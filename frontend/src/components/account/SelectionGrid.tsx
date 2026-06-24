import styles from "./SelectionGrid.module.css";

export default function SelectionGrid({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={styles.grid}>{children}</div>;
}