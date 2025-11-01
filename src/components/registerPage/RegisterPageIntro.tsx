import styles from "./RegisterPageIntro.module.css";
import LayoutWrapper from "../shared/LayoutWrapper";
import Nav from "../shared/Nav/Nav";
import RegisterForm from "../auth/RegisterForm/RegisterForm";
// import Corner from "../shared/Corner/Corner";
import Image from "next/image";
import Img1 from "../../../public/images/heroii.jpg";

export default function RegisterPageIntro() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <Nav
          navColor='var(--black)'
          scrolledNavColor='var(--black)'
          scrolledBg='var(--white)'
        />
        <div className={styles.content}>
          <div className={styles.cornerContainer}></div>

          <div className={styles.top}>
            <div className={styles.left}>
              <div className={styles.formContainer}>
                <RegisterForm />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.imgContainer}>
                <Image
                  src={Img1}
                  alt='hero image'
                  className={styles.img}
                  priority
                  fill
                />
                <div className={styles.imgOverlay} />

                <div className={styles.textContainer}>
                  <h1 className={styles.heading}>
                    Create 
                    an account
                  </h1>
                  <p className={styles.copy}>
                    Register to book your next appointment with us!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
