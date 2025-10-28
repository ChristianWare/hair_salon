// Hero.tsx
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./Hero.module.css";
// import Image from "next/image";
// import Img1 from "../../../../public/images/hero.jpg";
import Button from "@/components/shared/Button/Button";
import Nav from "@/components/shared/Nav/Nav";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Luxury from "@/components/shared/icons/Luxury/Luxury";

export default function Hero() {
  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        <Nav />
        <div className={styles.navContainer}></div>
        <div className={styles.imgOverlay}></div>
        {/* <Image
          src={Img1}
          alt='Nier Transportation'
          title='Nier Transportation'
          fill
          className={styles.img}
          priority
          placeholder='blur'
          loading='eager'
        /> */}
        <LayoutWrapper>
          <div className={styles.content}>
            <Luxury className={styles.icon} />
            <div className={styles.sectionHeadingContainer}>
              <SectionHeading text='Velvet & Vine' color='tan' left right />
            </div>

            <h1 className={styles.heading}>
              Dream. Style. <br />
              Shine.
            </h1>
            <p className={styles.copy}>
              We combine skill and creativity to give you a personalized
              experience that enhances your natural beauty. Step into our salon
              and leave with a fresh, confident look that turns heads wherever
              you go!
            </p>
            <div className={styles.btnContainer}>
              <Button
                href='/book-appointment'
                text='Book your appointment'
                btnType='tan'
              />
            </div>
          </div>
        </LayoutWrapper>
      </div>
    </section>
  );
}
