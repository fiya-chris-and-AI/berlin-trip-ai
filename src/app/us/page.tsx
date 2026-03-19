/* ──────────────────────────────────────────────
   "Us" page — shared space between Fiya and Chris
   Messages, mood, "thinking of you" pings
   ────────────────────────────────────────────── */

"use client";

import { useState, useRef, useEffect } from "react";
import { C } from "@/lib/colors";
import { useStore } from "@/store/useStore";
import { useRealtimeMessages, type SharedMessage } from "@/hooks/useRealtimeMessages";
import Section from "@/components/Section";
import Card from "@/components/Card";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "❤️", label: "In love" },
  { emoji: "🥰", label: "Missing you" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😴", label: "Sleepy" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "😋", label: "Hungry" },
  { emoji: "🥳", label: "Celebrating" },
];

/** Format timestamp into friendly time string */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function UsPage() {
  const user = useStore((s) => s.user) ?? "fiya";
  const setUser = useStore((s) => s.setUser);
  const { messages, loading, send } = useRealtimeMessages();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const partner = user === "fiya" ? "chris" : "fiya";

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    send(user, input.trim());
    setInput("");
  };

  const sendPing = () => send(user, "💕 Thinking of you!", "ping");
  const sendMood = (emoji: string, label: string) => send(user, `${emoji} feeling ${label.toLowerCase()}`, "mood");

  // Separate pings and moods from text messages for display
  const latestMoods: Record<string, SharedMessage> = {};
  for (const msg of messages) {
    if (msg.type === "mood") latestMoods[msg.sender] = msg;
  }

  return (
    <div>
      {/* Identity picker */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          justifyContent: "center",
        }}
      >
        <span className="font-code" style={{ fontSize: 9, color: C.light, alignSelf: "center" }}>
          I AM:
        </span>
        {(["fiya", "chris"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUser(u)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              background: user === u ? C.red : C.white,
              color: user === u ? C.white : C.dark,
              border: `1px solid ${user === u ? C.red : C.border}`,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: user === u ? 600 : 400,
              transition: "all 0.2s",
              minHeight: "auto",
            }}
          >
            {u === "fiya" ? "Fiya 💐" : "Chris 🇩🇪"}
          </button>
        ))}
      </div>

      {/* Quick actions: ping + mood */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Thinking of you */}
        <button
          onClick={sendPing}
          style={{
            padding: "8px 18px",
            borderRadius: 20,
            background: C.pink,
            color: C.white,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            minHeight: "auto",
            transition: "transform 0.15s",
          }}
        >
          💕 Thinking of you
        </button>
      </div>

      {/* Mood picker */}
      <Section title="How are you feeling?" sub={`${partner === "fiya" ? "Fiya" : "Chris"}'s latest: ${latestMoods[partner]?.content ?? "—"}`}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {MOODS.map((m) => (
            <button
              key={m.label}
              onClick={() => sendMood(m.emoji, m.label)}
              style={{
                padding: "6px 12px",
                borderRadius: 16,
                background: C.white,
                border: `1px solid ${C.borderLight}`,
                cursor: "pointer",
                fontSize: 12,
                transition: "all 0.15s",
                minHeight: "auto",
              }}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Messages */}
      <Section title="Messages" delay={0.3}>
        <Card style={{ padding: 0, minHeight: 300 }}>
          <div
            ref={scrollRef}
            style={{
              maxHeight: 400,
              overflowY: "auto",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {loading && (
              <div style={{ textAlign: "center", padding: 20, color: C.light, fontSize: 12 }}>
                Loading messages...
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💕</div>
                <div style={{ fontSize: 13, color: C.med }}>
                  No messages yet. Send the first one!
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isMine = msg.sender === user;
              const isPing = msg.type === "ping";
              const isMood = msg.type === "mood";

              // Pings get a special centered style
              if (isPing || isMood) {
                return (
                  <div
                    key={msg.id}
                    className="animate-fade-up"
                    style={{
                      textAlign: "center",
                      padding: "6px 0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 14px",
                        borderRadius: 12,
                        background: isPing ? "rgba(219,39,119,0.06)" : C.bg,
                        border: `1px solid ${isPing ? "rgba(219,39,119,0.15)" : C.borderLight}`,
                        color: isPing ? C.pink : C.med,
                        fontWeight: 500,
                      }}
                    >
                      {msg.sender === "fiya" ? "Fiya" : "Chris"}: {msg.content}
                    </span>
                    <div className="font-code" style={{ fontSize: 8, color: C.light, marginTop: 2 }}>
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                );
              }

              // Text messages
              return (
                <div
                  key={msg.id}
                  className="animate-fade-up"
                  style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "8px 12px",
                      borderRadius: isMine ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: isMine ? C.red : C.bg,
                      color: isMine ? C.white : C.black,
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {!isMine && (
                      <div
                        className="font-code"
                        style={{ fontSize: 8, color: C.pink, fontWeight: 600, marginBottom: 2 }}
                      >
                        {msg.sender === "fiya" ? "Fiya" : "Chris"}
                      </div>
                    )}
                    {msg.content}
                    <div
                      className="font-code"
                      style={{
                        fontSize: 8,
                        marginTop: 3,
                        opacity: 0.6,
                        textAlign: isMine ? "right" : "left",
                      }}
                    >
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSend}
            style={{
              borderTop: `1px solid ${C.borderLight}`,
              padding: "8px 12px",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${partner === "fiya" ? "Fiya" : "Chris"}...`}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                outline: "none",
                fontSize: 13,
                minHeight: "auto",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: input.trim() ? C.red : C.borderLight,
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                color: C.white,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "auto",
              }}
            >
              ↑
            </button>
          </form>
        </Card>
      </Section>
    </div>
  );
}
