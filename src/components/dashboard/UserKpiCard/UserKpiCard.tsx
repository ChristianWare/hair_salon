import styles from './UserKpiCard.module.css' 
 
 export default function UserKpiCard({
   label,
   value,
 }: {
   label: string;
   value: string | number;
 }) {
   return (
     <div className={styles.container}>
       <span className={styles.label}>{label}</span>
       <p className={styles.value}>{value}</p>
     </div>
   );
 }
