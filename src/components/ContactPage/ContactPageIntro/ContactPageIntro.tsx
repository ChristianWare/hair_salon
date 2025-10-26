import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import styles from "./ContactPageIntro.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import ContactSection from "@/components/shared/ContactSection/ContactSection";
import Nav from "@/components/shared/Nav/Nav";

export default function ContactPageIntro() {
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
            <SectionHeading text='Contact' />
            <h1 className={`${styles.heading} h2`}>
              Any Questions? <br />
              Get in Touch!
            </h1>
            <p className={styles.copy}>
              We are here to assist you with any questions or concerns you may
              have. Feel free to reach out to us anytime.
            </p>
            <p className={styles.copy}>480-456-36455</p>
            <p className={styles.copy}>helloclara@mauvestudio.co</p>
          </div>
          <div className={styles.right}>
            <ContactSection />
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
