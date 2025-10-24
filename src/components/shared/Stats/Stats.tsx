import CountUp from '../CountUp/CountUp';
import styles from './Stats.module.css'

const dataii = [
  { id: 1, number: "120+", detail: "Happy clients" },
  { id: 2, number: "14", detail: "Years of experience" },
  { id: 3, number: "70+", detail: "Campaigns launched" },
  { id: 4, number: "300+", detail: "Projects completed" },
];

function parseStat(str: string): { value: number; suffix: string } {
  const m = str.trim().match(/^(\d+(?:\.\d+)?)([a-zA-Z%+]+)?$/);
  const raw = m ? Number(m[1]) : Number(str) || 0;
  const suffix = m?.[2] ?? "";

  return { value: raw, suffix };
}

export default function Stats() {
  return (
    <section className={styles.container}>
      <div className={styles.bottomii}>
        <div className={styles.mapDataContainerii}>
          {dataii.map((item) => {
            const { value, suffix } = parseStat(item.number);
            return (
              <div key={item.id} className={styles.cardii}>
                <p className={styles.detail}>{item.detail}</p>
                <h4 className={`${styles.number} stat`}>
                  <CountUp
                    from={0}
                    to={value}
                    duration={1.2}
                    separator=','
                    className={styles.count}
                  />
                  {suffix && <span className={styles.suffix}>{suffix}</span>}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}