"use client";

import styles from "./BlockedDatesEditor.module.css";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BlockedDatesEditor({
  initialDates,
  onAddBreak,
  onRemoveBreak,
}: {
  initialDates: { id: string; date: string }[];
  onAddBreak: (formData: FormData) => Promise<void>;
  onRemoveBreak: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [date, setDate] = useState("");

  const sorted = useMemo(
    () =>
      [...initialDates].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [initialDates]
  );
  const existingISO = useMemo(
    () => new Set(sorted.map((d) => d.date.slice(0, 10))),
    [sorted]
  );

  const todayISO = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  const handleAdd = () => {
    if (!date) return;
    if (date < todayISO) {
      alert("You can’t add a past date.");
      return;
    }
    if (existingISO.has(date)) {
      alert("That date is already blocked.");
      return;
    }

    start(async () => {
      const fd = new FormData();
      fd.set("date", date);
      await onAddBreak(fd);
      setDate("");
      router.refresh();
    });
  };

  const handleRemove = (id: string, dateLabel: string) => {
    const ok = window.confirm(`Remove blocked date: ${dateLabel}?`);
    if (!ok) return;

    start(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await onRemoveBreak(fd);
      router.refresh();
    });
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  return (
    <section className={styles.container}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Blocked Dates</h3>
        <div className={styles.actions}>
          <input
            className={styles.input}
            type='date'
            value={date}
            min={todayISO}
            onChange={(e) => setDate(e.target.value)}
            disabled={pending}
          />
          <button
            className={styles.btnPrimary}
            onClick={handleAdd}
            disabled={pending || !date}
            aria-disabled={pending || !date}
          >
            {pending ? "Adding…" : "Add Date"}
          </button>
        </div>
      </div>

      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td className={styles.tdCenter} colSpan={2}>
                    No blocked dates.
                  </td>
                </tr>
              ) : (
                sorted.map((b) => {
                  const label = fmt(b.date);
                  return (
                    <tr key={b.id}>
                      <td className={styles.td} data-label='Date'>
                        {label}
                      </td>
                      <td className={styles.td} data-label='Actions'>
                        <button
                          className={styles.btnOutline}
                          onClick={() => handleRemove(b.id, label)}
                          disabled={pending}
                          aria-disabled={pending}
                        >
                          {pending ? "Removing…" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
