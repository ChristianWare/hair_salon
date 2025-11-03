import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { db } from "@/lib/db"; 

export const dynamic = "force-dynamic";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function ymd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "YYYY-MM"
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ dates: [] });
  }

  const [year, mo] = month.split("-").map(Number);
  const from = startOfMonth(new Date(year, mo - 1, 1));
  const to = endOfMonth(new Date(year, mo - 1, 1));

  const blackoutDates = await db.blackoutDate.findMany({
    where: { date: { gte: from, lte: to } },
    orderBy: { date: "asc" },
    select: { date: true },
  });

  const dates = blackoutDates.map((b) => ymd(new Date(b.date)));
  return NextResponse.json({ dates });
}
