"use client";

import Link from "next/link";
import styles from "./MenuItem.module.css";

type MenuItemProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
};

export default function MenuItem({ label, href, icon, active = false }: MenuItemProps) {
  return (
    <Link href={href} className={`${styles.item} ${active ? styles.active : ""}`}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </Link>
  );
}