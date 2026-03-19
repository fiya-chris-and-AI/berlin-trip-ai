/* ── Flights page — outbound/return toggle + flight cards ── */

"use client";

import { C } from "@/lib/colors";
import { FLIGHTS_OUT, FLIGHTS_RETURN, BOOKING } from "@/data/flights";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";
import FlightCard from "@/components/FlightCard";

export default function FlightsPage() {
  const dir = useStore((s) => s.flightDirection);
  const setDir = useStore((s) => s.setFlightDirection);
  const flights = dir === "outbound" ? FLIGHTS_OUT : FLIGHTS_RETURN;

  return (
    <div>
      <Section title="Flight Details">
        {/* Direction toggle */}
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 16,
            background: C.bg,
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            width: "fit-content",
          }}
        >
          {[
            { k: "outbound" as const, l: `Outbound · BHM → BER · ${BOOKING.outboundDuration}` },
            { k: "return" as const, l: `Return · BER → BHM · ${BOOKING.returnDuration}` },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setDir(t.k)}
              style={{
                background: dir === t.k ? C.red : "transparent",
                border: "none",
                cursor: "pointer",
                padding: "7px 16px",
                fontSize: 11,
                fontWeight: dir === t.k ? 600 : 400,
                color: dir === t.k ? C.white : C.med,
                transition: "all 0.2s",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Flight cards */}
        {flights.map((f, i) => (
          <FlightCard
            key={f.id}
            flight={f}
            isEndpoint={i === 0 || i === flights.length - 1}
          />
        ))}

        {/* Booking reference */}
        <div
          style={{
            marginTop: 16,
            padding: "10px 14px",
            background: C.bg,
            border: `1px solid ${C.borderLight}`,
            borderRadius: 6,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            { l: "Confirmation", v: BOOKING.confirmation },
            { l: "Passenger", v: BOOKING.passenger },
            { l: "eTicket", v: BOOKING.eTicket },
            { l: "Status", v: BOOKING.membership },
          ].map((d, j) => (
            <div key={j}>
              <span className="font-code" style={{ fontSize: 7, letterSpacing: 1, color: C.light }}>
                {d.l}
              </span>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.dark }}>{d.v}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
