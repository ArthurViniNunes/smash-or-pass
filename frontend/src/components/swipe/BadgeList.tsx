import BadgeItem from "@/components/ui/BadgeItem";
import styles from "./BadgeList.module.css";

type BadgeListProps = {
  title: string;
  items: string[];
};

export default function BadgeList({ title, items }: BadgeListProps) {
  return (
    <div>
      <h3 className={styles.heading}>{title}</h3>
      <div className={styles.list}>
        {items.map((item) => (
          <BadgeItem key={item} label={item} />
        ))}
      </div>
    </div>
  );
}