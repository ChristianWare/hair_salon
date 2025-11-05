/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "./CheckoutStep.module.css";
import { useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

type CheckoutStepProps = {
  bookingId: string;
  clientSecret: string;
  amountDueCents?: number;
  basePriceCents?: number;
  depositCents?: number;
  taxCents?: number;
  feeCents?: number;
  discountCents?: number;
  serviceName?: string;
  durationMin?: number;
  groomerName?: string;
  dateLabel?: string;
  timeLabel?: string;
  onDone?: (status: "CONFIRMED" | "PENDING" | "UNKNOWN") => void;
};

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!PK) {
  console.error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}
const stripePromise: Promise<Stripe | null> = PK
  ? loadStripe(PK)
  : Promise.resolve(null);

function fmt(cents?: number) {
  if (typeof cents !== "number") return "—";
  return `$${(cents / 100).toFixed(2)}`;
}
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const toCents = (val: string) =>
  Math.round(clamp(parseFloat(val || "0"), 0, 1_000_000) * 100);

export default function CheckoutStep(props: CheckoutStepProps) {
  const { clientSecret } = props;

  const options = useMemo(
    () =>
      clientSecret
        ? ({ clientSecret, appearance: { labels: "above" as const } } as const)
        : undefined,
    [clientSecret]
  );

  if (!clientSecret) {
    return <div className={styles.textMuted}>Preparing secure payment…</div>;
  }
  if (!PK) {
    return (
      <div className={styles.textError}>
        Payments aren’t configured: missing{" "}
        <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutInner {...props} />
    </Elements>
  );
}

function CheckoutInner({
  bookingId,
  amountDueCents,
  basePriceCents,
  depositCents,
  taxCents,
  feeCents,
  discountCents,
  serviceName,
  durationMin,
  groomerName,
  dateLabel,
  timeLabel,
  onDone,
}: CheckoutStepProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [tipCents, setTipCents] = useState<number>(0);
  const [updatingTip, setUpdatingTip] = useState(false);
  const [customTipInput, setCustomTipInput] = useState<string>("");

  const breakdown = useMemo(() => {
    const subtotalCents =
      typeof depositCents === "number"
        ? depositCents
        : typeof amountDueCents === "number"
        ? amountDueCents -
          (taxCents ?? 0) -
          (feeCents ?? 0) +
          (discountCents ?? 0)
        : undefined;

    const taxNow = typeof taxCents === "number" ? taxCents : 0;
    const feeNow = typeof feeCents === "number" ? feeCents : 0;
    const discountNow = typeof discountCents === "number" ? discountCents : 0;

    const calcTotal =
      typeof subtotalCents === "number"
        ? subtotalCents + taxNow + feeNow - discountNow
        : undefined;

    const totalCents =
      typeof amountDueCents === "number" ? amountDueCents : calcTotal;

    const hasDeposit =
      typeof basePriceCents === "number" &&
      typeof depositCents === "number" &&
      depositCents < basePriceCents;

    const remainingPreTax = hasDeposit
      ? Math.max(0, basePriceCents! - depositCents!)
      : 0;

    return {
      subtotalCents,
      taxNow,
      feeNow,
      discountNow,
      totalCents,
      hasDeposit,
      remainingPreTax,
    };
  }, [
    amountDueCents,
    basePriceCents,
    depositCents,
    taxCents,
    feeCents,
    discountCents,
  ]);

  const finalDueNowCents = (breakdown.totalCents ?? 0) + tipCents;

  const tipBaseCents =
    typeof basePriceCents === "number"
      ? basePriceCents
      : breakdown.subtotalCents ?? 0;

  const presetPercents = [20, 25, 30, 40];
  const tipForPct = (p: number) => Math.round((tipBaseCents * p) / 100);
  const isPresetSelected = (p: number) => tipCents === tipForPct(p);
  const isCustomSelected =
    tipCents > 0 && !presetPercents.some(isPresetSelected);

  async function updateTipOnServer(newTipCents: number) {
    try {
      setUpdatingTip(true);
      const res = await fetch("/api/book/set-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, tipCents: newTipCents }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Could not update tip.");
        return;
      }
      setTipCents(data.tipCents ?? newTipCents);
      toast.success(data.tipCents > 0 ? "Tip added" : "Tip removed");
    } catch (e: any) {
      toast.error(e?.message || "Could not update tip.");
    } finally {
      setUpdatingTip(false);
    }
  }

  function tipFromPercent(pct: number) {
    const cents = tipForPct(pct);
    setCustomTipInput("");
    updateTipOnServer(cents);
  }
  function tipNone() {
    setCustomTipInput("");
    updateTipOnServer(0);
  }
  function tipFromCustom() {
    const cents = toCents(customTipInput);
    updateTipOnServer(cents);
  }

  async function handlePay() {
    if (!stripe || !elements) {
      setError("Payments aren’t ready yet. Try reloading the page.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setSubmitting(false);
      setError(submitErr.message || "Please check your payment details.");
      return;
    }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmErr) {
      setSubmitting(false);
      setError(confirmErr.message || "Payment couldn’t be completed.");
      return;
    }

    try {
      const res = await fetch("/api/book/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitting(false);
        setError(data?.error || "We’re finalizing your booking…");
        toast("We’re finalizing your booking. You can check My Bookings.", {
          icon: "⌛",
        });
        onDone?.("UNKNOWN");
        return;
      }

      setSubmitting(false);
      const status = (data?.status as "CONFIRMED" | "PENDING") || "UNKNOWN";
      toast.success(status === "CONFIRMED" ? "Booked!" : "Request sent!");
      onDone?.(status);
    } catch (e: any) {
      setSubmitting(false);
      setError(e?.message || "Could not finalize your booking.");
      toast("We’re finalizing your booking. You can check My Bookings.", {
        icon: "⌛",
      });
      onDone?.("UNKNOWN");
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.title}>Review</div>
        <br />
        <div className={styles.row}>
          <span className={styles.muted}>Service</span>
          <span className={styles.mutedDetail}>{serviceName ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.muted}>Duration</span>
          <span className={styles.mutedDetail}>
            {durationMin ? `${durationMin} min` : "—"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.muted}>Groomer</span>
          <span className={styles.mutedDetail}>{groomerName ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.muted}>Date</span>
          <span className={styles.mutedDetail}>{dateLabel ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.muted}>Time</span>
          <span className={styles.mutedDetail}>{timeLabel ?? "—"}</span>
        </div>

        {typeof basePriceCents === "number" && (
          <div className={`${styles.row} ${styles.mt8}`}>
            <span className={styles.muted}>Service price</span>
            <span className={styles.mutedDetail}>{fmt(basePriceCents)}</span>
          </div>
        )}

        <div className={styles.breakdown}>
          {typeof breakdown.subtotalCents === "number" && (
            <div className={styles.row}>
              <span className={styles.muted}>
                {breakdown.hasDeposit ? "Deposit (today)" : "Subtotal"}
              </span>
              <span className={styles.mutedDetail}>
                {fmt(breakdown.subtotalCents)}
              </span>
            </div>
          )}

          {breakdown.taxNow > 0 && (
            <div className={styles.row}>
              <span className={styles.muted}>Tax</span>
              <span className={styles.mutedDetail}>
                {fmt(breakdown.taxNow)}
              </span>
            </div>
          )}

          {breakdown.feeNow > 0 && (
            <div className={styles.row}>
              <span className={styles.muted}>Fees</span>
              <span className={styles.mutedDetail}>
                {fmt(breakdown.feeNow)}
              </span>
            </div>
          )}

          {breakdown.discountNow > 0 && (
            <div className={styles.row}>
              <span className={styles.muted}>Discount</span>
              <span className={styles.mutedDetail}>
                -{fmt(breakdown.discountNow)}
              </span>
            </div>
          )}

          {tipCents > 0 && (
            <div className={styles.row}>
              <span className={styles.muted}>Tip</span>
              <span className={styles.mutedDetail}>{fmt(tipCents)}</span>
            </div>
          )}

          <div className={`${styles.row} ${styles.totalRow}`}>
            <span className={styles.totalLabel}>Due now</span>
            <span className={styles.totalLabel}>{fmt(finalDueNowCents)}</span>
          </div>

          {breakdown.hasDeposit && (
            <div className={styles.small}>
              Remaining service balance (pre-tax):{" "}
              <strong>{fmt(breakdown.remainingPreTax)}</strong> due at
              appointment.
            </div>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.title}>Payment</div>
        <br />
        <div className={styles.tipBlock}>
          <div className={`${styles.small} ${styles.mb6}`}>
            Tip your groomer (optional)
          </div>

          <div className={styles.tipChips}>
            <button
              type='button'
              onClick={tipNone}
              disabled={updatingTip}
              className={`${styles.chipBtn} ${
                tipCents === 0 ? styles.chipSelected : ""
              }`}
            >
              No tip
            </button>

            {presetPercents.map((p) => (
              <button
                key={p}
                type='button'
                onClick={() => tipFromPercent(p)}
                disabled={updatingTip}
                className={`${styles.chipBtn} ${
                  isPresetSelected(p) ? styles.chipSelected : ""
                }`}
                title={
                  typeof basePriceCents === "number"
                    ? `$${((basePriceCents * p) / 100 / 100).toFixed(2)}`
                    : undefined
                }
              >
                {p}%
              </button>
            ))}

            <div className={styles.customTip}>
              <span className={styles.dollar}>$</span>
              <input
                type='number'
                min={0}
                step='0.01'
                placeholder='Custom'
                value={customTipInput}
                onChange={(e) => setCustomTipInput(e.target.value)}
                className={`${styles.inputMini} ${
                  isCustomSelected ? styles.inputMiniSelected : ""
                }`}
                disabled={updatingTip}
              />
              <button
                type='button'
                onClick={tipFromCustom}
                disabled={updatingTip}
                className={`${styles.btnSm} ${
                  isCustomSelected ? styles.btnSmSelected : ""
                }`}
              >
                Apply
              </button>
            </div>
          </div>

          <div className={`${styles.small} ${styles.mt6} ${styles.textMuted}`}>
            100% of tips go to your groomer.
          </div>
        </div>

        <div className={styles.paymentEl}>
          <PaymentElement />
        </div>

        {error ? <div className={styles.textError}>{error}</div> : null}

        <button
          type='button'
          onClick={handlePay}
          disabled={submitting || !stripe || !elements || updatingTip}
          className={styles.btnPrimary}
        >
          {submitting ? "Processing…" : "Pay & Book"}
        </button>

        <p className={`${styles.small} ${styles.mt8}`}>
          Your payment info is encrypted and processed by Stripe.
        </p>
      </div>
    </div>
  );
}
