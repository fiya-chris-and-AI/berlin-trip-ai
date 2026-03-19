/* ── Horizontal day selector strip (May 19–27) ── */

"use client";

import { C } from "@/lib/colors";
import { CALENDAR, TRIP_DAYS } from "@/data/calendar";
import { DAY_NAMES } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import type { TripDay } from "@/lib/types";

interface DaySelectorProps {
  /** Optional: show a badge on days with content (used by Notes) */
  hasBadge?: (day: TripDay) => boolean;
}

export default function DaySelector({ hasBadge }: DaySelectorProps) {
  const selectedDay = useStore((s) => s.selectedDay);
  const setSelectedDay = useStore((s) => s.setSelectedDay);

  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
      {TRIP_DAYS.map((day) => {
        const info = CALENDAR[day];
        const sel = selectedDay === day;

        // Color the day dot based on type
        const isEvent = [22, 23, 24].includes(day);
        const isFlight = [19, 27].includes(day);
        const isLove = [20, 21, 25, 26].includes(day);
        let dotColor: string = C.light;
        if (isEvent) dotColor = C.blue;
        if (isFlight) dotColor = C.red;
        if (isLove) dotColor = C.pink;
        if (day === 20) dotColor = C.green;

        const showBadge = hasBadge?.(day) && !sel;

        return (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              flex: "0 0 auto",
              width: 68,
              padding: "8px 0",
              background: sel ? C.red : C.white,
              border: `1.5px solid ${sel ? C.red : C.borderLight}`,
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span
              className="font-code"
              style={{
                fontSize: 8,
                letterSpacing: 1,
                color: sel ? "rgba(255,255,255,0.65)" : C.light,
              }}
            >
              {DAY_NAMES[day]}
            </span>
            <span
              className="font-display"
              style={{ fontSize: 20, color: sel ? C.white : C.black }}
            >
              {day}
            </span>
            <span
              style={{
                fontSize: 7,
                fontWeight: 600,
                letterSpacing: 0.5,
                color: sel ? "rgba(255,255,255,0.8)" : dotColor,
              }}
            >
              {info.emoji} {info.label}
              {showBadge && (
                <span style={{ color: C.red, marginLeft: 2 }}>*</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
