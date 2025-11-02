// src/app/(admin)/groomers/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./GroomersPageStyles.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { $Enums, type Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/admin/groomers";

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

export default async function GroomersPage({
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

  const q = getStr(spObj, "q").trim();
  const activeParam = getStr(spObj, "active").trim();
  const sort = getStr(spObj, "sort") || "name";
  const order = (getStr(spObj, "order") || "asc") as "asc" | "desc";
  const page = Math.max(1, getNum(spObj, "page", 1));
  const pageSize = Math.min(100, getNum(spObj, "pageSize", 20));

  const where: Prisma.GroomerWhereInput = {
    user: { role: $Enums.UserRole.USER },
    ...(activeParam === "true" ? { active: true } : {}),
    ...(activeParam === "false" ? { active: false } : {}),
    ...(q
      ? {
          OR: [
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { bio: { contains: q, mode: "insensitive" } },
            { specialties: { has: q } },
            { id: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.GroomerOrderByWithRelationInput =
    sort === "active"
      ? { active: order }
      : sort === "name"
      ? { user: { name: order } }
      : { id: order };

  const [groomers, total, activeGroups] = await db.$transaction([
    db.groomer.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    db.groomer.count({ where }),
    db.groomer.groupBy({
      by: ["active"],
      _count: { _all: true },
      orderBy: { active: "desc" },
    }),
  ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  let activeCount = 0;
  let inactiveCount = 0;
  for (const row of activeGroups) {
    const c =
      typeof row._count === "object" && row._count ? row._count._all ?? 0 : 0;
    if (row.active) activeCount = c;
    else inactiveCount = c;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Groomers</h1>
        <div className={styles.headerCount}>{total.toLocaleString()} total</div>
      </div>

      <form className={styles.filters}>
        <div className={styles.fieldGrow}>
          <input
            className={styles.input}
            type='text'
            name='q'
            defaultValue={q}
            placeholder='Search name, email, bio, specialty…'
          />
        </div>

        <div className={styles.field}>
          <select
            name='active'
            defaultValue={activeParam}
            className={styles.select}
          >
            <option value=''>All statuses</option>
            <option value='true'>Active</option>
            <option value='false'>Inactive</option>
          </select>
        </div>

        <div className={styles.sortRow}>
          <select name='sort' defaultValue={sort} className={styles.select}>
            <option value='name'>Sort by Name</option>
            <option value='createdAt'>Sort by Created</option>
            <option value='active'>Sort by Active</option>
          </select>
          <select name='order' defaultValue={order} className={styles.select}>
            <option value='asc'>Asc</option>
            <option value='desc'>Desc</option>
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

      <div className={styles.pillsRow}>
        <Pill
          href={buildHref(sp, { active: null, page: "1" })}
          current={!activeParam}
          label={`All (${total})`}
        />
        <Pill
          href={buildHref(sp, { active: "true", page: "1" })}
          current={activeParam === "true"}
          label={`Active (${activeCount})`}
        />
        <Pill
          href={buildHref(sp, { active: "false", page: "1" })}
          current={activeParam === "false"}
          label={`Inactive (${inactiveCount})`}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Bio</th>
              <th className={styles.th}>Specialties</th>
              <th className={styles.th}>Active?</th>
            </tr>
          </thead>
          <tbody>
            {groomers.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No groomers match your filters.
                </td>
              </tr>
            ) : (
              groomers.map((g) => (
                <tr key={g.id} className={styles.tr}>
                  <td className={styles.td} data-label='Name'>
                    {g.user?.name ?? "—"}
                  </td>
                  <td className={styles.td} data-label='Email'>
                    {g.user?.email ?? "—"}
                  </td>
                  <td className={styles.td} data-label='Bio'>
                    {g.bio ?? "—"}
                  </td>
                  <td className={styles.td} data-label='Specialties'>
                    {g.specialties?.length ? g.specialties.join(", ") : "—"}
                  </td>
                  <td className={styles.td} data-label='Active?'>
                    <span
                      className={`${styles.badge} ${
                        g.active ? styles.badgeConfirmed : styles.badgeCanceled
                      }`}
                    >
                      {g.active ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))
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
