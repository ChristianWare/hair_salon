import styles from "./FinalCTA.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/location2.jpg";
import Button from "@/components/shared/Button/Button";

export default function FinalCTA() {
  return (
    <section className={styles.parent}>
      <div className={styles.container}>
        <div className={styles.imgOverlay} />
        <Image src={Img1} alt='Hero Image' fill className={styles.img} />
        <div className={styles.content}>
          <h2 className={styles.heading}>Ready to transform your hair?</h2>
          <p className={styles.desc}>
            Book an appointment with our expert stylists today and experience
            the Velvet & Vine difference.
          </p>
        </div>
      </div>
    </section>
  );
}
