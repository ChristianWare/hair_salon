import LayoutWrapper from "../LayoutWrapper";
import styles from "./InstaFeed.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/about1.jpg";
import Img2 from "../../../../public/images/about2.jpg";
import Img3 from "../../../../public/images/hero.jpg";
import Img4 from "../../../../public/images/location1.jpg";
import Img5 from "../../../../public/images/location2.jpg";
import Img6 from "../../../../public/images/service2.jpg";
import Img7 from "../../../../public/images/service3.jpg";
import Img8 from "../../../../public/images/team.jpg";
import Img9 from "../../../../public/images/about1.jpg";
import Instagram from "../icons/Instagram/Instagram";
import Link from "next/link";

const IMAGES = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9];

export default function InstaFeed() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 className={styles.heading}>Follow @velvet_n_vine</h2>
            <p className={styles.copy}>for trends & inspiration</p>
          </div>

          <div className={styles.bottom}>
            {IMAGES.map((src, i) => (
              <figure className={styles.item} key={i}>
                <Link
                  href='https://instagram.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.link}
                >
                  <Image
                    src={src}
                    alt={`Instagram Image ${i + 1}`}
                    fill
                    className={styles.img}
                  />
                  <div className={styles.overlay} aria-hidden='true'>
                    <Instagram className={styles.icon} />
                  </div>
                </Link>
              </figure>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
