/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./ActionBar.module.css";
import { useTransition } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  markCompletedSA,
  markNoShowSA,
} from "@/app/(admin)/admin/bookings/_actions";

export default function ActionBar({
  bookingId,
  status,
  isCanceled,
}: {
  bookingId: string;
  status: string;
  isCanceled: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  type ActionResult = { ok: boolean; error?: string };

  const handleCompleted = () =>
    start(async () => {
      const res: ActionResult = await markCompletedSA(bookingId);
      if (res.ok) {
        toast.success("Marked completed");
        router.refresh();
      } else {
        toast.error(res.error || "Could not mark completed");
      }
    });

  const handleNoShow = () =>
    start(async () => {
      const res: ActionResult = await markNoShowSA(bookingId);
      if (res.ok) {
        toast.success("Marked no-show");
        router.refresh();
      } else {
        toast.error(res.error || "Could not mark no-show");
      }
    });

  const handleAdminCancel = (formData: FormData) =>
    start(async () => {
      const reason = String(formData.get("reason") || "").trim();

      try {
        const res = await fetch("/api/book/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, reason, actor: "admin" }),
        });

        const data: any = await res.json().catch(() => ({}));

        if (res.ok && data?.ok) {
          const msg =
            typeof data.refunded === "number" && data.refunded > 0
              ? "Appointment canceled & refunded"
              : "Appointment canceled";
          toast.success(msg);
          router.refresh();
        } else {
          toast.error(data?.error || "Could not cancel");
        }
      } catch {
        toast.error("Could not cancel");
      }
    });

  const isCompleted = status === "COMPLETED";
  const isNoShow = status === "NO_SHOW";

  const cancelDisabled = isCanceled || isCompleted || isNoShow || pending;

  return (
    <>
      <Toaster position='top-right' />

      <div className={styles.actionsRow}>
        <button
          type='button'
          onClick={handleCompleted}
          className={styles.btnOutline}
          disabled={isCanceled || pending}
          title={isCanceled ? "Cannot complete a canceled booking" : undefined}
        >
          Mark Completed
        </button>

        <button
          type='button'
          onClick={handleNoShow}
          className={styles.btnOutline}
          disabled={isCanceled || pending}
          title={isCanceled ? "Cannot no-show a canceled booking" : undefined}
        >
          Mark No-Show
        </button>

        {isCanceled ? (
          <span
            className={`${styles.btnOutline} ${styles.btnDisabled}`}
            title='This booking is already canceled'
          >
            Already canceled
          </span>
        ) : isCompleted ? (
          <span
            className={`${styles.btnOutline} ${styles.btnMuted}`}
            title='Completed bookings can’t be canceled'
          >
            Completed — no cancellation
          </span>
        ) : isNoShow ? (
          <span
            className={`${styles.btnOutline} ${styles.btnMuted}`}
            title='No-show bookings can’t be canceled'
          >
            No-show — no cancellation
          </span>
        ) : (
          <form
            action={handleAdminCancel}
            className={styles.cancelForm}
            onSubmit={(e) => {
              if (
                !confirm(
                  "Cancel this appointment and issue a refund for any captured amount?"
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input
              type='text'
              name='reason'
              placeholder='Reason (optional)'
              className={`${styles.input} ${styles.reasonInput}`}
            />
            <button
              type='submit'
              className={styles.btnDanger}
              disabled={cancelDisabled}
            >
              {pending ? "Canceling…" : "Cancel Booking"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
