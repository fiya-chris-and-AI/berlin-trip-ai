/* ── Full AI chat page — bubble UI + voice + text input ── */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { C } from "@/lib/colors";
import { buildSystemPrompt, type ChatMessage } from "@/services/ai";
import { useTripContext } from "@/hooks/useTripContext";
import { useVoice } from "@/hooks/useVoice";
import ChatBubble from "@/components/ChatBubble";
import VoiceButton from "@/components/VoiceButton";

/** Generate a simple unique ID */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tripContext = useTripContext();
  const voice = useVoice();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  /** Send a message to the AI and get a response */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setApiError(null);

      // Add user message
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      try {
        // Build conversation history for Claude (last 20 messages for context window)
        const history = updatedMessages.slice(-20).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            system: buildSystemPrompt(tripContext),
          }),
        });

        const data = await res.json();

        if (data.error) {
          setApiError(data.error);
          setIsLoading(false);
          return;
        }

        const aiMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: data.content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Auto-speak if voice was used for input
        if (voice.state === "idle") {
          // Optionally: voice.speak(data.content);
        }
      } catch (err) {
        setApiError("Failed to reach Berlin AI. Check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, tripContext, voice]
  );

  /** Handle voice: start/stop recording and send transcribed text */
  const handleVoice = useCallback(async () => {
    if (voice.state === "recording") {
      const text = await voice.stopRecording();
      if (text) {
        sendMessage(text);
        // Auto-speak the response after voice input
        // Will be triggered when the AI responds
      }
    } else if (voice.state === "speaking") {
      voice.stopSpeaking();
    } else if (voice.state === "idle") {
      await voice.startRecording();
    }
  }, [voice, sendMessage]);

  /** Handle keyboard submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 200px)",
        minHeight: 400,
      }}
    >
      {/* Chat header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 0",
          borderBottom: `1px solid ${C.borderLight}`,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: C.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.white,
            fontSize: 16,
          }}
        >
          🤖
        </div>
        <div>
          <div className="font-display" style={{ fontSize: 18 }}>
            Berlin
          </div>
          <span className="font-code" style={{ fontSize: 9, color: C.light }}>
            AI Travel Companion · Powered by Claude
          </span>
        </div>
        <div
          className="animate-dot-blink"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: C.green,
            marginLeft: 4,
          }}
        />
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 4px",
        }}
      >
        {/* Welcome message if empty */}
        {messages.length === 0 && (
          <div
            className="animate-fade-up"
            style={{
              textAlign: "center",
              padding: "48px 20px",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🇩🇪</div>
            <div className="font-display" style={{ fontSize: 22, marginBottom: 8 }}>
              Hey Fiya! I&apos;m Berlin.
            </div>
            <p style={{ fontSize: 13, color: C.med, lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
              I know everything about your trip — flights, schedule, the best spots in Berlin, 
              and even how your body clock is adjusting. Ask me anything, or tap the mic to talk.
            </p>

            {/* Suggestion chips */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              {[
                "What's my flight schedule?",
                "Best dinner spots?",
                "How do I get to Impact Hub?",
                "Translate 'thank you' to German",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: C.white,
                    border: `1px solid ${C.border}`,
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.dark,
                    transition: "all 0.2s",
                    minHeight: "auto",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div
            className="animate-fade-up"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
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
              }}
            >
              B
            </div>
            <div
              style={{
                padding: "10px 18px",
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "14px 14px 14px 2px",
                display: "flex",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.light,
                    animation: `dotBlink 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error display */}
        {(apiError || voice.error) && (
          <div
            style={{
              margin: "8px 0",
              padding: "8px 12px",
              background: C.redSoft,
              border: `1px solid ${C.redBorder}`,
              borderRadius: 6,
              fontSize: 11,
              color: C.red,
            }}
          >
            ⚠️ {apiError || voice.error}
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: `1px solid ${C.borderLight}`,
          padding: "12px 0 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Berlin anything..."
            disabled={isLoading || voice.state === "recording"}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              outline: "none",
              fontSize: 13,
              background: C.white,
              color: C.black,
              transition: "border-color 0.2s",
              minHeight: "auto",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: input.trim() ? C.red : C.borderLight,
              border: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.white,
              fontSize: 16,
              transition: "all 0.2s",
              minHeight: "auto",
            }}
            aria-label="Send message"
          >
            ↑
          </button>
        </form>

        {/* Voice button */}
        <VoiceButton
          state={voice.state}
          onPress={handleVoice}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
