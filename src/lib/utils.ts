/* ──────────────────────────────────────────────
   Time, countdown, and trip-day utilities
   ────────────────────────────────────────────── */

import type { TripDay } from "./types";
import { CALENDAR } from "@/data/calendar";

// ── Timezone formatting ──

/** Format a Date in a given IANA timezone as "h:mm AM" */
export function formatTime(date: Date, tz: string): string {
  return date.toLocaleString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function berlinTime(date: Date = new Date()): string {
  return formatTime(date, "Europe/Berlin");
}

export function birminghamTime(date: Date = new Date()): string {
  return formatTime(date, "America/Chicago");
}

// ── Countdown / trip day ──

const TRIP_START = new Date("2026-05-19T00:00:00-05:00"); // CDT
const TRIP_END   = new Date("2026-05-27T23:59:59+02:00"); // CEST

/** Days until trip starts (negative = trip has started) */
export function daysUntilTrip(now: Date = new Date()): number {
  return Math.ceil((TRIP_START.getTime() - now.getTime()) / 86_400_000);
}

/** Current trip day (19–27) or null if outside trip dates */
export function currentTripDay(now: Date = new Date()): TripDay | null {
  const berlinDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  );
  const dayOfMonth = berlinDate.getDate();
  const month = berlinDate.getMonth(); // 0-indexed, May = 4

  if (month === 4 && dayOfMonth >= 19 && dayOfMonth <= 27) {
    return dayOfMonth as TripDay;
  }
  return null;
}

/** Human-readable trip status */
export function tripStatus(now: Date = new Date()): string {
  const d = daysUntilTrip(now);
  if (d > 1)  return `${d} days until Berlin`;
  if (d === 1) return "Tomorrow!";
  if (d === 0) return "Today is the day!";

  const tripDay = currentTripDay(now);
  if (tripDay) {
    const info = CALENDAR[tripDay];
    return `Day ${tripDay - 18} in Berlin — ${info?.label ?? ""}`;
  }
  return "Trip complete ✈️";
}

// ── Time-of-day greeting ──

export function greeting(name: string, now: Date = new Date()): string {
  const hour = Number(
    now.toLocaleString("en-US", {
      timeZone: "Europe/Berlin",
      hour: "numeric",
      hour12: false,
    })
  );

  let tod = "Good evening";
  if (hour < 12) tod = "Good morning";
  else if (hour < 17) tod = "Good afternoon";

  return `${tod}, ${name}`;
}

// ── Day name lookup ──

export const DAY_NAMES: Record<TripDay, string> = {
  19: "Mon", 20: "Tue", 21: "Wed", 22: "Thu",
  23: "Fri", 24: "Sat", 25: "Sun", 26: "Mon", 27: "Tue",
};
