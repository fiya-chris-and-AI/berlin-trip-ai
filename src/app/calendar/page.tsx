/* ── Calendar page — day-by-day view, body clock, jet lag ── */

"use client";

import { C } from "@/lib/colors";
import { CALENDAR } from "@/data/calendar";
import { BODY_CLOCK, JET_LAG } from "@/data/body-clock";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";
import DaySelector from "@/components/DaySelector";
import EventCard from "@/components/EventCard";
import Card from "@/components/Card";

export default function CalendarPage() {
  const selectedDay = useStore((s) => s.selectedDay);
  const dayInfo = CALENDAR[selectedDay];

  return (
    <div>
      <Section title="Your Trip, Day by Day" sub="Tap a day to see what's happening">
        <DaySelector />

        {/* Day header */}
        <div
          className="animate-fade-up"
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
        >
          <span style={{ fontSize: 28 }}>{dayInfo?.emoji}</span>
          <div>
            <span className="font-display" style={{ fontSize: 20 }}>
              May {selectedDay}
            </span>
            <span style={{ fontSize: 12, color: C.light, marginLeft: 8 }}>
              {dayInfo?.label}
            </span>
          </div>
        </div>

        {/* Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {dayInfo?.events.map((ev, i) => (
            <EventCard key={i} event={ev} index={i} />
          ))}
        </div>
      </Section>

      {/* Body Clock */}
      <Section title="Body Clock (Outbound)" sub="Birmingham is 7 hours behind Berlin" delay={0.5}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 6,
          }}
        >
          {BODY_CLOCK.map((bc, i) => (
            <Card key={i} style={{ borderLeft: `3px solid ${C.red}`, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{bc.icon}</span>
              <div>
                <span className="font-code" style={{ fontSize: 9, color: C.red, fontWeight: 600 }}>
                  {bc.time}{" "}
                  <span style={{ color: C.light, fontWeight: 400 }}>· body: {bc.body}</span>
                </span>
                <div style={{ fontSize: 11, color: C.med, marginTop: 2, lineHeight: 1.4 }}>
                  {bc.note}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Jet Lag Plan */}
      <Section title="Jet Lag Plan" delay={1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 6,
          }}
        >
          {JET_LAG.map((t, i) => (
            <Card key={i} style={{ borderTop: `3px solid ${C.red}` }}>
              <span className="font-code" style={{ fontSize: 9, color: C.red, fontWeight: 700, letterSpacing: 1 }}>
                {t.day}
              </span>
              <div style={{ fontSize: 11, color: C.med, marginTop: 4, lineHeight: 1.5 }}>
                {t.tip}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
