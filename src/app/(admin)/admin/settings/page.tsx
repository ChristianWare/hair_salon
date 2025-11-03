// src/app/(admin)/settings/page.tsx
import styles from "./AdminSettingsPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import ConfirmSubmit from "@/components/shared/ConfirmSubmit/ConfirmSubmit";
import ToastBridge from "@/components/shared/ToastBridge/ToastBridge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/admin/settings";

export async function updateGeneralSettings(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const depositPct = parseFloat(formData.get("depositPct") as string);
  const cancelWindow = parseInt(formData.get("cancelWindow") as string, 10);
  const taxRate = parseFloat(formData.get("taxRate") as string);
  if (isNaN(depositPct) || isNaN(cancelWindow) || isNaN(taxRate)) {
    throw new Error("Invalid input");
  }

  await Promise.all([
    db.config.upsert({
      where: { key: "depositPct" },
      create: { key: "depositPct", value: depositPct.toString() },
      update: { value: depositPct.toString() },
    }),
    db.config.upsert({
      where: { key: "cancelWindow" },
      create: { key: "cancelWindow", value: cancelWindow.toString() },
      update: { value: cancelWindow.toString() },
    }),
    db.config.upsert({
      where: { key: "taxRate" },
      create: { key: "taxRate", value: taxRate.toString() },
      update: { value: taxRate.toString() },
    }),
  ]);

  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}?toast=settings_saved`);
}

export async function updateNotificationTemplate(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const subject = (formData.get("subject") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  if (!id || !subject || !body) throw new Error("Invalid input");

  await db.notificationTemplate.update({
    where: { id },
    data: { subject, body },
  });

  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}?toast=template_saved`);
}

export async function addBlackoutDate(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const dateStr = formData.get("date") as string;
  const date = new Date(dateStr);
  if (isNaN(date.valueOf())) throw new Error("Invalid date");

  await db.blackoutDate.create({ data: { date } });
  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}?toast=blackout_added`);
}

export async function removeBlackoutDate(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await db.blackoutDate.delete({ where: { id } });
  revalidatePath(BASE_PATH);
  redirect(`${BASE_PATH}?toast=blackout_removed`);
}

type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const spObj = await searchParams;
  const toastKeyRaw = spObj?.toast;
  const toastKey = Array.isArray(toastKeyRaw) ? toastKeyRaw[0] : toastKeyRaw;

  const [depositCfg, cancelCfg, taxCfg] = await Promise.all([
    db.config.findUnique({ where: { key: "depositPct" } }),
    db.config.findUnique({ where: { key: "cancelWindow" } }),
    db.config.findUnique({ where: { key: "taxRate" } }),
  ]);
  const notificationTemplates = await db.notificationTemplate.findMany({
    orderBy: { event: "asc" },
  });
  const blackoutDates = await db.blackoutDate.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <section className={styles.section}>
      <ToastBridge toastKey={toastKey} />

      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Settings</h1>
      </div>

      <section className={styles.block}>
        <h2 className={styles.h2}>General Business Settings</h2>
        <form action={updateGeneralSettings} className={styles.gridForm}>
          <div className={styles.card}>
            <label className={styles.label}>Deposit Percentage (%)</label>
            <input
              name='depositPct'
              type='number'
              step='0.1'
              defaultValue={depositCfg?.value ?? ""}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.card}>
            <label className={styles.label}>Cancellation Window (hrs)</label>
            <input
              name='cancelWindow'
              type='number'
              defaultValue={cancelCfg?.value ?? ""}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.card}>
            <label className={styles.label}>Tax Rate (%)</label>
            <input
              name='taxRate'
              type='number'
              step='0.1'
              defaultValue={taxCfg?.value ?? ""}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.actionsRight}>
            <button type='submit' className={styles.btnPrimary}>
              Save
            </button>
          </div>
        </form>
      </section>

      <section className={styles.block}>
        <h2 className={styles.h2}>Notification Templates</h2>

        <div className={styles.cardsGridWide}>
          {notificationTemplates.map((t) => (
            <form
              key={t.id}
              action={updateNotificationTemplate}
              className={`${styles.card} ${styles.cardColumn}`}
            >
              <input type='hidden' name='id' value={t.id} />
              <div className={styles.metaRow}>
                <strong>Event:</strong>&nbsp;{t.event}
              </div>
              <div>
                <label className={styles.label}>Subject</label>
                <input
                  name='subject'
                  defaultValue={t.subject}
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Body</label>
                <textarea
                  name='body'
                  defaultValue={t.body}
                  rows={4}
                  required
                  className={styles.textarea}
                />
              </div>
              <div>
                <button type='submit' className={styles.btnPrimary}>
                  Save Template
                </button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.h2}>Blackout Dates</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blackoutDates.length === 0 ? (
                <tr>
                  <td colSpan={2} className={styles.emptyCell}>
                    No blackout dates.
                  </td>
                </tr>
              ) : (
                blackoutDates.map((b) => {
                  const delFormId = `blk-del-${b.id}`;
                  return (
                    <tr key={b.id} className={styles.tr}>
                      <td className={styles.td} data-label='Date'>
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td className={styles.td} data-label='Actions'>
                        <ConfirmSubmit
                          form={delFormId}
                          message='Remove this blackout date?'
                        >
                          Remove
                        </ConfirmSubmit>
                        <form
                          id={delFormId}
                          action={removeBlackoutDate}
                          className={styles.hidden}
                        >
                          <input type='hidden' name='id' value={b.id} />
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <form action={addBlackoutDate} className={styles.inlineRow}>
          <div>
            <label className={styles.label}>Add Date</label>
            <input name='date' type='date' required className={styles.input} />
          </div>
          <button type='submit' className={styles.btnPrimary}>
            Add Blackout Date
          </button>
        </form>
      </section>
    </section>
  );
}
