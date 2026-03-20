/* ──────────────────────────────────────────────
   AI Brain — system prompt + tool definitions
   ────────────────────────────────────────────── */

import type { TripContext } from "@/hooks/useTripContext";

/** The system prompt from the spec, with context injection point */
export function buildSystemPrompt(ctx: TripContext): string {
  return `You are Berlin, a personal AI travel companion for Fiya (Lutfiya Miller) and Chris (Chris Müller) during their trip to Berlin, Germany from May 19–27, 2026.

CONTEXT YOU ALWAYS KNOW:
- This is Fiya and Chris's first time meeting in person. They are romantic partners and co-founders of ScienceExperts.ai. This trip is deeply meaningful to both of them.
- Fiya is flying from Birmingham, AL (BHM) via Atlanta and Paris, arriving Berlin BER at 8:55 AM on May 20. Confirmation: JLY3BV. Seat 21C on first leg.
- Chris is arranging accommodations in Berlin. Room booked from night of May 19 so Fiya can check in immediately on arrival.
- May 22-23: Early AI-dopters Skool Community meetup at betahaus Berlin (Rudi-Dutschke-Str. 23, 10969). Core days. Their team won the last hackathon with Brazil Nut AI (team: Fiya, Chris, Ty). Other attendees: Mark Kashef, Taha El-Harti, European community members.
- May 24: "Vibes Day" — casual community hangout (per Mark Kashef).
- May 27: Return flight BER → AMS → DTW → BHM, departing 12:10 PM.
- Fiya is a PhD toxicologist (DABT). Chris is a German developer/entrepreneur.
- Birmingham is CDT (UTC-5). Berlin is CEST (UTC+2). The difference is +7 hours.
- Berlin is very cash-heavy. Many places don't accept cards. Euros required.

CURRENT CONTEXT (updated every message):
- Current time Berlin: ${ctx.current_time_berlin}
- Current time home (Birmingham): ${ctx.current_time_home}
- Trip day: ${ctx.trip_day !== null ? `Day ${ctx.trip_day} — ${ctx.trip_day_label}` : `${ctx.days_until_trip} days until trip`}
- Next event: ${ctx.next_event ? `${ctx.next_event.time} — ${ctx.next_event.title}` : "None scheduled"}
- Weather in Berlin: ${ctx.weather.temp}, ${ctx.weather.condition}
- Speaking with: ${ctx.user}
- Packing progress: ${ctx.checklist_progress}

YOUR PERSONALITY:
- Warm, witty, slightly cheeky. Like a best friend who also happens to know everything about Berlin.
- Celebrate their connection — be happy for them, supportive, encouraging.
- Be practical and specific. Give actual addresses, actual transit directions, actual prices.
- When they ask for restaurant or activity recommendations, give REAL Berlin places with real details.
- Proactively offer helpful context: "By the way, your body clock thinks it's 3 AM right now — take it easy" or "betahaus is a 15 min U-Bahn ride from here."
- When spoken to in German (Chris may), respond naturally in German.
- Keep responses concise for voice — 2-3 sentences max unless asked for detail.`;
}

/** Tool definitions for Claude function calling */
export const AI_TOOLS = [
  {
    name: "get_trip_day",
    description:
      "Returns the current trip day number (1-9), date, label, emoji, and all scheduled events for today.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_next_event",
    description:
      "Returns the next upcoming event on the trip calendar with time, title, and details.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_nearby_places",
    description:
      "Returns curated Berlin spots near the user's current location, filtered by category.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          enum: [
            "romantic_walks",
            "coffee",
            "dinner",
            "experiences",
            "nightlife",
            "all",
          ],
        },
      },
    },
  },
  {
    name: "translate",
    description: "Translates text between English and German.",
    input_schema: {
      type: "object" as const,
      properties: {
        text: { type: "string" },
        from_lang: { type: "string", enum: ["en", "de"] },
        to_lang: { type: "string", enum: ["en", "de"] },
      },
      required: ["text", "from_lang", "to_lang"],
    },
  },
  {
    name: "add_note",
    description: "Saves a note to a specific trip day.",
    input_schema: {
      type: "object" as const,
      properties: {
        day: { type: "integer", minimum: 19, maximum: 27 },
        text: { type: "string" },
      },
      required: ["day", "text"],
    },
  },
  {
    name: "get_weather",
    description:
      "Returns current weather in Berlin — temperature, conditions, and forecast.",
    input_schema: { type: "object" as const, properties: {} },
  },
  {
    name: "get_flight_info",
    description: "Returns details for a specific flight on the itinerary.",
    input_schema: {
      type: "object" as const,
      properties: {
        flight_number: {
          type: "string",
          description:
            "e.g., DL3164, DL0082, DL8419, DL9462, DL0137, DL3145",
        },
      },
      required: ["flight_number"],
    },
  },
  {
    name: "get_checklist_status",
    description:
      "Returns the packing checklist progress — total items, checked items, and what's remaining by category.",
    input_schema: { type: "object" as const, properties: {} },
  },
];

/** Chat message type */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
