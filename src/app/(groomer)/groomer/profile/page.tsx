/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./GroomerProfilePage.module.css";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireGroomer } from "@/lib/rbac";
import ProfileEditor from "@/components/groomerPage/ProfileEditor/ProfileEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_PATH = "/groomer/profile";

export async function saveProfile(formData: FormData) {
  "use server";
  const user = await requireGroomer();

  const bio = ((formData.get("bio") as string) || "").trim();
  const specsRaw = (formData.get("specialties") as string) || "";

  await db.groomer.update({
    where: { id: user.id },
    data: {
      bio,
      specialties: specsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    },
  });

  revalidatePath(BASE_PATH);
}

export default async function GroomerProfilePage() {
  const user = await requireGroomer();

  const groomer = await db.groomer.findUnique({
    where: { id: user.id },
    select: {
      bio: true,
      specialties: true,
      workingHours: true,
      active: true,
    },
  });
  if (!groomer) redirect("/login");

  const account = await db.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, image: true, createdAt: true },
  });

  const joined =
    account?.createdAt &&
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(account.createdAt));

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.heading} adminHeading`}>Groomer Profile</h1>
        <div className={styles.headerActions}>
          <Link href='/groomer' className={styles.btnOutline}>
            Dashboard
          </Link>
          <Link href='/groomer/my-bookings' className={styles.btnOutline}>
            My Bookings
          </Link>
          <Link href='/groomer/availability' className={styles.btnOutline}>
            Availability
          </Link>
        </div>
      </div>

      <div className={`${styles.card} ${styles.accountCard}`}>
        <div className={styles.infoGrid}>
          <div className={styles.infoName}>{account?.name ?? "—"}</div>
          <div className={styles.infoEmail}>{account?.email ?? "—"}</div>
          <div className={styles.infoMeta}>
            Joined {joined ?? "—"} ·{" "}
            <span
              className={`${styles.statusBadge} ${
                groomer.active ? styles.statusActive : styles.statusInactive
              }`}
            >
              {groomer.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className={styles.quickLinks}>
          <Link href='/account/settings' className={styles.btnOutline}>
            Change Password
          </Link>
        </div>
      </div>

      <section className={styles.card}>
        <h2 className={styles.h2}>Edit Profile</h2>
        <p className={styles.intro}>
          Update your bio and specialties. Your availability and breaks are
          managed separately on the Availability page.
        </p>

        <ProfileEditor
          initialBio={groomer.bio || ""}
          initialSpecs={groomer.specialties}
          initialWorking={groomer.workingHours as any}
          onSave={saveProfile}
        />
      </section>
    </section>
  );
}
