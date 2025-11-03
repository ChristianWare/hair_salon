// src/app/(admin)/customers/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AdminCustomersPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import RoleCheckboxes from "@/components/admin/RoleCheckboxes/RoleCheckboxes";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/admin/customers";

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

export default async function AdminCustomersPage({
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

  const q = getStr(spObj, "q").trim();
  const tab = (getStr(spObj, "tab") || "all") as
    | "all"
    | "admins"
    | "groomers"
    | "users";
  const sort = getStr(spObj, "sort") || "createdAt";
  const order = (getStr(spObj, "order") || "desc") as "asc" | "desc";
  const page = Math.max(1, getNum(spObj, "page", 1));
  const pageSize = Math.min(100, getNum(spObj, "pageSize", 20));

  let where: any = {};
  if (tab === "admins") where.role = "ADMIN";
  if (tab === "users") where.role = "USER";
  if (tab === "groomers")
    where = { ...where, groomer: { is: { active: true } } };

  if (q) {
    where = {
      ...where,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { id: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  const orderBy =
    sort === "name"
      ? { name: order }
      : sort === "email"
      ? { email: order }
      : { createdAt: order };

  const [rows, total, totalUsers, adminCount, userCount, groomerCount] =
    await db.$transaction([
      db.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          groomer: { select: { active: true } },
        },
      }),
      db.user.count({ where }),
      db.user.count(),
      db.user.count({ where: { role: "ADMIN" } }),
      db.user.count({ where: { role: "USER" } }),
      db.groomer.count({ where: { active: true } }),
    ]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Customers</h1>
        <div className={styles.headerCount}>
          {total.toLocaleString()} result{total === 1 ? "" : "s"}
        </div>
      </div>

      <form className={styles.filters}>
        <div className={styles.fieldGrow}>
          <label className={styles.label}>Search</label>
          <input
            name='q'
            defaultValue={q}
            placeholder='Search name, email, id…'
            className={styles.input}
          />
        </div>

        <div className={styles.sortRow}>
          <div className={styles.field}>
            <label className={styles.label}>Sort</label>
            <select name='sort' defaultValue={sort} className={styles.select}>
              <option value='createdAt'>Joined</option>
              <option value='name'>Name</option>
              <option value='email'>Email</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Order</label>
            <select name='order' defaultValue={order} className={styles.select}>
              <option value='desc'>Desc</option>
              <option value='asc'>Asc</option>
            </select>
          </div>
        </div>

        <input type='hidden' name='tab' value={tab} />
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
          href={buildHref(sp, { tab: "all", page: "1" })}
          current={tab === "all"}
          label={`All (${totalUsers})`}
        />
        <Pill
          href={buildHref(sp, { tab: "admins", page: "1" })}
          current={tab === "admins"}
          label={`Admins (${adminCount})`}
        />
        <Pill
          href={buildHref(sp, { tab: "groomers", page: "1" })}
          current={tab === "groomers"}
          label={`Groomers (${groomerCount})`}
        />
        <Pill
          href={buildHref(sp, { tab: "users", page: "1" })}
          current={tab === "users"}
          label={`Users (${userCount})`}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Roles</th>
              <th className={styles.th}>Joined</th>
              <th className={styles.th}>Edit Roles</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No customers match your filters.
                </td>
              </tr>
            ) : (
              rows.map((u) => {
                const roleText = [
                  u.role === "ADMIN" && "Admin",
                  u.groomer?.active && "Groomer",
                  "User",
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <tr key={u.id} className={styles.tr}>
                    <td className={styles.td} data-label='Name'>
                      {u.name ?? "—"}
                    </td>
                    <td className={styles.td} data-label='Email'>
                      {u.email}
                    </td>
                    <td className={styles.td} data-label='Roles'>
                      {roleText}
                    </td>
                    <td className={styles.td} data-label='Joined'>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`${styles.td}`} data-label='Edit Roles'>
                      <div className={styles.rowActions}>
                        <RoleCheckboxes
                          userId={u.id}
                          isAdmin={u.role === "ADMIN"}
                          isGroomer={!!u.groomer?.active}
                        />
                      </div>
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
