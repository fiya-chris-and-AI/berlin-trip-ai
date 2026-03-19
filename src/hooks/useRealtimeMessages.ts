/* ──────────────────────────────────────────────
   useRealtimeMessages — live Supabase subscription
   ────────────────────────────────────────────── */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/services/supabase";

export interface SharedMessage {
  id: string;
  sender: "fiya" | "chris";
  content: string;
  type: "text" | "emoji" | "ping" | "mood";
  created_at: string;
}

export function useRealtimeMessages() {
  const [messages, setMessages] = useState<SharedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch existing messages
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (!error && data) setMessages(data as SharedMessage[]);
      setLoading(false);
    }
    load();
  }, []);

  // Subscribe to realtime inserts
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as SharedMessage]);
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
    };
  }, []);

  /** Send a new message */
  const send = useCallback(
    async (sender: "fiya" | "chris", content: string, type: SharedMessage["type"] = "text") => {
      const { error } = await supabase
        .from("messages")
        .insert({ sender, content, type });

      if (error) console.error("[Messages] Insert error:", error.message);
    },
    []
  );

  return { messages, loading, send };
}
