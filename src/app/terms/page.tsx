import Img from "../../../public/images/location1.jpg";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "../leagal.module.css";
import Image from "next/image";
import Nav from "@/components/shared/Nav/Nav";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import { Metadata } from "next";
import Footerii from "@/components/shared/Footerii/Footerii";

export const metadata: Metadata = {
  title: "Terms | Velvet & Vine",
};

const TermsPage = () => {
  return (
    <main className={styles.parent}>
      <section className={styles.container}>
        <div className={styles.imgOverlay}></div>
        <Image
          src={Img}
          alt='Velvet & Vine'
          fill
          className={styles.img2}
          sizes='100vw'
          priority
        />
        <Nav />
        <LayoutWrapper>
          <div className={styles.content}>
            <h1 className={styles.heading} lang='en'>
              Terms and Conditions
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
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to Velvet &amp; Vine’s website. By accessing or using this
            website, booking salon services, or purchasing products online, you
            agree to comply with and be bound by these Terms and Conditions
            (“Terms”). If you do not agree to these Terms, please do not use the
            website or our online services.
          </p>
          <br />
          <h2>2. Changes to Terms</h2>
          <p>
            Velvet &amp; Vine may modify, amend, or update these Terms at any
            time. Changes are effective upon posting to this page with a revised
            effective date. Your continued use of the website after changes are
            posted constitutes acceptance of the updated Terms.
          </p>
          <br />
          <h2>3. Use of the Website</h2>
          <p>
            You must be at least 18 years old, or the age of majority in your
            jurisdiction, to use this website. You agree to use the site only
            for lawful purposes and in a manner that does not impair, interfere
            with, or disrupt the website or others’ use of it.
          </p>
          <br />
          <h2>4. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, and
            design elements, is the property of Velvet &amp; Vine or its
            licensors and is protected by intellectual property laws. You may
            not copy, reproduce, distribute, or create derivative works without
            our prior written permission.
          </p>
          <br />
          <h2>5. Privacy</h2>
          <p>
            Your use of this website is also governed by our Privacy Policy,
            available at <a href='/privacy'>/privacy</a>. By using the site, you
            consent to the collection and use of your information as described
            in the Privacy Policy.
          </p>
          <br />
          <h2>6. Appointments, Cancellations, and Payments</h2>
          <p>
            Online bookings may require a deposit or valid payment method to
            hold your appointment. Cancellations or rescheduling made within our
            stated policy window may avoid fees; late cancellations or no-shows
            may incur a charge up to the full service amount. Prices listed are
            subject to change and may vary by stylist, service level, and time
            required.
          </p>
          <br />
          <h2>7. Disclaimer of Warranties</h2>
          <p>
            The website and its content are provided “as is” and “as available”
            without warranties of any kind, express or implied, including but
            not limited to accuracy, reliability, or fitness for a particular
            purpose. Your use of the site is at your own risk.
          </p>
          <br />
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Velvet &amp; Vine and its
            affiliates will not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from or related to your
            use of the website or online services.
          </p>
          <br />
          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Arizona,
            without regard to conflict of law principles. You agree to the
            exclusive jurisdiction and venue of the state and federal courts
            located in Maricopa County, Arizona, for any disputes arising out of
            or relating to these Terms or your use of the website.
          </p>
          <br />
          <h2>10. Contact Information</h2>
          <p>
            For questions or concerns regarding these Terms, please contact us:
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
              legal@velvetandvine.com
            </strong>
          </p>
        </div>
      </LayoutWrapper>
      <FinalCTA />
      <Footerii />
    </main>
  );
};

export default TermsPage;
