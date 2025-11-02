/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AdminBookingsPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TZ = process.env.SALON_TZ ?? "America/Phoenix";
const BASE_PATH = "/admin/bookings";

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
function getNum(
  sp: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number
) {
  const n = Number(getStr(sp, key, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function buildHref(prev: URLSearchParams, next: Record<string, string | null>) {
  const q: Record<string, string> = Object.fromEntries(prev.entries());
  for (const [k, v] of Object.entries(next)) {
    if (v === null) delete q[k];
    else q[k] = v;
  }
  return { pathname: BASE_PATH, query: q } as const;
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const spObj = await searchParams;
  const sp = new URLSearchParams(
    Object.entries(spObj).reduce<Record<string, string>>((acc, [k, v]) => {
      if (Array.isArray(v)) acc[k] = v[0] ?? "";
      else if (v != null) acc[k] = v;
      return acc;
    }, {})
  );

  const page = Math.max(1, getNum(spObj, "page", 1));
  const pageSize = Math.min(100, getNum(spObj, "pageSize", 20));

  const q = getStr(spObj, "q").trim();
  const status = getStr(spObj, "status").trim();
  const groomerId = getStr(spObj, "groomerId").trim();
  const serviceId = getStr(spObj, "serviceId").trim();
  const from = getStr(spObj, "from").trim();
  const to = getStr(spObj, "to").trim();

  const sort = getStr(spObj, "sort") || "start";
  const order = (getStr(spObj, "order") || "desc") as "asc" | "desc";

  const where: Prisma.BookingWhereInput = {};

  if (status) where.status = status as any;
  if (groomerId) where.groomerId = groomerId;
  if (serviceId) where.serviceId = serviceId;

  if (from || to) {
    where.start = {};
    if (from) where.start.gte = new Date(from);
    if (to) {
      const end =
        to.length <= 10 ? new Date(`${to}T23:59:59.999Z`) : new Date(to);
      where.start.lte = end;
    }
  }

  if (q) {
    where.OR = [
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
      { service: { name: { contains: q, mode: "insensitive" } } },
      { groomerId: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "createdAt"
      ? { createdAt: order }
      : sort === "status"
      ? { status: order }
      : { start: order };

  const [bookings, total, groomers, services, statusCounts] =
    await db.$transaction([
      db.booking.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { name: true, email: true } },
          groomer: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
          service: { select: { name: true } },
        },
      }),
      db.booking.count({ where }),
      db.groomer.findMany({ orderBy: { id: "asc" }, select: { id: true } }),
      db.service.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      db.booking.groupBy({
        by: ["status"],
        where,
        orderBy: { status: "asc" },
        _count: { _all: true },
      }),
    ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

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

  const statusCountMap = Object.fromEntries(
    statusCounts.map((s) => [
      String(s.status),
      typeof s._count === "object" && s._count ? s._count._all ?? 0 : 0,
    ])
  );

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Bookings</h1>

        <div className={styles.headerCount}>
          {total.toLocaleString()} result{total === 1 ? "" : "s"}
        </div>
      </div>

      <form className={styles.filters}>
        <div className={styles.fieldGrow}>
          <input
            className={styles.input}
            type='text'
            name='q'
            defaultValue={q}
            placeholder='Search name, email, service, groomer id...'
          />
        </div>

        <div className={styles.field}>
          <select name='status' defaultValue={status} className={styles.select}>
            <option value=''>All statuses</option>
            {Object.keys(statusCountMap)
              .sort()
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.field}>
          <select
            name='groomerId'
            defaultValue={groomerId}
            className={styles.select}
          >
            <option value=''>All groomers</option>
            {groomers.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <select
            name='serviceId'
            defaultValue={serviceId}
            className={styles.select}
          >
            <option value=''>All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.dateRow}>
          <input
            className={styles.input}
            type='date'
            name='from'
            defaultValue={from}
          />
          <input
            className={styles.input}
            type='date'
            name='to'
            defaultValue={to}
          />
        </div>

        <div className={styles.sortRow}>
          <select name='sort' defaultValue={sort} className={styles.select}>
            <option value='start'>Sort by Start</option>
            <option value='createdAt'>Sort by Created</option>
            <option value='status'>Sort by Status</option>
          </select>
          <select name='order' defaultValue={order} className={styles.select}>
            <option value='desc'>Desc</option>
            <option value='asc'>Asc</option>
          </select>
        </div>

        <input type='hidden' name='page' value='1' />
        <input type='hidden' name='pageSize' value={pageSize} />

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

      {Object.keys(statusCountMap).length > 0 && (
        <div className={styles.pillsRow}>
          <Pill
            href={buildHref(sp, { status: null, page: "1" })}
            current={!status}
            label={`All (${total})`}
          />
          {Object.entries(statusCountMap).map(([s, c]) => (
            <Pill
              key={s}
              href={buildHref(sp, { status: s, page: "1" })}
              current={status === s}
              label={
                <>
                  {s} <span className={styles.pillCount}>({c})</span>
                </>
              }
            />
          ))}
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <Th
                sp={sp}
                label='Date'
                sortKey='start'
                sort={sort}
                order={order}
              />
              <th className={styles.th}>Time</th>
              <Th
                sp={sp}
                label='Booked'
                sortKey='createdAt'
                sort={sort}
                order={order}
              />
              <th className={styles.th}>Customer</th>
              <th className={styles.th}>Groomer</th>
              <th className={styles.th}>Service</th>
              <Th
                sp={sp}
                label='Status'
                sortKey='status'
                sort={sort}
                order={order}
              />
              <th className={styles.th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyCell}>
                  No bookings match your filters.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const dt = new Date(b.start);
                const created = new Date(b.createdAt);
                const date = dateFmt.format(dt);
                const time = timeFmt.format(dt);
                const bookedDate = dateFmt.format(created);
                const bookedTime = timeFmt.format(created);
                const customer = b.user?.name || b.user?.email || "—";
                const service = b.service?.name || "—";
                const groomerName =
                  b.groomer?.user?.name || b.groomer?.user?.email || "—";
                return (
                  <tr key={b.id} className={styles.tr}>
                    <td className={styles.td}>{date}</td>
                    <td className={styles.td}>{time}</td>
                    <td className={styles.td}>
                      {bookedDate}{" "}
                      <small className={styles.bookedTime}>{bookedTime}</small>
                    </td>
                    <td className={styles.td}>{customer}</td>
                    <td className={styles.td}>{groomerName}</td>
                    <td className={styles.td}>{service}</td>
                    <td className={styles.td}>
                      <StatusBadge status={b.status as any} />
                    </td>
                    <td className={styles.td}>
                      <Link
                        href={{ pathname: `${BASE_PATH}/${b.id}` }}
                        className={styles.viewLink}
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

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing{" "}
          {total === 0
            ? "0"
            : `${(page - 1) * pageSize + 1}–${Math.min(
                page * pageSize,
                total
              )}`}{" "}
          of {total}
        </div>
        <div className={styles.paginationControls}>
          {page <= 1 ? (
            <span className={`${styles.btnOutline} ${styles.btnDisabled}`}>
              Previous
            </span>
          ) : (
            <Link
              href={buildHref(sp, { page: String(page - 1) })}
              className={styles.btnOutline}
            >
              Previous
            </Link>
          )}
          {page >= pages ? (
            <span className={`${styles.btnOutline} ${styles.btnDisabled}`}>
              Next
            </span>
          ) : (
            <Link
              href={buildHref(sp, { page: String(page + 1) })}
              className={styles.btnOutline}
            >
              Next
            </Link>
          )}
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
    <span className={`${styles.badge} ${cls}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function Th({
  sp,
  label,
  sortKey,
  sort,
  order,
}: {
  sp: URLSearchParams;
  label: string;
  sortKey: string;
  sort: string;
  order: "asc" | "desc";
}) {
  const isActive = sort === sortKey;
  const nextOrder = isActive && order === "asc" ? "desc" : "asc";
  const href = buildHref(sp, { sort: sortKey, order: nextOrder, page: "1" });

  return (
    <th className={styles.th}>
      <Link
        href={href}
        className={`${styles.thLink} ${isActive ? styles.thActive : ""}`}
      >
        {label}{" "}
        <span className={styles.thArrow}>
          {isActive ? (order === "asc" ? "▲" : "▼") : ""}
        </span>
      </Link>
    </th>
  );
}
