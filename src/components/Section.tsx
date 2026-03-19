/* ── Section wrapper — heading + subtitle + RedLine + content ── */

import { C } from "@/lib/colors";
import RedLine from "./RedLine";
import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  sub?: string;
  delay?: number;
  children: ReactNode;
}

export default function Section({ title, sub, delay = 0, children }: SectionProps) {
  return (
    <div style={{ marginTop: 32 }}>
      <h2
        className="font-display animate-fade-up"
        style={{ fontSize: 24, fontWeight: 400, color: C.black, marginBottom: sub ? 2 : 6 }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 12, color: C.light, marginBottom: 6 }}>{sub}</p>
      )}
      <RedLine delay={delay} />
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}
