/* ──────────────────────────────────────────────
   useVoice — recording + playback state machine
   Uses MediaRecorder API for browser mic access
   ────────────────────────────────────────────── */

"use client";

import { useState, useRef, useCallback } from "react";

export type VoiceState = "idle" | "recording" | "transcribing" | "speaking";

interface UseVoiceReturn {
  state: VoiceState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>; // Returns transcribed text
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  error: string | null;
}

export function useVoice(): UseVoiceReturn {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resolveStopRef = useRef<((text: string) => void) | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Prefer webm; fall back to whatever's available
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach((t) => t.stop());

        setState("transcribing");

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
          const res = await fetch("/api/stt", { method: "POST", body: formData });
          const data = await res.json();

          if (data.error) {
            setError(data.error);
            resolveStopRef.current?.("");
          } else {
            resolveStopRef.current?.(data.text || "");
          }
        } catch (err) {
          setError("Failed to transcribe audio.");
          resolveStopRef.current?.("");
        } finally {
          setState("idle");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch (err) {
      setError("Microphone access denied. Please allow microphone access in your browser settings.");
      setState("idle");
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      resolveStopRef.current = resolve;
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      } else {
        resolve("");
      }
    });
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setError(null);
      setState("speaking");

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "TTS failed.");
        setState("idle");
        return;
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setState("idle");
        audioRef.current = null;
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setError("Audio playback failed.");
        setState("idle");
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      setError("Failed to play audio.");
      setState("idle");
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState("idle");
  }, []);

  return { state, startRecording, stopRecording, speak, stopSpeaking, error };
}
