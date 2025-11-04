/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./BookingDetailsPage.module.css";
import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { requireGroomer } from "@/lib/rbac";
import ConfirmSubmit from "@/components/shared/ConfirmSubmit/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_LIST_PATH = "/groomer/my-bookings";
const TZ = process.env.SALON_TZ ?? "America/Phoenix";

export async function cancelAndRefundSA(formData: FormData): Promise<void> {
  "use server";
  const me = await requireGroomer();
  const bookingId = String(formData.get("id") || "");
  const reason = String(formData.get("reason") || "").trim();

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: { select: { priceCents: true, name: true } },
    },
  });
  if (!booking || booking.groomerId !== me.id) throw new Error("Unauthorized");

  const now = new Date();
  const isFuture = new Date(booking.start) > now;
  const isCancelable =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  if (!isFuture || !isCancelable || !booking.paymentIntentId) {
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELED",
        notes: appendNote(
          booking.notes,
          `Canceled by groomer.${reason ? " " + reason : ""}`
        ),
      },
    });
    revalidatePath(`${BASE_LIST_PATH}/${bookingId}`);
    revalidatePath(BASE_LIST_PATH);
    return;
  }

  const deposit = booking.depositCents ?? 0;
  const tax = booking.taxCents ?? 0;
  const fee = (booking as any).feeCents ?? 0;
  const discount = (booking as any).discountCents ?? 0;
  const tip = booking.tipCents ?? 0;
  const amountDue = booking.amountDueCents;

  const coreNow =
    typeof amountDue === "number"
      ? amountDue
      : Math.max(0, deposit + tax + fee - discount);
  const chargedNow = Math.max(0, coreNow + tip);

  if (chargedNow > 0) {
    await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
      amount: chargedNow,
      reason: "requested_by_customer",
      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
        groomerId: booking.groomerId,
        canceledBy: `groomer:${me.id}`,
      },
    });
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELED",
      notes: appendNote(
        booking.notes,
        reason ? `Canceled by groomer: ${reason}` : "Canceled by groomer."
      ),
    },
  });

  revalidatePath(`${BASE_LIST_PATH}/${bookingId}`);
  revalidatePath(BASE_LIST_PATH);
}

export async function markCompletedSA(formData: FormData): Promise<void> {
  "use server";
  const me = await requireGroomer();
  const bookingId = String(formData.get("id") || "");
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { groomerId: true },
  });
  if (!booking || booking.groomerId !== me.id) throw new Error("Unauthorized");
  await db.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });
  revalidatePath(`${BASE_LIST_PATH}/${bookingId}`);
  revalidatePath(BASE_LIST_PATH);
}

export async function markNoShowSA(formData: FormData): Promise<void> {
  "use server";
  const me = await requireGroomer();
  const bookingId = String(formData.get("id") || "");
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { groomerId: true },
  });
  if (!booking || booking.groomerId !== me.id) throw new Error("Unauthorized");
  await db.booking.update({
    where: { id: bookingId },
    data: { status: "NO_SHOW" },
  });
  revalidatePath(`${BASE_LIST_PATH}/${bookingId}`);
  revalidatePath(BASE_LIST_PATH);
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const groomer = await requireGroomer();
  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, id: true } },
      service: {
        select: { id: true, name: true, priceCents: true, durationMin: true },
      },
      groomer: { select: { id: true } },
    },
  });
  if (!booking || booking.groomerId !== groomer.id) notFound();

  let refunds:
    | {
        id: string;
        amount: number;
        created: number;
        status: string;
        currency?: string | null;
        reason?: string | null;
        charge?: string | null;
      }[]
    | null = null;

  if (booking.paymentIntentId) {
    try {
      const list = await stripe.refunds.list({
        payment_intent: booking.paymentIntentId,
        limit: 20,
      });
      refunds = list.data.map((r) => ({
        id: r.id,
        amount: r.amount,
        created: r.created,
        status: r.status ?? "unknown",
        currency: r.currency ?? "usd",
        reason: r.reason ?? null,
        charge: typeof r.charge === "string" ? r.charge : r.charge?.id ?? null,
      }));
    } catch {
      refunds = null;
    }
  }

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  });

  const start = new Date(booking.start);
  const end = booking.end ? new Date(booking.end) : null;

  const dateStr = dateFmt.format(start);
  const timeStr = end
    ? `${timeFmt.format(start)} – ${timeFmt.format(end)}`
    : timeFmt.format(start);

  const createdStr = `${dateFmt.format(
    new Date(booking.createdAt)
  )} ${timeFmt.format(new Date(booking.createdAt))}`;
  const updatedStr = `${dateFmt.format(
    new Date(booking.updatedAt)
  )} ${timeFmt.format(new Date(booking.updatedAt))}`;

  const basePriceCents = booking.service?.priceCents ?? null;
  const depositCents = booking.depositCents ?? 0;
  const taxCents = booking.taxCents ?? 0;
  const feeCents = (booking as any).feeCents ?? 0;
  const discountCents = (booking as any).discountCents ?? 0;
  const tipCents = booking.tipCents ?? 0;
  const amountDueCents = booking.amountDueCents ?? null;

  const subtotalNowCents =
    typeof amountDueCents === "number"
      ? Math.max(0, amountDueCents - taxCents - feeCents + discountCents)
      : depositCents;

  const coreDueNowCents =
    typeof amountDueCents === "number"
      ? amountDueCents
      : Math.max(0, depositCents + taxCents + feeCents - discountCents);

  const totalChargedCents = coreDueNowCents + tipCents;

  const status = String(booking.status || "");
  const isCanceled = status === "CANCELED";

  const cancelFormId = `cancel-refund-${booking.id}`;

  return (
    <section className={styles.section}>
      <div className={styles.breadcrumbs}>
        <Link href={BASE_LIST_PATH} className={styles.backLink}>
          ← Back to My Bookings
        </Link>
        <div className={styles.headerId}>ID: {booking.id}</div>
      </div>

      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>
          Appointment Details
        </h1>
        <StatusBadge status={status} />
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.sectionTitle}>Appointment</div>
          <Row label='Date' value={dateStr} />
          <Row label='Time' value={timeStr} />
          {booking.service?.durationMin ? (
            <Row
              label='Duration'
              value={`${booking.service.durationMin} min`}
            />
          ) : null}
          <Row label='Timezone' value={TZ} />
          <Row label='Status' value={<StatusBadge status={status} />} />

          <div className={`${styles.sectionTitle} ${styles.mt12}`}>
            Customer
          </div>
          <Row
            label='Name'
            value={booking.user?.name || booking.user?.email || "—"}
          />
          {booking.user?.email ? (
            <Row
              label='Email'
              value={
                <a
                  href={`mailto:${booking.user.email}`}
                  className={styles.link}
                >
                  {booking.user.email}
                </a>
              }
            />
          ) : null}

          <div className={`${styles.sectionTitle} ${styles.mt12}`}>Service</div>
          <Row label='Service' value={booking.service?.name ?? "—"} />
          {typeof basePriceCents === "number" ? (
            <Row label='Service price' value={fmt(basePriceCents)} />
          ) : null}
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Payment</div>

          {typeof basePriceCents === "number" ? (
            <Row label='Base price' value={fmt(basePriceCents)} />
          ) : null}

          <Row
            label={amountDueCents != null ? "Deposit (today)" : "Subtotal"}
            value={fmt(subtotalNowCents)}
          />
          {taxCents > 0 && <Row label='Tax' value={fmt(taxCents)} />}
          {feeCents > 0 && <Row label='Fees' value={fmt(feeCents)} />}
          {discountCents > 0 && (
            <Row label='Discount' value={`-${fmt(discountCents)}`} />
          )}
          {tipCents > 0 && <Row label='Tip' value={fmt(tipCents)} />}

          <div className={`${styles.row} ${styles.rowTotal}`}>
            <div className={styles.labelStrong}>Charged</div>
            <div className={styles.valueStrong}>{fmt(totalChargedCents)}</div>
          </div>

          {booking.paymentIntentId ? (
            <Row
              label='Payment Intent'
              value={<Mono>{booking.paymentIntentId}</Mono>}
            />
          ) : null}
          {booking.receiptUrl ? (
            <Row
              label='Receipt'
              value={
                <a
                  href={booking.receiptUrl}
                  target='_blank'
                  rel='noreferrer'
                  className={styles.link}
                >
                  View payment receipt
                </a>
              }
            />
          ) : null}
        </div>

        {refunds && refunds.length > 0 && (
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Refunds</div>
            {refunds.map((r) => {
              const dt = new Date(r.created * 1000);
              const date = dateFmt.format(dt);
              const time = timeFmt.format(dt);
              return (
                <div key={r.id} className={styles.row}>
                  <div className={styles.label}>Refunded</div>
                  <div className={styles.value}>
                    ${(r.amount / 100).toFixed(2)} • {r.status}
                    {r.reason ? ` • ${r.reason}` : ""}
                    <div className={styles.muted}>
                      {date} {time}
                    </div>
                    <div className={styles.mt6}>
                      <Link
                        href={`/receipt/refund/${r.id}`}
                        className={styles.link}
                      >
                        Public refund receipt
                      </Link>
                      {r.charge ? (
                        <>
                          {" "}
                          • Charge: <Mono>{r.charge}</Mono>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Timeline</div>
          <Row label='Booked On' value={createdStr} />
          <Row label='Last Updated' value={updatedStr} />
          <div className={`${styles.sectionTitle} ${styles.mt12}`}>Notes</div>
          <div className={styles.notes}>
            {booking.notes ? (
              booking.notes
            ) : (
              <span className={styles.muted}>—</span>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.actionsHeader}>
            <div className={styles.actionsTitle}>Actions</div>
            <span className={styles.actionsHint}>Manage this appointment</span>
          </div>

          {isCanceled ? (
            <div className={styles.muted}>This booking has been canceled.</div>
          ) : (
            <>
              <form
                id={cancelFormId}
                action={cancelAndRefundSA}
                className={styles.formInline}
              >
                <input type='hidden' name='id' value={booking.id} />
                <input
                  type='text'
                  name='reason'
                  placeholder='Reason (optional)'
                  className={styles.input}
                />
              </form>
              <ConfirmSubmit
                form={cancelFormId}
                message='Cancel this appointment and refund the client?'
              >
                Cancel & Refund
              </ConfirmSubmit>
            </>
          )}

          <div className={styles.actionsRow}>
            <form action={markCompletedSA}>
              <input type='hidden' name='id' value={booking.id} />
              <button
                type='submit'
                className={styles.btnOutline}
                disabled={isCanceled}
              >
                Mark Completed
              </button>
            </form>
            <form action={markNoShowSA}>
              <input type='hidden' name='id' value={booking.id} />
              <button
                type='submit'
                className={styles.btnOutline}
                disabled={isCanceled}
              >
                Mark No-Show
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className={styles.mono}>{children}</code>;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "COMPLETED"
      ? styles.badge_completed
      : status === "CONFIRMED"
      ? styles.badge_confirmed
      : status === "PENDING" || status === "PENDING_PAYMENT"
      ? styles.badge_pending
      : status === "CANCELED"
      ? styles.badge_canceled
      : styles.badge_noshow;
  return (
    <span className={`${styles.badge} ${cls}`}>{status.replace("_", " ")}</span>
  );
}

function fmt(cents: number | null | undefined) {
  if (typeof cents !== "number") return "—";
  return `$${(cents / 100).toFixed(2)}`;
}
function appendNote(existing: string | null | undefined, line?: string | null) {
  const add = (line ?? "").trim();
  if (!add) return existing ?? null;
  return existing ? `${existing}\n${add}` : add;
}
