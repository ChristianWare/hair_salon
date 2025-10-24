import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./ServicesPreview.module.css";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";
import Image from "next/image";
import Img1 from "../../../../public/images/service1.jpg";
import Img2 from "../../../../public/images/service2.jpg";
import Img3 from "../../../../public/images/service3.jpg";
import Button from "@/components/shared/Button/Button";
import Stats from "@/components/shared/Stats/Stats";

const data = [
  {
    id: 1,
    title: "Haircut",
    description:
      "Experience a fresh new look with our expert haircut  services tailored to your preferences.",
    src: Img1,
  },
  {
    id: 2,
    title: "Coloring",
    description:
      "Transform your hair with our professional coloring services, from highlights to full color changes.",
    src: Img2,
  },
  {
    id: 3,
    title: "Styling",
    description:
      "Revitalize your hair with our nourishing treatments designed to restore health and shine.",
    src: Img3,
  },
];

export default function ServicesPreview() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.top}>
          <SectionHeading text='What we do' />
          <h2 className={styles.heading}>
            Our most <br className={styles.br} />{" "}
            <span className={styles.accent}>requested services</span>
          </h2>
        </div>
        <div className={styles.bottom}>
          <div className={styles.mapDataContainer}>
            {data.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imgContainer}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className={styles.img}
                  />
                  <span className={styles.index}>0{item.id}</span>
                </div>
                <div className={styles.cardBottom}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.desc}>{item.description}</p>
                  <div className={styles.btnContainer}>
                    <Button href='/' text='Explore' btnType='tanBorder' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.btnContainerii}>
          <Button href='/' text='See all services' btnType='brown' />
        </div>
      </LayoutWrapper>
      <Stats />
    </section>
  );
}
