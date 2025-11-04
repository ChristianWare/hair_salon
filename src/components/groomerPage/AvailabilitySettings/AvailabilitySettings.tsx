"use client";

import styles from "./AvailabilitySettings.module.css";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AvailabilityEditor from "../AvailabilityEditor/AvailabilityEditor";

export default function AvailabilitySettings({
  initialWorking,
  onSave,
}: {
  initialWorking: Record<string, [string, string][]>;
  onSave: (fd: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [working, setWorking] = useState(initialWorking);

  const initialJson = useMemo(
    () => JSON.stringify(initialWorking),
    [initialWorking]
  );
  const dirty = useMemo(
    () => JSON.stringify(working) !== initialJson,
    [working, initialJson]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    start(async () => {
      const fd = new FormData();
      fd.set("workingHours", JSON.stringify(working));
      await onSave(fd);
      router.refresh();
    });
  };

  const handleReset = () => {
    if (!dirty) return;
    setWorking(initialWorking);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.editorWrap}>
        <AvailabilityEditor initial={initialWorking} onChange={setWorking} />
      </div>

      <div className={styles.actions}>
        <button
          type='submit'
          className={styles.btnPrimary}
          disabled={pending || !dirty}
          aria-busy={pending}
        >
          {pending ? "Saving…" : "Save Availability"}
        </button>
        <button
          type='button'
          onClick={handleReset}
          className={styles.btnOutline}
          disabled={pending || !dirty}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
