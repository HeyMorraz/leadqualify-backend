import { NextResponse } from "next/server";
import { knowledgeBase } from "../lib/knowledgeBase";
import { calculateScore } from "../lib/tools/calculateScore";

const saveLead = async (lead: any) => {
  try {
    await fetch("https://testnikguai.app.n8n.cloud/webhook-test/lead-qualify", { //http://localhost:7890/webhook-test/lead-qualify
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: lead.score,
        category: lead.category,
        summary: lead.summary,
        answers: lead.answers,
        source: "chat",
      }),
    });

  } catch (error) {
    //console.error("Error enviando a n8n:", error);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
Eres un asesor virtual especializado en calificar leads B2B usando el framework BANT.

Responde SIEMPRE en español.

CONTEXTO:
${knowledgeBase}

COMPORTAMIENTO:
- Sé conversacional y natural
- Haz una sola pregunta a la vez
- Debes obtener: presupuesto, autoridad, necesidad y tiempo
- No evalúes hasta tener toda la información

IMPORTANTE:
Cuando tengas toda la información, responde SOLO con JSON válido.
Los datos deben estar NORMALIZADOS y ESTRUCTURADOS así:

{
  "score": number,
  "category": "Hot" | "Warm" | "Cold",
  "summary": "Resumen del lead",
  "answers": {
    "budget": number,
    "authority": "CEO" | "Director" | "Manager" | "Otro",
    "need": "automatización" | "optimización" | "otro",
    "timeline": number
  }
}

REGLAS CRÍTICAS:
- budget debe ser número (ej: 20000)
- timeline debe ser número en meses (ej: 8)
- NO uses texto como "$20000"
- NO uses "8 meses"
- NO agregues texto fuera del JSON
            `,
          },
          ...body.messages,
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return NextResponse.json(
        {
          success: false,
          message: "Error consultando el modelo de IA",
          providerError: data,
        },
        { status: response.status }
      );
    }

    const aiMessage = data?.choices?.[0]?.message;

    if (!aiMessage || typeof aiMessage.content !== "string") {
      console.error("Respuesta inválida de OpenRouter:", data);

      return NextResponse.json(
        {
          success: false,
          message: "La IA no devolvió un mensaje válido",
          raw: data,
        },
        { status: 500 }
      );
    }

    let parsed = null;

    try {
      const match = aiMessage.content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    } catch (e) {
      console.error("Error parseando JSON:", e);
    }

    if (parsed && parsed.answers) {
      const { score, category } = calculateScore(parsed.answers);

      const finalLead: any = {
        ...parsed,
        score,
        category,
        source: "chat",
        createdAt: new Date().toISOString(),
      };

      let tag = "";
      if (category === "Warm") tag = "nurture";
      if (category === "Hot") tag = "priority";

      finalLead.tag = tag;

      await saveLead(finalLead);

      return NextResponse.json({
        success: true,
        aiMessage,
        finalLead,
      });
    }

    return NextResponse.json({
      success: true,
      aiMessage,
    });
  } catch (error) {
    console.error("Error en API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error en servidor",
      },
      { status: 500 }
    );
  }
}