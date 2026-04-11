export const calculateScore = (answers: any, signals: any = {}) => {
  let score = 0;

  const { budget, authority, need, timeline } = answers;

  if (budget >= 5000) score += 25;
  else if (budget >= 2000) score += 15;
  else if (budget > 0) score += 5;

  if (authority === "CEO" || authority === "Director") score += 25;
  else if (authority === "Manager") score += 15;
  else score += 5;

  if (need === "automatización") score += 25;
  else if (need === "optimización") score += 15;
  else score += 10;

  if (timeline <= 1) score += 25;
  else if (timeline <= 3) score += 20;
  else if (timeline <= 6) score += 10;
  else score += 5;

  if (signals.emailCorporate) score += 5;
  if (signals.mentionsCompetitor) score += 3;
  if (signals.askPricing) score += 2;

  let category = "Cold";
  if (score >= 70) category = "Hot";
  else if (score >= 40) category = "Warm";

  return { score, category };
};