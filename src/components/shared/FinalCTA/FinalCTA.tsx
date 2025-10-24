import styles from "./FinalCTA.module.css";
import Button from "@/components/shared/Button/Button";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

export default function FinalCTA() {
  return (
    <section className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.imgOverlay} />
        <div className={styles.content}>
          <div className={styles.sectionHeadingContainer}>
            <SectionHeading text='Velvet & Vine' color='tan' />
          </div>
          <h2 className={styles.heading}>Ready to transform your hair?</h2>
          <p className={styles.desc}>
            Book an appointment with our expert stylists today and experience
            the Velvet & Vine difference.
          </p>
          <div className={styles.btnContainer}>
            <Button href='/' text='Get Started' btnType='tanBorderii' />
          </div>
        </div>
      </div>
    </section>
  );
}
