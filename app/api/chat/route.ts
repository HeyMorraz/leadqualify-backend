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
        contact: lead.contact,
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

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
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
Eres un asesor virtual B2B especializado en calificación de leads usando el framework BANT.
Responde SIEMPRE en español.

CONTEXTO:
${knowledgeBase}

OBJETIVO
Obtener OBLIGATORIAMENTE los 4 datos de contacto y 4 criterios BANT antes de generar el JSON final.

PRESENTACIÓN INICIAL (OBLIGATORIA EN EL PRIMER MENSAJE)
- DEBES presentarte en el primer turno, antes de cualquier pregunta
- Máximo 12 palabras
- Ejemplo: "Soy tu asistente de calificación de leads. Vamos a comenzar."
- Luego de la presentación, EN EL MISMO MENSAJE, haz la primera pregunta: "¿Cuál es tu nombre completo?"
- No vuelvas a presentarte en ningún otro mensaje

RECOPILACIÓN DE DATOS DE CONTACTO
Solicita los 4 datos UNO POR UNO, en turnos separados, en este orden exacto:
1. Turno 1: [PRESENTACIÓN] + "¿Cuál es tu nombre completo?"
2. Turno 2 (después de recibir nombre): "¿En qué empresa trabaja?"
3. Turno 3 (después de recibir empresa): "¿Cuál es tu email?"
4. Turno 4 (después de recibir email): "¿Cuál es tu teléfono?"
Después de recibir teléfono, avanza a las preguntas BANT.

REGLA ABSOLUTA DE PREGUNTAS BANT
Debes hacer EXACTAMENTE 4 preguntas BANT, una por turno, en este orden fijo:
1. Need → ¿Qué proceso necesita automatizar u optimizar?
2. Budget → ¿Cuenta con presupuesto definido para este proyecto? ¿Cuánto aproximadamente?
3. Authority → ¿Cuál es su rol en la toma de decisión?
4. Timeline → ¿En qué plazo espera implementar la solución?

PROHIBICIONES ABSOLUTAS
- NUNCA omitas la presentación en el primer mensaje
- NUNCA hagas una pregunta sin antes presentarte (si es el primer turno)
- NUNCA generes JSON antes de tener los 4 datos de contacto y respuestas a las 4 preguntas BANT
- NUNCA generes JSON parcial ni intermedio
- NUNCA asumas un criterio a partir de una respuesta parcial o ambigua
- NUNCA combines dos preguntas en un mismo turno
- NUNCA repitas una pregunta ya hecha
- NUNCA escribas texto fuera del JSON final
- NUNCA uses emojis
- NUNCA uses listas
- NUNCA expliques el proceso al usuario
- NUNCA avances a preguntas BANT sin tener los 4 datos de contacto completos

CONTADOR INTERNO (no visible al usuario)
Antes de cada respuesta, verifica internamente:
- ¿Tengo nombre completo?
- ¿Tengo empresa?
- ¿Tengo email?
- ¿Tengo teléfono?
- ¿Cuántas preguntas BANT he hecho? (máx. 4)
- Si falta algún dato de contacto → solicita el siguiente en orden
- Si tengo todos los contactos pero NO las 4 respuestas BANT → haz la siguiente pregunta BANT
- Si tengo todo (4 contacto + 4 BANT) → genera el JSON final

REGLAS DE RESPUESTA
- Máximo 15 palabras por turno (excluyendo el JSON final)
- Solo una pregunta por turno
- Directa, sin contexto adicional

NORMALIZACIÓN DE RESPUESTAS

contact (extrae de la respuesta del usuario los 4 datos en orden: nombre, empresa, email, teléfono):
- name: Primer dato mencionado - almacena exactamente tal como responda
- company: Segundo dato mencionado - almacena exactamente tal como responda
- email: Tercer dato mencionado - almacena exactamente tal como responda
- phone: Cuarto dato mencionado - almacena exactamente tal como responda

budget:
- Si da un número → úsalo tal cual (ej: 20000)
- Si dice "no sé" o es ambiguo → 0
- Si da un rango → usa el valor medio (ej: "entre 10000 y 20000" → 15000)

timeline:
- Convierte siempre a número en meses (ej: "3 meses" → 3, "1 año" → 12)
- Si dice "lo antes posible" → 1
- Si dice "no sé" o es ambiguo → 6

authority:
- CEO, dueño, fundador → "CEO"
- Director, VP, gerente general → "Director"
- Coordinador, jefe de área, supervisor → "Manager"
- Cualquier otro → "Otro"

need:
- Procesos repetitivos, flujos, registros, datos → "automatización"
- Mejora de eficiencia, reducción de costos, reportes → "optimización"
- Cualquier otro → "otro"

OUTPUT FINAL
Solo cuando tengas los 4 datos de contacto + 4 respuestas BANT, responde ÚNICAMENTE con este JSON válido y nada más:

{
  "contact": {
    "name": "string",
    "company": "string",
    "email": "string",
    "phone": "string"
  },
  "score": 0,
  "category": "Hot" | "Warm" | "Cold",
  "summary": "Resumen breve del lead en una oración",
  "answers": {
    "budget": number,
    "authority": "CEO" | "Director" | "Manager" | "Otro",
    "need": "automatización" | "optimización" | "otro",
    "timeline": number
  }
}

REGLAS DEL OUTPUT
- El campo score siempre va en 0 (se calcula externamente)
- No escribas nada antes ni después del JSON
- No uses bloques de código ni markdown
- No uses la palabra json
- Un solo objeto JSON, nunca más de uno
- No agregues comentarios dentro del JSON
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

    if (parsed && parsed.answers && parsed.contact) {
      const { score, category } = calculateScore(parsed.answers);

      let categoryMessage = "";

      if (category === "Hot") {
        categoryMessage = "Muchas gracias por la información. Un asesor de nuestro equipo se pondrá en contacto contigo muy pronto para acompañarte en el siguiente paso.";
      } else if (category === "Warm") {
        categoryMessage = "Muchas gracias por compartir esta información. Te estaremos enviando contenido y detalles que pueden ayudarte a avanzar en tu proceso.";
      } else {
        categoryMessage = "Muchas gracias por tu interés. Ha sido un gusto conversar contigo y quedamos a disposición para cuando lo necesites.";
      }

      const finalLead: any = {
        ...parsed,
        score,
        category,
        source: "chat",
        createdAt: new Date().toISOString(),
        message: categoryMessage, // 👈 ESTO FALTABA
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
