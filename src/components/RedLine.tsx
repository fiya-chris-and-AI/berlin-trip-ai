/* ── Animated red sweep line section divider ── */

import { C } from "@/lib/colors";

interface RedLineProps {
  delay?: number;
}

export default function RedLine({ delay = 0 }: RedLineProps) {
  return (
    <div
      style={{
        width: "100%",
        height: 2,
        overflow: "hidden",
        borderRadius: 1,
        background: "rgba(200,16,46,0.06)",
      }}
    >
      <div
        className="animate-red-sweep"
        style={{
          height: "100%",
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}
