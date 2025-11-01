import { requireGroomer } from "@/lib/rbac";
import styles from "./GroomerLayout.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import Nav from "@/components/shared/Nav/Nav";
import GroomerSideNav from "@/components/groomerPage/GroomerSideNav/GroomerSideNav";
import Footerii from "@/components/shared/Footerii/Footerii";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireGroomer();

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
              <div className={styles.AdminSideNavContainer}>
                <GroomerSideNav />
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
