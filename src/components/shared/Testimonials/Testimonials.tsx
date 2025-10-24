"use client";

import { useState } from "react";
import styles from "./Testimonials.module.css";
import SectionIntro from "../SectionIntro/SectionIntro";
import Image from "next/image";
import Img1 from "../../../../public/images/doggyiii.jpg";
import LayoutWrapper from "../LayoutWrapper";
import ScrollHorizontalText from "../ScrollHorizontalText/ScrollHorizontalText";
import Starii from "@/components/icons/Starii/Starii";

const reviews = [
  {
    id: 71,
    review:
      "Absolutely loved the convenience and comfort of Elite Retreat Rentals, a true home away from home!",
    reviewer: "Michael Jones.",
  },
  {
    id: 72,
    review:
      "The attention to detail in every aspect of our stay with Elite Retreat Rentals made our vacation truly exceptional.",
    reviewer: "Ryan Lindenburg",
  },
  {
    id: 73,
    review:
      "Fantastic experience with Elite Retreat Rentals—impeccable service, stunning accommodations, and unbeatable value!",
    reviewer: "Miguel Sanchez",
  },
  {
    id: 74,
    review:
      "Highly recommend Elite Retreat Rentals for anyone looking for a perfect blend of luxury and affordability in Phoenix.",
    reviewer: "Pietro Flores",
  },
  {
    id: 75,
    review:
      "Our stay with Elite Retreat Rentals exceeded all expectations; we can't wait to return!",
    reviewer: "Carol Turner",
  },
];

const Testimonials = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const nextReview = () => {
    setSlideDirection("right");
    setCurrentReviewIndex((prev) =>
      prev === reviews.length - 1 ? 0 : prev + 1
    );
  };

  const prevReview = () => {
    setSlideDirection("left");
    setCurrentReviewIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.scrollTextContainer}>
        <ScrollHorizontalText
          text='Certified stylists'
          text2='Gentle handling'
          text3='SMS reminders'
        />
      </div>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.top}>
            <SectionIntro title='Guest Reviews' />
            <div className={styles.starContainer}>
              <Starii className={styles.icon} />
              <Starii className={styles.icon} />
              <Starii className={styles.icon} />
              <Starii className={styles.icon} />
              <Starii className={styles.icon} />
            </div>
          </div>
          <div className={styles.reviewContainer}>
            <button onClick={prevReview} className={styles.arrowButton}>
              ←
            </button>

            <div className={styles.reviewWrapper}>
              <div
                key={currentReviewIndex}
                className={`${styles.reviewContent} ${
                  slideDirection === "right"
                    ? styles.slideInRight
                    : styles.slideInLeft
                }`}
              >
                <p className={styles.review}>
                  &ldquo;{reviews[currentReviewIndex].review}&ldquo;
                  {reviews[currentReviewIndex].review}
                </p>
                <div className={styles.imgContainer}>
                  <Image
                    src={Img1}
                    alt=''
                    title=''
                    width={60}
                    height={60}
                    className={styles.img}
                  />
                </div>
                <p className={styles.reviewer}>
                  {reviews[currentReviewIndex].reviewer}
                </p>
                <p className={styles.from}>From Germany</p>
              </div>
            </div>

            <button onClick={nextReview} className={styles.arrowButton}>
              →
            </button>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
};

export default Testimonials;
