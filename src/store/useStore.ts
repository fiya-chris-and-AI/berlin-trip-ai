/* ──────────────────────────────────────────────
   Zustand store — persisted to localStorage
   ────────────────────────────────────────────── */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TripDay } from "@/lib/types";

interface AppState {
  // ── Navigation ──
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // ── Calendar / Notes day selection ──
  selectedDay: TripDay;
  setSelectedDay: (day: TripDay) => void;

  // ── User identity (simple — no auth) ──
  user: "fiya" | "chris" | null;
  setUser: (user: "fiya" | "chris") => void;

  // ── Flights toggle ──
  flightDirection: "outbound" | "return";
  setFlightDirection: (dir: "outbound" | "return") => void;

  // ── Explore category ──
  exploreCategoryIndex: number;
  setExploreCategoryIndex: (idx: number) => void;

  // ── Berlin Info accordion ──
  expandedInfoSection: number | null;
  setExpandedInfoSection: (idx: number | null) => void;

  // ── Checklist ──
  checkedItems: Record<string, boolean>;
  toggleItem: (key: string) => void;
  resetChecklist: () => void;

  // ── Notes (per-day) ──
  notes: Record<number, string>;
  setNote: (day: number, text: string) => void;

  // ── Explore favorites ──
  favorites: Set<string>;
  toggleFavorite: (spotName: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: "/",
      setActiveTab: (tab) => set({ activeTab: tab }),

      selectedDay: 20 as TripDay,
      setSelectedDay: (day) => set({ selectedDay: day }),

      user: null,
      setUser: (user) => set({ user }),

      flightDirection: "outbound",
      setFlightDirection: (dir) => set({ flightDirection: dir }),

      exploreCategoryIndex: 0,
      setExploreCategoryIndex: (idx) => set({ exploreCategoryIndex: idx }),

      expandedInfoSection: null,
      setExpandedInfoSection: (idx) => set({ expandedInfoSection: idx }),

      checkedItems: {},
      toggleItem: (key) =>
        set((s) => ({
          checkedItems: { ...s.checkedItems, [key]: !s.checkedItems[key] },
        })),
      resetChecklist: () => set({ checkedItems: {} }),

      notes: { 19: "", 20: "", 21: "", 22: "", 23: "", 24: "", 25: "", 26: "", 27: "" },
      setNote: (day, text) =>
        set((s) => ({ notes: { ...s.notes, [day]: text } })),

      favorites: new Set<string>(),
      toggleFavorite: (spotName) =>
        set((s) => {
          const next = new Set(s.favorites);
          if (next.has(spotName)) next.delete(spotName);
          else next.add(spotName);
          return { favorites: next };
        }),
    }),
    {
      name: "berlin-companion-store",
      // Serialize Set<string> for localStorage
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (parsed?.state?.favorites) {
            parsed.state.favorites = new Set(parsed.state.favorites);
          }
          return parsed;
        },
        setItem: (name, value) => {
          const serializable = {
            ...value,
            state: {
              ...value.state,
              favorites: Array.from(value.state.favorites || []),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
