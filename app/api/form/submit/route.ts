import { NextResponse } from "next/server";
import { calculateScore } from "@/app/api/lib/tools/calculateScore";

const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://testnikguai.app.n8n.cloud/webhook-test/lead-qualify";

function parseBudget(value: string) {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function isCorporateEmail(email: string) {
  const normalized = email.toLowerCase();
  const freeDomains = [
    "@gmail.com",
    "@hotmail.com",
    "@outlook.com",
    "@live.com",
    "@yahoo.com",
    "@icloud.com",
  ];

  return !freeDomains.some((domain) => normalized.endsWith(domain));
}

function buildSummary(payload: {
  name: string;
  company: string;
  need: string;
  timeline: number;
}) {
  const timelineText =
    payload.timeline <= 1
      ? "corto plazo"
      : payload.timeline <= 3
      ? "1 a 3 meses"
      : payload.timeline <= 6
      ? "3 a 6 meses"
      : "más de 6 meses";

  return `${payload.name} de ${payload.company} mostró interés en ${payload.need} con implementación estimada en ${timelineText}.`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const contact = {
      name: String(body.name || "").trim(),
      company: String(body.company || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
    };

    if (!contact.name || !contact.company || !contact.email || !contact.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos de contacto obligatorios.",
        },
        { status: 400 }
      );
    }

    const answers = {
      budget: parseBudget(String(body.budget || "0")),
      authority: String(body.authority || "Otro"),
      need: String(body.need || "otro"),
      timeline: Number(body.timeline || 6),
    };

    const signals = {
      emailCorporate: isCorporateEmail(contact.email),
    };

    const { score, category } = calculateScore(answers, signals);

    const summary = buildSummary({
      name: contact.name,
      company: contact.company,
      need: answers.need,
      timeline: answers.timeline,
    });

    const payload = {
      score,
      category,
      summary,
      answers,
      contact,
      source: "form",
    };

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const webhookText = await webhookResponse.text();

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "No se pudo enviar la información al flujo.",
          details: webhookText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error en /api/form/submit:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}