/* ──────────────────────────────────────────────
   Body clock + jet lag tips (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { BodyClockEntry, JetLagTip } from "@/lib/types";

export const BODY_CLOCK: BodyClockEntry[] = [
  { time: "10:45 AM CDT", body: "4:45 PM Berlin", note: "Late afternoon energy — you'll feel fine. Grab a coffee at BHM.", icon: "☕" },
  { time: "12:46 PM EDT", body: "6:46 PM Berlin", note: "Early evening feeling. Eat a real meal in ATL — your body will thank you later.", icon: "🍽️" },
  { time: "3:25 PM EDT", body: "9:25 PM Berlin", note: "Your body thinks it's bedtime. Try to sleep on this flight!", icon: "😴" },
  { time: "6:10 AM CEST", body: "12:10 AM home", note: "Midnight back home. You'll be tired — this is normal. Stay awake!", icon: "🌙" },
  { time: "8:55 AM CEST", body: "1:55 AM home", note: "Deep night at home. Push through — sunlight & walking will help.", icon: "🌅" },
];

export const JET_LAG: JetLagTip[] = [
  { day: "Day 1–2", tip: "Expect to wake at 3–4 AM. Get morning sun. No naps over 20 min. Enjoy the quiet early mornings together." },
  { day: "Day 3–4", tip: "Push dinner to 7 PM local. Evening walks help. You'll start feeling normal." },
  { day: "Day 5+", tip: "Fully adjusted! Enjoy Berlin on local time. You've got this." },
  { day: "Return", tip: "Coming west is easier. You'll want to stay up late. Set an alarm, morning light, eat on home time." },
];
