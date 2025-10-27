import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./AboutUs.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/about1.jpg";
import Img2 from "../../../../public/images/about2.jpg";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Button from "@/components/shared/Button/Button";

export default function AboutUs() {
  return (
    <div className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.left}>
            <SectionHeading text='About' />
            <h2 className={styles.heading}>
              Meet <br /> Velvet & Vine
            </h2>
            <p className={styles.copy}>
              At Velvet & Vine, we believe in the power of nature to transform
              your hair. Our products are crafted with the finest botanical
              ingredients, ensuring that your hair receives the nourishment it
              deserves.
            </p>
            <div className={styles.btnContainer}>
              <Button href='/' text='More About Us' btnType='darkBrown' />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.r1}>
              <div className={styles.imgContainer}>
                <Image src={Img1} alt='About us' fill className={styles.img} />
              </div>
            </div>
            <div className={styles.r2}>
              <div className={styles.imgContainerii}>
                <Image
                  src={Img2}
                  alt='About us 2'
                  fill
                  className={styles.img}
                />
              </div>
              <div className={styles.box}>
                <h3 className={styles.subheading}>Empowering your vision</h3>
                <br />
                <p className={styles.copyii}>
                  Transforming challenges into opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
}
