import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./WhyUs.module.css";
import Image from "next/image";
import Img1 from "../../../../public/images/stylist.jpg";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Check from "@/components/shared/icons/Check/Check";

const data = [
  {
    id: 1,
    title: "Experienced Stylists",
    description:
      "Our team consists of highly skilled and experienced stylists who are passionate about their craft.",
  },
  {
    id: 2,
    title: "Personalized Services",
    description:
      "We believe in tailoring our services to meet the unique needs and preferences of each client.",
  },
  {
    id: 3,
    title: "Quality Products",
    description:
      "We use only the best hair care products to ensure the health and vitality of your hair.",
  },
  {
    id: 4,
    title: "Relaxing Atmosphere",
    description:
      "Our salon provides a comfortable and welcoming environment where you can unwind and enjoy your experience.",
  },
];

export default function WhyUs() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.left}>
            <SectionHeading text='Why Choose Us?' color='tan' />
            {/* <h2 className={styles.heading}>Choose us because...</h2> */}
            <p className={styles.copy}>
              We are dedicated to providing the best hair care experience. Our
              team of skilled stylists is committed to staying up-to-date with
              the latest trends and techniques to ensure you look and feel your
              best. We go beyond just cutting and styling hair—we create an
              experience that’s all about you. Here&apos;s why we&apos;re the
              right choice:
            </p>
            <div className={styles.mapDataContainer}>
              {data.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <Check className={styles.icon} />
                  </div>
                  <div className={styles.cardRight}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.desc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.imgContainer}>
              <Image
                src={Img1}
                alt="Stylist working on a client's hair"
                fill
                className={styles.img}
              />
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
