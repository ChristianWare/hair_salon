/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./AvailabilityEditor.module.css";
import { useEffect, useMemo, useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
type Opt = { value: string; label: string };

function buildTimeOpts(startHour = 6, endHour = 20): Opt[] {
  const out: Opt[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const value = `${hh}:${mm}`;
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      out.push({ value, label: `${h12}:${mm} ${ampm}` });
    }
  }
  return out;
}
const timeOpts = buildTimeOpts();

const isAfter = (a: string, b: string) => a > b;
const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

export default function AvailabilityEditor({
  initial,
  onChange,
}: {
  initial: Record<string, [string, string][]>;
  onChange: (json: Record<string, [string, string][]>) => void;
}) {
  const [state, setState] = useState<
    Record<string, { enabled: boolean; start: string; end: string }>
  >(
    DAYS.reduce((acc, d) => {
      const slot = initial[d]?.[0];
      acc[d] = {
        enabled: Boolean(slot),
        start: slot?.[0] || DEFAULT_START,
        end: slot?.[1] || DEFAULT_END,
      };
      return acc;
    }, {} as any)
  );

  const errors = useMemo(() => {
    const e: Record<string, string | null> = {};
    for (const d of DAYS) {
      const { enabled, start, end } = state[d];
      e[d] =
        enabled && !isAfter(end, start)
          ? "End time must be after start."
          : null;
    }
    return e;
  }, [state]);

  useEffect(() => {
    const json = DAYS.reduce((obj, d) => {
      const { enabled, start, end } = state[d];
      obj[d] = enabled ? [[start, end]] : [];
      return obj;
    }, {} as Record<string, [string, string][]>);
    onChange(json);
  }, [state, onChange]);

  const setDay = (
    d: string,
    patch: Partial<{ enabled: boolean; start: string; end: string }>
  ) => setState((s) => ({ ...s, [d]: { ...s[d], ...patch } }));

  const weekdays95 = () => {
    setState((s) => {
      const next = { ...s };
      for (const d of DAYS.slice(0, 5))
        next[d] = { enabled: true, start: "09:00", end: "17:00" };
      for (const d of DAYS.slice(5))
        next[d] = { enabled: false, start: "09:00", end: "17:00" };
      return next;
    });
  };

  const copyMonToAll = () => {
    const mon = state["Mon"];
    setState((s) => {
      const next = { ...s };
      for (const d of DAYS) next[d] = { ...mon };
      return next;
    });
  };

  const clearAll = () => {
    setState((s) => {
      const next = { ...s };
      for (const d of DAYS)
        next[d] = { enabled: false, start: DEFAULT_START, end: DEFAULT_END };
      return next;
    });
  };

  return (
    <section className={styles.container}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>Weekly Availability</h3>
        <div className={styles.quickActions}>
          <button
            type='button'
            onClick={weekdays95}
            className={styles.btnOutline}
          >
            Weekdays 9–5
          </button>
          <button
            type='button'
            onClick={copyMonToAll}
            className={styles.btnOutline}
          >
            Copy Monday → all
          </button>
          <button
            type='button'
            onClick={clearAll}
            className={styles.btnOutline}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Day</th>
                <th className={styles.th}>Enable</th>
                <th className={styles.th}>Start</th>
                <th className={styles.th}>End</th>
                <th className={styles.th}>Note</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((d) => {
                const row = state[d];
                const hasErr = !!errors[d];
                return (
                  <tr key={d}>
                    <td className={styles.td} data-label='Day'>
                      <strong className={styles.dayLabel}>{d}</strong>
                    </td>
                    <td className={styles.td} data-label='Enable'>
                      <input
                        type='checkbox'
                        checked={row.enabled}
                        onChange={(e) =>
                          setDay(d, { enabled: e.target.checked })
                        }
                      />
                    </td>
                    <td className={styles.td} data-label='Start'>
                      <select
                        className={styles.select}
                        disabled={!row.enabled}
                        value={row.start}
                        onChange={(e) => {
                          const start = e.target.value;
                          let end = row.end;
                          if (!isAfter(end, start)) {
                            const idx = timeOpts.findIndex(
                              (t) => t.value === start
                            );
                            const next = timeOpts[idx + 1]?.value ?? end;
                            end = isAfter(next, start) ? next : end;
                          }
                          setDay(d, { start, end });
                        }}
                      >
                        {timeOpts.map(({ value, label }) => (
                          <option key={`${d}-start-${value}`} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.td} data-label='End'>
                      <select
                        className={styles.select}
                        disabled={!row.enabled}
                        value={row.end}
                        onChange={(e) => setDay(d, { end: e.target.value })}
                      >
                        {timeOpts.map(({ value, label }) => (
                          <option key={`${d}-end-${value}`} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={styles.td} data-label='Note'>
                      {row.enabled ? (
                        hasErr ? (
                          <span className={styles.errorText}>{errors[d]}</span>
                        ) : (
                          <span className={styles.noteText}>
                            {row.start}–{row.end}
                          </span>
                        )
                      ) : (
                        <span className={styles.noteText}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.footerNote}>
        Note: This editor supports one time window per day. If you need split
        shifts (e.g., 9–12 and 1–5), we can extend this to multiple windows per
        day.
      </div>
    </section>
  );
}
