/* ──────────────────────────────────────────────
   Berlin info accordion + quick reference (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { InfoSection, QuickRef } from "@/lib/types";

export const BERLIN_INFO: InfoSection[] = [
  {
    cat: "Getting Around",
    items: [
      { l: "BVG Day Pass", d: "€8.80/day covers all U-Bahn, S-Bahn, buses, trams in zones AB" },
      { l: "Berlin WelcomeCard", d: "Transit + museum discounts — great for tourists" },
      { l: "Uber / Bolt / Freenow", d: "All work well in Berlin as backup" },
      { l: "betahaus Berlin", d: "Rudi-Dutschke-Str. 23, 10969 — Kreuzberg. U6 to Kochstraße is closest." },
    ],
  },
  {
    cat: "Money (CASH IS KING!)",
    items: [
      { l: "Bring Euros in cash!", d: "Many Berlin restaurants, bars & shops are cash only. This is not a joke." },
      { l: "ATMs (Geldautomat)", d: "Withdraw at bank ATMs (Sparkasse, Deutsche Bank). Avoid random ones — high fees." },
      { l: "Tipping", d: "Round up or 5–10%. Say the total you want to pay when handing cash." },
      { l: "Cards", d: "Visa/Mastercard work at some places. Many only take EC (German debit) or cash." },
    ],
  },
  {
    cat: "Useful German",
    items: [
      { l: "Hallo / Tschüss", d: "Hello / Bye" },
      { l: "Sprechen Sie Englisch?", d: "Do you speak English? (Most Berliners do)" },
      { l: "Die Rechnung, bitte", d: "The check, please" },
      { l: "Ein Bier / Wein, bitte", d: "One beer / wine, please" },
      { l: "Danke / Bitte", d: "Thank you / Please (or You're welcome)" },
      { l: "Wo ist...?", d: "Where is...?" },
      { l: "Ich liebe dich", d: "I love you" },
    ],
  },
  {
    cat: "Emergency & Health",
    items: [
      { l: "EU Emergency", d: "112 (police, fire, ambulance)" },
      { l: "US Embassy Berlin", d: "Clayallee 170, 14191 Berlin · +49 30 8305-0" },
      { l: "Apotheke (Pharmacy)", d: "Green cross sign. Many open late. Basic meds available OTC." },
    ],
  },
  {
    cat: "Weather (Late May)",
    items: [
      { l: "Temperature", d: "55–72°F (13–22°C). Warm days, cool evenings." },
      { l: "Rain", d: "Possible showers. Bring a light rain jacket." },
      { l: "Daylight", d: "Sunrise ~5 AM, sunset ~9 PM. Long beautiful evenings!" },
    ],
  },
];

export const QUICK_REFERENCE: QuickRef[] = [
  { l: "Time Diff", v: "+7 hours", s: "CEST vs CDT" },
  { l: "Currency", v: "Euro (EUR)", s: "BRING CASH!" },
  { l: "Language", v: "German", s: "Most speak English" },
  { l: "Plugs", v: "Type C/F · 230V", s: "Bring EU adapter" },
  { l: "Emergency", v: "112", s: "EU-wide" },
  { l: "Transit", v: "BVG", s: "€8.80 day pass" },
];
