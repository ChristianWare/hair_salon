// src/app/(user)/dashboard/layout.tsx
import { requireUser } from "@/lib/rbac";
import styles from "./UserLayout.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import Nav from "@/components/shared/Nav/Nav";
import UserSideNav from "@/components/dashboard/UserSideNav/UserSideNav";
import Footerii from "@/components/shared/Footerii/Footerii";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser(); // ✅ Admins, Groomers, and Users allowed

  return (
    <main>
      <section className={styles.container}>
        <LayoutWrapper>
          <Nav
            navColor='var(--black)'
            scrolledNavColor='var(--black)'
            scrolledBg='var(--white)'
          />{" "}
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.UserSideNavContainer}>
                <UserSideNav />
              </div>
            </div>
            <div className={styles.right}>{children}</div>
          </div>
        </LayoutWrapper>
      </section>
        <Footerii />
    </main>
  );
}
