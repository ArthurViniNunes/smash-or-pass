import styles from "./welcome.module.css";

type Props = { message: string };

export function WelcomeText({ message }: Props) {
  return <h1 className={styles.title}>{message}</h1>;
}