import Img from "../../../public/images/location1.jpg";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "../leagal.module.css";
import Image from "next/image";
import Nav from "@/components/shared/Nav/Nav";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import { Metadata } from "next";
import Footerii from "@/components/shared/Footerii/Footerii";

export const metadata: Metadata = {
  title: "Accessibility | Velvet & Vine",
};

const AccessibilityPage = () => {
  return (
    <main className={styles.parent}>
      <section className={styles.container}>
        <div className={styles.imgOverlay}></div>
        <Image
          src={Img}
          alt='Accessibility Policy'
          fill
          className={styles.img2}
          sizes='100vw'
          priority
        />
        <Nav />
        <LayoutWrapper>
          <div className={styles.content}>
            <h1 className={styles.heading} lang='en'>
              Accessibility <br /> Policy
            </h1>
          </div>
        </LayoutWrapper>
      </section>
      <LayoutWrapper>
        <div className={styles.content}>
          <p>
            <strong>Effective Date: 10/31/2025</strong>
          </p>
          <br />
          <h2>1. Introduction</h2>
          <p>
            Welcome to Velvet &amp; Vine’s Accessibility Policy. We are
            committed to providing an inclusive, user-friendly experience for
            all guests, including people with disabilities. This policy outlines
            our ongoing efforts to ensure our website and online booking
            experience are accessible and usable by the widest possible
            audience.
          </p>
          <br />
          <h2>2. Web Content Accessibility Guidelines (WCAG)</h2>
          <p>
            We strive to align our website with the Web Content Accessibility
            Guidelines (WCAG) 2.1 Level AA. Our efforts include:
            <br />
            <br />
            - Providing alternative text for meaningful images and media.
            <br />
            <br />
            - Supporting keyboard-only navigation and screen reader
            compatibility.
            <br />
            <br />
            - Maintaining sufficient color contrast and scalable text.
            <br />
            <br />
            - Using clear hierarchy, headings, and consistent navigation.
            <br />
            <br />- Designing responsive layouts that work across devices and
            screen sizes.
          </p>
          <br />
          <h2>3. Assistive Technologies</h2>
          <p>
            Our website is designed to be compatible with a range of assistive
            technologies, including screen readers, screen magnifiers, and voice
            recognition software. Guests who rely on these tools should be able
            to access core features such as browsing services, viewing stylist
            information, and booking appointments.
          </p>
          <br />
          <h2>4. Accessible Booking and Communication</h2>
          <p>
            If you experience difficulty using our online booking or have
            questions about accessibility, we offer alternative options. You can
            contact us by phone or email for assistance with appointments,
            service details, pricing, and product purchases.
          </p>
          <br />
          <h2>5. Feedback</h2>
          <p>
            Your feedback helps us improve. If you encounter an accessibility
            barrier or have suggestions, please let us know:
            <br />
            <br />
            <strong>
              Address:
              <br />
              Velvet &amp; Vine
              <br />
              12345 N Scottsdale Rd, Suite 200
              <br />
              Scottsdale, AZ 85254
            </strong>
            <br />
            <br />
            <strong>
              Phone:
              <br />
              (480) 555-0137
            </strong>
            <br />
            <br />
            <strong>
              Email:
              <br />
              accessibility@velvetandvine.com
            </strong>
          </p>
          <br />
          <h2>6. Ongoing Improvements</h2>
          <p>
            Accessibility is an ongoing effort. We regularly review our website,
            update content and code, and train our team to maintain and enhance
            accessibility as standards and technologies evolve.
          </p>
          <br />
          <h2>7. Third-Party Content</h2>
          <p>
            Some areas of our site may include third-party content,
            integrations, or links beyond our control. While we aim to work with
            partners who support accessibility, we cannot guarantee the
            accessibility of external websites or services.
          </p>
          <br />
          <h2>8. Statement of Commitment</h2>
          <p>
            Velvet &amp; Vine is dedicated to providing an inclusive salon
            experience online and in person. We welcome requests for reasonable
            accommodations related to our services and will make good-faith
            efforts to meet your needs.
          </p>
          <br />
        </div>
      </LayoutWrapper>
      <FinalCTA />
      <Footerii />
    </main>
  );
};

export default AccessibilityPage;
