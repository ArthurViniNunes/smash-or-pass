"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import MenuItem from "./MenuItem";
import { SwipeIcon, LikesIcon, AccountIcon, SwitchIcon } from "./SwipeIcons";
import styles from "./SideMenu.module.css";

const MENU_ITEMS = [
  { key: "swipe", label: "Swipe", href: "/swipe", icon: <SwipeIcon /> },
  { key: "curtidas", label: "Curtidas", href: "/recipes", icon: <LikesIcon /> },
  { key: "conta", label: "Conta", href: "/profile", icon: <AccountIcon /> },
];

export default function SideMenu({ active = "swipe" }: { active?: string }) {
  // Admins acessam a visão de usuário mas precisam de uma saída para voltar
  // à seleção de conta — o item só aparece quando o papel é ADMIN.
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    authService
      .me()
      .then((user) => {
        if (mounted) setIsAdmin(user.role === "ADMIN");
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <nav className={styles.menu}>
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.key}
          label={item.label}
          href={item.href}
          icon={item.icon}
          active={item.key === active}
        />
      ))}

      {isAdmin && (
        <MenuItem
          label="Trocar conta"
          href="/select-account"
          icon={<SwitchIcon />}
        />
      )}
    </nav>
  );
}
