/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AdminServicesPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import ConfirmSubmit from "@/components/shared/ConfirmSubmit/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/admin/services";

export async function createService(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const name = (formData.get("name") as string)?.trim();
  const duration = Number(formData.get("duration"));
  const price = Number(formData.get("price"));
  if (!name || isNaN(duration) || isNaN(price))
    throw new Error("Invalid input");

  await db.service.create({
    data: {
      name,
      durationMin: duration,
      priceCents: Math.round(price * 100),
    },
  });

  revalidatePath(BASE_PATH);
}

export async function updateService(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const duration = Number(formData.get("duration"));
  const price = Number(formData.get("price"));
  const active = formData.get("active") === "on";

  await db.service.update({
    where: { id },
    data: {
      name,
      durationMin: duration,
      priceCents: Math.round(price * 100),
      active,
    },
  });

  revalidatePath(BASE_PATH);
}

export async function deactivateService(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await db.service.update({ where: { id }, data: { active: false } });

  revalidatePath(BASE_PATH);
}

export async function activateService(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await db.service.update({ where: { id }, data: { active: true } });

  revalidatePath(BASE_PATH);
}

export async function deleteService(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  try {
    await db.service.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2003") {
      throw new Error(
        "Cannot delete a service that has existing bookings. Deactivate it instead."
      );
    }
    throw e;
  } finally {
    revalidatePath(BASE_PATH);
  }
}

export default async function AdminServicesPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const services = await db.service.findMany({ orderBy: { name: "asc" } });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Services</h1>
        <div className={styles.headerCount}>{services.length} total</div>
      </div>

      <form action={createService} className={styles.filters}>
        <div className={`${styles.fieldGrow}`}>
          <label className={styles.label}>Name</label>
          <input
            name='name'
            placeholder='Name'
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Duration (min)</label>
          <input
            name='duration'
            type='number'
            min='1'
            placeholder='Minutes'
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Price ($)</label>
          <input
            name='price'
            type='number'
            min='0'
            step='0.01'
            placeholder='Price $'
            required
            className={styles.input}
          />
        </div>

        <div className={styles.actionsRight}>
          <button type='submit' className={styles.btnPrimary}>
            Create
          </button>
        </div>
      </form>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Duration</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Active</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No services yet.
                </td>
              </tr>
            ) : (
              services.map((s) => {
                const editFormId = `edit-${s.id}`;
                const deactFormId = `deact-${s.id}`;
                const actFormId = `act-${s.id}`;
                const delFormId = `del-${s.id}`;

                return (
                  <tr key={s.id} className={styles.tr}>
                    <td className={styles.td} data-label='Name'>
                      <input
                        name='name'
                        defaultValue={s.name}
                        form={editFormId}
                        required
                        className={`${styles.input} ${styles.inputFull}`}
                      />
                    </td>
                    <td className={styles.td} data-label='Duration'>
                      <input
                        name='duration'
                        type='number'
                        defaultValue={s.durationMin}
                        form={editFormId}
                        required
                        className={`${styles.input} ${styles.inputSm}`}
                      />
                    </td>
                    <td className={styles.td} data-label='Price'>
                      <input
                        name='price'
                        type='number'
                        step='0.01'
                        defaultValue={(s.priceCents / 100).toFixed(2)}
                        form={editFormId}
                        required
                        className={`${styles.input} ${styles.inputMd}`}
                      />
                    </td>
                    <td
                      className={`${styles.td} ${styles.tdCenter}`}
                      data-label='Active'
                    >
                      <input
                        name='active'
                        type='checkbox'
                        defaultChecked={s.active}
                        form={editFormId}
                      />
                    </td>
                    <td className={styles.td} data-label='Actions'>
                      <div className={styles.rowActions}>
                        <button
                          type='submit'
                          form={editFormId}
                          className={styles.btnPrimary}
                        >
                          Save
                        </button>

                        {s.active ? (
                          <button
                            type='submit'
                            form={deactFormId}
                            className={styles.btnOutline}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type='submit'
                            form={actFormId}
                            className={styles.btnOutline}
                          >
                            Activate
                          </button>
                        )}

                        <ConfirmSubmit
                          form={delFormId}
                          message={`Delete “${s.name}”? This cannot be undone.`}
                        >
                          Delete
                        </ConfirmSubmit>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {services.map((s) => (
        <div key={s.id} className={styles.hidden}>
          <form id={`edit-${s.id}`} action={updateService}>
            <input type='hidden' name='id' value={s.id} />
          </form>
          <form id={`deact-${s.id}`} action={deactivateService}>
            <input type='hidden' name='id' value={s.id} />
          </form>
          <form id={`act-${s.id}`} action={activateService}>
            <input type='hidden' name='id' value={s.id} />
          </form>
          <form id={`del-${s.id}`} action={deleteService}>
            <input type='hidden' name='id' value={s.id} />
          </form>
        </div>
      ))}
    </section>
  );
}
