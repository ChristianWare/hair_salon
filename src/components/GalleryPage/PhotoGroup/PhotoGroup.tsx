import styles from "./PhotoGroup.module.css";
import Image from "next/image";
import BG from "../../../../public/images/about1.jpg";
import BG1 from "../../../../public/images/about2.jpg";
import BG2 from "../../../../public/images/bridal.jpg";
import BG3 from "../../../../public/images/brooke.jpg";
import BG4 from "../../../../public/images/coloring.jpg";
import BG5 from "../../../../public/images/consult.jpg";
import BG6 from "../../../../public/images/curls.jpg";
import BG7 from "../../../../public/images/cut.jpg";
import BG8 from "../../../../public/images/extensions.jpg";
import BG9 from "../../../../public/images/fellipe.jpg";
import BG10 from "../../../../public/images/hero.jpg";
import BG11 from "../../../../public/images/hug.jpg";
import BG12 from "../../../../public/images/wash.jpg";
import BG13 from "../../../../public/images/team.jpg";
import BG14 from "../../../../public/images/tahir.jpg";
import BG15 from "../../../../public/images/stylist.jpg";
import BG16 from "../../../../public/images/service3.jpg";
import BG17 from "../../../../public/images/service2.jpg";
import BG18 from "../../../../public/images/service1.jpg";
import BG19 from "../../../../public/images/scalp.jpg";
import BG20 from "../../../../public/images/salon.jpg";
import LayoutWrapper from "@/components/shared/LayoutWrapper";

export default function PhotoGroup() {
  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <div className={styles.gallery}>
          <div className={styles.imgContainer}>
            <Image src={BG} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.vStretch}`}>
            <Image src={BG1} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.hStretch}`}>
            <Image src={BG2} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG3} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG20} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.vStretch}`}>
            <Image src={BG4} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.bigStretch}`}>
            <Image src={BG5} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG6} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.hStretch}`}>
            <Image src={BG7} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG8} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG9} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG10} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.vStretch}`}>
            <Image src={BG11} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG12} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.bigStretch}`}>
            <Image src={BG13} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG14} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.hStretch}`}>
            <Image src={BG15} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG16} alt='' fill className={styles.img} />
          </div>
          <div className={`${styles.imgContainer} ${styles.bigStretch}`}>
            <Image src={BG17} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG18} alt='' fill className={styles.img} />
          </div>
          <div className={styles.imgContainer}>
            <Image src={BG19} alt='' fill className={styles.img} />
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
