"use client";
import React, { useState, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TradeChatProps {
  room?: string;
}

export function TradeChat({ room = "GLOBAL" }: TradeChatProps) {
  const [messages, setMessages] = useState<Array<{ user: string; text: string; time: string }>>([
    { user: "ProTrader_Elite", text: "Looking for Doppler Phase 4 M9. Have high tier liquid items!", time: "11:02" },
    { user: "SkinBaron_Vault", text: "Sent trade for Vice Gloves. Check offer token.", time: "11:05" },
  ]);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg = {
      user: "You",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="flex flex-col h-72 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800 text-xs font-semibold text-zinc-300">
        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
        <span>Live Trader Chat ({room})</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 py-2 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className="bg-zinc-900/70 p-2 rounded border border-zinc-800/80">
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span className="font-bold text-blue-400">{m.user}</span>
              <span>{m.time}</span>
            </div>
            <p className="text-zinc-200 mt-0.5">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 pt-2 border-t border-zinc-800">
        <Input
          placeholder="Negotiate or discuss..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="text-xs bg-zinc-900 border-zinc-800 h-8"
        />
        <Button size="sm" onClick={handleSend} className="bg-blue-600 hover:bg-blue-500 h-8 px-3">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
