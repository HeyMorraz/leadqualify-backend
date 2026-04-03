import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Chat de precalificación con IA
          </h1>
          <p className="mt-3 text-slate-600">
            Responde algunas preguntas y nuestro asistente evaluará el lead en
            tiempo real.
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <ChatWidget  />
        </div>
      </div>
    </main>
  );
}