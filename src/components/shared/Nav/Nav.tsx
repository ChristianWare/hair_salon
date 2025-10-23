"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import Button from "../Button/Button";
import { useEffect, useState, MouseEvent, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Img1 from "../../../../public/images/hero.jpg";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";

export interface NavProps {
  navItemColor?: string;
  color?: string;
  hamburgerColor?: string;
}

export default function Nav({ color = "", hamburgerColor = "" }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    body.style.overflow =
      window.innerWidth <= 1068 && isOpen ? "hidden" : "auto";
    const handleResize = () => setIsOpen(false);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((s) => !s);
  const closeMenu = () => setIsOpen(false);

  const handleHamburgerClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    toggleMenu();
  };

  useEffect(() => {
    const setProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p =
        max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      if (navRef.current)
        navRef.current.style.setProperty("--progress", `${p}%`);
    };
    setProgress();
    const onScrollResize = () => {
      window.requestAnimationFrame(setProgress);
    };
    window.addEventListener("scroll", onScrollResize);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize);
      window.removeEventListener("resize", onScrollResize);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const items = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "About", href: "/about" },
      { text: "Services", href: "/services" },
      { text: "Gallery", href: "/fleet" },
      { text: "Policies", href: "/blog" },
      { text: "Contact", href: "/contact" },
      { text: "Login", href: "/login" },
    ],
    []
  );

  return (
    <header className={styles.header} ref={navRef}>
      <nav className={styles.navbar} aria-label='Primary'>
        <Link
          href='/'
          className={styles.logoContainer}
          aria-label='Go to homepage'
        >
          <Logo color='tan' />
        </Link>

        <div className={styles.navItems}>
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${styles[color]} ${
                  active ? styles.navItemActive : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.text}
              </Link>
            );
          })}
        </div>

        {isOpen &&
          createPortal(
            <div
              className={`${styles.overlay} ${styles.overlayVisible}`}
              onClick={closeMenu}
            />,
            document.body
          )}

        {isOpen &&
          createPortal(
            <aside
              id='mobile-menu'
              className={`${styles.navItemsii} ${isOpen ? styles.active : ""}`}
              aria-hidden={!isOpen}
            >
              <div className={styles.navItemsiiList}>
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.navItemPanel} ${styles[color]} ${
                        active ? styles.navItemPanelActive : ""
                      }`}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.text}
                    </Link>
                  );
                })}
              </div>

              <div className={styles.menuImage}>
                <Image
                  src={Img1}
                  alt='Menu image'
                  fill
                  className={styles.img}
                />
                <div className={styles.menuImageOverlay}>
                  <Logo color='tan' />
                </div>
              </div>

              <div className={styles.btnContainerii}>
                <Button
                  href='/'
                  text='Book your Ride'
                  btnType='tan'
                  onClick={closeMenu}
                />
              </div>
            </aside>,
            document.body
          )}

        <span
          className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
          onClick={handleHamburgerClick}
          aria-expanded={isOpen}
          aria-controls='mobile-menu'
          role='button'
        >
          <span className={`${styles.whiteBar} ${styles[hamburgerColor]}`} />
          <span className={`${styles.whiteBar} ${styles[hamburgerColor]}`} />
          <span className={`${styles.whiteBar} ${styles[hamburgerColor]}`} />
        </span>
      </nav>
    </header>
  );
}
