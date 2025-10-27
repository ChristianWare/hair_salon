/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import { useEffect, useState, MouseEvent, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import Instagram from "../icons/Instagram/Instagram";
import LinkedIn from "../icons/LinkedIn/LinkedIn";
import Facebook from "../icons/Facebook/Facebook";
import Twitter from "../icons/Twitter/Twitter";
import Youtube from "../icons/Youtube/Youtube";
import Pinterest from "../icons/Pinterest/Pinterest";
import Tiktok from "../icons/Tiktok/Tiktok";

export interface NavProps {
  navColor?: string;
  scrolledNavColor?: string;
  scrolledBg?: string;
  hamburgerColor?: string;
}

export default function Nav({
  navColor = "var(--tan)",
  scrolledNavColor = "var(--black)",
  scrolledBg = "var(--white)",
  hamburgerColor = "",
}: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const pathname = usePathname();

  const logoTop = /black/i.test(navColor) ? "black" : "tan";
  const logoScrolled = /tan/i.test(scrolledNavColor) ? "tan" : "black";

  useEffect(() => {
    setPortalNode(document.body);
  }, []);

  useEffect(() => {
    const setNavHeightVar = () => {
      if (navRef.current) {
        const h = navRef.current.offsetHeight || 0;
        document.documentElement.style.setProperty("--nav-h", `${h}px`);
      }
    };
    setNavHeightVar();
    const ro = new ResizeObserver(setNavHeightVar);
    if (navRef.current) ro.observe(navRef.current);
    window.addEventListener("load", setNavHeightVar);
    window.addEventListener("resize", setNavHeightVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", setNavHeightVar);
      window.removeEventListener("resize", setNavHeightVar);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      const p = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      if (navRef.current)
        navRef.current.style.setProperty("--progress", `${p}%`);
      const atTop = y <= 2;
      setIsScrolled(!atTop);
      const goingDown = y > lastYRef.current;
      const pastThreshold = y > 100;
      if (!isOpen) setIsHidden(goingDown && pastThreshold);
      if (!goingDown) setIsHidden(false);
      lastYRef.current = y;
      tickingRef.current = false;
    };
    const onScrollResize = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (isOpen) {
      const y = window.scrollY;
      body.setAttribute("data-lock-scroll-y", String(y));
      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
      setIsHidden(false);
    } else {
      const y = parseInt(body.getAttribute("data-lock-scroll-y") || "0", 10);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, y);
      body.removeAttribute("data-lock-scroll-y");
    }
    return () => {
      const y = parseInt(body.getAttribute("data-lock-scroll-y") || "0", 10);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      body.style.touchAction = "";
      html.style.overflow = "";
      if (y) window.scrollTo(0, y);
      body.removeAttribute("data-lock-scroll-y");
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((s) => !s);
  const closeMenu = () => setIsOpen(false);

  const handleHamburgerClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    toggleMenu();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const items = useMemo(
    () => [
      { text: "Home", href: "/" },
      { text: "About", href: "/about" },
      { text: "Services", href: "/services" },
      { text: "Gallery", href: "/gallery" },
      { text: "Contact", href: "/contact" },
      { text: "Book Appointment", href: "/book-appointment" },
    ],
    []
  );

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
        isHidden ? styles.hidden : ""
      } ${isOpen ? styles.menuOpen : ""}`}
      ref={navRef}
      style={
        {
          ["--nav-color" as any]: navColor,
          ["--nav-scrolled-color" as any]: scrolledNavColor,
          ["--nav-scrolled-bg" as any]: scrolledBg,
        } as React.CSSProperties
      }
    >
      <nav className={styles.navbar} aria-label='Primary'>
        <Link
          href='/'
          className={styles.logoContainer}
          aria-label='Go to homepage'
        >
          <Logo color={isScrolled ? logoScrolled : logoTop} />
        </Link>

        <div className={styles.navItems}>
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  active ? styles.navItemActive : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.text}
              </Link>
            );
          })}
        </div>

        {portalNode &&
          createPortal(
            <div
              className={`${styles.overlay} ${
                isOpen ? styles.overlayVisible : ""
              }`}
              onClick={closeMenu}
            />,
            portalNode
          )}

        {portalNode &&
          createPortal(
            <aside
              id='mobile-menu'
              className={`${styles.navItemsii} ${isOpen ? styles.active : ""}`}
              aria-hidden={!isOpen}
            >
              <div className={styles.mobileLogo}>
                Velvet <br /> & Vine
              </div>
              <div className={styles.navItemsiiList}>
                {items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${styles.navItemPanel} ${
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
              <div className={styles.socialsContainer}>
                <div className={styles.iconBox}>
                  <Facebook className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <Twitter className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <Youtube className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <Pinterest className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <Tiktok className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <LinkedIn className={styles.icon} />
                </div>
                <div className={styles.iconBox}>
                  <Instagram className={styles.icon} />
                </div>
              </div>
            </aside>,
            portalNode
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
