/* ── Chat bubble — user (red) vs assistant (white) ── */

import { C } from "@/lib/colors";
import type { ChatMessage } from "@/services/ai";

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.white,
            fontSize: 12,
            flexShrink: 0,
            marginRight: 8,
            marginTop: 2,
          }}
        >
          B
        </div>
      )}

      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
          background: isUser ? C.red : C.white,
          color: isUser ? C.white : C.black,
          border: isUser ? "none" : `1px solid ${C.border}`,
          fontSize: 13,
          lineHeight: 1.6,
          boxShadow: isUser ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message.content}

        {/* Timestamp */}
        <div
          className="font-code"
          style={{
            fontSize: 8,
            marginTop: 4,
            opacity: 0.5,
            textAlign: isUser ? "right" : "left",
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
