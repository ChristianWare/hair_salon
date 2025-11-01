// Button.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./Button.module.css";
import {
  useAnimate,
  AnimationOptions,
  ValueAnimationTransition,
} from "motion/react";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import Link from "next/link";

const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === "string") return children;
  if (React.isValidElement(children)) {
    const props = (children as React.ReactElement).props as any;
    const childText = props.children as React.ReactNode;
    if (typeof childText === "string") return childText;
    if (React.isValidElement(childText))
      return extractTextFromChildren(childText);
  }
  return "";
};

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

interface Props {
  href?: string;
  text?: string;
  btnType: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  disabled?: boolean;
  children?: ReactNode;
  image?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
  type?: "button" | "submit" | "reset";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const staggerDuration = 0.015;
const staggerFrom: "first" | "last" | "center" | number | "random" = "first";
const transition: ValueAnimationTransition | AnimationOptions = {
  type: "tween",
  duration: 0.18,
  ease: "easeOut",
};

const baseZ = "translateZ(-0.5lh)";
const rotationTransform = `${baseZ} rotateX(90deg)`;
const resetTransform = `${baseZ} rotateX(0deg)`;

const ButtonContent3D = ({
  content,
  className,
}: {
  content: React.ReactNode;
  className?: string;
}) => {
  const text = useMemo(() => extractTextFromChildren(content), [content]);
  const characters = useMemo(() => {
    const parts = text.split(" ");
    return parts.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== parts.length - 1,
    }));
  }, [text]);

  return (
    <span
      className={`${styles.text3dContainer}${className ? ` ${className}` : ""}`}
    >
      <span className={styles.srOnly}>{text}</span>
      {characters.map(
        (wordObj: WordObject, wordIndex: number, array: WordObject[]) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce(
              (sum: number, w: WordObject) => sum + w.characters.length,
              0
            );
          return (
            <span key={wordIndex} className={styles.wordBox}>
              {wordObj.characters.map((char: string, charIndex: number) => {
                const totalIndex = previousCharsCount + charIndex;
                return <CharBox key={totalIndex} char={char} />;
              })}
              {wordObj.needsSpace && <span className={styles.space}> </span>}
            </span>
          );
        }
      )}
    </span>
  );
};

const CharBox = ({ char }: { char: string }) => {
  return (
    <span
      className={`letter-3d-swap-char-box-item ${styles.charBox}`}
      style={{ transform: resetTransform }}
    >
      <span
        className={styles.frontFace}
        style={{ transform: "translateZ(0.5lh)" }}
      >
        {char}
      </span>
      <span
        className={styles.secondFace}
        style={{ transform: "rotateX(-90deg) translateZ(0.5lh)" }}
      >
        {char}
      </span>
    </span>
  );
};

export default function Button({
  href,
  text,
  btnType,
  target,
  disabled,
  children,
  onClick,
  type = "button",
  leftIcon,
  rightIcon,
}: Props) {
  const content = text || children;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [scope, animate] = useAnimate();

  const getStaggerDelay = useCallback((index: number, totalChars: number) => {
    const total = totalChars;
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      const center = Math.floor(total / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === "random") {
      const randomIndex = Math.floor(Math.random() * total);
      return Math.abs(randomIndex - index) * staggerDuration;
    }
    return Math.abs(staggerFrom - index) * staggerDuration;
  }, []);

  const handleHoverStart = useCallback(async () => {
    if (isAnimating || isHovering) return;
    setIsHovering(true);
    setIsAnimating(true);
    const root = (scope as any).current as HTMLElement | null;
    const nodes = root
      ? root.querySelectorAll(".letter-3d-swap-char-box-item")
      : null;
    const totalChars = nodes ? nodes.length : 0;
    const delays = Array.from({ length: totalChars }, (_, i) =>
      getStaggerDelay(i, totalChars)
    );
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: rotationTransform },
      { ...transition, delay: (i: number) => delays[i] }
    );
    await animate(
      ".letter-3d-swap-char-box-item",
      { transform: resetTransform },
      { duration: 0.001 }
    );
    setIsAnimating(false);
  }, [animate, getStaggerDelay, isAnimating, isHovering, scope]);

  const handleHoverEnd = useCallback(() => setIsHovering(false), []);

  const inner = (
    <>
      {leftIcon && (
        <span className={styles.iconBox} aria-hidden='true'>
          {leftIcon}
        </span>
      )}
      <ButtonContent3D content={content} />
      {rightIcon && (
        <span className={styles.iconBox} aria-hidden='true'>
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        ref={scope as any}
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={onClick as any}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        className={`${styles.btn} ${styles[btnType]}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={scope as any}
      type={type}
      className={`${styles.btn} ${styles[btnType]}`}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {inner}
    </button>
  );
}
