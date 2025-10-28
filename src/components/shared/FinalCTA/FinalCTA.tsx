import styles from "./FinalCTA.module.css";
import Button from "@/components/shared/Button/Button";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Luxury from "../icons/Luxury/Luxury";

export default function FinalCTA() {
  return (
    <section className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.imgOverlay} />
        <div className={styles.content}>
          <Luxury className={styles.icon} />
          <div className={styles.sectionHeadingContainer}>
            <SectionHeading text='Velvet & Vine' color='tan' left right />
          </div>
          <h2 className={styles.heading}>Ready to transform your hair?</h2>
          <p className={styles.desc}>
            Book an appointment with our expert stylists today and experience
            the Velvet & Vine difference.
          </p>
          <div className={styles.btnContainer}>
            <Button href='/book-appointment' text='Get Started' btnType='tanBorderii' />
          </div>
        </div>
      </div>
    </section>
  );
}
