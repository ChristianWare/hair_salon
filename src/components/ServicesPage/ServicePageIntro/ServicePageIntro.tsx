import Nav from '@/components/shared/Nav/Nav';
import styles from './ServicePageIntro.module.css'
import LayoutWrapper from '@/components/shared/LayoutWrapper';
import Button from '@/components/shared/Button/Button';


export default function ServicePageIntro() {
  return (
    <section className={styles.container}>
      <div className={styles.imgContainer}>
        <Nav />
        <div className={styles.navContainer}></div>
        <div className={styles.imgOverlay}></div>
        <LayoutWrapper>
          <div className={styles.content}>
            <h1 className={`${styles.heading} h2`}>
              Elevate Your Style <br /> with Our Expert Hair Services
            </h1>
            <p className={styles.copy}>
              Discover the perfect look for any occasion with our professional
              hair services. From trendy cuts to vibrant colors, our skilled
              stylists are here to bring your vision to life.
            </p>
            <div className={styles.btnContainer}>
              <Button
                href='/'
                text='Book your appointment'
                btnType='tanBorderii'
              />
            </div>
          </div>
        </LayoutWrapper>
      </div>
    </section>
  );
}