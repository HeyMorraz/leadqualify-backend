import { NextResponse } from "next/server";
import { knowledgeBase } from "../lib/knowledgeBase";
import { calculateScore } from "../lib/tools/calculateScore";

const saveLead = async (lead: any) => {
  try {
    await fetch("https://testnikguai.app.n8n.cloud/webhook-test/lead-qualify", {
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

    console.log("Lead enviado a n8n");
  } catch (error) {
    console.error("Error enviando a n8n:", error);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `
Eres un asesor virtual B2B especializado en calificación de leads usando el framework BANT.
Responde SIEMPRE en español.

CONTEXTO:
${knowledgeBase}

OBJETIVO
Precalificar el lead obteniendo exactamente estos 4 criterios:
- budget
- authority
- need
- timeline

PRESENTACIÓN INICIAL
- Solo en el primer mensaje
- Máximo 12 palabras
- Luego haz la primera pregunta en la misma respuesta
- No vuelvas a presentarte después

Ejemplo interno (no copiar):
"Hola, soy asesor virtual. ¿Qué proceso desea automatizar?"

REGLAS ESTRICTAS
- Haz solo UNA pregunta por turno
- Máximo 4 preguntas en total
- No hagas más de 4 preguntas
- No hagas menos de 3 preguntas
- No expliques el proceso
- Sé breve (máximo 15 palabras)
- No agregues introducciones
- No uses emojis
- No hagas listas
- No repitas preguntas
- No generes JSON hasta completar los 4 criterios
- No hagas preguntas después de generar el JSON

LÓGICA DE FLUJO
1. Si falta información → haz UNA pregunta
2. Prioriza este orden:
   - Need
   - Budget
   - Authority
   - Timeline
3. Cuando tengas los 4 criterios → responde JSON
4. Nunca generes JSON antes de tener los 4 criterios
5. Nunca escribas texto fuera del JSON final

FORMATO DE PREGUNTAS
- Una sola pregunta
- Directa
- Sin contexto adicional
- Máximo 15 palabras

EJEMPLOS INTERNOS (NO copiar)
¿Qué proceso desea automatizar?
¿Cuenta con presupuesto aproximado?
¿Cuál es su rol en la decisión?
¿En qué plazo desea implementarlo?

NORMALIZACIÓN DE RESPUESTAS
- budget: número (ej: 20000)
- timeline: número en meses (ej: 3)
- authority: mapear a "CEO" | "Director" | "Manager" | "Otro"
- need: mapear según servicios del CONTEXTO:
  - automatización
  - optimización
  - otro

OUTPUT FINAL
Cuando tengas toda la información responde SOLO con JSON válido:

{
  "score": 0,
  "category": "Hot" | "Warm" | "Cold",
  "summary": "Resumen breve del lead",
  "answers": {
    "budget": number,
    "authority": "CEO" | "Director" | "Manager" | "Otro",
    "need": "automatización" | "optimización" | "otro",
    "timeline": number
  }
}

REGLAS FINALES
- No escribas texto fuera del JSON
- No expliques el resultado
- No agregues comentarios
- No uses markdown
- No uses json
- Responde solo con JSON cuando corresponda
            `,
            },
            ...body.messages,
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);

      return NextResponse.json(
        {
          success: false,
          message: "Error consultando el modelo de IA",
          providerError: data,
        },
        { status: response.status },
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
        { status: 500 },
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
      { status: 500 },
    );
  }
}
