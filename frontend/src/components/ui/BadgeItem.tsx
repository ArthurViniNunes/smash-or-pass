import styles from "./BadgeItem.module.css";

export default function BadgeItem({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>;
}