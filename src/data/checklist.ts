/* ──────────────────────────────────────────────
   Packing checklist (canonical source: berlin-dashboard.jsx)
   ────────────────────────────────────────────── */

import type { ChecklistCategory } from "@/lib/types";

export const CHECKLIST: ChecklistCategory[] = [
  {
    cat: "Documents & Tech",
    items: [
      "Passport (valid through Nov 2026+)",
      "Delta app with boarding passes",
      "Travel insurance docs",
      "Hotel/accommodation confirmation",
      "Copy of itinerary (this dashboard!)",
      "Phone + charger",
      "EU power adapter (Type C/F)",
      "Portable battery pack",
      "AirPods",
      "Laptop + charger",
    ],
  },
  {
    cat: "Clothing (May Berlin = 55-70°F)",
    items: [
      "Layers — mornings are cool, afternoons warm",
      "Comfortable walking shoes (you'll walk MILES)",
      "Rain jacket (May showers are common)",
      "1-2 nice outfits for dinners & the event",
      "Something cute for the meetup days",
      "Sleepwear",
      "Undergarments (8 days)",
      "Swimsuit (Badeschiff!)",
    ],
  },
  {
    cat: "For the Event (May 22-23)",
    items: [
      "Business cards (if you have them)",
      "Laptop for hackathon/demos",
      "ScienceExperts.ai pitch notes",
      "Brazil Nut AI demo-ready",
      "Notebook & pen",
      "Chargers for all-day use",
    ],
  },
  {
    cat: "Comfort & Wellness",
    items: [
      "Neck pillow for the long flights",
      "Eye mask + ear plugs",
      "Compression socks for the flights",
      "Reusable water bottle (refill at airport after security)",
      "Melatonin (for jet lag adjustment)",
      "Snacks for flights & layovers",
      "Medications/vitamins",
      "Sunscreen (May sun is strong!)",
    ],
  },
  {
    cat: "Toiletries",
    items: [
      "TSA-size liquids bag",
      "Toothbrush + toothpaste",
      "Deodorant",
      "Skincare essentials",
      "Hair products/tools",
      "Makeup bag",
      "Perfume (travel size)",
    ],
  },
  {
    cat: "Berlin Essentials",
    items: [
      "Cash — EUROS! Berlin is very cash-heavy!",
      "Download BVG transit app before you go",
      "Download offline Berlin map in Google Maps",
      "Google Translate app (camera mode for menus)",
      "Comfortable day bag/backpack for exploring",
    ],
  },
  {
    cat: "Fun Extras",
    items: [
      "Camera for capturing memories together",
      "A little gift / surprise for Chris",
      "Journal for trip memories & notes",
      "Portable speaker (for the room)",
    ],
  },
];

/** Total item count (pre-computed for convenience) */
export const TOTAL_ITEMS = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
