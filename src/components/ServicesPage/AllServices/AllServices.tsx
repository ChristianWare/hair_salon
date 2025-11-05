"use client";

import LayoutWrapper from "@/components/shared/LayoutWrapper";
import styles from "./AllServices.module.css";
import { servicesData } from "@/lib/data";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/shared/Modal/Modal";
import { useState, MouseEvent } from "react";
import SectionHeading from "@/components/shared/SectionHeading/SectionHeading";

type Service = (typeof servicesData)[number];

export default function AllServices() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);

  const openModal = (service: Service) => {
    setSelected(service);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  const onMoreDetails = (e: MouseEvent, service: Service) => {
    e.preventDefault();
    openModal(service);
  };

  return (
    <section className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            {/* <h2 className={styles.heading}>All Services</h2> */}
            <SectionHeading text='All Services' left right />
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
                        onClick={(e: MouseEvent) => onMoreDetails(e, service)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal}>
          {selected && (
            <div className={styles.modalGrid}>
              <div className={styles.modalImgWrap}>
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className={styles.modalImg}
                />
              </div>
              <div className={styles.modalBody}>
                <h3 className={styles.modalTitle}>{selected.title}</h3>
                <p className={styles.modalDesc}>{selected.description}</p>

                <div className={styles.modalInfoGrid}>
                  <div className={styles.stat}>
                    <strong className={styles.statLabel}>Price</strong>
                    <div className={styles.statValue}>${selected.price}</div>
                  </div>
                  <div className={styles.stat}>
                    <strong className={styles.statLabel}>Average Time</strong>
                    <div className={styles.statValue}>
                      {selected.averageTime}
                    </div>
                  </div>
                  <div className={styles.stat}>
                    <strong className={styles.statLabel}>Difficulty</strong>
                    <div className={styles.statValue}>
                      {selected.difficulty}
                    </div>
                  </div>
                  <div className={styles.stat}>
                    <strong className={styles.statLabel}>Category</strong>
                    <div className={styles.statValue}>{selected.category}</div>
                  </div>
                </div>

                <div className={styles.processBox}>
                  <strong className={styles.statLabel}>Process</strong>
                  <div className={styles.statValue}>{selected.process}</div>
                </div>

                <div className={styles.modalCta}>
                  <Button href='/book-appointment' text='Book Now' btnType='brown' />
                </div>
              </div>
            </div>
          )}
        </Modal>
      </LayoutWrapper>
    </section>
  );
}
