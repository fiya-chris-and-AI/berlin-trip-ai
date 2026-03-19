/* ──────────────────────────────────────────────
   POST /api/chat — Server-side Claude API proxy
   Keeps ANTHROPIC_API_KEY server-side
   ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { AI_TOOLS } from "@/services/ai";
import { CALENDAR, TRIP_DAYS } from "@/data/calendar";
import { FLIGHTS_OUT, FLIGHTS_RETURN } from "@/data/flights";
import { EXPLORE } from "@/data/explore";
import { CHECKLIST } from "@/data/checklist";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 1024;

/** Handle tool calls from Claude and return results */
function executeTool(name: string, input: Record<string, unknown>): unknown {
  switch (name) {
    case "get_trip_day": {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const tripDay = month === 5 && day >= 19 && day <= 27 ? day : null;
      if (tripDay && CALENDAR[tripDay as keyof typeof CALENDAR]) {
        const info = CALENDAR[tripDay as keyof typeof CALENDAR];
        return {
          day: tripDay - 18,
          date: `May ${tripDay}`,
          label: info.label,
          emoji: info.emoji,
          events: info.events.map((e) => ({
            time: e.t,
            title: e.title,
            subtitle: e.sub,
          })),
        };
      }
      return { message: "Trip hasn't started yet or has ended." };
    }

    case "get_next_event": {
      // Return first event of Day 1 (or current day) as a stub
      const firstDay = CALENDAR[19];
      const ev = firstDay.events[0];
      return ev
        ? { time: ev.t, title: ev.title, subtitle: ev.sub }
        : { message: "No upcoming events." };
    }

    case "get_nearby_places": {
      const category = input.category as string;
      if (category === "all") {
        return EXPLORE.map((cat) => ({
          category: cat.cat,
          spots: cat.spots,
        }));
      }
      const catMap: Record<string, string> = {
        romantic_walks: "Romantic Walks",
        coffee: "Coffee & Cafés",
        dinner: "Date Night Dinners",
        experiences: "Experience Together",
        nightlife: "Berlin After Dark",
      };
      const label = catMap[category] ?? category;
      const found = EXPLORE.find((c) => c.cat === label);
      return found ? found.spots : { message: `No spots found for "${category}"` };
    }

    case "translate":
      // Claude can handle translation inline — this is a stub
      return {
        translation: `[Translation handled by Claude: "${input.text}" from ${input.from_lang} to ${input.to_lang}]`,
      };

    case "add_note":
      return {
        success: true,
        message: `Note saved to Day ${input.day}: "${input.text}"`,
      };

    case "get_weather":
      return {
        temperature: "18°C",
        condition: "Partly cloudy",
        forecast: "Tomorrow: 20°C and sunny. Perfect for exploring!",
        note: "Placeholder — connect to OpenWeatherMap for live data in Phase 5.",
      };

    case "get_flight_info": {
      const flightNum = (input.flight_number as string).toUpperCase();
      const allFlights = [...FLIGHTS_OUT, ...FLIGHTS_RETURN];
      const flight = allFlights.find(
        (f) => f.id.replace(/\s+/g, "").toUpperCase() === flightNum.replace(/\s+/g, "")
      );
      return flight
        ? {
            id: flight.id,
            from: `${flight.from.code} (${flight.from.city})`,
            to: `${flight.to.code} (${flight.to.city})`,
            depart: `${flight.depart} on ${flight.departDate}`,
            arrive: `${flight.arrive} on ${flight.arriveDate}`,
            seat: flight.seat,
            aircraft: flight.aircraft,
            operator: flight.operator,
          }
        : { message: `Flight ${flightNum} not found.` };
    }

    case "get_checklist_status": {
      const totalItems = CHECKLIST.reduce((s, c) => s + c.items.length, 0);
      return {
        total: totalItems,
        checked: 0, // Server can't read client state — this is a stub
        categories: CHECKLIST.map((c) => ({
          name: c.cat,
          items: c.items.length,
        })),
        note: "For real-time checklist progress, the client injects this into context.",
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages, system } = body;

    // First API call
    let response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages,
        tools: AI_TOOLS,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Claude API error: ${response.status} — ${errorText}` },
        { status: response.status }
      );
    }

    let result = await response.json();

    // Handle tool use — loop until Claude gives a final text response
    const conversationMessages = [...messages];
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (result.stop_reason === "tool_use" && iterations < MAX_ITERATIONS) {
      iterations++;

      // Extract tool use blocks
      const toolUseBlocks = result.content.filter(
        (block: { type: string }) => block.type === "tool_use"
      );

      // Add assistant's tool-use message to conversation
      conversationMessages.push({ role: "assistant", content: result.content });

      // Execute each tool and build results
      const toolResults = toolUseBlocks.map(
        (block: { id: string; name: string; input: Record<string, unknown> }) => ({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(executeTool(block.name, block.input)),
        })
      );

      conversationMessages.push({ role: "user", content: toolResults });

      // Call Claude again with tool results
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages: conversationMessages,
          tools: AI_TOOLS,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Claude API error: ${response.status} — ${errorText}` },
          { status: response.status }
        );
      }

      result = await response.json();
    }

    // Extract the final text content
    const textBlock = result.content?.find(
      (block: { type: string }) => block.type === "text"
    );
    const text = textBlock?.text ?? "I couldn't form a response. Try again?";

    return NextResponse.json({ content: text });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error }, { status: 500 });
  }
}
