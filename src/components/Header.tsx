/* ── App header with brand bar + trip info ── */

import { C } from "@/lib/colors";
import DualClock from "./DualClock";

export default function Header() {
  return (
    <>
      {/* 3px red brand bar */}
      <div style={{ height: 3, background: C.red }} />

      <header style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px 12px" }}>
          {/* Top row: logo + clocks */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: C.red,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontSize: 13,
                }}
              >
                ✈
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <h1
                    className="font-display"
                    style={{ fontSize: 24, fontWeight: 400 }}
                  >
                    Berlin
                  </h1>
                  <span
                    className="font-code"
                    style={{ fontSize: 9, letterSpacing: 2, color: C.light }}
                  >
                    JLY3BV
                  </span>
                </div>
                <div
                  className="animate-line-grow"
                  style={{
                    height: 2,
                    background: C.red,
                    borderRadius: 1,
                    maxWidth: 50,
                    marginTop: 1,
                  }}
                />
              </div>
            </div>

            {/* Clocks + countdown */}
            <DualClock />
          </div>

          {/* Context tags */}
          <div
            className="animate-fade-up delay-1"
            style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}
          >
            {[
              { l: "Lutfiya Miller", s: "Passenger" },
              { l: "Chris Müller", s: "Co-founder & host" },
              { l: "Impact Hub Berlin", s: "May 22-23 event" },
              { l: "Early AI-dopters", s: "Skool community" },
              { l: "ScienceExperts.ai", s: "Your platform" },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: 5,
                  background: C.bg,
                  border: `1px solid ${C.borderLight}`,
                  fontSize: 11,
                }}
              >
                <span style={{ fontWeight: 600 }}>{t.l}</span>{" "}
                <span style={{ color: C.light, fontSize: 9 }}>{t.s}</span>
              </div>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
