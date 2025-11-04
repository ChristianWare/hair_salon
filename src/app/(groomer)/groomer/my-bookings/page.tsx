/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./MyBookingsPage.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import RowActions from "@/components/groomerPage/RowActions/RowActions";
import { addDays, endOfDay, startOfDay } from "date-fns";
import type { BookingStatus } from "@prisma/client";

type SearchParamsPromise = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export const dynamic = "force-dynamic";

const TZ = process.env.SALON_TZ ?? "America/Phoenix";
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

export async function setBookingStatus(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const id = formData.get("id") as string;
  const status = formData.get("status") as BookingStatus;

  const booking = await db.booking.findUnique({
    where: { id },
    select: { groomerId: true },
  });
  if (!booking || booking.groomerId !== user.id) {
    throw new Error("Unauthorized");
  }

  await db.booking.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/groomer/my-bookings");
}

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const user = await requireGroomer();

  const sp = await searchParams;
  const filterParam = Array.isArray(sp?.filter) ? sp?.filter[0] : sp?.filter;
  type Filter =
    | "upcoming"
    | "pending"
    | "confirmed"
    | "completed"
    | "canceled"
    | "no_show"
    | "all"
    | undefined;
  const filter = filterParam as Filter;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekEnd = endOfDay(addDays(todayStart, 7));

  const baseWhere = { groomerId: user.id };
  let where: any = { ...baseWhere };

  switch (filter) {
    case "pending":
      where = { ...baseWhere, status: "PENDING", start: { gte: now } };
      break;
    case "confirmed":
      where = { ...baseWhere, status: "CONFIRMED", start: { gte: now } };
      break;
    case "completed":
      where = { ...baseWhere, status: "COMPLETED" };
      break;
    case "canceled":
      where = { ...baseWhere, status: "CANCELED" };
      break;
    case "no_show":
      where = { ...baseWhere, status: "NO_SHOW" };
      break;
    case "all":
      where = { ...baseWhere };
      break;
    case "upcoming":
    default:
      where = {
        ...baseWhere,
        start: { gte: now },
        status: { in: ["PENDING", "CONFIRMED"] },
      };
      break;
  }

  const bookings = await db.booking.findMany({
    where,
    include: {
      service: { select: { name: true, durationMin: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { start: "asc" },
    take: 50,
  });

  const pendingCount = await db.booking.count({
    where: {
      groomerId: user.id,
      status: "PENDING",
      start: { gte: todayStart, lte: weekEnd },
    },
  });

  return (
    <section className={styles.section}>
      <h1 className={`${styles.heading} adminHeading`}>My Bookings</h1>

      <nav className={styles.pillsRow}>
        <FilterLink
          href='/groomer/my-bookings'
          current={!filter || filter === "upcoming"}
        >
          Upcoming
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=pending'
          current={filter === "pending"}
        >
          Pending {pendingCount > 0 && <Badge>{pendingCount}</Badge>}
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=confirmed'
          current={filter === "confirmed"}
        >
          Confirmed
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=completed'
          current={filter === "completed"}
        >
          Completed
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=canceled'
          current={filter === "canceled"}
        >
          Canceled
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=no_show'
          current={filter === "no_show"}
        >
          No-Show
        </FilterLink>
        <FilterLink
          href='/groomer/my-bookings?filter=all'
          current={filter === "all"}
        >
          All
        </FilterLink>
      </nav>

      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className='tablethead'>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Booked</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`${styles.td} ${styles.center} ${styles.muted}`}
                  >
                    No bookings for this view.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const start = new Date(b.start);
                  const created = new Date(b.createdAt);

                  const dateStr = dateFmt.format(start);
                  const timeStr = timeFmt.format(start);
                  const bookedDate = dateFmt.format(created);
                  const bookedTime = timeFmt.format(created);

                  const canConfirm = b.status === "PENDING";
                  const canCancel =
                    b.status === "PENDING" || b.status === "CONFIRMED";
                  const canComplete =
                    b.status === "CONFIRMED" && start <= new Date();
                  const canNoShow =
                    b.status === "CONFIRMED" && start <= new Date();

                  return (
                    <tr key={b.id}>
                      <td className={styles.td} data-label='Date'>
                        {dateStr}
                      </td>
                      <td className={styles.td} data-label='Time'>
                        {timeStr}
                      </td>
                      <td className={styles.td} data-label='Booked'>
                        {bookedDate}{" "}
                        <small className={styles.muted}>{bookedTime}</small>
                      </td>
                      <td className={styles.td} data-label='Service'>
                        {b.service.name}{" "}
                        <small>({b.service.durationMin}m)</small>
                      </td>
                      <td className={styles.td} data-label='Customer'>
                        {b.user.name ?? "—"}
                        <br />
                        <small>{b.user.email}</small>
                      </td>
                      <td className={styles.td} data-label='Status'>
                        <StatusBadge status={b.status as BookingStatus} />
                      </td>
                      <td
                        className={`${styles.td} ${styles.rowActions}`}
                        data-label='Actions'
                      >
                        <Link
                          href={`/groomer/my-bookings/${b.id}`}
                          className={styles.btnOutlineSm}
                          title='View booking details'
                        >
                          View
                        </Link>
                        <RowActions
                          bookingId={b.id}
                          onSetStatus={setBookingStatus}
                          canConfirm={canConfirm}
                          canCancel={canCancel}
                          canComplete={canComplete}
                          canNoShow={canNoShow}
                        />
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
  );
}

function FilterLink({
  href,
  current,
  children,
}: {
  href: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.pill} ${current ? styles.pillCurrent : ""}`}
    >
      {children}
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className={styles.pillBadge}>{children}</span>;
}

function StatusBadge({ status }: { status: BookingStatus }) {
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
