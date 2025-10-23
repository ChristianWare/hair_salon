import Quotes from "@/components/shared/icons/Quotes/Quotes";
import styles from "./Quote.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

export default function Quote() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <blockquote className={styles.quote}>
          <div className={styles.quoteIconBox}>
            <Quotes className={styles.icon} />
          </div>
          <p className={styles.copy}>
            My color and cut are always flawless, and I leave feeling like the
            best version of myself.
          </p>
        </blockquote>
        <SectionHeading text="Stacey - Phoenix, AZ" />
      </div>
    </section>
  );
}
