import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import styles from "./AboutUsDetails.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import Luxury from "@/components/shared/icons/Luxury/Luxury";

export default function AboutUsDetails() {
  return (
    <section className={styles.container}>
      <div className={styles.imgOverlay} />
      <LayoutWrapper>
        <div className={styles.content}>
          <Luxury className={styles.icon} />
          <div className={styles.sectionHeadingContainer}>
            <SectionHeading text='Our mission' color='tan' left right />
          </div>
          <h2 className={styles.heading}>
            &ldquo;We are passionate about creating beautiful hair. We believe
            in providing a personalized experience, listening to your needs, and
            using high-quality products to achieve stunning results.&rdquo;
          </h2>
          <p className={styles.copy}>
            Our team of skilled and creative stylists is dedicated to delivering
            exceptional service, from the latest trends to timeless classics.
            Whether you&apos;re here for a fresh cut, vibrant color, or a
            signature style, we aim to make every visit relaxing, inspiring.
          </p>
        </div>
      </LayoutWrapper>
    </section>
  );
}
