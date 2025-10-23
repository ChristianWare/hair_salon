import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./Welcome.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

export default function Welcome() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <SectionHeading text='Welcome' />
          </div>
          <div className={styles.bottom}></div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
