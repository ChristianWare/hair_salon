import LayoutWrapper from "../LayoutWrapper";
import styles from "./InstaFeed.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/about1.jpg";
import Img2 from "../../../../public/images/about2.jpg";
import Img3 from "../../../../public/images/hero.jpg";
import Img4 from "../../../../public/images/location1.jpg";
import Img5 from "../../../../public/images/location2.jpg";
import Img6 from "../../../../public/images/service2.jpg";
import Instagram from "../icons/Instagram/Instagram";

const IMAGES = [Img1, Img2, Img3, Img4, Img5, Img6];

export default function InstaFeed() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 className={styles.heading}>Our Instagram feed</h2>
            <p className={styles.copy}>
              Follow us on Instagram for the latest updates and promotions!
            </p>
          </div>

          <div className={styles.bottom}>
            {IMAGES.map((src, i) => (
              <figure className={styles.item} key={i}>
                {/* Square container with Image filling it */}
                <Image
                  src={src}
                  alt={`Instagram Image ${i + 1}`}
                  fill
                  className={styles.img}
                />
                <div className={styles.overlay} aria-hidden='true'>
                  <Instagram className={styles.icon} />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
