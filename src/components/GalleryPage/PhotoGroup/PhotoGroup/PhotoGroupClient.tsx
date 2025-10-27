/* eslint-disable react-hooks/exhaustive-deps */
// components/shared/PhotoGroup/PhotoGroupClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../PhotoGroup.module.css";
import Image from "next/image";
import Close from "@/components/shared/icons/Close/Close";
import Arrow from "@/components/shared/icons/Arrow/Arrow";

export default function PhotoGroupClient({
  images,
  pattern,
}: {
  images: string[];
  pattern: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const openAt = (i: number) => {
    setIndex(i);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const prev = () => setIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const next = () => setIndex((p) => (p + 1) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !stripRef.current) return;
    const child = stripRef.current.children[index] as HTMLElement | undefined;
    if (!child) return;
    if (child.scrollIntoView) {
      child.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    } else {
      const container = stripRef.current;
      const cLeft = container.scrollLeft;
      const cWidth = container.clientWidth;
      const left = child.offsetLeft;
      const right = left + child.clientWidth;
      if (left < cLeft) container.scrollLeft = left;
      else if (right > cLeft + cWidth) container.scrollLeft = right - cWidth;
    }
  }, [index, isOpen]);

  return (
    <>
      <div className={styles.gallery}>
        {images.map((src: string, i: number) => {
          const extra = pattern[i % pattern.length];
          const cls =
            extra && styles[extra as keyof typeof styles]
              ? `${styles.imgContainer} ${styles[extra as keyof typeof styles]}`
              : styles.imgContainer;
          return (
            <div key={`${src}-${i}`} className={cls} onClick={() => openAt(i)}>
              <Image src={src} alt='' fill className={styles.img} />
            </div>
          );
        })}
      </div>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <button
            className={styles.closeBtn}
            onClick={close}
            aria-label='Close'
          >
            <Close className={styles.closeIcon} />
          </button>

          <div className={styles.modalContent}>
            <button
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={prev}
              aria-label='Previous image'
            >
              <Arrow className={styles.navIcon} />
            </button>

            <div className={styles.modalMain}>
              <div className={styles.modalImageWrap}>
                <Image
                  src={images[index]}
                  alt=''
                  fill
                  className={styles.modalImg}
                />
              </div>

              <div className={styles.thumbStrip} ref={stripRef}>
                {images.map((src, i) => (
                  <button
                    key={`thumb-${src}-${i}`}
                    className={`${styles.thumb} ${
                      i === index ? styles.thumbActive : ""
                    }`}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                  >
                    <div className={styles.thumbImgWrap}>
                      <Image
                        src={src}
                        alt=''
                        fill
                        className={styles.thumbImg}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={next}
              aria-label='Next image'
            >
              <Arrow className={styles.navIcon} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
