/* ── Notes — per-day notepad with scheduled events below ── */

"use client";

import { C } from "@/lib/colors";
import { CALENDAR } from "@/data/calendar";
import { eventColors } from "@/lib/colors";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";
import Card from "@/components/Card";
import DaySelector from "@/components/DaySelector";
import type { TripDay } from "@/lib/types";

export default function NotesPage() {
  const selectedDay = useStore((s) => s.selectedDay);
  const notes = useStore((s) => s.notes);
  const setNote = useStore((s) => s.setNote);
  const dayInfo = CALENDAR[selectedDay];

  return (
    <div>
      <Section
        title="Trip Notes"
        sub="Plans, restaurant picks, reminders — anything you want to remember"
      >
        <DaySelector
          hasBadge={(day: TripDay) => (notes[day]?.trim().length ?? 0) > 0}
        />

        {/* Note card */}
        <Card style={{ padding: 0 }}>
          <div
            style={{
              padding: "10px 14px",
              borderBottom: `1px solid ${C.borderLight}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="font-display" style={{ fontSize: 16 }}>
              May {selectedDay} — {dayInfo?.label}
            </span>
            <span style={{ fontSize: 18 }}>{dayInfo?.emoji}</span>
          </div>
          <textarea
            value={notes[selectedDay] || ""}
            onChange={(e) => setNote(selectedDay, e.target.value)}
            placeholder={`What's the plan for May ${selectedDay}? Ideas, restaurants, things to remember...`}
            style={{
              width: "100%",
              minHeight: 180,
              padding: 14,
              border: "none",
              outline: "none",
              resize: "vertical",
              fontSize: 13,
              lineHeight: 1.6,
              color: C.black,
              background: "transparent",
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          />
        </Card>

        {/* Scheduled events for this day */}
        {dayInfo?.events.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <span
              className="font-code"
              style={{ fontSize: 8, letterSpacing: 1.5, color: C.light }}
            >
              SCHEDULED THIS DAY
            </span>
            {dayInfo.events.map((ev, i) => {
              const ec = eventColors[ev.type] ?? eventColors.tip;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 0",
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: ec.dot,
                    }}
                  />
                  <span style={{ fontSize: 11, color: C.dark }}>
                    <strong>{ev.t}</strong> — {ev.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
