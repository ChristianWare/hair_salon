import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./GalleryPageIntro.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Nav from "@/components/shared/Nav/Nav";

export default function GalleryPageIntro() {
  return (
    <section className={styles.container}>
      <Nav
        navColor='var(--black)'
        scrolledNavColor='var(--black)'
        scrolledBg='var(--white)'
      />
      <LayoutWrapper>
        <div className={styles.content}>
          <SectionHeading text='Portfolio' />
          <h1 className={`${styles.heading} h2`}>Our recent works</h1>
          <p className={styles.copy}>
            Explore our portfolio showcasing a variety of hairstyles and
            transformations. From classic cuts to modern styles, see how we
            bring our clients&apos; visions to life with precision and
            creativity.
          </p>
        </div>
      </LayoutWrapper>
    </section>
  );
}
