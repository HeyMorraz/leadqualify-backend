import { NextResponse } from "next/server";
import { knowledgeBase } from "@/app/api/lib/knowledgeBase";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://testnikguai.app.n8n.cloud/webhook-test/lead-qualify";

function extractJsonObject(content: string) {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Error parseando JSON del formulario:", error);
    return null;
  }
}

function isValidFinalLead(data: any) {
  return (
    data &&
    typeof data === "object" &&
    data.contact &&
    typeof data.contact.name === "string" &&
    typeof data.contact.company === "string" &&
    typeof data.contact.email === "string" &&
    typeof data.contact.phone === "string" &&
    data.answers &&
    typeof data.answers.budget === "number" &&
    typeof data.answers.authority === "string" &&
    typeof data.answers.need === "string" &&
    typeof data.answers.timeline === "number" &&
    typeof data.score === "number" &&
    typeof data.category === "string" &&
    typeof data.summary === "string"
  );
}

function resolveTag(category: string) {
  if (category === "Hot") return "priority";
  if (category === "Warm") return "nurture";
  return "";
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Falta configurar OPENROUTER_API_KEY en el entorno.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const rawPayload = {
      name: String(body.name || "").trim(),
      company: String(body.company || "").trim(),
      email: String(body.email || "").trim(),
      phone: String(body.phone || "").trim(),
      need: String(body.need || "").trim(),
      budget: String(body.budget || "").trim(),
      authority: String(body.authority || "").trim(),
      timeline: String(body.timeline || "").trim(),
    };

    if (
      !rawPayload.name ||
      !rawPayload.company ||
      !rawPayload.email ||
      !rawPayload.phone ||
      !rawPayload.need ||
      !rawPayload.budget ||
      !rawPayload.authority ||
      !rawPayload.timeline
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos obligatorios del formulario.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `
Eres un evaluador B2B especializado en calificación de leads con framework BANT.
Responde únicamente con JSON válido.
Responde en español.

CONTEXTO:
${knowledgeBase}

TAREA
Recibirás un objeto con datos enviados desde un formulario web.
Debes:
1. Normalizar los datos del contacto
2. Normalizar las respuestas BANT
3. Calcular score
4. Determinar category
5. Redactar summary
6. Devolver un único JSON válido

REGLAS DE NORMALIZACIÓN

contact:
- name: conservar tal como venga, limpio
- company: conservar tal como venga, limpio
- email: conservar tal como venga en minúsculas
- phone: conservar tal como venga, limpio

budget:
- Si viene como número o texto con monto, conviértelo a número
- Si viene como rango, usa el valor medio
- Si no está claro o no sabe, usa 0

authority:
- CEO, dueño, fundador → "CEO"
- Director, VP, gerente general → "Director"
- Coordinador, jefe de área, supervisor, manager, jefatura → "Manager"
- Otro caso → "Otro"

need:
- Procesos repetitivos, flujos, registros, integración, tareas manuales → "automatización"
- Eficiencia, mejora operativa, reducción de costos, reportes, optimización → "optimización"
- Otro caso → "otro"

timeline:
- Convierte siempre a número en meses
- "lo antes posible" → 1
- "1 a 3 meses" → 3
- "3 a 6 meses" → 6
- "más de 6 meses" → 7
- ambiguo o "no sé" → 6
- "1 año" → 12

REGLAS PARA SCORE
Calcula el score tú mismo en escala 0 a 100:
- Budget:
  - >= 5000 → +30
  - >= 2000 y < 5000 → +20
  - > 0 y < 2000 → +10
  - 0 → +0
- Authority:
  - CEO → +25
  - Director → +18
  - Manager → +10
  - Otro → +5
- Need:
  - automatización → +20
  - optimización → +15
  - otro → +10
- Timeline:
  - <= 1 mes → +20
  - <= 3 meses → +15
  - <= 6 meses → +10
  - > 6 meses → +5

CATEGORÍA
- score >= 70 → "Hot"
- score >= 40 y < 70 → "Warm"
- score < 40 → "Cold"

SUMMARY
Genera una sola oración breve, profesional y clara, en español.

OUTPUT
Devuelve únicamente este JSON válido:

{
  "contact": {
    "name": "string",
    "company": "string",
    "email": "string",
    "phone": "string"
  },
  "score": 0,
  "category": "Hot",
  "summary": "Resumen breve del lead en una oración",
  "answers": {
    "budget": 0,
    "authority": "CEO",
    "need": "automatización",
    "timeline": 1
  }
}

REGLAS FINALES
- No escribas nada fuera del JSON
- No uses markdown
- No uses bloques de código
- No agregues comentarios
- Devuelve un único objeto JSON válido
            `,
          },
          {
            role: "user",
            content: JSON.stringify(rawPayload),
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error en formulario:", data);

      return NextResponse.json(
        {
          success: false,
          message:
            data?.error?.message ||
            data?.message ||
            "Error consultando el modelo de IA.",
          details: data,
        },
        { status: response.status }
      );
    }

    const aiMessage = data?.choices?.[0]?.message;

    if (!aiMessage || typeof aiMessage.content !== "string") {
      console.error("Respuesta inválida de OpenRouter en formulario:", data);

      return NextResponse.json(
        {
          success: false,
          message: "La IA no devolvió un mensaje válido.",
          details: data,
        },
        { status: 500 }
      );
    }

    const parsed = extractJsonObject(aiMessage.content);

    if (!isValidFinalLead(parsed)) {
      console.error("Lead inválido devuelto por IA:", aiMessage.content);

      return NextResponse.json(
        {
          success: false,
          message: "La IA no devolvió un lead válido.",
          details: aiMessage.content,
        },
        { status: 500 }
      );
    }

    const payload = {
      ...parsed,
      source: "form",
      tag: resolveTag(parsed.category),
      createdAt: new Date().toISOString(),
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
      lead: payload,
    });
  } catch (error) {
    console.error("Error en /api/form/submit:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}