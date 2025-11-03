import styles from "./BillingAndReceiptsPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TZ = process.env.SALON_TZ ?? "America/Phoenix";

type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

/* ───────────── helpers ───────────── */
function getStr(
  sp: Record<string, string | string[] | undefined>,
  key: string,
  fallback = ""
) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;
}
function buildHref(prev: URLSearchParams, next: Record<string, string | null>) {
  const q = new URLSearchParams(prev.toString());
  for (const [k, v] of Object.entries(next)) {
    if (v === null) q.delete(k);
    else q.set(k, v);
  }
  return `?${q.toString()}`;
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function subDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() - n);
  return x;
}
const toUSD = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

/* ───────────── page ───────────── */
export default async function BillingAndReceiptsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const me = session.user.id;

  // parse query
  const spObj = await searchParams;
  const sp = new URLSearchParams(
    Object.entries(spObj).reduce<Record<string, string>>((acc, [k, v]) => {
      if (Array.isArray(v)) acc[k] = v[0] ?? "";
      else if (v != null) acc[k] = v;
      return acc;
    }, {})
  );

  type Preset = "30d" | "90d" | "year" | "custom";
  const preset = (getStr(spObj, "preset") || "30d") as Preset;
  const fromQ = getStr(spObj, "from");
  const toQ = getStr(spObj, "to");
  const statusParam = (getStr(spObj, "status") || "COMPLETED") as
    | "COMPLETED"
    | "ALL";

  // date range
  const now = new Date();
  let fromDate: Date;
  let toDate: Date;
  if (preset === "custom" || fromQ || toQ) {
    fromDate = startOfDay(fromQ ? new Date(fromQ) : subDays(now, 29));
    toDate = endOfDay(toQ ? new Date(toQ) : now);
  } else if (preset === "90d") {
    fromDate = startOfDay(subDays(now, 89));
    toDate = endOfDay(now);
  } else if (preset === "year") {
    fromDate = startOfDay(new Date(now.getFullYear(), 0, 1));
    toDate = endOfDay(now);
  } else {
    fromDate = startOfDay(subDays(now, 29));
    toDate = endOfDay(now);
  }
  const fromStr = toISODate(fromDate);
  const toStr = toISODate(toDate);

  // where
  const baseWhere: Prisma.BookingWhereInput = {
    userId: me,
    start: { gte: fromDate, lte: toDate },
  };
  const where: Prisma.BookingWhereInput =
    statusParam === "COMPLETED"
      ? { ...baseWhere, status: "COMPLETED" }
      : baseWhere;

  const orderBy: Prisma.BookingOrderByWithRelationInput = {
    start: "desc",
  } as const;

  const pageSize = 100;

  const [rows, totalsAll, totalsCompleted] = await db.$transaction([
    db.booking.findMany({
      where,
      orderBy,
      take: pageSize,
      include: {
        service: { select: { name: true } },
        groomer: { select: { user: { select: { name: true, email: true } } } },
      },
    }),
    db.booking.aggregate({
      where: baseWhere,
      _sum: { depositCents: true, tipCents: true },
      _count: { _all: true },
    }),
    db.booking.aggregate({
      where: { ...baseWhere, status: "COMPLETED" },
      _sum: { depositCents: true, tipCents: true },
      _count: { _all: true },
    }),
  ]);

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

  const completedSum =
    (totalsCompleted._sum?.depositCents ?? 0) +
    (totalsCompleted._sum?.tipCents ?? 0);
  const allSum =
    (totalsAll._sum?.depositCents ?? 0) + (totalsAll._sum?.tipCents ?? 0);
  const completedCount = totalsCompleted._count?._all ?? 0;
  const allCount = totalsAll._count?._all ?? 0;

  const pillClass = (current: boolean) =>
    current ? `${styles.pill} ${styles.pillCurrent}` : styles.pill;

  const statusClass = (s: string) =>
    s === "COMPLETED"
      ? styles.badge_completed
      : s === "CONFIRMED"
      ? styles.badge_confirmed
      : s === "PENDING"
      ? styles.badge_pending
      : s === "CANCELED"
      ? styles.badge_canceled
      : styles.badge_noshow;

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Billing & Receipts</h1>
        <div className={styles.btnRow}>
          <Link href='/dashboard' className={styles.btnOutline}>
            Dashboard
          </Link>
          <Link href='/dashboard/my-bookings' className={styles.btnOutline}>
            My Bookings
          </Link>
          <Link href='/book' className={styles.btnPrimary}>
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <form className={styles.filters}>
        <div className={styles.field}>
          <label className={styles.label}>From</label>
          <input
            type='date'
            name='from'
            defaultValue={fromStr}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>To</label>
          <input
            type='date'
            name='to'
            defaultValue={toStr}
            className={styles.input}
          />
        </div>
        <input type='hidden' name='preset' value='custom' />
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            name='status'
            defaultValue={statusParam}
            className={styles.select}
          >
            <option value='COMPLETED'>Completed only</option>
            <option value='ALL'>All statuses</option>
          </select>
        </div>
        <button type='submit' className={styles.btnPrimary}>
          Apply
        </button>
        <Link href='?' className={styles.btnOutline}>
          Clear
        </Link>
      </form>

      {/* Preset pills */}
      <div className={styles.pillsRow}>
        <Link
          href={buildHref(sp, { preset: "30d", from: null, to: null })}
          className={pillClass(preset === "30d")}
        >
          Last 30 days
        </Link>
        <Link
          href={buildHref(sp, { preset: "90d", from: null, to: null })}
          className={pillClass(preset === "90d")}
        >
          Last 90 days
        </Link>
        <Link
          href={buildHref(sp, { preset: "year", from: null, to: null })}
          className={pillClass(preset === "year")}
        >
          This year
        </Link>
      </div>

      {/* Summary cards */}
      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Completed total</div>
          <div className={styles.cardValue}>{toUSD(completedSum)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Completed count</div>
          <div className={styles.cardValue}>
            {completedCount.toLocaleString()}
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>All total (in range)</div>
          <div className={styles.cardValue}>{toUSD(allSum)}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>All count (in range)</div>
          <div className={styles.cardValue}>{allCount.toLocaleString()}</div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Groomer</th>
                <th className={styles.th}>Deposit</th>
                <th className={styles.th}>Tip</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className={`${styles.td} ${styles.center} ${styles.muted}`}
                  >
                    No records for this view.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const d = new Date(r.start);
                  const service = r.service?.name ?? "—";
                  const groomer =
                    r.groomer?.user?.name ?? r.groomer?.user?.email ?? "—";
                  const deposit = r.depositCents ?? 0;
                  const tip = r.tipCents ?? 0;
                  const total = deposit + tip;

                  return (
                    <tr key={r.id}>
                      <td className={styles.td} data-label='Date'>
                        {dateFmt.format(d)}
                      </td>
                      <td className={styles.td} data-label='Time'>
                        {timeFmt.format(d)}
                      </td>
                      <td className={styles.td} data-label='Service'>
                        {service}
                      </td>
                      <td className={styles.td} data-label='Groomer'>
                        {groomer}
                      </td>
                      <td className={styles.td} data-label='Deposit'>
                        {toUSD(deposit)}
                      </td>
                      <td className={styles.td} data-label='Tip'>
                        {toUSD(tip)}
                      </td>
                      <td
                        className={`${styles.td} ${styles.tdStrong}`}
                        data-label='Total'
                      >
                        {toUSD(total)}
                      </td>
                      <td className={styles.td} data-label='Status'>
                        <span
                          className={`${styles.badge} ${statusClass(r.status)}`}
                        >
                          {r.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className={styles.td} data-label='Receipt'>
                        {r.receiptUrl ? (
                          <a
                            href={r.receiptUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className={styles.link}
                          >
                            View
                          </a>
                        ) : (
                          <span className={styles.muted}>—</span>
                        )}
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
