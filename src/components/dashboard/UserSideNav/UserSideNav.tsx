"use client";

import styles from "./UserSideNav.module.css";
import Link from "next/link";
import Calendar from "@/components/shared/icons/Calendar/Calendar";
import House from "@/components/shared/icons/House/House";
import Cog from "@/components/shared/icons/Cog/Cog";
import Users from "@/components/shared/icons/Users/Users";
import Report from "@/components/shared/icons/Report/Report";
import Listing from "@/components/shared/icons/Listing/Listing";
import UserButton from "@/components/dashboard/UserButton/UserButton";
import Button from "@/components/shared/Button/Button";
import { useState } from "react";
import { useSession } from "next-auth/react";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: <House /> },
  { title: "Book Aptmnt", href: "/booking", icon: <Calendar /> },
  { title: "My Bookings", href: "/dashboard/my-bookings", icon: <Listing /> },
  { title: "Profile", href: "/dashboard/profile", icon: <Users /> },
  { title: "Settings", href: "/dashboard/settings", icon: <Cog /> },
  {
    title: "Billing & Receipts",
    href: "/dashboard/billing-and-receipts",
    icon: <Report />,
  },
];

export default function UserSideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isGroomer = !!session?.user?.isGroomer;

  return (
    <aside className={styles.container}>
      <nav className={styles.nav}>
        <ul
          className={
            isOpen ? `${styles.navLinks} ${styles.open}` : styles.navLinks
          }
        >
          <div className={styles.linksWrapper}>
            {NAV_ITEMS.map(({ title, href, icon }) => (
              <li key={title}>
                <Link
                  href={href}
                  className={styles.navLink}
                  onClick={() => setIsOpen(false)}
                >
                  {icon}
                  {title}
                </Link>
              </li>
            ))}
          </div>

          <div className={styles.btnContainerii}>
            <UserButton />
            <Button btnType='brownBorder' text='Go Home' href='/' />
            {isAdmin && (
              <Button btnType='brown' text='Admin Dashboard' href='/admin' />
            )}
            {isGroomer && (
              <Button
                btnType='orangeOutline'
                text='Groomer Dashboard'
                href='/groomer'
              />
            )}
          </div>
        </ul>

        <div className={styles.btnContainer}>
          <UserButton />
            <Button btnType='tan' text='Go Home' href='/' />
          {isAdmin && (
            <Button
              btnType='brown'
              text='Admin Dashboard'
              href='/admin'
            />
          )}
          {isGroomer && (
            <Button
              btnType='darkBrown'
              text='Groomer Dashboard'
              href='/groomer'
            />
          )}
        </div>
      </nav>
    </aside>
  );
}
