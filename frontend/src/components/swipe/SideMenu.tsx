import MenuItem from "./MenuItem";
import { SwipeIcon, LikesIcon, AccountIcon } from "./SwipeIcons";
import styles from "./SideMenu.module.css";

const MENU_ITEMS = [
  { key: "swipe", label: "Swipe", href: "/swipe", icon: <SwipeIcon /> },
  { key: "curtidas", label: "Curtidas", href: "/recipes", icon: <LikesIcon /> },
  { key: "conta", label: "Conta", href: "/profile", icon: <AccountIcon /> },
];

export default function SideMenu({ active = "swipe" }: { active?: string }) {
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
    </nav>
  );
}