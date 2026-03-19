/* ──────────────────────────────────────────────
   useTripContext — computes current trip phase, day, next event
   Used to inject context into every Claude message
   ────────────────────────────────────────────── */

"use client";

import { useMemo } from "react";
import { CALENDAR, TRIP_DAYS } from "@/data/calendar";
import { CHECKLIST } from "@/data/checklist";
import { useStore } from "@/store/useStore";
import {
  berlinTime,
  birminghamTime,
  currentTripDay,
  daysUntilTrip,
} from "@/lib/utils";
import type { CalendarEvent, TripDay } from "@/lib/types";

export interface TripContext {
  current_time_berlin: string;
  current_time_home: string;
  trip_day: number | null;
  trip_day_label: string;
  next_event: { time: string; title: string; sub: string } | null;
  weather: { temp: string; condition: string };
  user: string;
  checklist_progress: string;
  days_until_trip: number;
}

/** Find the next upcoming event (naive: first event of the current or next trip day) */
function findNextEvent(now: Date): { time: string; title: string; sub: string } | null {
  const tripDay = currentTripDay(now);

  if (tripDay) {
    const dayEvents = CALENDAR[tripDay]?.events ?? [];
    // Return the first event of this day as a simple heuristic
    if (dayEvents.length > 0) {
      const ev = dayEvents[0];
      return { time: ev.t, title: ev.title, sub: ev.sub };
    }
  }

  // Pre-trip: return first event of the trip
  const daysLeft = daysUntilTrip(now);
  if (daysLeft > 0) {
    const firstDay = CALENDAR[19];
    if (firstDay.events.length > 0) {
      const ev = firstDay.events[0];
      return { time: ev.t, title: ev.title, sub: ev.sub };
    }
  }

  return null;
}

export function useTripContext(): TripContext {
  const checkedItems = useStore((s) => s.checkedItems);
  const user = useStore((s) => s.user);

  return useMemo(() => {
    const now = new Date();
    const tripDay = currentTripDay(now);
    const totalItems = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;

    return {
      current_time_berlin: berlinTime(now),
      current_time_home: birminghamTime(now),
      trip_day: tripDay ? tripDay - 18 : null, // 1-indexed trip day
      trip_day_label: tripDay ? CALENDAR[tripDay]?.label ?? "" : "",
      next_event: findNextEvent(now),
      weather: { temp: "18°C", condition: "Partly cloudy" }, // Placeholder until weather API
      user: user ?? "fiya",
      checklist_progress: `${checkedCount}/${totalItems}`,
      days_until_trip: daysUntilTrip(now),
    };
  }, [checkedItems, user]);
}
