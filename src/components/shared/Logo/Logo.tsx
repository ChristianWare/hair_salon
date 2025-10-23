import styles from "./Logo.module.css";

export default function Logo({ color }: { color?: string }) {
  return (
    <div className={styles.container}>
      <span className={`${styles.text} ${color ? styles[color] : ""}`}>
        Velvet & Vine
      </span>
    </div>
  );
}
