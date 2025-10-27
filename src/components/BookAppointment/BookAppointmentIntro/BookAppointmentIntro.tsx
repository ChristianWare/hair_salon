import Nav from "@/components/shared/Nav/Nav";
import styles from "./BookAppointmentIntro.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import Luxury from "@/components/shared/icons/Luxury/Luxury";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

export default function BookAppointmentIntro() {
  return (
    <section className={styles.container}>
      <Nav
        navColor='var(--black)'
        scrolledNavColor='var(--black)'
        scrolledBg='var(--white)'
      />
      <LayoutWrapper>
        <div className={styles.content}>
          <Luxury className={styles.icon} />
          <SectionHeading text='Book Appointment' left right />
          <h1 className={`${styles.heading} h2`}>
            It&apos;s your time to shine
          </h1>
          <p className={styles.copy}>
            Thank you for your interest in Luxe Salon. Please fill out the form
            below and someone from our salon will contact you shortly to set up
            your appointment with one of our artists. Your personal information
            will not be passed on to any third parties. We look forward to
            seeing you in the salon soon.
          </p>
        </div>
      </LayoutWrapper>
    </section>
  );
}
