/* ── Floating voice button — mic with pulse ring animation ── */

"use client";

import { C } from "@/lib/colors";
import type { VoiceState } from "@/hooks/useVoice";

interface VoiceButtonProps {
  state: VoiceState;
  onPress: () => void;
  disabled?: boolean;
}

function MicIcon({ color = "#fff", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10v1a7 7 0 01-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function StopIcon({ color = "#fff", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function WaveformIcon({ color = "#fff" }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
      {[8, 14, 18, 12, 16, 10, 14].map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: h,
            background: color,
            borderRadius: 2,
            animation: `fadeUp 0.4s ease-in-out ${i * 0.08}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/** Small status label under the button */
function StatusLabel({ state }: { state: VoiceState }) {
  const labels: Record<VoiceState, string> = {
    idle: "",
    recording: "Listening…",
    transcribing: "Thinking…",
    speaking: "Speaking…",
  };

  if (!labels[state]) return null;

  return (
    <span
      className="font-code"
      style={{
        fontSize: 9,
        color: state === "recording" ? C.red : C.light,
        marginTop: 4,
        fontWeight: 600,
        letterSpacing: 1,
      }}
    >
      {labels[state]}
    </span>
  );
}

export default function VoiceButton({ state, onPress, disabled }: VoiceButtonProps) {
  const isRecording = state === "recording";
  const isSpeaking = state === "speaking";
  const isTranscribing = state === "transcribing";
  const isActive = isRecording || isSpeaking || isTranscribing;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        {/* Pulse ring when recording */}
        {isRecording && (
          <div
            className="animate-pulse-ring"
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: `2px solid ${C.red}`,
            }}
          />
        )}

        <button
          onClick={onPress}
          disabled={disabled || isTranscribing}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "none",
            background: isRecording
              ? "#DC2626"
              : isSpeaking
                ? C.dark
                : C.red,
            cursor: disabled || isTranscribing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isActive
              ? `0 0 20px rgba(200,16,46,0.35)`
              : `0 2px 8px rgba(0,0,0,0.12)`,
            transition: "all 0.2s",
            opacity: disabled || isTranscribing ? 0.5 : 1,
            position: "relative",
            zIndex: 1,
            minHeight: "auto",
          }}
          aria-label={
            isRecording
              ? "Stop recording"
              : isSpeaking
                ? "Stop speaking"
                : "Start recording"
          }
        >
          {isRecording ? (
            <StopIcon />
          ) : isSpeaking ? (
            <WaveformIcon />
          ) : isTranscribing ? (
            <div
              style={{
                width: 18,
                height: 18,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : (
            <MicIcon />
          )}
        </button>
      </div>

      <StatusLabel state={state} />
    </div>
  );
}
