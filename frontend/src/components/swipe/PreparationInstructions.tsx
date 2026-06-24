import styles from "./PreparationInstructions.module.css";

export default function PreparationInstructions({ text }: { text: string }) {
  const steps = text.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div>
      <h3 className={styles.heading}>Modo de preparo</h3>
      <div className={styles.text}>
        {steps.map((step, index) => (
          <p key={index} className={styles.step}>{step}</p>
        ))}
      </div>
    </div>
  );
}