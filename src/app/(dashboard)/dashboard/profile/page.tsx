import styles from "./ProfilePage.module.css";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/account";

/* ───────────────── Server action: update profile ───────────────── */
export async function updateProfile(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();

  if (!name) throw new Error("Name is required.");

  await db.user.update({
    where: { id: session.user.id },
    data: { name, image: image || null },
  });

  revalidatePath(BASE_PATH);
}

/* ───────────────── Page ───────────────── */
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });
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
        <h1 className={`${styles.heading} adminHeading`}>Profile & Settings</h1>
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

      {/* Summary card */}
      <div className={`${styles.card} ${styles.summaryGrid} ${styles.mb16}`}>
        

        <div className={styles.infoGrid}>
          <Info label='Name' value={me.name ?? "—"} />
          <Info label='Email' value={me.email} />
          <Info label='Role' value={me.role} />
          <Info label='Joined' value={joined} />
        </div>
      </div>

      {/* Edit profile */}
      <section className={styles.mb16}>
        <h2 className={styles.h2}>Edit Profile</h2>
        <form action={updateProfile} className={styles.formGrid}>
          <div className={styles.card}>
            <label className={styles.label}>Name</label>
            <input
              name='name'
              defaultValue={me.name ?? ""}
              required
              className={styles.input}
            />
          </div>
         
          <div className={styles.actionsRight}>
            <button type='submit' className={styles.btnPrimary}>
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* Read-only account details */}
      <section>
        <h2 className={styles.h2}>Account</h2>
        <div className={`${styles.card} ${styles.infoGridWide}`}>
          <Info label='Email (read-only)' value={me.email} />
          <Info
            label='User ID'
            value={<code className={styles.code}>{me.id}</code>}
          />

          {session.user.role === "ADMIN" && (
            <div>
              <div className={styles.infoLabelMuted}>Admin</div>
              <Link href='/admin' className={styles.btnOutline}>
                Open Admin Panel
              </Link>
            </div>
          )}

          {session.user.isGroomer && (
            <div>
              <div className={styles.infoLabelMuted}>Groomer</div>
              <Link href='/groomer' className={styles.btnOutline}>
                Open Groomer Panel
              </Link>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

/* ───────────── little presentational bits ───────────── */
function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoLabelBox}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  );
}
