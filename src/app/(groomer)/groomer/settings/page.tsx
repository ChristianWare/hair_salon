// src/app/groomer/settings/page.tsx
import styles from "./SettingsPage.module.css";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import SettingsForm from "@/components/groomerPage/SettingsForm/SettingsForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/groomer/settings";

export async function saveSettings(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const autoConfirm = formData.get("autoConfirm") === "on";
  const emailOptIn = formData.get("emailOptIn") === "on";
  const smsOptIn = formData.get("smsOptIn") === "on";

  const minLeadMinutesRaw = Number(formData.get("minLeadMinutes"));
  const bufferMinRaw = Number(formData.get("bufferMin"));
  const minLeadMinutes = Number.isFinite(minLeadMinutesRaw)
    ? Math.max(0, Math.floor(minLeadMinutesRaw))
    : 0;
  const bufferMin = Number.isFinite(bufferMinRaw)
    ? Math.max(0, Math.floor(bufferMinRaw))
    : 0;

  const phone =
    (formData.get("notificationPhone") as string | null)?.trim() || null;

  await db.groomer.update({
    where: { id: user.id },
    data: {
      autoConfirm,
      emailOptIn,
      smsOptIn,
      notificationPhone: smsOptIn ? phone : null,
      minLeadMinutes,
      bufferMin,
    },
  });

  revalidatePath(BASE_PATH);
}

export default async function SettingsPage() {
  const user = await requireGroomer();

  const groomer = await db.groomer.findUnique({
    where: { id: user.id },
    select: {
      autoConfirm: true,
      minLeadMinutes: true,
      bufferMin: true,
      emailOptIn: true,
      smsOptIn: true,
      notificationPhone: true,
    },
  });

  if (!groomer) redirect("/login");

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Settings</h1>
        <div className={styles.headerActions}>
          <Link href='/groomer' className={styles.btnOutline}>
            Dashboard
          </Link>
          <Link href='/groomer/availability' className={styles.btnOutline}>
            Availability
          </Link>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            My Bookings
          </Link>
        </div>
      </div>

      <p className={styles.subtext}>
        Control how bookings are confirmed, lead time, cleanup buffers, and
        notification preferences.
      </p>

      <section className={styles.card}>
        <h2 className={styles.h2}>Booking & Notifications</h2>
        <SettingsForm initial={groomer} onSave={saveSettings} />
      </section>
    </section>
  );
}
