/* ── Live dual clock: Birmingham + Berlin ── */

"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/colors";
import { berlinTime, birminghamTime } from "@/lib/utils";

export default function DualClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", gap: 12, fontSize: 10, color: C.light, alignItems: "center" }}>
      <span className="font-code">Home {birminghamTime(now)}</span>
      <span style={{ color: C.borderLight }}>|</span>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <div
          className="animate-dot-blink"
          style={{ width: 5, height: 5, borderRadius: "50%", background: C.red }}
        />
        <span className="font-code" style={{ color: C.dark, fontWeight: 600 }}>
          Berlin {berlinTime(now)}
        </span>
      </div>
    </div>
  );
}
