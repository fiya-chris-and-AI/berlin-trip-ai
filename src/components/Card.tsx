/* ── Reusable card component ── */

import { C } from "@/lib/colors";
import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Card({ children, style, className = "" }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
