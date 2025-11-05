// components/bookingPage/BookingWizard/BookingWizard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import styles from "./BookingWizard.module.css";
import LayoutWrapper from "@/components/shared/LayoutWrapper";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import CheckoutStep from "@/components/bookingPage/Checkout/CheckoutStep";

type Service = {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number;
  active: boolean;
};

type GroomerLite = { id: string; name: string };

type Slot = {
  iso: string;
  label: string;
  time24: string;
  groomerId?: string;
  groomerName?: string;
};

type GroomerCalendar = { workDays: number[]; blackoutISO: string[] };

type Checkout = {
  bookingId: string;
  clientSecret: string;
  amountDueCents: number;
  slotIso: string;
  totals?: {
    depositCents: number;
    taxCents: number;
    feeCents?: number;
    discountCents?: number;
  };
} | null;

const ANY_ID = "ANY";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function CalendarPopover({
  value,
  min,
  isDateEnabled,
  onChange,
}: {
  value?: string;
  min?: string;
  isDateEnabled?: (d: Date) => boolean;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => new Date(), []);
  const minDate = useMemo(
    () => (min ? new Date(min + "T00:00:00") : undefined),
    [min]
  );
  const selectedDate = useMemo(
    () => (value ? new Date(value + "T00:00:00") : undefined),
    [value]
  );
  const [month, setMonth] = useState<Date>(startOfMonth(selectedDate ?? today));

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!popRef.current || !anchorRef.current) return;
      if (
        popRef.current.contains(e.target as Node) ||
        anchorRef.current.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const daysInMonth = endOfMonth(month).getDate();
  const firstDayIndex = new Date(
    month.getFullYear(),
    month.getMonth(),
    1
  ).getDay();

  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(firstDayIndex).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(month.getFullYear(), month.getMonth(), d));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const headerLabel = month.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  const triggerLabel = selectedDate
    ? selectedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  const handleSelect = (d: Date) => {
    const tooEarly = minDate && d < minDate;
    const blockedByRule = isDateEnabled ? !isDateEnabled(d) : false;
    if (tooEarly || blockedByRule) return;
    onChange(ymd(d));
    setOpen(false);
  };

  return (
    <div ref={anchorRef} className={styles.calendarAnchor}>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-haspopup='dialog'
        aria-expanded={open}
        className={`${styles.input} ${styles.calendarTrigger}`}
      >
        <span className={styles.calendarTriggerSpan}>{triggerLabel}</span>
        <span className={styles.chevron}>▼</span>
      </button>

      {open && (
        <div
          ref={popRef}
          role='dialog'
          aria-label='Choose a date'
          className={styles.popover}
        >
          <div className={styles.popoverHeader}>
            <button
              type='button'
              onClick={() => setMonth((m) => addMonths(m, -1))}
              className={styles.btnNav}
              aria-label='Previous month'
            >
              ‹
            </button>
            <div className={styles.popoverTitle}>{headerLabel}</div>
            <button
              type='button'
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className={styles.btnNav}
              aria-label='Next month'
            >
              ›
            </button>
          </div>

          <div className={styles.weekHeader}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className={styles.calGrid}>
            {weeks.map((row, i) =>
              row.map((cell, j) => {
                if (!cell)
                  return <div key={`${i}-${j}`} className={styles.dayEmpty} />;
                const tooEarly = minDate && cell < minDate;
                const blockedByRule = isDateEnabled
                  ? !isDateEnabled(cell)
                  : false;
                const disabled = tooEarly || blockedByRule;
                const selected = selectedDate && isSameDay(selectedDate, cell);
                const isToday = isSameDay(new Date(), cell);
                const cls = [
                  styles.day,
                  disabled ? styles.dayDisabled : "",
                  selected ? styles.daySelected : "",
                  isToday ? styles.dayToday : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={cell.toISOString()}
                    type='button'
                    onClick={() => handleSelect(cell)}
                    disabled={disabled}
                    className={cls}
                    aria-current={selected ? "date" : undefined}
                  >
                    {cell.getDate()}
                  </button>
                );
              })
            )}
          </div>

          <div className={styles.popoverFooter}>
            <button
              type='button'
              onClick={() => setMonth(startOfMonth(new Date()))}
              className={styles.btnOutline}
            >
              Today
            </button>
            <span className={styles.flex1} />
            <button
              type='button'
              onClick={() => setOpen(false)}
              className={styles.btnOutline}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingWizard({
  services,
  groomers,
  calendars,
}: {
  services: Service[];
  groomers: GroomerLite[];
  calendars: Record<string, GroomerCalendar>;
}) {
  const [serviceId, setServiceId] = useState("");
  const [groomerId, setGroomerId] = useState("");
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string>("");

  const [checkoutSlot, setCheckoutSlot] = useState<{
    iso: string;
    groomerId: string;
    groomerName?: string;
  } | null>(null);

  const [checkout, setCheckout] = useState<Checkout>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>("");

  const [isMobile, setIsMobile] = useState(false);
  const [selectedTimeValue, setSelectedTimeValue] = useState("");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 568px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const todayISO = useMemo(() => ymd(new Date()), []);

  const selectedService = services.find((s) => s.id === serviceId);
  const price = selectedService
    ? (selectedService.priceCents / 100).toFixed(2)
    : null;
  const duration = selectedService?.durationMin ?? null;

  const selectedCal = useMemo(
    () =>
      groomerId && groomerId !== ANY_ID ? calendars[groomerId] : undefined,
    [calendars, groomerId]
  );

  const isDateEnabled = useMemo(() => {
    if (groomerId && groomerId !== ANY_ID) {
      const cal = calendars[groomerId];
      if (!cal) return (d: Date) => true;
      const workSet = new Set(cal.workDays);
      const blackoutSet = new Set(cal.blackoutISO);
      return (d: Date) => workSet.has(d.getDay()) && !blackoutSet.has(ymd(d));
    }
    const entries = Object.entries(calendars);
    if (entries.length === 0) return (_d: Date) => false;
    return (d: Date) => {
      const day = d.getDay();
      const iso = ymd(d);
      for (const [, cal] of entries) {
        if (cal.workDays.includes(day) && !cal.blackoutISO.includes(iso)) {
          return true;
        }
      }
      return false;
    };
  }, [calendars, groomerId]);

  useEffect(() => {
    if (!date) return;
    const d = new Date(date + "T00:00:00");
    if (!Number.isNaN(d.valueOf()) && !isDateEnabled(d)) {
      setDate("");
      setSlots([]);
      setMessage("");
      setCheckoutSlot(null);
      setCheckout(null);
    }
  }, [isDateEnabled, date]);

  const canFetch = useMemo(
    () => Boolean(serviceId && groomerId && date && !checkoutSlot),
    [serviceId, groomerId, date, checkoutSlot]
  );

  useEffect(() => {
    setSlots([]);
    setMessage("");
    setSelectedTimeValue("");
    if (!canFetch) return;
    let canceled = false;
    start(async () => {
      try {
        const params = new URLSearchParams({
          serviceId,
          groomerId,
          date,
        }).toString();
        const res = await fetch(`/api/availability?${params}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as Slot[] | { error: string };
        if (!canceled) {
          if (Array.isArray(data)) setSlots(data);
          else setMessage(data.error || "Failed to load availability");
        }
      } catch {
        if (!canceled) setMessage("Failed to load availability");
      }
    });
    return () => {
      canceled = true;
    };
  }, [canFetch, serviceId, groomerId, date, start]);

  function displayTime(slot: Slot) {
    const hasHHMM =
      typeof slot.time24 === "string" && /^\d{2}:\d{2}$/.test(slot.time24);
    if (hasHHMM) {
      const [h, m] = slot.time24!.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = ((h + 11) % 12) + 1;
      return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
    }
    if (slot.iso) {
      return new Date(slot.iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "—";
  }

  function chooseSlot(s: Slot, fallbackGroomerId: string) {
    if (!s.iso) return;
    const gid = s.groomerId ?? fallbackGroomerId;
    setCheckout(null);
    setCheckoutError("");
    setCheckoutLoading(true);
    setCheckoutSlot({ iso: s.iso, groomerId: gid, groomerName: s.groomerName });
  }

  useEffect(() => {
    let aborted = false;
    async function prepare() {
      if (!checkoutSlot || !selectedService) return;
      try {
        const res = await fetch("/api/book/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId: selectedService.id,
            groomerId: checkoutSlot.groomerId,
            slotIso: checkoutSlot.iso,
          }),
        });
        const data = (await res.json()) as
          | {
              bookingId: string;
              clientSecret: string;
              amountDueCents: number;
              slotIso: string;
            }
          | { error?: string };
        if (aborted) return;
        if (!res.ok || !("bookingId" in data)) {
          setCheckoutError(
            (data as any)?.error || "Could not initialize payment."
          );
          setCheckout(null);
        } else {
          setCheckout({
            bookingId: data.bookingId,
            clientSecret: data.clientSecret,
            amountDueCents: data.amountDueCents,
            slotIso: data.slotIso,
            totals: (data as any).totals,
          });
        }
      } catch (e: any) {
        if (!aborted) {
          setCheckoutError(e?.message || "Could not initialize payment.");
          setCheckout(null);
        }
      } finally {
        if (!aborted) setCheckoutLoading(false);
      }
    }
    if (checkoutSlot) {
      prepare();
    } else {
      setCheckout(null);
      setCheckoutLoading(false);
      setCheckoutError("");
    }
    return () => {
      aborted = true;
    };
  }, [checkoutSlot, selectedService]);

  const selectedGroomerLabel =
    checkoutSlot?.groomerName ||
    (groomerId === ANY_ID
      ? "Any available groomer"
      : groomers.find((g) => g.id === groomerId)?.name || "Groomer");

  function handleMobileSelect(val: string) {
    setSelectedTimeValue(val);
    const idx = Number(val);
    if (!Number.isNaN(idx) && slots[idx]) {
      chooseSlot(slots[idx], groomerId);
    }
  }

  return (
    <div className={styles.wrapper}>
      <LayoutWrapper>
        {!checkoutSlot && (
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>1. Service</label>
              <select
                value={serviceId}
                onChange={(e) => {
                  setServiceId(e.target.value);
                  setCheckoutSlot(null);
                  setCheckout(null);
                }}
                className={styles.select}
              >
                <option value=''>Select service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.durationMin ? `• ${s.durationMin}m` : ""} • $
                    {(s.priceCents / 100).toFixed(2)}
                  </option>
                ))}
              </select>
              {selectedService && (
                <div className={styles.helpText}>
                  Duration: {duration} min · Price: ${price}
                </div>
              )}
            </div>

            <div>
              <label className={styles.label}>2. Groomer</label>
              <select
                value={groomerId}
                onChange={(e) => {
                  setGroomerId(e.target.value);
                  setCheckoutSlot(null);
                  setCheckout(null);
                }}
                className={styles.select}
              >
                <option value=''>Select groomer</option>
                <option value={ANY_ID}>Any available groomer</option>
                {groomers.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>

              {groomerId && groomerId !== ANY_ID && selectedCal && (
                <div className={styles.helpText}>
                  Select a date on:{" "}
                  {selectedCal.workDays
                    .slice()
                    .sort((a, b) => a - b)
                    .map(
                      (d) =>
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]
                    )
                    .join(", ")}
                  {selectedCal.blackoutISO.length > 0 &&
                    " (some dates unavailable)"}
                </div>
              )}
              {groomerId === ANY_ID && (
                <div className={styles.helpText}>
                  We’ll match you to the best available pro for your chosen
                  time.
                </div>
              )}
            </div>

            <div>
              <label className={styles.label}>3. Date</label>
              <CalendarPopover
                value={date}
                min={todayISO}
                isDateEnabled={isDateEnabled}
                onChange={(d) => {
                  setDate(d);
                  setCheckoutSlot(null);
                  setCheckout(null);
                }}
              />
            </div>
          </div>
        )}

        {!checkoutSlot && (
          <div className={styles.feedback}>
            {pending && (
              <p className={styles.textMuted}>Loading available times…</p>
            )}
            {!pending &&
              serviceId &&
              groomerId &&
              date &&
              slots.length === 0 &&
              !message && (
                <p className={styles.textMuted}>
                  No available times for that date.
                </p>
              )}
            {message && <p className={styles.textError}>{message}</p>}
          </div>
        )}

        {!checkoutSlot && slots.length > 0 && (
          <>
            <div className={styles.slots}>
              <h3 className={styles.label}>4. Time</h3>
              {!isMobile && (
                <div className={styles.slotData}>
                  {slots.map((s, idx) => (
                    <button
                      key={`${s.iso ?? idx}-${s.groomerId ?? ""}`}
                      onClick={() => chooseSlot(s, groomerId)}
                      disabled={!s.iso}
                      className={styles.btnSlot}
                      title={
                        s.groomerName ? `With ${s.groomerName}` : undefined
                      }
                    >
                      {displayTime(s)}
                      {s.groomerName ? ` — ${s.groomerName}` : ""}
                    </button>
                  ))}
                </div>
              )}
              {isMobile && (
                <div className={styles.timeSelectWrap}>
                  <select
                    className={`${styles.select} ${styles.timeSelect}`}
                    value={selectedTimeValue}
                    onChange={(e) => handleMobileSelect(e.target.value)}
                  >
                    <option value=''>Select a time</option>
                    {slots.map((s, idx) => (
                      <option key={`${s.iso ?? idx}`} value={String(idx)}>
                        {displayTime(s)}
                        {s.groomerName ? ` — ${s.groomerName}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className={styles.slotsHelp}>
              Times shown are in your local timezone.
            </div>
          </>
        )}

        {checkoutSlot && (
          <div className={styles.checkout}>
            {checkoutLoading && (
              <div className={styles.textMuted}>Preparing secure payment…</div>
            )}
            {checkoutError && (
              <div className={styles.textError}>{checkoutError}</div>
            )}
            {checkout && selectedService && (
              <div className={styles.checkoutInner}>
                <CheckoutStep
                  bookingId={checkout.bookingId}
                  clientSecret={checkout.clientSecret}
                  amountDueCents={checkout.amountDueCents}
                  basePriceCents={selectedService.priceCents}
                  depositCents={checkout.totals?.depositCents}
                  taxCents={checkout.totals?.taxCents}
                  feeCents={checkout.totals?.feeCents}
                  discountCents={checkout.totals?.discountCents}
                  serviceName={selectedService.name}
                  durationMin={selectedService.durationMin}
                  groomerName={selectedGroomerLabel}
                  dateLabel={new Date(checkout.slotIso).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  timeLabel={new Date(checkout.slotIso).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  onDone={(_status) => {
                    window.location.href = "/dashboard/my-bookings";
                  }}
                />
                <div className={styles.checkoutBackWrap}>
                  <button
                    type='button'
                    onClick={() => {
                      setCheckout(null);
                      setCheckoutSlot(null);
                      setCheckoutError("");
                      setCheckoutLoading(false);
                    }}
                    className={styles.btnOutline}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            {!checkoutLoading && !checkout && !checkoutError && (
              <div className={styles.textMuted}>
                Unable to initialize checkout for this time.
              </div>
            )}
          </div>
        )}
      </LayoutWrapper>
    </div>
  );
}
