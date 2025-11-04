"use client";

import styles from "./ProfileEditor.module.css";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEditor({
  initialBio,
  initialSpecs,
  initialWorking,
  onSave,
}: {
  initialBio: string;
  initialSpecs: string[];
  initialWorking: Record<string, [string, string][]>;
  onSave: (fd: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const [bio, setBio] = useState(initialBio);
  const [specs, setSpecs] = useState(initialSpecs.join(", "));
  const [working, setWorking] = useState(initialWorking);

  const MAX_BIO = 1000;

  const chips = useMemo(() => tokenizeSpecs(specs), [specs]);
  const dirty = bio !== initialBio || specs !== initialSpecs.join(", ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const fd = new FormData();
      fd.set("bio", bio.trim());
      fd.set("specialties", chips.join(", "));
      fd.set("workingHours", JSON.stringify(working || {}));
      await onSave(fd);
      router.refresh();
    });
  };

  const handleReset = () => {
    setBio(initialBio);
    setSpecs(initialSpecs.join(", "));
    setWorking(initialWorking);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          maxLength={MAX_BIO}
          placeholder='Tell clients about your experience, certifications, and what you love grooming.'
          className={styles.textarea}
        />
        <div className={styles.helpText}>
          {bio.length}/{MAX_BIO}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Specialties</label>
        <input
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          placeholder='e.g. doodles, seniors, nail trim, deshed'
          className={styles.input}
        />
        <div className={styles.helpText}>Comma-separated. Preview:</div>
        <div className={styles.chipsRow}>
          {chips.length === 0 ? (
            <span className={styles.muted}>— none —</span>
          ) : (
            chips.map((c) => (
              <span key={c} className={styles.chip}>
                {c}
              </span>
            ))
          )}
        </div>
      </div>

      <div className={styles.buttonsRow}>
        <button
          type='submit'
          disabled={pending || !dirty}
          className={styles.btnPrimary}
        >
          {pending ? "Saving…" : "Save Profile"}
        </button>
        <button
          type='button'
          onClick={handleReset}
          disabled={pending || !dirty}
          className={styles.btnOutline}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function tokenizeSpecs(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\s+/g, " "))
    .slice(0, 24);
}
