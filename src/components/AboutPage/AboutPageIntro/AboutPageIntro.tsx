import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./AboutPageIntro.module.css";
import Image from "next/image";

export default function AboutPageIntro() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.left}></div>
          <div className={styles.right}></div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
