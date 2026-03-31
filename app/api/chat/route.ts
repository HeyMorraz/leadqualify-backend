import { knowledgeBase } from "../lib/knowledgeBase";
import { NextResponse } from "next/server";
import { calculateScore } from "../lib/tools/calculateScore";

// 🔧 TOOL: guardar lead en n8n
const saveLead = async (lead: any) => {
    try {
        await fetch("http://localhost:7890/webhook-test/lead-qualify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                score: lead.score,
                category: lead.category,
                summary: lead.summary,
                answers: lead.answers,
                source: "chat"
            })
        });

        console.log("Lead enviado a n8n");
    } catch (error) {
        console.error("Error enviando a n8n:", error);
    }
};

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
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
                            Cuando tengas toda la información, responde SOLO con JSON válido:
                            Los datos deben estar NORMALIZADOS y ESTRUCTURADOS:

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
                        
                            `
                    },
                    ...body.messages
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message;

        // PARSEO SEGURO
        let parsed = null;

        try {
            const match = aiMessage?.content?.match(/\{[\s\S]*\}/);
            if (match) {
                parsed = JSON.parse(match[0]);
            }
        } catch (e) {
            console.error("Error parseando JSON:", e);
        }

        // TOOL AUTOMÁTICO EN BACKEND
        if (parsed && parsed.answers) {
            console.log("ANSWERS DETECTADOS:", parsed.answers);
            // CALCULAR SCORE REAL
            const { score, category } = calculateScore(parsed.answers);

            const finalLead = {
                ...parsed,
                score,
                category,
                source: "chat", // 🔥 importante
                createdAt: new Date().toISOString()
                
            };

            let tag = "";

            if (category === "Warm") tag = "nurture";
            if (category === "Hot") tag = "priority";

            finalLead.tag = tag;
            

            //  ENVIAR A n8n
            await saveLead(finalLead);

            return NextResponse.json({
                ...data,
                finalLead
            });
        }

        //  ESTA LÍNEA FALTABA (CRÍTICA)
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error en API:", error);
        return NextResponse.json({ error: "Error en servidor" }, { status: 500 });
    }
}