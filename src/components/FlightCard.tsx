/* ── Flight card with airport codes, plane→line→dot connector ── */

import { C } from "@/lib/colors";
import Card from "./Card";
import type { Flight } from "@/lib/types";

interface FlightCardProps {
  flight: Flight;
  isEndpoint?: boolean; // first or last flight in the direction
}

function PlaneIcon({ rotate = 0, size = 12 }: { rotate?: number; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.red}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z" />
    </svg>
  );
}

export default function FlightCard({ flight: f, isEndpoint = false }: FlightCardProps) {
  return (
    <div>
      <Card style={{ marginBottom: 0 }}>
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: isEndpoint ? C.red : C.borderLight,
          }}
        />

        {/* Flight ID + operator badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="font-code" style={{ fontSize: 15, fontWeight: 700 }}>
              {f.id}
            </span>
            {f.operator !== "Delta" && (
              <span
                className="font-code"
                style={{
                  fontSize: 8,
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: C.redSoft,
                  color: C.red,
                  fontWeight: 600,
                }}
              >
                OPR. {f.operator.toUpperCase()}
              </span>
            )}
            {f.overnight && (
              <span
                className="font-code"
                style={{
                  fontSize: 8,
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: "rgba(0,0,0,0.04)",
                  color: C.dark,
                }}
              >
                OVERNIGHT
              </span>
            )}
          </div>
          <span className="font-code" style={{ fontSize: 10, color: C.light }}>
            {f.aircraft}
          </span>
        </div>

        {/* Airport code grid: FROM → TO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Departure */}
          <div>
            <div className="font-display" style={{ fontSize: 22 }}>
              {f.from.code}
            </div>
            <div style={{ fontSize: 10, color: C.light, marginBottom: 4 }}>
              {f.from.city}
            </div>
            <span className="font-code" style={{ fontSize: 12, fontWeight: 600 }}>
              {f.depart}
            </span>
            <div style={{ fontSize: 9, color: C.light }}>{f.departDate}</div>
            <span className="font-code" style={{ fontSize: 8, color: C.light, marginTop: 3, display: "block" }}>
              {f.from.tz}
            </span>
          </div>

          {/* Connector */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <PlaneIcon rotate={90} size={12} />
            <div
              style={{
                width: 1.5,
                height: 22,
                background: `linear-gradient(to bottom, ${C.red}, rgba(200,16,46,0.12))`,
              }}
            />
            <div
              className="animate-dot-blink"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.red,
              }}
            />
          </div>

          {/* Arrival */}
          <div style={{ textAlign: "right" }}>
            <div className="font-display" style={{ fontSize: 22 }}>
              {f.to.code}
            </div>
            <div style={{ fontSize: 10, color: C.light, marginBottom: 4 }}>
              {f.to.city}
            </div>
            <span className="font-code" style={{ fontSize: 12, fontWeight: 600 }}>
              {f.arrive}
            </span>
            <div style={{ fontSize: 9, color: C.light }}>{f.arriveDate}</div>
            <span className="font-code" style={{ fontSize: 8, color: C.light, marginTop: 3, display: "block" }}>
              {f.to.tz}
            </span>
          </div>
        </div>

        {/* Details footer */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 12,
            paddingTop: 10,
            borderTop: `1px solid ${C.borderLight}`,
            flexWrap: "wrap",
          }}
        >
          {[
            { l: "Seat", v: f.seat },
            { l: "From", v: f.from.terminal },
            { l: "To", v: f.to.terminal },
            { l: "Fare", v: f.fare },
          ].map((d, j) => (
            <div key={j}>
              <span
                className="font-code"
                style={{ fontSize: 7, letterSpacing: 1, color: C.light }}
              >
                {d.l}
              </span>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: d.v === "21C" ? 700 : 500,
                  color: d.v === "21C" ? C.red : C.dark,
                }}
              >
                {d.v}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Layover connector */}
      {f.layoverAfter && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 18px",
          }}
        >
          <div
            style={{
              width: 1.5,
              height: 24,
              background: `repeating-linear-gradient(to bottom,${C.red} 0,${C.red} 3px,transparent 3px,transparent 6px)`,
              marginLeft: 14,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              background: C.redSoft,
              border: `1px solid ${C.redBorder}`,
              borderRadius: 5,
            }}
          >
            <div
              className="animate-dot-blink"
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: C.red,
              }}
            />
            <span
              className="font-code"
              style={{ fontSize: 9, color: C.red, fontWeight: 600 }}
            >
              Layover · {f.layoverAfter} · Change at {f.to.code}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
