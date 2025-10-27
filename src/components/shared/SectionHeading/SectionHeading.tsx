import styles from "./SectionHeading.module.css";

export default function SectionHeading({
  text,
  color,
  left = false,
  right = false,
}: {
  text: string;
  color?: string;
  left?: boolean;
  right?: boolean;
}) {
  const containerClass = [
    styles.container,
    left ? styles.withLeft : "",
    right ? styles.withRight : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      <span className={`${styles.text}${color ? ` ${styles[color]}` : ""}`}>
        {text}
      </span>
    </div>
  );
}
