import Link from "next/link";
import styles from "./welcome.module.css";

type Props = { text: string; linkText: string; href?: string };

export function RegisterLink({ text, linkText, href = "/register" }: Props) {
  return (
    <p className={styles.register}>
      {text}{" "}
      <Link href={href} className={styles.link}>
        {linkText}
      </Link>
    </p>
  );
}