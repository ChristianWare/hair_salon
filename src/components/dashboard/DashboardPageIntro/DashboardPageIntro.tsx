import styles from "./DashboardPageIntro.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import CancelBookingForm from "../CancelBookingForm/CancelBookingForm";
import UserKpiCard from "../UserKpiCard/UserKpiCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/dashboard";
const TZ = process.env.SALON_TZ ?? "America/Phoenix";

export async function cancelBooking(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const id = formData.get("id") as string;
  const me = session.user.id;

  const booking = await db.booking.findUnique({
    where: { id },
    select: { id: true, userId: true, start: true, status: true },
  });
  if (!booking || booking.userId !== me) throw new Error("Not allowed");
  if (!(booking.status === "PENDING" || booking.status === "CONFIRMED"))
    throw new Error("Only upcoming bookings can be canceled.");

  const cancelCfg = await db.config.findUnique({
    where: { key: "cancelWindow" },
  });
  const hours = Number(cancelCfg?.value ?? "24");
  const cutoff = new Date(booking.start);
  cutoff.setHours(cutoff.getHours() - (Number.isFinite(hours) ? hours : 24));
  if (new Date() > cutoff) {
    throw new Error("Too late to cancel online. Please contact the salon.");
  }

  await db.booking.update({ where: { id }, data: { status: "CANCELED" } });
  revalidatePath(BASE_PATH);
}

export default async function DashboardPageIntro() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = session.user.id;
  const name = session.user.name ?? session.user.email ?? "Your";
  const now = new Date();

  const [upcoming, statusCounts] = await db.$transaction([
    db.booking.findMany({
      where: {
        userId: me,
        start: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      orderBy: { start: "asc" },
      take: 5,
      include: {
        service: { select: { name: true, durationMin: true } },
        groomer: { select: { user: { select: { name: true, email: true } } } },
      },
    }),
    db.booking.groupBy({
      by: ["status"],
      where: { userId: me },
      orderBy: { status: "asc" },
      _count: { _all: true },
    }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [
      String(s.status),
      typeof s._count === "object" && s._count ? s._count._all ?? 0 : 0,
    ])
  );

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

  const next = upcoming[0];

  return (
    <div>
      <section className={styles.container}>
        <div className={styles.content}>
          <h1 className={`${styles.heading} adminHeading`}> {name}&apos;s Dashboard (user) </h1>
          <p className={styles.copy}>
            Welcome back! Here&apos;s what&apos;s happening with your bookings.
          </p>
        </div>
      </section>

      <div className={styles.kpiCards}>
        <UserKpiCard
          label='Upcoming'
          value={(statusMap["CONFIRMED"] ?? 0) + (statusMap["PENDING"] ?? 0)}
        />
        <UserKpiCard label='Completed' value={statusMap["COMPLETED"] ?? 0} />
        <UserKpiCard label='Canceled' value={statusMap["CANCELED"] ?? 0} />
        <UserKpiCard label='No-shows' value={statusMap["NO_SHOW"] ?? 0} />
      </div>

      <div className={`${styles.card} ${styles.mb24}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            {next ? "Your Next Appointment" : "No Upcoming Appointments"}
          </div>
          {next && (
            <div className={styles.cardActions}>
              <Link
                href={`/dashboard/my-bookings/${next.id}`}
                className={styles.btnOutline}
              >
                View Details
              </Link>
              <CancelBookingForm bookingId={next.id} />
            </div>
          )}
        </div>

        {next ? (
          <div className={styles.infoGrid}>
            <Info label='Date' value={dateFmt.format(new Date(next.start))} />
            <Info label='Time' value={timeFmt.format(new Date(next.start))} />
            <Info
              label='Service'
              value={`${next.service?.name ?? "—"}${
                next.service?.durationMin
                  ? ` (${next.service.durationMin}m)`
                  : ""
              }`}
            />
            <Info
              label='Groomer'
              value={
                next.groomer?.user?.name ?? next.groomer?.user?.email ?? "—"
              }
            />
          </div>
        ) : (
          <div className={styles.muted}>
            When you book an appointment, it will appear here.{" "}
            <Link href='/book' className={styles.link}>
              Book now
            </Link>
            .
          </div>
        )}
      </div>

      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.tablethead}>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Groomer</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${styles.td} ${styles.center}`}>
                    No upcoming bookings.
                  </td>
                </tr>
              ) : (
                upcoming.map((b) => {
                  const date = dateFmt.format(new Date(b.start));
                  const time = timeFmt.format(new Date(b.start));
                  const canCancel =
                    b.status === "PENDING" || b.status === "CONFIRMED";

                  return (
                    <tr key={b.id}>
                      <td className={styles.td} data-label='Date'>
                        {date}
                      </td>
                      <td className={styles.td} data-label='Time'>
                        {time}
                      </td>
                      <td className={styles.td} data-label='Service'>
                        {b.service?.name ?? "—"}
                        {b.service?.durationMin ? (
                          <>
                            {" "}
                            <small>({b.service.durationMin}m)</small>
                          </>
                        ) : null}
                      </td>
                      <td className={styles.td} data-label='Groomer'>
                        {b.groomer?.user?.name ?? b.groomer?.user?.email ?? "—"}
                      </td>
                      <td className={styles.td} data-label='Status'>
                        <span
                          className={`${styles.badge} ${statusClass(
                            styles,
                            b.status
                          )}`}
                        >
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className={styles.td} data-label='Actions'>
                        <div className={styles.rowActions}>
                          <Link
                            href={`/dashboard/my-bookings/${b.id}`}
                            className={styles.btnOutlineSm}
                          >
                            View
                          </Link>
                          {canCancel ? (
                            <CancelBookingForm bookingId={b.id} />
                          ) : (
                            <span className={styles.muted}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function statusClass(s: Record<string, string>, status: string) {
  switch (status) {
    case "CONFIRMED":
      return s.badge_confirmed;
    case "PENDING":
      return s.badge_pending;
    case "COMPLETED":
      return s.badge_completed;
    case "CANCELED":
      return s.badge_canceled;
    default:
      return s.badge_noshow;
  }
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}
