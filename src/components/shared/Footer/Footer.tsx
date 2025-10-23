import Button from "../Button/Button";
import LayoutWrapper from "../LayoutWrapper";
import styles from "./Footer.module.css";
import Instagram from "../icons/Instagram/Instagram";
import LinkedIn from "../icons/LinkedIn/LinkedIn";
import Facebook from "../icons/Facebook/Facebook";
import Yelp from "../icons/Yelp/Yelp";

export default function Footer() {
  return (
    <footer className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.heading}>Get on the List</div>
            <p className={styles.copy}>
              Sign up for our weekly newsletter where we share exclusive
              content, interior inspo, styling tips, our favorite things & more!
            </p>
            <form className={styles.inputContainer}>
              <input className={styles.input} placeholder='Email' />
              <div className={styles.btnContainer}>
                <Button href='#' text='Subscribe' btnType='tanBorder' />
              </div>
            </form>
          </div>

          <div className={styles.right}>
            <div className={styles.heading}>
              Join us in this journey of creating, <br className={styles.br} />{" "}
              living, and sharing a life of substance{" "}
              <br className={styles.br} /> and style.
            </div>
            <p className={styles.copy}>email@gmail.com</p>
            <div className={styles.socialsContainer}>
              <div className={styles.iconBox}>
                <Instagram className={styles.icon} />
              </div>
              <div className={styles.iconBox}>
                <LinkedIn className={styles.icon} />
              </div>
              <div className={styles.iconBox}>
                <Facebook className={styles.icon} />
              </div>
              <div className={styles.iconBox}>
                <Yelp className={styles.icon} />
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
      <div className={styles.bottom}>
        <div className={styles.disclosureBox}>
          <p className={styles.disclosureText}>Privacy Policy</p>
          <p className={styles.disclosureText}>Refund Policy</p>
          <p className={styles.disclosureText}>Terms of Service</p>
        </div>
        <small>© 2024 Velvet & Vine. All rights reserved.</small>
      </div>
    </footer>
  );
}
