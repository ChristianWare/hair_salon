/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./AvailabilityPage.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import AvailabilitySettings from "@/components/groomerPage/AvailabilitySettings/AvailabilitySettings";
import BlockedDatesEditor from "@/components/groomerPage/BlockedDatesEditor/BlockedDatesEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/groomer/availability";

/* ────────────────────────────────────────────────
   Server Action: Save working hours
──────────────────────────────────────────────── */
export async function saveWorkingHours(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const workingRaw = (formData.get("workingHours") as string) || "{}";
  let workingHours: Record<string, [string, string][]>;
  try {
    workingHours = JSON.parse(workingRaw);
  } catch {
    throw new Error("Invalid workingHours JSON");
  }

  await db.groomer.update({
    where: { id: user.id },
    data: { workingHours },
  });

  revalidatePath(BASE_PATH);
}

/* ────────────────────────────────────────────────
   Server Actions: Blocked dates
──────────────────────────────────────────────── */
export async function addBreak(formData: FormData) {
  "use server";
  const user = await requireGroomer();
  const dateStr = formData.get("date") as string;
  const date = new Date(dateStr);
  if (isNaN(date.valueOf())) throw new Error("Invalid date");

  if (!user.id) throw new Error("Missing groomerId");
  await db.break.create({ data: { groomerId: user.id as string, date } });
  revalidatePath(BASE_PATH);
}

export async function removeBreak(formData: FormData) {
  "use server";
  await requireGroomer();
  const id = formData.get("id") as string;
  await db.break.delete({ where: { id } });
  revalidatePath(BASE_PATH);
}

/* ────────────────────────────────────────────────
   Page
──────────────────────────────────────────────── */
export default async function AvailabilityPage() {
  const user = await requireGroomer();

  const groomer = await db.groomer.findUnique({
    where: { id: user.id },
    include: { breaks: { orderBy: { date: "asc" } } },
  });
  if (!groomer) redirect("/login");

  const blockedDates = groomer.breaks.map((b) => ({
    id: b.id,
    date: b.date.toISOString(),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Availability</h1>
        <div className={styles.headerActions}>
          <Link href='/groomer' className={styles.btnOutline}>
            Dashboard
          </Link>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            My Bookings
          </Link>
          <Link href='/groomer/earnings' className={styles.btnOutline}>
            Earnings
          </Link>
        </div>
      </div>

      <p className={styles.intro}>
        Set your weekly working hours and block off full days you’re
        unavailable. Customers will only see openings inside these windows.
      </p>

      <section className={`${styles.card} ${styles.mb16}`}>
        <h2 className={styles.h2}>Weekly Hours</h2>
        <AvailabilitySettings
          initialWorking={groomer.workingHours as any}
          onSave={saveWorkingHours}
        />
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Blocked Dates</h2>
        <BlockedDatesEditor
          initialDates={blockedDates}
          onAddBreak={addBreak}
          onRemoveBreak={removeBreak}
        />
      </section>
    </section>
  );
}
