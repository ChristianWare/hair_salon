import Quotes from "@/components/shared/icons/Quotes/Quotes";
import styles from "./Quote.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Img1 from "../../../../public/images/quote.jpg";
import Image from "next/image";

export default function Quote() {
  return (
    <section className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.imgOverlay} />
        <Image
          src={Img1}
          alt='Hero Image'
          fill
          className={styles.img}
        />
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
          <div className={styles.sectionHeadingContainer}>
            <SectionHeading text='Stacey - Phoenix, AZ' color='tan' />
          </div>
        </div>
      </div>
    </section>
  );
}
