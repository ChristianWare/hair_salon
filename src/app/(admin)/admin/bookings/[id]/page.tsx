/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./BookingDetailsPage.module.css";
import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import ActionBar from "@/components/admin/ActionBar/ActionBar";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TZ = process.env.SALON_TZ ?? "America/Phoenix";
const BASE_PATH = "/admin/bookings";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, id: true } },
      groomer: {
        include: { user: { select: { name: true, email: true, id: true } } },
      },
      service: {
        select: { id: true, name: true, priceCents: true, durationMin: true },
      },
    },
  });
  if (!booking) notFound();

  let refunds:
    | {
        id: string;
        amount: number;
        created: number;
        status: string;
        charge?: string | null;
        currency?: string | null;
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
        charge: typeof r.charge === "string" ? r.charge : r.charge?.id ?? null,
        currency: r.currency ?? "usd",
        reason: r.reason ?? null,
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
  const fmt = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(2)}` : "—";

  const start = new Date(booking.start);
  const end = booking.end ? new Date(booking.end) : null;

  const startDate = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  const endTime = end ? timeFmt.format(end) : null;

  const createdDate = dateFmt.format(new Date(booking.createdAt));
  const createdTime = timeFmt.format(new Date(booking.createdAt));
  const updatedDate = dateFmt.format(new Date(booking.updatedAt));
  const updatedTime = timeFmt.format(new Date(booking.updatedAt));

  const customer = booking.user?.name || booking.user?.email || "—";
  const customerEmail = booking.user?.email || null;
  const groomerName =
    booking.groomer?.user?.name || booking.groomer?.user?.email || "—";
  const serviceName = booking.service?.name || "—";
  const durationMin = booking.service?.durationMin ?? null;

  const basePriceCents = booking.service?.priceCents ?? null;
  const depositCents = booking.depositCents ?? 0;
  const taxCents = booking.taxCents ?? 0;
  const tipCents = booking.tipCents ?? 0;
  const feeCents = (booking as any).feeCents ?? 0;
  const amountDueCents = booking.amountDueCents ?? null;
  const subtotalNowCents = depositCents;
  const totalChargedCents =
    (typeof amountDueCents === "number"
      ? amountDueCents
      : subtotalNowCents + taxCents) +
    tipCents +
    feeCents;

  const remainingPreTax =
    typeof basePriceCents === "number" && depositCents < basePriceCents
      ? Math.max(0, basePriceCents - depositCents)
      : 0;

  const priceCents =
    booking.amountDueCents != null
      ? booking.amountDueCents
      : booking.service?.priceCents ?? null;
  const price =
    typeof priceCents === "number" ? `$${(priceCents / 100).toFixed(2)}` : "—";

  const status = String(booking.status || "");
  const isCanceled = status === "CANCELED";
  const notes = booking.notes ?? null;

  const stripeMode = (process.env.STRIPE_SECRET_KEY || "").includes("_test")
    ? "test"
    : "live";

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <Link href={BASE_PATH} className={styles.link}>
          ← Back to Bookings
        </Link>
        <div className={styles.idText}>ID: {booking.id}</div>
      </div>

      <div className={styles.titleRow}>
        <h1 className={`${styles.heading} adminHeading`}>Booking Details</h1>
        <StatusBadge status={status} />
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.card}>
          <div className={styles.twoColGrid}>
            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Appointment</div>
              <Row label='Date' value={startDate} />
              <Row
                label='Time'
                value={endTime ? `${startTime} – ${endTime}` : startTime}
              />
              {durationMin ? (
                <Row label='Duration' value={`${durationMin} min`} />
              ) : null}
              <Row label='Timezone' value={TZ} />
              <Row label='Status' value={<StatusBadge status={status} />} />
            </div>

            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Booked</div>
              <Row label='Booked On' value={`${createdDate} ${createdTime}`} />
              <Row
                label='Last Updated'
                value={`${updatedDate} ${updatedTime}`}
              />
            </div>

            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Customer</div>
              <Row label='Name / Email' value={customer} />
              {customerEmail ? (
                <Row
                  label='Email'
                  value={
                    <a href={`mailto:${customerEmail}`} className={styles.link}>
                      {customerEmail}
                    </a>
                  }
                />
              ) : null}
            </div>

            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Groomer</div>
              <Row label='Assigned To' value={groomerName} />
            </div>

            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Service</div>
              <Row label='Service' value={serviceName} />
              {typeof basePriceCents === "number" ? (
                <Row label='Service Price' value={fmt(basePriceCents)} />
              ) : null}

              <div className={`${styles.sectionTitle} ${styles.mt10}`}>
                Payment Breakdown
              </div>
              <Row
                label={
                  typeof basePriceCents === "number" &&
                  depositCents < basePriceCents
                    ? "Deposit (charged today)"
                    : "Subtotal (charged today)"
                }
                value={fmt(subtotalNowCents)}
              />
              {taxCents > 0 && <Row label='Tax' value={fmt(taxCents)} />}
              {tipCents > 0 && <Row label='Tip' value={fmt(tipCents)} />}
              {feeCents > 0 && <Row label='Fees' value={fmt(feeCents)} />}

              <div className={styles.totalRow}>
                <div className={styles.totalLabel}>Total Charged Today</div>
                <div className={styles.totalValue}>
                  {fmt(totalChargedCents)}
                </div>
              </div>

              {remainingPreTax > 0 && (
                <div className={styles.remainingNote}>
                  Remaining service balance (pre-tax):{" "}
                  <strong>{fmt(remainingPreTax)}</strong> due at appointment.
                </div>
              )}

              {booking.paymentIntentId ? (
                <Row
                  label='Payment Intent'
                  value={<Mono>{booking.paymentIntentId}</Mono>}
                />
              ) : null}
              {booking.receiptUrl ? (
                <Row
                  label='Payment Receipt'
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
              <div className={styles.twoColGridArea}>
                <div className={styles.sectionTitle}>Refunds</div>
                <div>
                  {refunds.map((r) => {
                    const dt = new Date(r.created * 1000);
                    const date = dateFmt.format(dt);
                    const time = timeFmt.format(dt);
                    const amount = (r.amount / 100).toFixed(2);
                    const dashUrl = `https://dashboard.stripe.com/${
                      stripeMode === "test" ? "test/" : ""
                    }refunds/${r.id}`;
                    return (
                      <div key={r.id} className={styles.refundRow}>
                        <div className={styles.refundLabel}>Refunded</div>
                        <div className={styles.refundValue}>
                          ${amount} • {r.status}
                          {r.reason ? ` • ${r.reason}` : ""}
                          <div className={styles.refundMeta}>
                            {date} {time}
                          </div>
                          <div className={styles.refundLinks}>
                            <a
                              href={dashUrl}
                              target='_blank'
                              rel='noreferrer'
                              className={styles.link}
                            >
                              View in Stripe
                            </a>
                            <span className={styles.dot}>•</span>
                            <Link
                              href={`/receipt/refund/${r.id}`}
                              className={styles.link}
                            >
                              Public refund receipt
                            </Link>
                            {r.charge ? (
                              <>
                                <span className={styles.dot}>•</span>
                                Charge: <Mono>{r.charge}</Mono>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.twoColGridArea}>
              <div className={styles.sectionTitle}>Notes</div>
              <div className={styles.notes}>
                {notes ? notes : <span className={styles.notesEmpty}>No Notes</span>}
              </div>
            </div>

            <div>
              <div className={styles.sectionTitle}>Technical</div>
              <Row label='Booking ID' value={<Mono>{booking.id}</Mono>} />
              <Row label='User ID' value={<Mono>{booking.userId}</Mono>} />
              <Row
                label='Groomer ID'
                value={<Mono>{booking.groomerId}</Mono>}
              />
              <Row
                label='Service ID'
                value={<Mono>{booking.serviceId}</Mono>}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.actionsHeader}>
            <div className={styles.actionsTitle}>Actions</div>
            <span className={styles.actionsHint}>
              Update the booking status
            </span>
          </div>
          <ActionBar
            bookingId={booking.id}
            status={status}
            isCanceled={isCanceled}
          />
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>{label}</div>
      <div className={styles.rowValue}>{value}</div>
    </div>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className={styles.mono}>{children}</code>;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "CONFIRMED"
      ? styles.badgeConfirmed
      : status === "PENDING" || status === "PENDING_PAYMENT"
      ? styles.badgePending
      : status === "COMPLETED"
      ? styles.badgeCompleted
      : status === "CANCELED"
      ? styles.badgeCanceled
      : styles.badgeOther;
  return (
    <span className={`${styles.badge} ${cls}`}>{status.replace("_", " ")}</span>
  );
}
