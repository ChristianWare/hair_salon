import styles from "./GroomerPageIntro.module.css";
import { auth } from "../../../../auth";

export default async function GroomerPageIntro() {
  const session = await auth();

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={`${styles.heading} adminHeading`}>
          {session?.user?.name}&lsquo;s Dashboard (Groomer)
        </h1>{" "}
        <p className={styles.copy}>
          Welcome to the groomer dashboard! Here you can manage your profile,
          set your working hours, and view your earnings.
        </p>
      </div>
    </section>
  );
}
