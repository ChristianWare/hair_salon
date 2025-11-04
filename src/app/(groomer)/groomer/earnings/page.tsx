/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./EarningsPage.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import { startOfDay, endOfDay, addDays, startOfMonth } from "date-fns";

type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TZ = process.env.SALON_TZ ?? "America/Phoenix";

function usdFromCents(n?: number | null) {
  return ((n ?? 0) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function parseRange(range?: string) {
  const now = new Date();
  if (range === "today") {
    return { from: startOfDay(now), to: endOfDay(now), label: "Today" };
  }
  if (range === "7d") {
    return {
      from: startOfDay(addDays(now, -6)),
      to: endOfDay(now),
      label: "Last 7 Days",
    };
  }
  if (range === "mtd") {
    return {
      from: startOfMonth(now),
      to: endOfDay(now),
      label: "Month to Date",
    };
  }
  return {
    from: undefined as Date | undefined,
    to: undefined as Date | undefined,
    label: "All Time",
  };
}

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const user = await requireGroomer();
  const sp = await searchParams;
  const rangeParam = Array.isArray(sp?.range) ? sp?.range[0] : sp?.range;
  const { from, to, label } = parseRange(rangeParam);

  const baseWhere: any = { groomerId: user.id, status: "COMPLETED" };
  const where =
    from && to ? { ...baseWhere, start: { gte: from, lte: to } } : baseWhere;

  const [agg, count, rows] = await Promise.all([
    db.booking.aggregate({
      where,
      _sum: { depositCents: true, tipCents: true },
    }),
    db.booking.count({ where }),
    db.booking.findMany({
      where,
      include: {
        service: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { start: "desc" },
      take: 50,
    }),
  ]);

  const grossCents = (agg._sum.depositCents ?? 0) + (agg._sum.tipCents ?? 0);

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
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Earnings</h1>
        <div className={styles.headerActions}>
          <Link href='/groomer' className={styles.btnOutline}>
            Dashboard
          </Link>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            My Bookings
          </Link>
        </div>
      </div>

      <p className={styles.subheading}>{label}</p>

      <nav className={styles.pillsRow}>
        <Pill
          href='/groomer/earnings?range=today'
          current={rangeParam === "today"}
        >
          Today
        </Pill>
        <Pill href='/groomer/earnings?range=7d' current={rangeParam === "7d"}>
          Last 7 Days
        </Pill>
        <Pill href='/groomer/earnings?range=mtd' current={rangeParam === "mtd"}>
          Month to Date
        </Pill>
        <Pill href='/groomer/earnings' current={!rangeParam}>
          All Time
        </Pill>
        <span className={styles.flexSpacer} />
        <Link
          href={`/groomer/earnings/export${
            rangeParam ? `?range=${encodeURIComponent(rangeParam)}` : ""
          }`}
          className={styles.btnExport}
        >
          Export CSV
        </Link>
      </nav>

      <div className={styles.kpiGrid}>
        <Kpi label='Completed Appointments' value={count.toLocaleString()} />
        <Kpi label='Tips' value={usdFromCents(agg._sum.tipCents)} />
        <Kpi
          label='Service Revenue'
          value={usdFromCents(agg._sum.depositCents)}
        />
        <Kpi label='Gross (Revenue + Tips)' value={usdFromCents(grossCents)} />
      </div>

      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.tablethead}>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Time</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Deposit</th>
                <th className={styles.th}>Tip</th>
                <th className={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className={`${styles.td} ${styles.center}`} colSpan={7}>
                    No completed appointments in this range.
                  </td>
                </tr>
              ) : (
                rows.map((b) => {
                  const d = new Date(b.start);
                  const totalCents = (b.depositCents ?? 0) + (b.tipCents ?? 0);
                  return (
                    <tr key={b.id}>
                      <td className={styles.td} data-label='Date'>
                        {dateFmt.format(d)}
                      </td>
                      <td className={styles.td} data-label='Time'>
                        {timeFmt.format(d)}
                      </td>
                      <td className={styles.td} data-label='Service'>
                        {b.service?.name ?? "—"}
                      </td>
                      <td className={styles.td} data-label='Customer'>
                        {b.user?.name ?? "—"}
                        <br />
                        <small className={styles.muted}>{b.user?.email}</small>
                      </td>
                      <td className={styles.td} data-label='Deposit'>
                        {usdFromCents(b.depositCents)}
                      </td>
                      <td className={styles.td} data-label='Tip'>
                        {usdFromCents(b.tipCents)}
                      </td>
                      <td
                        className={`${styles.td} ${styles.bold}`}
                        data-label='Total'
                      >
                        {usdFromCents(totalCents)}
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

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}

function Pill({
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
