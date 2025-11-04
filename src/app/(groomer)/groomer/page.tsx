/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./GroomerDashboardPage.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import GroomerPageIntro from "@/components/groomerPage/GroomerPageIntro/GroomerPageIntro";
import ConfirmSubmit from "@/components/shared/ConfirmSubmit/ConfirmSubmit";
import { startOfDay, endOfDay, addDays, startOfMonth } from "date-fns";
import UserKpiCard from "@/components/dashboard/UserKpiCard/UserKpiCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/groomer";
const TZ = process.env.SALON_TZ ?? "America/Phoenix";

export async function updateProfile(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const bio = (formData.get("bio") as string)?.trim() || "";
  const specsRaw = (formData.get("specialties") as string) || "";
  const workingRaw = (formData.get("workingHours") as string) || "{}";

  let workingHours: Record<string, [string, string][]>;
  workingHours = JSON.parse(workingRaw);

  await db.groomer.update({
    where: { id: user.id },
    data: {
      bio,
      specialties: specsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      workingHours,
    },
  });

  revalidatePath(BASE_PATH);
}

export async function addBreak(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const dateStr = formData.get("date") as string;
  const date = new Date(dateStr);
  if (isNaN(date.valueOf())) throw new Error("Invalid date");

  if (!user.id) throw new Error("Missing groomerId");
  await db.break.create({
    data: { groomerId: user.id, date },
  });

  revalidatePath(BASE_PATH);
}

export async function removeBreak(formData: FormData) {
  "use server";
  await requireGroomer();

  const id = formData.get("id") as string;
  await db.break.delete({ where: { id } });

  revalidatePath(BASE_PATH);
}

export default async function GroomerDashboardPage() {
  const user = await requireGroomer();

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekEnd = endOfDay(addDays(todayStart, 7));
  const monthStart = startOfMonth(new Date());

  const groomer = await db.groomer.findUnique({
    where: { id: user.id },
    include: { breaks: { orderBy: { date: "asc" } } },
  });
  if (!groomer) redirect("/login");

  const [
    appointmentsToday,
    appointmentsWeek,
    earningsTodayAgg,
    earningsMTDAgg,
    pendingCount,
    nextBookings,
  ] = await Promise.all([
    db.booking.count({
      where: {
        groomerId: user.id,
        status: "CONFIRMED",
        start: { gte: todayStart, lte: todayEnd },
      },
    }),
    db.booking.count({
      where: {
        groomerId: user.id,
        status: "CONFIRMED",
        start: { gte: todayStart, lte: weekEnd },
      },
    }),
    db.booking.aggregate({
      _sum: { depositCents: true, tipCents: true },
      where: {
        groomerId: user.id,
        status: "COMPLETED",
        start: { gte: todayStart, lte: todayEnd },
      },
    }),
    db.booking.aggregate({
      _sum: { depositCents: true, tipCents: true },
      where: {
        groomerId: user.id,
        status: "COMPLETED",
        start: { gte: monthStart },
      },
    }),
    db.booking.count({
      where: {
        groomerId: user.id,
        status: "PENDING",
        start: { gte: todayStart },
      },
    }),
    db.booking.findMany({
      where: {
        groomerId: user.id,
        start: { gte: new Date() },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: {
        id: true,
        start: true,
        createdAt: true,
        status: true,
        service: { select: { name: true, durationMin: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { start: "asc" },
      take: 5,
    }),
  ]);

  const centsToDollars = (c: number | null | undefined) => (c ?? 0) / 100;
  const earningsToday =
    centsToDollars(earningsTodayAgg._sum.depositCents) +
    centsToDollars(earningsTodayAgg._sum.tipCents);
  const earningsMTD =
    centsToDollars(earningsMTDAgg._sum.depositCents) +
    centsToDollars(earningsMTDAgg._sum.tipCents);

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

  return (
    <section className={styles.section}>
      <div className={styles.mb12}>
        <GroomerPageIntro />
      </div>

      <div className={styles.kpiCards}>
        <UserKpiCard label='Today’s Appointments' value={appointmentsToday} />
        <UserKpiCard label='Next 7 Days' value={appointmentsWeek} />
        <UserKpiCard
          label='Earnings Today'
          value={`$${earningsToday.toFixed(2)}`}
        />
        <UserKpiCard
          label='Earnings This Month'
          value={`$${earningsMTD.toFixed(2)}`}
        />
      </div>

      {pendingCount > 0 && (
        <div className={`${styles.card} ${styles.alert}`}>
          You have{" "}
          <Link
            href='/groomer/my-bookings?filter=pending'
            className={styles.alertLink}
          >
            {pendingCount} new booking request{pendingCount > 1 ? "s" : ""}
          </Link>
          .
        </div>
      )}

      <section className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.subheading}>Next Appointments</h2>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            View all
          </Link>
        </div>

        <div className={styles.tableScroll}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className='tablethead'>
                <tr>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Time</th>
                  <th className={styles.th}>Booked</th>
                  <th className={styles.th}>Customer</th>
                  <th className={styles.th}>Service</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nextBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`${styles.td} ${styles.center} ${styles.muted}`}
                    >
                      You have no upcoming appointments.
                    </td>
                  </tr>
                ) : (
                  nextBookings.map((b) => {
                    const createdDate = dateFmt.format(new Date(b.createdAt));
                    const createdTime = timeFmt.format(new Date(b.createdAt));
                    return (
                      <tr key={b.id}>
                        <td className={styles.td} data-label='Date'>
                          {dateFmt.format(new Date(b.start))}
                        </td>
                        <td className={styles.td} data-label='Time'>
                          {timeFmt.format(new Date(b.start))}
                        </td>
                        <td className={styles.td} data-label='Booked'>
                          {createdDate}{" "}
                          <small className={styles.muted}>{createdTime}</small>
                        </td>
                        <td className={styles.td} data-label='Customer'>
                          {b.user?.name ?? "—"}
                        </td>
                        <td className={styles.td} data-label='Service'>
                          {b.service?.name ?? "—"}
                          {b.service?.durationMin ? (
                            <small> ({b.service.durationMin}m)</small>
                          ) : null}
                        </td>
                        <td className={styles.td} data-label='Status'>
                          <StatusBadge status={b.status as any} />
                        </td>
                        <td className={styles.td} data-label='Actions'>
                          <Link
                            href={`/groomer/my-bookings/${b.id}`}
                            className={styles.btnOutlineSm}
                            title='View booking details'
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.sectionBlock}>
        <h2 className={styles.subheading}>Quick Actions</h2>
        <div className={styles.quickActions}>
          <Link href='/groomer/availability' className={styles.btnOutline}>
            Manage Availability
          </Link>
          <Link href='/groomer/profile' className={styles.btnOutline}>
            Edit Profile
          </Link>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            View All Bookings
          </Link>
          <Link href='/groomer/earnings' className={styles.btnOutline}>
            View Earnings
          </Link>
        </div>
      </section>

      <section>
        <h2 className={styles.subheading}>Breaks / Time Off</h2>

        <div className={styles.tableScroll}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className='tablethead'>
                <tr>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groomer.breaks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className={`${styles.td} ${styles.center} ${styles.muted}`}
                    >
                      No breaks scheduled.
                    </td>
                  </tr>
                ) : (
                  groomer.breaks.map((br) => {
                    const delId = `break-del-${br.id}`;
                    return (
                      <tr key={br.id}>
                        <td className={styles.td} data-label='Date'>
                          {dateFmt.format(new Date(br.date))}
                        </td>
                        <td
                          className={`${styles.td} ${styles.rowActions}`}
                          data-label='Actions'
                        >
                          <ConfirmSubmit
                            form={delId}
                            message='Remove this break date?'
                          >
                            Remove
                          </ConfirmSubmit>
                          <form
                            id={delId}
                            action={removeBreak}
                            className={styles.hiddenForm}
                          >
                            <input type='hidden' name='id' value={br.id} />
                          </form>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <form action={addBreak} className={styles.addBreakRow}>
          <div>
            <label className={styles.label}>Add Break Date</label>
            <input type='date' name='date' required className={styles.input} />
          </div>
          <button type='submit' className={styles.btnPrimary}>
            Add
          </button>
        </form>
      </section>
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELED" | "NO_SHOW";
}) {
  const cls =
    status === "COMPLETED"
      ? styles.badge_completed
      : status === "CONFIRMED"
      ? styles.badge_confirmed
      : status === "PENDING"
      ? styles.badge_pending
      : status === "CANCELED"
      ? styles.badge_canceled
      : styles.badge_noshow;
  return (
    <span className={`${styles.badge} ${cls}`}>{status.replace("_", " ")}</span>
  );
}
