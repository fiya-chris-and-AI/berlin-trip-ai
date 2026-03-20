/* ── Home screen — the command center ── */

"use client";

import { useState, useEffect, useCallback } from "react";
import { C } from "@/lib/colors";
import { berlinTime, birminghamTime, daysUntilTrip, tripStatus, greeting, currentTripDay } from "@/lib/utils";
import { CALENDAR, TRIP_DAYS } from "@/data/calendar";
import { CHECKLIST } from "@/data/checklist";
import { useStore } from "@/store/useStore";
import { eventColors } from "@/lib/colors";
import { supabase } from "@/services/supabase";
import Card from "@/components/Card";
import Section from "@/components/Section";
import Link from "next/link";

const TOTAL_ITEMS = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);

/** "I am lost" SOS button — grabs GPS and sends to Chris */
function LostButton() {
  const [state, setState] = useState<"idle" | "locating" | "sent" | "error">("idle");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const user = useStore((s) => s.user) ?? "fiya";

  const handleLost = useCallback(() => {
    if (state === "locating") return;
    setState("locating");
    setErrorMsg("");
    setLocation(null);

    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        setLocation({ lat, lng });

        // Send location to partner via Supabase
        if (supabase) {
          const sender = user === "fiya" ? "fiya" : "chris";
          const partner = user === "fiya" ? "Chris" : "Fiya";
          await supabase.from("messages").insert({
            sender,
            content: `📍 I'm lost! Here's my location: ${mapsUrl}`,
            type: "ping",
          });
        }

        setState("sent");
      },
      (err) => {
        setState("error");
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrorMsg("Location access denied. Please enable it in your browser settings.");
            break;
          case err.POSITION_UNAVAILABLE:
            setErrorMsg("Location unavailable right now. Try again.");
            break;
          case err.TIMEOUT:
            setErrorMsg("Location request timed out. Try again.");
            break;
          default:
            setErrorMsg("Could not get your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [state, user]);

  const mapsUrl = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : null;

  return (
    <div className="animate-fade-up" style={{ marginTop: 24, marginBottom: 8, textAlign: "center" }}>
      {/* The big pink button */}
      <button
        onClick={handleLost}
        disabled={state === "locating"}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "16px 24px",
          borderRadius: 14,
          background: state === "sent"
            ? "linear-gradient(135deg, #DB2777 0%, #BE185D 100%)"
            : state === "locating"
            ? "linear-gradient(135deg, #F472B6 0%, #DB2777 100%)"
            : "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
          border: "none",
          cursor: state === "locating" ? "wait" : "pointer",
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 0.5,
          boxShadow: "0 4px 20px rgba(219,39,119,0.35)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          margin: "0 auto",
          minHeight: 56,
        }}
      >
        {state === "locating" ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                border: "2.5px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Finding you...
          </>
        ) : state === "sent" ? (
          <>📍 Location Sent!</>
        ) : (
          <>🆘 I am lost.</>
        )}
      </button>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Success: show Google Maps link */}
      {state === "sent" && location && mapsUrl && (
        <div
          className="animate-fade-up"
          style={{
            marginTop: 12,
            padding: "14px 18px",
            background: "rgba(219,39,119,0.06)",
            border: "1px solid rgba(219,39,119,0.15)",
            borderRadius: 10,
            maxWidth: 400,
            margin: "12px auto 0",
          }}
        >
          <div style={{ fontSize: 12, color: C.pink, fontWeight: 600, marginBottom: 6 }}>
            ✅ Chris can see your location now
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "#fff",
              border: `1px solid ${C.pinkBorder}`,
              borderRadius: 8,
              color: C.pink,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            📍 Open in Google Maps
          </a>
          <div className="font-code" style={{ fontSize: 9, color: C.light, marginTop: 8 }}>
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>
          {/* Send again */}
          <button
            onClick={() => { setState("idle"); setLocation(null); }}
            style={{
              marginTop: 8,
              padding: "4px 12px",
              background: "transparent",
              border: `1px solid ${C.pinkBorder}`,
              borderRadius: 6,
              color: C.pink,
              fontSize: 11,
              cursor: "pointer",
              minHeight: "auto",
            }}
          >
            Send again
          </button>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div
          className="animate-fade-up"
          style={{
            marginTop: 12,
            padding: "10px 16px",
            background: C.redSoft,
            border: `1px solid ${C.redBorder}`,
            borderRadius: 8,
            fontSize: 12,
            color: C.red,
            maxWidth: 400,
            margin: "12px auto 0",
          }}
        >
          ⚠️ {errorMsg}
          <button
            onClick={() => setState("idle")}
            style={{
              marginLeft: 8,
              padding: "2px 8px",
              background: "transparent",
              border: `1px solid ${C.redBorder}`,
              borderRadius: 4,
              color: C.red,
              fontSize: 10,
              cursor: "pointer",
              minHeight: "auto",
            }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

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

      {/* 🆘 I am lost button */}
      <LostButton />

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

