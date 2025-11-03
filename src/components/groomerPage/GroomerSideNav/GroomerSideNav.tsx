"use client";

import styles from "./GroomerSideNav.module.css";
import Link from "next/link";
import Calendar from "@/components/shared/icons/Calendar/Calendar";
import House from "@/components/shared/icons/House/House";
import Employee from "@/components/shared/icons/Employee/Employee";
import Cog from "@/components/shared/icons/Cog/Cog";
import Report from "@/components/shared/icons/Report/Report";
import Listing from "@/components/shared/icons/Listing/Listing";
import UserButton from "@/components/dashboard/UserButton/UserButton";
import Button from "@/components/shared/Button/Button";
import { useState } from "react";
import FalseButton from "@/components/shared/FalseButton/FalseButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/groomer", icon: <House /> },
  { title: "My Bookings", href: "/groomer/my-bookings", icon: <Calendar /> },
  { title: "Availability", href: "/groomer/availability", icon: <Listing /> },
  { title: "Profile", href: "/groomer/profile", icon: <Employee /> },
  { title: "Earnings", href: "/groomer/earnings", icon: <Report /> },
  { title: "Settings", href: "/groomer/settings", icon: <Cog /> },
];

export default function GroomerSideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const pathname = usePathname();

  const toggle = () => setIsOpen((o) => !o);

  return (
    <aside className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.hamburgerContainer}>
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={
              isOpen ? `${styles.hamburger} ${styles.active}` : styles.hamburger
            }
            onClick={toggle}
            type='button'
          >
            <span className={styles.whiteBar} />
            <span className={styles.whiteBar} />
            <span className={styles.whiteBar} />
          </button>
        </div>

        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
        )}

        <ul
          className={
            isOpen ? `${styles.navLinks} ${styles.open}` : styles.navLinks
          }
        >
          <div className={styles.closeWrapper}>
            <FalseButton
              text='Close'
              btnType='blue'
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className={styles.linksWrapper}>
            {NAV_ITEMS.map(({ title, href, icon }) => {
              const isDashboard = href === "/groomer";
              const active = isDashboard
                ? pathname === "/groomer"
                : pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${styles.navLink} ${
                      active ? styles.navLinkActive : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                    aria-current={active ? "page" : undefined}
                  >
                    {icon}
                    {title}
                  </Link>
                </li>
              );
            })}
          </div>

          <div className={styles.btnContainerii}>
            <UserButton />
            <Button btnType='blue' text='Go Home' href='/' />
            <Button
              btnType='blueOutline'
              text='User Dashboard'
              href='/dashboard'
            />
          </div>
        </ul>

        <div className={styles.btnContainer}>
          <UserButton />
          <Button btnType='brown' text='Go Home' href='/' />
          {isAdmin && (
            <Button btnType='darkBrown' text='Admin Dashboard' href='/admin' />
          )}
        </div>
      </nav>
    </aside>
  );
}
