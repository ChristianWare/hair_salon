import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./Welcome.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Button from "@/components/shared/Button/Button";
import Vogue from "@/components/shared/icons/Vogue/Vogue";
import Glamour from "@/components/shared/icons/Glamour/Glamour";
import Forbes from "@/components/shared/icons/Forbes/Forbes";
import BusinessInsider from "@/components/shared/icons/BusinessInsider/BusinessInsider";
import Entreprenure from "@/components/shared/icons/Entreprenure/Entreprenure";

function LogosRow({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Vogue className={styles.icon} />
      <Glamour className={styles.icon} />
      <Forbes className={styles.icon} />
      <BusinessInsider className={styles.icon} />
      <Entreprenure className={styles.icon} />
      <Vogue className={styles.icon} />
      <Glamour className={styles.icon} />
      <Forbes className={styles.icon} />
      <BusinessInsider className={styles.icon} />
      <Entreprenure className={styles.icon} />
    </div>
  );
}

export default function Welcome() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <SectionHeading text='Welcome' />
            <h2 className={styles.heading}>
              We believe great hair <span className={styles.spanImage} /> is
              more than just a look! Our team of{" "}
              <span className={styles.squiggly}>skilled stylists </span> is
              ready to make your hair goals a reality.
            </h2>
            <p className={styles.copy}>
              At our salon, we prioritize your satisfaction and comfort. From
              the moment you walk in, you&apos;ll experience a warm and inviting
              atmosphere where you can relax and enjoy your time with us.
            </p>
            <div className={styles.btnContainer}>
              <Button
                href='/'
                text='Book your appointment'
                btnType='tanBorder'
              />
            </div>
          </div>

          <div className={styles.bottom}>
            {/* <span className={styles.asSeenIn}>As seen in:</span> */}

            <div className={styles.iconContainer}>
              <LogosRow className={styles.iconTrack} />
              <LogosRow
                className={`${styles.iconTrack} ${styles.iconTrackAlt}`}
              />
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
