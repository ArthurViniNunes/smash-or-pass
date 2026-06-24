import styles from "./HeaderSection.module.css";

type HeaderSectionProps = {
  title: string;
  highlight?: string;
};

export default function HeaderSection({ title, highlight }: HeaderSectionProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        {title}{" "}
        {highlight && <span className={styles.highlight}>{highlight}</span>}
      </h1>
    </header>
  );
}