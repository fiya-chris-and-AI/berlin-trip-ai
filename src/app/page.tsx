/* ── Home screen — the command center ── */

"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/colors";
import { berlinTime, birminghamTime, daysUntilTrip, tripStatus, greeting, currentTripDay } from "@/lib/utils";
import { CALENDAR, TRIP_DAYS } from "@/data/calendar";
import { CHECKLIST } from "@/data/checklist";
import { useStore } from "@/store/useStore";
import { eventColors } from "@/lib/colors";
import Card from "@/components/Card";
import Section from "@/components/Section";
import Link from "next/link";

const TOTAL_ITEMS = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);

export default function HomePage() {
  const [now, setNow] = useState(new Date());
  const checkedItems = useStore((s) => s.checkedItems);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const daysLeft = daysUntilTrip(now);
  const tripDay = currentTripDay(now);
  const userName = "Fiya"; // Default to Fiya

  // Compute upcoming events for "Next Up" section
  const upcomingEvents = (() => {
    const events: { day: number; label: string; emoji: string; title: string; time: string; type: string }[] = [];
    for (const d of TRIP_DAYS) {
      const info = CALENDAR[d];
      for (const ev of info.events) {
        events.push({
          day: d,
          label: info.label,
          emoji: info.emoji,
          title: ev.title,
          time: ev.t,
          type: ev.type,
        });
      }
    }
    return events.slice(0, 3);
  })();

  return (
    <div>
      {/* Greeting */}
      <Section title={greeting(userName, now)}>
        <div
          className="animate-fade-up"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="font-code" style={{ fontSize: 10, color: C.light }}>BIRMINGHAM</span>
              <span className="font-code" style={{ fontSize: 16, fontWeight: 600, color: C.dark }}>
                {birminghamTime(now)}
              </span>
            </div>
            <span style={{ color: C.borderLight, fontSize: 20 }}>→</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="font-code" style={{ fontSize: 10, color: C.red }}>BERLIN</span>
              <span className="font-code" style={{ fontSize: 16, fontWeight: 600, color: C.black }}>
                {berlinTime(now)}
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "6px 14px",
              background: daysLeft > 0 ? C.redSoft : C.greenSoft,
              border: `1px solid ${daysLeft > 0 ? C.redBorder : C.greenBorder}`,
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              color: daysLeft > 0 ? C.red : C.green,
            }}
          >
            {tripStatus(now)}
          </div>
        </div>
      </Section>

      {/* Right Now card */}
      <Section title="Right Now" delay={0.3}>
        <Card
          style={{
            borderLeft: `4px solid ${C.red}`,
            background: "linear-gradient(135deg, #fff 0%, rgba(200,16,46,0.02) 100%)",
          }}
        >
          {daysLeft > 0 ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 4 }}>
                Start packing! You&apos;re {Math.round((totalChecked / TOTAL_ITEMS) * 100)}% packed.
              </div>
              <div
                style={{
                  height: 6,
                  background: C.borderLight,
                  borderRadius: 5,
                  overflow: "hidden",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(totalChecked / TOTAL_ITEMS) * 100}%`,
                    background: totalChecked === TOTAL_ITEMS ? C.green : C.red,
                    borderRadius: 5,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <span className="font-code" style={{ fontSize: 10, color: C.light, marginTop: 4, display: "block" }}>
                {totalChecked} of {TOTAL_ITEMS} items packed
              </span>
            </>
          ) : tripDay ? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.black }}>
                Day {tripDay - 18} — {CALENDAR[tripDay]?.label}
              </div>
              <div style={{ fontSize: 12, color: C.med, marginTop: 4 }}>
                {CALENDAR[tripDay]?.events[0]?.title}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 14, fontWeight: 600, color: C.black }}>
              Trip complete! Welcome home. 🏠
            </div>
          )}
        </Card>
      </Section>

      {/* Quick Actions Grid */}
      <Section title="Quick Actions" delay={0.5}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 8,
          }}
        >
          {[
            { href: "/chat",      emoji: "🎙️", label: "Talk to Berlin"    },
            { href: "/calendar",  emoji: "📅", label: "Today's Plan"       },
            { href: "/flights",   emoji: "✈️", label: "Flight Status"      },
            { href: "/notes",     emoji: "💕", label: "Send Chris a Note"  },
            { href: "/explore",   emoji: "📍", label: "What's Nearby"      },
            { href: "/checklist", emoji: "✓",  label: `Packing ${totalChecked}/${TOTAL_ITEMS}` },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <Card
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  padding: "16px 12px",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{action.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>
                  {action.label}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Next Up Timeline */}
      <Section title="Next Up" sub="Your upcoming events" delay={0.7}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {upcomingEvents.map((ev, i) => {
            const ec = eventColors[ev.type as keyof typeof eventColors] ?? eventColors.tip;
            return (
              <Card
                key={i}
                style={{ borderLeft: `3px solid ${ec.dot}`, background: ec.bg, borderColor: ec.bd }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 50, textAlign: "center" }}>
                    <span style={{ fontSize: 18 }}>{ev.emoji}</span>
                    <div className="font-code" style={{ fontSize: 8, color: C.light, marginTop: 2 }}>
                      May {ev.day}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{ev.title}</div>
                    <span className="font-code" style={{ fontSize: 10, color: ec.dot }}>{ev.time}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
