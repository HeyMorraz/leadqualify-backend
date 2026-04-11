"use client";

import { useState } from "react";
import ChatWidget from "@/components/ChatWidget";

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
        >
          <span className="text-base">💬</span>
          Hablar con IA
        </button>
      )}

      {isOpen && <ChatWidget />}
    </>
  );
}