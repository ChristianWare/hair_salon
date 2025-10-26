import styles from "./AboutPageIntro.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import Image from "next/image";
import Img1 from "../../../../public/images/hug.jpg";
import Img2 from "../../../../public/images/salon4.jpg";
import Nav from "@/components/shared/Nav/Nav";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Stats from "@/components/shared/Stats/Stats";

export default function AboutPageIntro() {
  return (
    <section className={styles.container}>
      <Nav
        navColor='var(--black)'
        scrolledNavColor='var(--black)'
        scrolledBg='var(--white)'
      />
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.left}>
            <SectionHeading text='About Us' />
            <h1 className={`${styles.heading} h1ii`}>
              We create beautiful hairstyles
            </h1>
            <p className={styles.copy}>
              At Velvet & Vine we believe that great hair is more than just a
              style. That&apos;s why we are committed to delivering not only
              exceptional results but also an unforgettable experience.
            </p>
            <div className={styles.imgContainer}>
              <Image
                src={Img2}
                alt='stylist hugging client'
                fill
                className={styles.img}
                sizes='(max-width: 1168px) 100vw, 50vw'
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.imgContainerii}>
              <Image
                src={Img1}
                alt='stylist hugging client'
                fill
                className={styles.img}
                sizes='(max-width: 1168px) 100vw, 50vw'
              />
            </div>
            <h2 className={styles.subHeading}>
              From the moment you walk through our doors, our goal is to make
              you feel welcomed, pampered, and confident in your own beauty. We
              take the time to understand your unique needs and preferences,
              ensuring that every service is tailored to enhance your individual
              style.
            </h2>
          </div>
          <div className={styles.mobileHidden}>
            <div className={styles.imgContainer}>
              <Image
                src={Img2}
                alt='stylist hugging client'
                fill
                className={styles.img}
                sizes='(max-width: 1168px) 100vw, 50vw'
              />
            </div>
            <div className={styles.imgContainerii}>
              <Image
                src={Img1}
                alt='stylist hugging client'
                fill
                className={styles.img}
                sizes='(max-width: 1168px) 100vw, 50vw'
              />
            </div>
          </div>
        </div>
      </LayoutWrapper>
      <Stats />
    </section>
  );
}
