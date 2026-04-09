"use client";

import { useEffect, useRef, useState } from "react";
import LeadResult from "./LeadResult";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    void sendMessage("start");
  }, []);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage ?? input.trim();

    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: messageToSend,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    await sendToAPI(updatedMessages);
  };

  const sendToAPI = async (messagesToSend: ChatMessage[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      console.log("CHAT API RESPONSE:", data);
      console.log("API response:", data);

      const aiMessage = data?.aiMessage;
      const finalLead = data?.finalLead;

      if (finalLead) {
        setResult(finalLead);
        return;
      }

      if (!aiMessage || typeof aiMessage.content !== "string") {
        console.error("AI message is missing or invalid:", aiMessage);
        return;
      }

      try {
        const match = aiMessage.content.match(/\{[\s\S]*\}/);

        if (match) {
          let jsonString = match[0];

          jsonString = jsonString.replace(/\n/g, " ");
          jsonString = jsonString.replace(/(\w)"(\w)/g, "$1'$2");

          const parsed = JSON.parse(jsonString);
          console.log("Parsed JSON:", parsed);
        }
      } catch (e) {
        console.error("Error parsing JSON:", e);
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling chat API:", error);
    }
  };

  const isInputEmpty = !input || input.trim() === "";

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-xl bg-white p-4 shadow-xl">
      <div className="mb-2 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className="mb-5">
            <strong>
              {msg.role === "assistant" ? "Asistente" : "Usuario"}:
            </strong>{" "}
            {msg.content === "start" ? "Iniciar" : msg.content}
          </div>
        ))}
      </div>

      <input
        className="w-full rounded border p-2 font-normal"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe aquí..."
      />

      <button
        onClick={() => void sendMessage()}
        disabled={isInputEmpty}
        className={`mt-2 w-full rounded p-2 text-white ${
          isInputEmpty ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
      >
        Enviar
      </button>

      <div className="mt-4">{result && <LeadResult result={result} />}</div>
    </div>
  );
}
