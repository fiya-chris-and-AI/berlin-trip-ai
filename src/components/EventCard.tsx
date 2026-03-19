/* ── Color-coded event card ── */

import { C } from "@/lib/colors";
import { eventColors } from "@/lib/colors";
import Card from "./Card";
import type { CalendarEvent } from "@/lib/types";

interface EventCardProps {
  event: CalendarEvent;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const ec = eventColors[event.type] ?? eventColors.tip;

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
      <Card
        style={{
          borderLeft: `3px solid ${ec.dot}`,
          background: ec.bg,
          borderColor: ec.bd,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span
            className="font-code"
            style={{
              minWidth: 80,
              fontSize: 10,
              fontWeight: 600,
              color: ec.dot,
              paddingTop: 2,
            }}
          >
            {event.t}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>
              {event.title}
            </div>
            <div style={{ fontSize: 11, color: C.med, marginTop: 1, lineHeight: 1.4 }}>
              {event.sub}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
