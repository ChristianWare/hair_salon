import Img from "../../../public/images/location1.jpg";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "../leagal.module.css";
import Image from "next/image";
import Nav from "@/components/shared/Nav/Nav";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import { Metadata } from "next";
import Footerii from "@/components/shared/Footerii/Footerii";

export const metadata: Metadata = {
  title: "Privacy | Velvet & Vine",
};

const PrivacyPage = () => {
  return (
    <main className={styles.parent}>
      <section className={styles.container}>
        <div className={styles.imgOverlay}></div>
        <Image src={Img} alt='' fill className={styles.img2} />
        <Nav />
        <LayoutWrapper>
          <div className={styles.content}>
            <h1 className={styles.heading} lang='en'>
              Privacy Policy
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
          <h2>1. Information Collection and Use</h2>
          <p>
            Velvet &amp; Vine may collect personal information such as your
            name, email address, phone number, appointment details, service
            preferences, and payment information when you book a salon service,
            purchase products, or contact us with inquiries. We use this
            information to schedule and manage appointments, process payments,
            communicate with you, personalize your experience, and improve our
            services.
          </p>
          <br />
          <h2>2. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with trusted service
            providers who help us operate our website, booking system, customer
            communications, and payment processing. These providers are required
            to protect your information and may only use it to perform services
            on our behalf.
          </p>
          <br />
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard safeguards to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            electronic storage is completely secure, and we cannot guarantee
            absolute security.
          </p>
          <br />
          <h2>4. Cookies</h2>
          <p>
            We may use cookies and similar technologies to remember preferences,
            analyze site traffic, and enhance your browsing experience. You can
            manage or disable cookies through your browser settings, though some
            features of the site may not function properly without them.
          </p>
          <br />
          <h2>5. Links to Third-Party Websites</h2>
          <p>
            Our website may contain links to third-party sites for your
            convenience. We are not responsible for the privacy practices or
            content of those sites. We recommend reviewing the privacy policies
            of any third-party websites you visit.
          </p>
          <br />
          <h2>6. Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or legal requirements. We will post the
            updated policy on this page with a revised effective date. Material
            changes may also be communicated through additional notices.
          </p>
          <br />
          <h2>7. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy or your personal information, please contact us:
            <br />
            <br />
            <strong>
              Address:
              <br />
              Velvet &amp; Vine <br />
              12345 N Scottsdale Rd, Suite 200 <br />
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
              privacy@velvetandvine.com
            </strong>
          </p>
          <br />
          <b>
            By using our website or services, you consent to the collection,
            use, and disclosure of your personal information as described in
            this Privacy Policy.
          </b>
        </div>
      </LayoutWrapper>
      <FinalCTA />
      <Footerii />
    </main>
  );
};

export default PrivacyPage;
