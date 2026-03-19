/* ──────────────────────────────────────────────
   ScienceExperts.ai brand palette + event colors
   ────────────────────────────────────────────── */

import type { EventColorSet, EventType } from "./types";

export const C = {
  // Brand reds
  red:        "#C8102E",
  redLight:   "#E8354A",
  redDark:    "#9B0C23",
  redSoft:    "rgba(200,16,46,0.06)",
  redBorder:  "rgba(200,16,46,0.14)",

  // Neutrals
  black:      "#1A1A1A",
  dark:       "#3A3A3A",
  med:        "#6B6B6B",
  light:      "#9E9E9E",
  border:     "#E5E5E5",
  borderLight:"#F0F0F0",
  bg:         "#FAFAFA",
  white:      "#FFFFFF",

  // Semantic
  green:      "#16A34A",
  greenSoft:  "rgba(22,163,74,0.08)",
  greenBorder:"rgba(22,163,74,0.18)",

  blue:       "#2563EB",
  blueSoft:   "rgba(37,99,235,0.06)",
  blueBorder: "rgba(37,99,235,0.14)",

  amber:      "#D97706",
  amberSoft:  "rgba(217,119,6,0.06)",
  amberBorder:"rgba(217,119,6,0.14)",

  pink:       "#DB2777",
  pinkSoft:   "rgba(219,39,119,0.06)",
  pinkBorder: "rgba(219,39,119,0.14)",
} as const;

/** Color set per event type — bg, border, accent dot */
export const eventColors: Record<EventType, EventColorSet> = {
  flight:  { bg: C.redSoft,    bd: C.redBorder,    dot: C.red   },
  layover: { bg: C.amberSoft,  bd: C.amberBorder,  dot: C.amber },
  arrive:  { bg: C.greenSoft,  bd: C.greenBorder,  dot: C.green },
  event:   { bg: C.blueSoft,   bd: C.blueBorder,   dot: C.blue  },
  love:    { bg: C.pinkSoft,   bd: C.pinkBorder,   dot: C.pink  },
  tip:     { bg: C.bg,         bd: C.border,        dot: C.light },
};
