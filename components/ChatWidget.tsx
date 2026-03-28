"use client";

import { useState, useEffect, useRef } from "react";
import LeadResult from "./LeadResult";

export default function ChatWidget() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [result, setResult] = useState<any>(null)
    const hasStarted = useRef(false)
    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true
        sendMessage("start")
    }, [])

    const sendMessage = async (customMessage?: string) => {
        const messageToSend = customMessage ?? input;

        if (!messageToSend) return;

        const userMessage = { role: "user", content: messageToSend };

        const updatedMessages = [...messages, userMessage];

        // 1. Actualizar UI
        setMessages(updatedMessages);
        setInput("");

        // 2. Llamar API FUERA del setState
        await sendToAPI(updatedMessages);
    };
    const sendToAPI = async (messagesToSend: any[]) => {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messagesToSend
            })
        });

        const data = await res.json();
        const aiMessage = data.choices[0].message;

        let parsed = null;

        try {
            const match = aiMessage.content.match(/\{[\s\S]*\}/);
            if (match) {
                //parsed = JSON.parse(match[0]);
                 let jsonString = match[0];

                // limpiar saltos de línea problemáticos
                jsonString = jsonString.replace(/\n/g, " ");

                // limpiar comillas mal formadas
                jsonString = jsonString.replace(/(\w)"(\w)/g, "$1'$2");

                parsed = JSON.parse(jsonString);

            }
        } catch (e) {
            console.error("Error parseando JSON:", e);
        }

        if (parsed && parsed.score !== undefined) {
            setResult(parsed);
            return;
        }

        setMessages((prev) => [...prev, aiMessage]);
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-xl p-4">
            {/*MENSAJES*/}
            <div className="h-64 overflow-y-auto mb-2">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-5">
                        <strong>{msg.role === 'assistant' ? 'Asistente' : 'Usuario'}:</strong>{msg.content === "start" ? "Iniciar" : msg.content}
                    </div>
                ))}
            </div>
            <input
                className="w-full border p-2 rounded"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí..."
            />

            <button
                onClick={() => sendMessage()}
                className="mt-2 w-full bg-black text-white p-2 rounded"
            >
                Enviar
            </button>
            <div className="mt-4">
                {result && <LeadResult result={result} />}
            </div>
        </div>
    )
}