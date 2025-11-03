import styles from "./SettingPage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import ConfirmSubmit from "@/components/shared/ConfirmSubmit/ConfirmSubmit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/dashboard/settings";

/* ───────────────── Actions ───────────────── */

export async function updateGroomerNotifications(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const emailOptIn = formData.get("emailOptIn") === "on";
  const smsOptIn = formData.get("smsOptIn") === "on";
  const notificationPhone =
    (formData.get("notificationPhone") as string)?.trim() || null;

  const groomer = await db.groomer.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!groomer)
    throw new Error("Only groomers can edit notification preferences.");

  if (smsOptIn && !notificationPhone) {
    throw new Error("Please enter a phone number to enable SMS notifications.");
  }

  await db.groomer.update({
    where: { id: session.user.id },
    data: { emailOptIn, smsOptIn, notificationPhone },
  });

  revalidatePath(BASE_PATH);
}

export async function signOutEverywhere() {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await db.session.deleteMany({ where: { userId: session.user.id } });
  redirect("/login");
}

export async function deleteAccount() {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const upcoming = await db.booking.count({
    where: {
      userId: session.user.id,
      start: { gte: new Date() },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });
  if (upcoming > 0) {
    throw new Error("You have upcoming bookings. Please cancel them first.");
  }

  await db.user.delete({ where: { id: session.user.id } });
  redirect("/");
}

/* ───────────────── Page ───────────────── */

export default async function SettingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [me, groomer] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    db.groomer.findUnique({
      where: { id: session.user.id },
      select: {
        active: true,
        emailOptIn: true,
        smsOptIn: true,
        notificationPhone: true,
      },
    }),
  ]);

  if (!me) redirect("/login");

  const joined = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(me.createdAt));

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Settings</h1>
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

      {/* Account summary */}
      <div className={`${styles.card} ${styles.infoGridWide} ${styles.mb16}`}>
        <Info label='Name' value={me.name ?? "—"} />
        <Info label='Email' value={me.email} />
        <Info label='Role' value={me.role} />
        <Info label='Joined' value={joined} />
      </div>

      {/* Notifications (groomer only) */}
      {groomer?.active && (
        <section className={styles.mb16}>
          <h2 className={styles.h2}>Notifications (Groomers)</h2>
          <form
            action={updateGroomerNotifications}
            className={`${styles.card} ${styles.formGrid}`}
          >
            <div>
              <div className={styles.label}>Email Notifications</div>
              <label className={styles.checkboxLabel}>
                <input
                  type='checkbox'
                  name='emailOptIn'
                  defaultChecked={!!groomer.emailOptIn}
                />
                <span className={styles.checkboxText}>
                  Receive job notifications by email
                </span>
              </label>
            </div>

            <div>
              <div className={styles.label}>SMS Notifications</div>
              <label className={styles.checkboxLabel}>
                <input
                  type='checkbox'
                  name='smsOptIn'
                  defaultChecked={!!groomer.smsOptIn}
                />
                <span className={styles.checkboxText}>
                  Receive job notifications by SMS
                </span>
              </label>
            </div>

            <div>
              <label className={styles.label}>Notification Phone</label>
              <input
                name='notificationPhone'
                defaultValue={groomer.notificationPhone ?? ""}
                placeholder='(555) 123-4567'
                className={styles.input}
              />
              <div className={styles.helpText}>Required if SMS is enabled.</div>
            </div>

            <div className={styles.actionsRight}>
              <button type='submit' className={styles.btnPrimary}>
                Save
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Security */}
      <section>
        <h2 className={styles.h2}>Security</h2>
        <div className={styles.cardGrid}>
          {/* Sign out everywhere */}
          <form action={signOutEverywhere} className={styles.card}>
            <div className={styles.cardTitle}>Sign out everywhere</div>
            <div className={styles.helpText}>
              End all active sessions on all devices. You’ll need to log in
              again.
            </div>
            <button type='submit' className={styles.btnOutline}>
              Sign out all devices
            </button>
          </form>

          {/* Danger Zone */}
          <div className={styles.card}>
            <div className={`${styles.cardTitle} ${styles.dangerTitle}`}>
              Delete account
            </div>
            <div className={styles.helpText}>
              Permanently delete your account and data (past bookings are
              removed). This cannot be undone.
            </div>
            <form
              id='del-account'
              action={deleteAccount}
              className={styles.hidden}
            />
            <ConfirmSubmit
              form='del-account'
              message='Are you sure you want to permanently delete your account? This cannot be undone.'
            >
              Delete my account
            </ConfirmSubmit>
          </div>
        </div>
      </section>
    </section>
  );
}

/* ───────────── UI bits ───────────── */
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}
