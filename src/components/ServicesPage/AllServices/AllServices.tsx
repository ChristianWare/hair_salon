import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./AllServices.module.css";
import { servicesData } from "@/lib/data";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";

export default function AllServices() {
  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <h2 className={styles.heading}>All Services</h2>
          </div>
          <div className={styles.bottom}>
            <div className={styles.mapDataContainer}>
              {servicesData.map((service) => (
                <div key={service.id} className={styles.card}>
                  <div className={styles.imgContainer}>
                    <Image
                      src={service.src}
                      alt={service.title}
                      fill
                      className={styles.img}
                    />
                  </div>
                  <div className={styles.meta}>
                    <h3 className={styles.title}>{service.title}</h3>
                    <p className={styles.desc}>{service.description}</p>
                    <div className={styles.btnContainer}>
                      <Button
                        href='#'
                        text='More Details'
                        btnType='tanBorder'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
