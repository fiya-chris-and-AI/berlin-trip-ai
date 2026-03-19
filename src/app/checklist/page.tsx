/* ── Packing checklist — interactive with progress bar + confetti ── */

"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/colors";
import { CHECKLIST, TOTAL_ITEMS } from "@/data/checklist";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function ChecklistPage() {
  const checkedItems = useStore((s) => s.checkedItems);
  const toggleItem = useStore((s) => s.toggleItem);
  const resetChecklist = useStore((s) => s.resetChecklist);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Confetti when 100%
  useEffect(() => {
    if (totalChecked === TOTAL_ITEMS && TOTAL_ITEMS > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [totalChecked]);

  return (
    <div>
      <Section title="Packing Checklist" sub={`${totalChecked} of ${TOTAL_ITEMS} packed`}>
        {/* Progress bar */}
        <div
          style={{
            marginBottom: 16,
            background: C.borderLight,
            borderRadius: 5,
            height: 6,
            overflow: "hidden",
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

        {/* Confetti overlay */}
        {showConfetti && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 100,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 48, animation: "confetti 2s ease-out forwards" }}>
              🎉
            </div>
            <div
              style={{
                position: "absolute",
                fontSize: 20,
                fontWeight: 700,
                color: C.green,
                marginTop: 60,
              }}
            >
              All packed! You&apos;re ready for Berlin!
            </div>
          </div>
        )}

        {/* Categories */}
        {CHECKLIST.map((cat, ci) => {
          const catChecked = cat.items.filter(
            (it) => checkedItems[`${ci}-${it}`]
          ).length;

          return (
            <div key={ci} style={{ marginBottom: 12 }}>
              {/* Category header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span
                  className="font-code"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: catChecked === cat.items.length ? C.green : C.red,
                  }}
                >
                  {cat.cat}
                </span>
                <span className="font-code" style={{ fontSize: 8, color: C.light }}>
                  {catChecked}/{cat.items.length}
                </span>
                <div style={{ flex: 1, height: 1, background: C.borderLight }} />
              </div>

              {/* Items */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 3,
                }}
              >
                {cat.items.map((it, ii) => {
                  const key = `${ci}-${it}`;
                  const done = !!checkedItems[key];

                  return (
                    <button
                      key={ii}
                      onClick={() => toggleItem(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "7px 10px",
                        background: done ? C.greenSoft : C.white,
                        border: `1px solid ${done ? C.greenBorder : C.borderLight}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div
                        className={done ? "animate-check-pop" : ""}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 3,
                          flexShrink: 0,
                          border: `1.5px solid ${done ? C.green : C.border}`,
                          background: done ? C.green : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {done && <CheckIcon />}
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: done ? C.green : C.dark,
                          textDecoration: done ? "line-through" : "none",
                          fontWeight: done ? 400 : 500,
                        }}
                      >
                        {it}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Reset button */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          {confirmReset ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.med }}>Reset all items?</span>
              <button
                onClick={() => { resetChecklist(); setConfirmReset(false); }}
                style={{
                  padding: "6px 16px",
                  background: C.red,
                  color: C.white,
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={{
                  padding: "6px 16px",
                  background: C.bg,
                  color: C.dark,
                  border: `1px solid ${C.border}`,
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                padding: "6px 16px",
                background: C.bg,
                color: C.light,
                border: `1px solid ${C.borderLight}`,
                borderRadius: 5,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              Reset all
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}
