import Img from "../../../public/images/location1.jpg";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "../leagal.module.css";
import Image from "next/image";
import Nav from "@/components/shared/Nav/Nav";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import { Metadata } from "next";
import Footerii from "@/components/shared/Footerii/Footerii";

export const metadata: Metadata = {
  title: "California | Velvet & Vine",
};

const CaliforniaPage = () => {
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
              California Consumer Privacy Act (CCPA)
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
            This California Consumer Privacy Act (CCPA) Notice (“Notice”) is
            provided by Velvet &amp; Vine to inform California residents of
            their rights under the CCPA and explain how we collect, use, and
            disclose personal information.
          </p>
          <br />
          <h2>2. Categories of Personal Information Collected</h2>
          <p>
            Depending on how you interact with us, we may collect the following
            categories of personal information as defined by the CCPA:
            <br />
            <br />
            <strong>Identifiers:</strong> Name, email address, phone number, and
            similar identifiers.
            <br />
            <br />
            <strong>Customer Records:</strong> Billing address, shipping
            address, and limited payment information processed by our payment
            partners.
            <br />
            <br />
            <strong>Commercial Information:</strong> Appointment history,
            services purchased, product preferences.
            <br />
            <br />
            <strong>Internet or Network Activity:</strong> Browsing activity,
            device information, and interactions with our website.
            <br />
            <br />
            <strong>Geolocation Data:</strong> General location derived from IP
            address or user-provided information.
            <br />
            <br />
            <strong>Inferences:</strong> Preferences drawn from other personal
            information to improve services and offers.
          </p>
          <br />
          <h2>3. How We Use Personal Information</h2>
          <p>
            We may use personal information to:
            <br />
            <br />- Provide and manage appointments and salon services.
            <br />
            <br />- Communicate with you and respond to inquiries.
            <br />
            <br />- Process payments and prevent fraud.
            <br />
            <br />- Improve our website, services, and guest experience.
            <br />
            <br />- Personalize content, recommendations, and promotions.
            <br />
            <br />- Comply with legal obligations and enforce our policies.
          </p>
          <br />
          <h2>4. Disclosure of Personal Information</h2>
          <p>
            We do not sell personal information. We may disclose personal
            information to service providers that support our operations (such
            as booking, payments, analytics, and communications) under contracts
            that restrict use to our business purposes.
          </p>
          <br />
          <h2>5. Your Rights Under the CCPA</h2>
          <h3>Right to Know</h3>
          <p>
            You may request that we disclose the categories and specific pieces
            of personal information we have collected about you in the past 12
            months, along with the sources, purposes, and categories of third
            parties to whom it was disclosed.
          </p>
          <br />
          <h3>Right to Delete</h3>
          <p>
            You may request that we delete personal information we collected
            from you, subject to certain exceptions.
          </p>
          <br />
          <h3>Right to Correct</h3>
          <p>
            You may request that we correct inaccurate personal information that
            we maintain about you.
          </p>
          <br />
          <h3>Right to Non-Discrimination</h3>
          <p>
            We will not discriminate against you for exercising any of your CCPA
            rights.
          </p>
          <br />
          <h2>6. Submitting a Request</h2>
          <p>
            To exercise your CCPA rights, please contact us using the methods
            below or see our Privacy Policy at <a href='/privacy'>/privacy</a>{" "}
            for additional details. We will take reasonable steps to verify your
            identity before fulfilling your request.
          </p>
          <br />
          <h2>7. Authorized Agents</h2>
          <p>
            You may designate an authorized agent to submit a request on your
            behalf. We require written permission from you and may request
            verification of your identity and the agent’s authority.
          </p>
          <br />
          <h2>8. Contact Us</h2>
          <p>
            If you have questions about this Notice or our privacy practices,
            please contact:
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
              privacy@velvetandvine.com
            </strong>
          </p>
          <br />
        </div>
      </LayoutWrapper>
      <FinalCTA />
      <Footerii />
    </main>
  );
};

export default CaliforniaPage;
