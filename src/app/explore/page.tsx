/* ── Explore Berlin — curated spots by category ── */

"use client";

import { C } from "@/lib/colors";
import { EXPLORE } from "@/data/explore";
import { useStore } from "@/store/useStore";
import Section from "@/components/Section";
import Card from "@/components/Card";

export default function ExplorePage() {
  const catIdx = useStore((s) => s.exploreCategoryIndex);
  const setCatIdx = useStore((s) => s.setExploreCategoryIndex);
  const favorites = useStore((s) => s.favorites);
  const toggleFav = useStore((s) => s.toggleFavorite);

  return (
    <div>
      <Section
        title="Explore Berlin Together"
        sub="Date spots, restaurants, and experiences for you & Chris"
      >
        {/* Category filter */}
        <div
          style={{
            display: "flex",
            gap: 5,
            marginBottom: 14,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {EXPLORE.map((cat, i) => (
            <button
              key={i}
              onClick={() => setCatIdx(i)}
              style={{
                flex: "0 0 auto",
                padding: "6px 14px",
                borderRadius: 5,
                background: catIdx === i ? C.red : C.white,
                border: `1px solid ${catIdx === i ? C.red : C.borderLight}`,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: catIdx === i ? 600 : 400,
                color: catIdx === i ? C.white : C.dark,
                transition: "all 0.2s",
              }}
            >
              {cat.cat}
            </button>
          ))}
        </div>

        {/* Spots grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 8,
          }}
        >
          {EXPLORE[catIdx]?.spots.map((s, i) => {
            const isFav = favorites.has(s.name);
            return (
              <Card key={i} style={{ borderLeft: `3px solid ${C.pink}` }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.black,
                        marginBottom: 2,
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.med,
                        lineHeight: 1.4,
                        marginBottom: 4,
                      }}
                    >
                      {s.vibe}
                    </div>
                    <span
                      className="font-code"
                      style={{ fontSize: 8, color: C.pink, fontWeight: 600 }}
                    >
                      {s.area}
                    </span>
                  </div>
                  {/* Favorite heart toggle */}
                  <button
                    onClick={() => toggleFav(s.name)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 18,
                      padding: 4,
                      transition: "transform 0.2s",
                      transform: isFav ? "scale(1.2)" : "scale(1)",
                      minHeight: "auto",
                    }}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFav ? "❤️" : "🤍"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
