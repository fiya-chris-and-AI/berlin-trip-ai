/* ── Bottom tab navigation (mobile-first, sticky) ── */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/colors";
import { useStore } from "@/store/useStore";
import { CHECKLIST } from "@/data/checklist";

const TOTAL_ITEMS = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);

const NAV = [
  { href: "/",          label: "Home",     emoji: "🏠" },
  { href: "/chat",      label: "Berlin AI", emoji: "🎙️" },
  { href: "/calendar",  label: "Calendar", emoji: "📅" },
  { href: "/flights",   label: "Flights",  emoji: "✈️" },
  { href: "/explore",   label: "Explore",  emoji: "💕" },
  { href: "/us",        label: "Us",       emoji: "💑" },
  { href: "/checklist", label: "Packing",  emoji: "✓" },
  { href: "/info",      label: "Info",     emoji: "📍" },
  { href: "/notes",     label: "Notes",    emoji: "📝" },
];

export default function TabNav() {
  const pathname = usePathname();
  const checkedItems = useStore((s) => s.checkedItems);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                borderBottom: active
                  ? `2.5px solid ${C.red}`
                  : "2.5px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 5,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 13 }}>{n.emoji}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: active ? C.black : C.light,
                }}
              >
                {n.label}
              </span>
              {/* Packing progress badge */}
              {n.href === "/checklist" && totalChecked > 0 && (
                <span
                  className="font-code"
                  style={{
                    fontSize: 8,
                    padding: "1px 4px",
                    borderRadius: 3,
                    background:
                      totalChecked === TOTAL_ITEMS ? C.greenSoft : C.redSoft,
                    color:
                      totalChecked === TOTAL_ITEMS ? C.green : C.red,
                    fontWeight: 600,
                  }}
                >
                  {totalChecked}/{TOTAL_ITEMS}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
