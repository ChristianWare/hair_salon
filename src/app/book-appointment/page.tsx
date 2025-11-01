import BookAppointmentIntro from "@/components/BookAppointment/BookAppointmentIntro/BookAppointmentIntro";
import BookingWizard from "@/components/bookingPage/BookingWizard/BookingWizard";
import FinalCTA from "@/components/shared/FinalCTA/FinalCTA";
import Footerii from "@/components/shared/Footerii/Footerii";
import InstaFeed from "@/components/shared/InstaFeed/InstaFeed";
import { db } from "@/lib/db";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your next hair appointment at Velvet & Vine. Experience personalized service and expert care in a relaxing environment.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

const dayToIdx: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export default async function BookAppointmentPage() {
  const services = await db.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      durationMin: true,
      priceCents: true,
      active: true,
    },
  });

  const groomerRows = await db.groomer.findMany({
    where: { active: true },
    orderBy: { user: { name: "asc" } },
    select: {
      id: true,
      workingHours: true, // JSON like { Mon: [[start,end]], ... }
      user: { select: { name: true } },
      breaks: { select: { date: true } }, // blackout dates
    },
  });

  const groomers = groomerRows.map((g) => ({
    id: g.id,
    name: g.user?.name ?? "—",
  }));

  const calendars = Object.fromEntries(
    groomerRows.map((g) => {
      const wh = (g.workingHours || {}) as Record<string, [string, string][]>;
      const workDays = Object.entries(wh)
        .filter(([, slots]) => Array.isArray(slots) && slots.length > 0)
        .map(([day]) => dayToIdx[day]!)
        .filter((n) => Number.isInteger(n))
        .sort((a, b) => a - b);

      const blackoutISO = (g.breaks || []).map((b) => ymd(b.date));

      return [g.id, { workDays, blackoutISO }];
    })
  );

  return (
    <main>
      <BookAppointmentIntro />
      <BookingWizard
        services={services}
        groomers={groomers}
        calendars={calendars}
      />{" "}
      <FinalCTA />
      <InstaFeed />
      <Footerii />
    </main>
  );
}
