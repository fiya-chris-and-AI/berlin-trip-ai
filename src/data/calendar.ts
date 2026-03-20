/* ──────────────────────────────────────────────
   Calendar events, May 19–27 (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { CalendarDay, TripDay } from "@/lib/types";

export const CALENDAR: Record<TripDay, CalendarDay> = {
  19: {
    label: "Travel Day", emoji: "✈️",
    events: [
      { t: "10:45 AM CDT", title: "Depart Birmingham", sub: "DL3164 · Seat 21C · BHM → ATL", type: "flight" },
      { t: "12:46 PM EDT", title: "Arrive Atlanta — Layover 2h 39m", sub: "Change to International Terminal", type: "layover" },
      { t: "3:25 PM EDT", title: "Depart Atlanta (overnight)", sub: "DL0082 · ATL → CDG · Try to sleep!", type: "flight" },
    ],
  },
  20: {
    label: "Arrival Day", emoji: "🇩🇪",
    events: [
      { t: "6:10 AM", title: "Arrive Paris CDG — Layover 1h", sub: "Change Terminal E → F", type: "layover" },
      { t: "7:10 AM", title: "Depart Paris (Air France DL8419)", sub: "CDG → BER · Almost there!", type: "flight" },
      { t: "8:55 AM", title: "Land in Berlin!", sub: "BER Terminal 1 · Chris will be there", type: "arrive" },
      { t: "Morning", title: "Early check-in (Chris pre-arranged)", sub: "Room booked from night before so you can go straight in", type: "love" },
      { t: "Afternoon", title: "Rest & settle in together", sub: "Your body thinks it's 2 AM. Take it slow, enjoy the moment.", type: "love" },
    ],
  },
  21: {
    label: "Day with Chris", emoji: "💕",
    events: [
      { t: "Morning", title: "Sleep in — jet lag recovery", sub: "You'll likely wake early (3-4 AM body clock). Embrace the quiet morning together.", type: "love" },
      { t: "Daytime", title: "Explore Berlin together", sub: "First full day — no agenda, just be together. See Explore tab for ideas!", type: "love" },
      { t: "Evening", title: "Dinner for two", sub: "Berlin has incredible restaurants. See Berlin Info for picks.", type: "love" },
    ],
  },
  22: {
    label: "Skool Day 1", emoji: "🧠",
    events: [
      { t: "Morning", title: "Early AI-dopters Meetup — Day 1", sub: "betahaus Berlin · Rudi-Dutschke-Str. 23, 10969 Berlin", type: "event" },
      { t: "All Day", title: "Core Day with the community", sub: "Mark Kashef, Taha El-Harti, Ty (Brazil Nut AI), + European members", type: "event" },
      { t: "Tip", title: "Brazil Nut AI hackathon winners!", sub: "You, Chris & Ty — celebrate the win with the crew", type: "tip" },
    ],
  },
  23: {
    label: "Skool Day 2", emoji: "🧠",
    events: [
      { t: "Morning", title: "Early AI-dopters Meetup — Day 2", sub: "betahaus Berlin · Rudi-Dutschke-Str. 23, 10969 Berlin", type: "event" },
      { t: "All Day", title: "Core Day 2", sub: "N8N is also Berlin-based — possible crossover connections", type: "event" },
      { t: "Evening", title: "Community dinner / after-event hangout", sub: "Great chance to bond with the European community members", type: "event" },
    ],
  },
  24: {
    label: "Vibes Day", emoji: "🎉",
    events: [
      { t: "All Day", title: "Vibes Day (per Mark)", sub: "Casual community hangout — no formal agenda", type: "event" },
      { t: "Tip", title: "ScienceExperts.ai collab time?", sub: "Great day to work on the platform with Chris between community hangs", type: "tip" },
    ],
  },
  25: {
    label: "Day with Chris", emoji: "💕",
    events: [
      { t: "All Day", title: "Free day — explore together", sub: "You're fully adjusted to Berlin time by now. Make the most of it!", type: "love" },
      { t: "Idea", title: "Day trip or deeper Berlin exploration", sub: "Potsdam is 30 min by S-Bahn, or go deeper into Berlin neighborhoods", type: "tip" },
    ],
  },
  26: {
    label: "Last Full Day", emoji: "🌆",
    events: [
      { t: "Morning", title: "Last morning in Berlin", sub: "Soak it in.", type: "love" },
      { t: "Daytime", title: "Final explorations & souvenir shopping", sub: "Pack throughout the day so tonight is stress-free", type: "tip" },
      { t: "Evening", title: "Last dinner together", sub: "Make it special.", type: "love" },
      { t: "Night", title: "Pack for tomorrow's departure", sub: "Flight is at 12:10 PM — you'll need to leave for BER by ~9 AM", type: "tip" },
    ],
  },
  27: {
    label: "Return Home", emoji: "🏠",
    events: [
      { t: "~9 AM", title: "Head to BER Airport", sub: "Terminal 1 · Allow 2+ hours for international check-in", type: "tip" },
      { t: "12:10 PM", title: "Depart Berlin (KLM DL9462)", sub: "BER → AMS · 1h layover in Amsterdam", type: "flight" },
      { t: "2:30 PM", title: "Depart Amsterdam (DL0137)", sub: "AMS → DTW · The long leg home", type: "flight" },
      { t: "4:56 PM EDT", title: "Arrive Detroit — Layover 2h 54m", sub: "McNamara Terminal", type: "layover" },
      { t: "7:50 PM EDT", title: "Depart Detroit (DL3145)", sub: "DTW → BHM · Last leg!", type: "flight" },
      { t: "8:45 PM CDT", title: "Home in Birmingham", sub: "Body thinks it's 3:45 AM Berlin time. Straight to bed!", type: "arrive" },
    ],
  },
};

/** Ordered list of trip days for iteration */
export const TRIP_DAYS: TripDay[] = [19, 20, 21, 22, 23, 24, 25, 26, 27];
