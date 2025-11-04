"use client";

import styles from "./SettingsForm.module.css";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  autoConfirm: boolean;
  minLeadMinutes: number;
  bufferMin: number;
  emailOptIn: boolean;
  smsOptIn: boolean;
  notificationPhone: string | null;
};

export default function SettingsForm({
  initial,
  onSave,
}: {
  initial: Initial;
  onSave: (fd: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [autoConfirm, setAutoConfirm] = useState(initial.autoConfirm);
  const [minLeadMinutes, setMinLeadMinutes] = useState(initial.minLeadMinutes);
  const [bufferMin, setBufferMin] = useState(initial.bufferMin);
  const [emailOptIn, setEmailOptIn] = useState(initial.emailOptIn);
  const [smsOptIn, setSmsOptIn] = useState(initial.smsOptIn);
  const [notificationPhone, setNotificationPhone] = useState(
    initial.notificationPhone ?? ""
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const fd = new FormData();
      if (autoConfirm) fd.set("autoConfirm", "on");
      if (emailOptIn) fd.set("emailOptIn", "on");
      if (smsOptIn) fd.set("smsOptIn", "on");
      fd.set("minLeadMinutes", String(minLeadMinutes));
      fd.set("bufferMin", String(bufferMin));
      if (notificationPhone) fd.set("notificationPhone", notificationPhone);

      await onSave(fd);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Booking Behavior</legend>

        <label className={styles.row}>
          <input
            type='checkbox'
            checked={autoConfirm}
            onChange={(e) => setAutoConfirm(e.target.checked)}
          />
          <span>Automatically confirm new bookings</span>
        </label>

        <div className={styles.grid2}>
          <label>
            <div className={styles.label}>Minimum lead time (minutes)</div>
            <input
              className={styles.input}
              type='number'
              min={0}
              value={minLeadMinutes}
              onChange={(e) =>
                setMinLeadMinutes(parseInt(e.target.value || "0", 10))
              }
            />
          </label>

          <label>
            <div className={styles.label}>Buffer per appointment (minutes)</div>
            <input
              className={styles.input}
              type='number'
              min={0}
              value={bufferMin}
              onChange={(e) =>
                setBufferMin(parseInt(e.target.value || "0", 10))
              }
            />
          </label>
        </div>

        <p className={styles.hint}>
          Lead time prevents last-minute bookings. Buffer is added after each
          service to allow cleanup or prep.
        </p>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Notifications</legend>

        <label className={styles.row}>
          <input
            type='checkbox'
            checked={emailOptIn}
            onChange={(e) => setEmailOptIn(e.target.checked)}
          />
          <span>Email notifications</span>
        </label>

        <label className={styles.row}>
          <input
            type='checkbox'
            checked={smsOptIn}
            onChange={(e) => setSmsOptIn(e.target.checked)}
          />
          <span>SMS notifications</span>
        </label>

        <label>
          <div className={styles.label}>
            Notification phone (E.164, e.g. +16025551234)
          </div>
          <input
            className={styles.input}
            type='tel'
            value={notificationPhone}
            onChange={(e) => setNotificationPhone(e.target.value)}
            placeholder='+16025551234'
            disabled={!smsOptIn}
          />
        </label>
      </fieldset>

      <div className={styles.actions}>
        <button type='submit' disabled={pending} className={styles.btnPrimary}>
          {pending ? "Updating…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
