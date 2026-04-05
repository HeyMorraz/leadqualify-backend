export const saveLead = async (lead: any) => {
  await fetch("https://testnikguai.app.n8n.cloud/webhook-test/lead-qualify", {
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
};