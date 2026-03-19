/* ──────────────────────────────────────────────
   Shared TypeScript types for the Berlin Companion
   ────────────────────────────────────────────── */

// ── Flights ──

export interface Airport {
  code: string;
  city: string;
  terminal: string;
  tz: string;
}

export interface Flight {
  id: string;
  aircraft: string;
  operator: string;
  from: Airport;
  to: Airport;
  depart: string;
  departDate: string;
  arrive: string;
  arriveDate: string;
  seat: string;
  fare: string;
  layoverAfter: string | null;
  overnight?: boolean;
}

// ── Calendar ──

export type EventType = "flight" | "layover" | "arrive" | "event" | "love" | "tip";

export interface CalendarEvent {
  t: string;       // time label (e.g. "10:45 AM CDT", "Morning", "Tip")
  title: string;
  sub: string;
  type: EventType;
}

export interface CalendarDay {
  label: string;
  emoji: string;
  events: CalendarEvent[];
}

// ── Explore ──

export interface Spot {
  name: string;
  vibe: string;
  area: string;
}

export interface ExploreCategory {
  cat: string;
  spots: Spot[];
}

// ── Checklist ──

export interface ChecklistCategory {
  cat: string;
  items: string[];
}

// ── Body Clock / Jet Lag ──

export interface BodyClockEntry {
  time: string;
  body: string;
  note: string;
  icon: string;
}

export interface JetLagTip {
  day: string;
  tip: string;
}

// ── Berlin Info ──

export interface InfoItem {
  l: string;  // label
  d: string;  // description
}

export interface InfoSection {
  cat: string;
  items: InfoItem[];
}

// ── Quick Reference ──

export interface QuickRef {
  l: string;  // label
  v: string;  // value
  s: string;  // subtitle
}

// ── Event Color Mapping ──

export interface EventColorSet {
  bg: string;
  bd: string;    // border
  dot: string;   // accent dot / left-border color
}

// ── Trip Day Numbers ──

/** May 19–27 encoded as day-of-month */
export type TripDay = 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27;
