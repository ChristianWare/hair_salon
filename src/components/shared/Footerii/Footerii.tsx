import Link from "next/link";
import Button from "../Button/Button";
import Facebook from "../icons/Facebook/Facebook";
import Instagram from "../icons/Instagram/Instagram";
import LinkedIn from "../icons/LinkedIn/LinkedIn";
import Luxury from "../icons/Luxury/Luxury";
import Pinterest from "../icons/Pinterest/Pinterest";
import Tiktok from "../icons/Tiktok/Tiktok";
import Twitter from "../icons/Twitter/Twitter";
import Youtube from "../icons/Youtube/Youtube";
import LayoutWrapper from "../LayoutWrapper";
import Logo from "../Logo/Logo";
import SectionHeading from "../SectionHeading/SectionHeading";
import styles from "./Footerii.module.css";
import { servicesData } from "@/lib/data";
import Image from "next/image";

const data = [
  {
    id: 1,
    title: "Home",
    href: "/",
  },
  {
    id: 2,
    title: "About",
    href: "/about",
  },
  {
    id: 3,
    title: "Services",
    href: "/services",
  },
  {
    id: 4,
    title: "Gallery",
    href: "/gallery",
  },
  {
    id: 5,
    title: "Contact",
    href: "/contact",
  },
  {
    id: 6,
    title: "Book Appointment",
    href: "/book-appointment",
  },
];

const dataii = [
  {
    id: 7,
    title: "Terms of Service",
    href: "/",
  },
  {
    id: 8,
    title: "Accessibility",
    href: "/accessibility",
  },
  {
    id: 9,
    title: "Careers",
    href: "/careers",
  },
];

export default function Footerii() {
  return (
    <footer className={styles.container}>
      <LayoutWrapper>
        <div className={styles.content}>
          <div className={styles.one}>
            <Luxury className={styles.logoIcon} />
            <Logo />
            <p className={styles.copy}>
              We are committed to providing top-notch hair care services with a
              focus on luxury and personalization.
            </p>
            <div className={styles.btnContainer}>
              <Button
                href='/book-appointment'
                text='Book your appointment'
                btnType='tanBorder'
              />
            </div>
            <br className={styles.br} />
            <SectionHeading text='Social Media' />
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
          </div>
          <div className={styles.two}>
            <div className={styles.twoLeft}>
              <span className={styles.subHeading}>Menu</span>
              <div className={styles.mapDataContainer}>
                {data.map((item) => (
                  <Link key={item.id} href={item.href} className={styles.link}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className={styles.twoRight}>
              <span className={styles.subHeading}>Disclosures</span>
              <div className={styles.mapDataContainer}>
                {dataii.map((item) => (
                  <Link key={item.id} href={item.href} className={styles.link}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.three}>
            <div className={styles.desktop}>
              <SectionHeading text='Top Services' right />
            </div>
            <div className={styles.mobile}>
              <SectionHeading text='Top Services' left right />
            </div>
            <br className={styles.br} />
            <br className={styles.br} />
            <div className={styles.mapDataContainer}>
              {servicesData.slice(0, 3).map((item) => (
                <div key={item.id} className={styles.card}>
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={110}
                    height={75}
                    className={styles.img}
                  />
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <small className={styles.small}>
              © Velvet & Vine. All rights reserved.
            </small>
          </div>
          <div className={styles.right}>
            <small className={styles.small}>
              This site was designed and developed by Fonts & Footers
            </small>
          </div>
        </div>
      </LayoutWrapper>
    </footer>
  );
}
