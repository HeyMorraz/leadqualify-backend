export const saveLead = async (lead: any) => {
  await fetch("https://localhost:7890/webhook/lead-qualify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      score: lead.score,
      category: lead.category,
      answers: lead.answers,
      source: "chat",
      summary: lead.summary
    })
  });
  console.log("ENVIANDO A N8N", lead);
};