import styles from "./BookingDetailsPage.module.css";
import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import CancelBookingForm from "@/components/dashboard/CancelBookingForm/CancelBookingForm";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/dashboard/my-bookings";
const TZ = process.env.SALON_TZ ?? "America/Phoenix";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const me = session.user.id;

  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      groomer: { include: { user: { select: { name: true, email: true } } } },
      service: {
        select: { id: true, name: true, priceCents: true, durationMin: true },
      },
    },
  });
  if (!booking || booking.userId !== me) notFound();

  let refunds:
    | {
        id: string;
        amount: number;
        created: number;
        status: string;
        currency: string;
        reason?: string | null;
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
      }));
    } catch {
      refunds = null;
    }
  }

  const cancelCfg = await db.config.findUnique({
    where: { key: "cancelWindow" },
    select: { value: true },
  });
  const cancelWindowHours = Number(cancelCfg?.value ?? 24);

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

  const groomerName =
    booking.groomer?.user?.name || booking.groomer?.user?.email || "—";

  const basePriceCents = booking.service?.priceCents ?? null;
  const depositCents = booking.depositCents ?? 0;
  const taxCents = booking.taxCents ?? 0;
  const tipCents = booking.tipCents ?? 0;
  const amountDueCents = booking.amountDueCents ?? null;
  const chargedNowCents =
    typeof amountDueCents === "number"
      ? amountDueCents
      : depositCents + taxCents;
  const totalChargedCents = chargedNowCents + tipCents;

  const status = String(booking.status || "");
  const now = new Date();
  const cutoff = new Date(start.getTime() - cancelWindowHours * 60 * 60 * 1000);

  const canCancel =
    (status === "PENDING" || status === "CONFIRMED") &&
    start > now &&
    now <= cutoff;

  const cancelReason = !(
    (status === "PENDING" || status === "CONFIRMED") &&
    start > now
  )
    ? "This appointment can no longer be canceled online."
    : now > cutoff
    ? `Cancellations must be at least ${cancelWindowHours} hour${
        cancelWindowHours === 1 ? "" : "s"
      } before the start time.`
    : null;

  return (
    <section className={styles.section}>
      <div className={styles.breadcrumbs}>
        <Link href={BASE_PATH} className={styles.backLink}>
          ← Back to My Bookings
        </Link>
        <div className={styles.headerId}>ID: {booking.id}</div>
      </div>

      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Booking Details</h1>
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

          <div className={`${styles.sectionTitle} ${styles.mt12}`}>Service</div>
          <Row label='Service' value={booking.service?.name ?? "—"} />
          {typeof basePriceCents === "number" ? (
            <Row label='Base price' value={fmt(basePriceCents)} />
          ) : null}

          <div className={`${styles.sectionTitle} ${styles.mt12}`}>
            Your Pro
          </div>
          <Row label='Groomer' value={groomerName} />
        </div>

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Payment</div>

          {typeof basePriceCents === "number" ? (
            <Row label='Service price' value={fmt(basePriceCents)} />
          ) : null}

          <Row
            label={amountDueCents != null ? "Deposit (today)" : "Subtotal"}
            value={fmt(depositCents)}
          />
          {taxCents > 0 && <Row label='Tax' value={fmt(taxCents)} />}
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
                    {fmt(r.amount)} • {r.status}
                    {r.reason ? ` • ${r.reason}` : ""}
                    <div className={styles.muted}>
                      {date} {time}
                    </div>
                    <div className={styles.mt6}>
                      <Link
                        href={`/receipt/refund/${r.id}`}
                        className={styles.link}
                      >
                        View refund receipt
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(booking.notes || booking.petJson) && (
          <div className={styles.card}>
            <div className={styles.sectionTitle}>Notes</div>
            <div className={styles.notes}>
              {booking.notes ? (
                booking.notes
              ) : (
                <span className={styles.muted}>—</span>
              )}
            </div>

            {booking.petJson ? (
              <>
                <div className={`${styles.sectionTitle} ${styles.mt12}`}>
                  Pet Details
                </div>
                <pre className={styles.pre}>
                  {JSON.stringify(booking.petJson, null, 2)}
                </pre>
              </>
            ) : null}
          </div>
        )}

        <div className={styles.card}>
          <div className={styles.sectionTitle}>Booking Timeline</div>
          <Row label='Booked On' value={createdStr} />
          <Row label='Last Updated' value={updatedStr} />
        </div>

        <div className={styles.card}>
          <div className={styles.actionsHeader}>
            <div className={styles.actionsTitle}>Actions</div>
            <span className={styles.actionsHint}>Manage this appointment</span>
          </div>

          {status === "CANCELED" ? (
            <div className={styles.muted}>This booking has been canceled.</div>
          ) : canCancel ? (
            <CancelBookingForm bookingId={booking.id} />
          ) : (
            <div className={styles.muted}>
              {cancelReason ??
                "Cancellation is not available for this booking."}
            </div>
          )}
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
