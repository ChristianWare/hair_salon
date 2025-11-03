// src/app/(admin)/reports/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./ReportsPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/admin/reports";

type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

function getStr(
  sp: Record<string, string | string[] | undefined>,
  key: string,
  fallback = ""
) {
  const v = sp[key];
  return Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;
}
function buildHref(prev: URLSearchParams, next: Record<string, string | null>) {
  const q: Record<string, string> = Object.fromEntries(prev.entries());
  for (const [k, v] of Object.entries(next)) {
    if (v === null) delete q[k];
    else q[k] = v;
  }
  return { pathname: BASE_PATH, query: q } as const;
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function subDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() - n);
  return x;
}
const toUSD = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const spObj = await searchParams;
  const sp = new URLSearchParams(
    Object.entries(spObj).reduce<Record<string, string>>((acc, [k, v]) => {
      if (Array.isArray(v)) acc[k] = v[0] ?? "";
      else if (v != null) acc[k] = v;
      return acc;
    }, {})
  );

  const preset = (getStr(spObj, "preset") || "30d") as
    | "today"
    | "7d"
    | "30d"
    | "month"
    | "custom";
  const fromQ = getStr(spObj, "from");
  const toQ = getStr(spObj, "to");

  const now = new Date();
  let fromDate: Date;
  let toDate: Date;

  if (fromQ || toQ || preset === "custom") {
    const f = fromQ
      ? startOfDay(new Date(fromQ))
      : startOfDay(subDays(now, 29));
    const t = toQ ? endOfDay(new Date(toQ)) : endOfDay(now);
    fromDate = f;
    toDate = t;
  } else if (preset === "today") {
    fromDate = startOfDay(now);
    toDate = endOfDay(now);
  } else if (preset === "7d") {
    fromDate = startOfDay(subDays(now, 6));
    toDate = endOfDay(now);
  } else if (preset === "month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    fromDate = startOfDay(first);
    toDate = endOfDay(now);
  } else {
    fromDate = startOfDay(subDays(now, 29));
    toDate = endOfDay(now);
  }

  const fromStr = toISODate(fromDate);
  const toStr = toISODate(toDate);

  const whereAll: Prisma.BookingWhereInput = {
    start: { gte: fromDate, lte: toDate },
  };
  const whereCompleted: Prisma.BookingWhereInput = {
    ...whereAll,
    status: "COMPLETED",
  };

  const [
    totalBookings,
    statusCounts,
    revenueAgg,
    svcAgg,
    grAgg,
    services,
    groomers,
  ] = await db.$transaction([
    db.booking.count({ where: whereAll }),
    db.booking.groupBy({
      by: ["status"],
      where: whereAll,
      orderBy: { status: "asc" },
      _count: { _all: true },
    }),
    db.booking.aggregate({
      where: whereCompleted,
      _sum: { depositCents: true, tipCents: true },
      _count: { _all: true },
    }),
    db.booking.groupBy({
      by: ["serviceId"],
      where: whereCompleted,
      orderBy: { serviceId: "asc" },
      _count: { _all: true },
      _sum: { depositCents: true, tipCents: true },
    }),
    db.booking.groupBy({
      by: ["groomerId"],
      where: whereCompleted,
      orderBy: { groomerId: "asc" },
      _count: { _all: true },
      _sum: { depositCents: true, tipCents: true },
    }),
    db.service.findMany({ select: { id: true, name: true } }),
    db.groomer.findMany({
      select: { id: true, user: { select: { name: true, email: true } } },
    }),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [
      String(s.status),
      typeof s._count === "object" && s._count ? s._count._all ?? 0 : 0,
    ])
  );
  const completedCount =
    typeof revenueAgg._count === "object" && revenueAgg._count
      ? revenueAgg._count._all ?? 0
      : 0;
  const sumDeposit =
    typeof revenueAgg._sum === "object" && revenueAgg._sum?.depositCents
      ? revenueAgg._sum.depositCents ?? 0
      : 0;
  const sumTip =
    typeof revenueAgg._sum === "object" && revenueAgg._sum?.tipCents
      ? revenueAgg._sum.tipCents ?? 0
      : 0;
  const revenueCents = (sumDeposit ?? 0) + (sumTip ?? 0);
  const avgTicketCents =
    completedCount > 0 ? Math.round(revenueCents / completedCount) : 0;

  const serviceName = new Map(services.map((s) => [s.id, s.name]));
  const groomerName = new Map(
    groomers.map((g) => [g.id, g.user?.name || g.user?.email || g.id])
  );

  const topServices = [...svcAgg]
    .map((r) => {
      const count =
        typeof r._count === "object" && r._count ? r._count._all ?? 0 : 0;
      const revenue = (r._sum?.depositCents ?? 0) + (r._sum?.tipCents ?? 0);
      return {
        id: r.serviceId,
        name: serviceName.get(r.serviceId) || r.serviceId,
        count,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const topGroomers = [...grAgg]
    .map((r) => {
      const count =
        typeof r._count === "object" && r._count ? r._count._all ?? 0 : 0;
      const revenue = (r._sum?.depositCents ?? 0) + (r._sum?.tipCents ?? 0);
      return {
        id: r.groomerId,
        name: groomerName.get(r.groomerId) || r.groomerId,
        count,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Reports</h1>
        <div className={styles.headerCount}>
          {fromStr} → {toStr}
        </div>
      </div>

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
        <div className={styles.actionsRight}>
          <button type='submit' className={styles.btnPrimary}>
            Apply
          </button>
          <Link
            href={{ pathname: BASE_PATH, query: {} }}
            className={styles.btnOutline}
          >
            Clear
          </Link>
        </div>
      </form>

      <div className={styles.pillsRow}>
        <Pill
          href={buildHref(sp, { preset: "today", from: null, to: null })}
          current={preset === "today"}
          label='Today'
        />
        <Pill
          href={buildHref(sp, { preset: "7d", from: null, to: null })}
          current={preset === "7d"}
          label='Last 7 days'
        />
        <Pill
          href={buildHref(sp, { preset: "30d", from: null, to: null })}
          current={preset === "30d"}
          label='Last 30 days'
        />
        <Pill
          href={buildHref(sp, { preset: "month", from: null, to: null })}
          current={preset === "month"}
          label='This month'
        />
      </div>

      <div className={styles.cardsGrid}>
        <Card title='Bookings' value={totalBookings.toLocaleString()} />
        <Card title='Completed' value={completedCount.toLocaleString()} />
        <Card title='Revenue' value={toUSD(revenueCents)} />
        <Card title='Avg ticket' value={toUSD(avgTicketCents)} />
        <Card
          title='No-shows'
          value={(statusMap["NO_SHOW"] ?? 0).toLocaleString()}
        />
        <Card
          title='Canceled'
          value={(statusMap["CANCELED"] ?? 0).toLocaleString()}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(statusMap).length === 0 ? (
              <tr>
                <td colSpan={2} className={styles.emptyCell}>
                  No bookings in range.
                </td>
              </tr>
            ) : (
              Object.entries(statusMap).map(([s, c]) => (
                <tr key={s} className={styles.tr}>
                  <td className={styles.td} data-label='Status'>
                    {s.replace("_", " ")}
                  </td>
                  <td
                    className={`${styles.td} ${styles.tdCenter}`}
                    data-label='Count'
                  >
                    {c}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.tablesGrid}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Top Services (Completed)</th>
                <th className={styles.th}>Bookings</th>
                <th className={styles.th}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topServices.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyCell}>
                    No completed bookings in range.
                  </td>
                </tr>
              ) : (
                topServices.map((r) => (
                  <tr key={r.id} className={styles.tr}>
                    <td className={styles.td} data-label='Service'>
                      {r.name}
                    </td>
                    <td
                      className={`${styles.td} ${styles.tdCenter}`}
                      data-label='Bookings'
                    >
                      {r.count}
                    </td>
                    <td className={styles.td} data-label='Revenue'>
                      {toUSD(r.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Top Groomers (Completed)</th>
                <th className={styles.th}>Bookings</th>
                <th className={styles.th}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topGroomers.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyCell}>
                    No completed bookings in range.
                  </td>
                </tr>
              ) : (
                topGroomers.map((r) => (
                  <tr key={r.id} className={styles.tr}>
                    <td className={styles.td} data-label='Groomer'>
                      {r.name}
                    </td>
                    <td
                      className={`${styles.td} ${styles.tdCenter}`}
                      data-label='Bookings'
                    >
                      {r.count}
                    </td>
                    <td className={styles.td} data-label='Revenue'>
                      {toUSD(r.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Pill({
  href,
  current,
  label,
}: {
  href: any;
  current?: boolean;
  label: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.pill} ${current ? styles.pillCurrent : ""}`}
    >
      {label}
    </Link>
  );
}

function Card({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}
