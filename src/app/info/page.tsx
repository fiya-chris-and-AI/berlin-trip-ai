/* ── Berlin Info — accordion sections + quick reference grid ── */

"use client";

import { C } from "@/lib/colors";
import { BERLIN_INFO, QUICK_REFERENCE } from "@/data/berlin-info";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";
import Card from "@/components/Card";

export default function InfoPage() {
  const expanded = useStore((s) => s.expandedInfoSection);
  const setExpanded = useStore((s) => s.setExpandedInfoSection);

  return (
    <div>
      <Section
        title="Berlin Essentials"
        sub="Everything you need to know on the ground"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {BERLIN_INFO.map((sec, si) => (
            <div key={si}>
              <button
                onClick={() => setExpanded(expanded === si ? null : si)}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "10px 14px",
                  background: expanded === si ? C.redSoft : C.white,
                  border: `1px solid ${expanded === si ? C.redBorder : C.border}`,
                  borderLeft: `3px solid ${C.red}`,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="font-code"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: C.red,
                    }}
                  >
                    {sec.cat}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: C.light,
                      transition: "transform 0.2s",
                      transform: expanded === si ? "rotate(180deg)" : "rotate(0)",
                      display: "inline-block",
                    }}
                  >
                    ▾
                  </span>
                </div>
              </button>

              {expanded === si && (
                <div
                  style={{
                    padding: "4px 0 0 10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {sec.items.map((it, ii) => (
                    <Card key={ii} style={{ padding: "10px 14px" }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 600, color: C.black }}
                      >
                        {it.l}
                      </div>
                      <div
                        style={{ fontSize: 11, color: C.med, marginTop: 1 }}
                      >
                        {it.d}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Quick Reference */}
      <Section title="Quick Reference" delay={0.5}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 6,
          }}
        >
          {QUICK_REFERENCE.map((info, i) => (
            <Card key={i} style={{ borderTop: `2px solid ${C.red}`, padding: "10px 12px" }}>
              <span
                className="font-code"
                style={{ fontSize: 7, letterSpacing: 1, color: C.light }}
              >
                {info.l}
              </span>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                {info.v}
              </div>
              <div style={{ fontSize: 10, color: C.med, marginTop: 1 }}>
                {info.s}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
