import styles from "./LoginPageIntro.module.css";
import Nav from "@/components/shared/Nav/Nav";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
// import Corner from "@/components/shared/Corner/Corner";
import Image from "next/image";
import Img1 from "../../../../public/images/about1.jpg";

export default function LoginPageIntro() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <Nav
          navColor='var(--black)'
          scrolledNavColor='var(--black)'
          scrolledBg='var(--white)'
        />{" "}
        <div className={styles.content}>
          <div className={styles.bottomCornerContainer}></div>
          <div className={styles.top}>
            <div className={styles.left}>
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
                    Welcome <br />
                    Back
                  </h1>
                  <p className={styles.copy}>
                    Login to your account to manage your salon bookings, view
                    appointments, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.formContainer}>
                <LoginForm />
              </div>
            </div>
          </div>
          {/* <div className={styles.bottom}>
            
          </div> */}
        </div>
      </LayoutWrapper>
    </section>
  );
}
