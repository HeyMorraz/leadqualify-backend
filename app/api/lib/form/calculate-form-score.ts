import {
  LeadCategory,
  LeadFormAnswers,
  LeadScoreBreakdown,
  LeadScoreResult,
} from "@/app/types/lead-form";
import { isCorporateEmail } from "./form-logic";

function getBudgetScore(answers: LeadFormAnswers): number {
  if (answers.budgetStatus === "assigned") return 25;
  if (answers.budgetStatus === "exploring") return 15;
  if (answers.budgetStatus === "none") return 5;
  return 0;
}

function getAuthorityScore(answers: LeadFormAnswers): number {
  if (answers.authorityLevel === "decision_maker") return 25;
  if (answers.authorityLevel === "recommender") return 15;
  if (answers.authorityLevel === "researcher") return 5;
  return 0;
}

function getNeedScore(answers: LeadFormAnswers): number {
  if (!answers.needType) return 0;

  if (
    answers.needType === "automation" ||
    answers.needType === "optimization" ||
    answers.needType === "lead_generation" ||
    answers.needDescription.trim().length >= 25
  ) {
    return 25;
  }

  if (answers.needType === "cost_reduction" || answers.needDescription.trim().length >= 10) {
    return 15;
  }

  return 5;
}

function getTimelineScore(answers: LeadFormAnswers): number {
  if (answers.timeline === "1_3") return 25;
  if (answers.timeline === "3_6") return 15;
  if (answers.timeline === "later" || answers.timeline === "researching") return 5;
  return 0;
}

function getBonusScore(answers: LeadFormAnswers): number {
  let bonus = 0;

  if (isCorporateEmail(answers.email)) bonus += 5;
  if (answers.mentionsCompetitor) bonus += 3;
  if (answers.asksForPricing) bonus += 2;

  return Math.min(bonus, 10);
}

function resolveCategory(score: number): LeadCategory {
  if (score >= 70) return "Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}

export function calculateFormScore(answers: LeadFormAnswers): LeadScoreResult {
  const breakdown: LeadScoreBreakdown = {
    budget: getBudgetScore(answers),
    authority: getAuthorityScore(answers),
    need: getNeedScore(answers),
    timeline: getTimelineScore(answers),
    bonus: getBonusScore(answers),
  };

  const totalScore =
    breakdown.budget +
    breakdown.authority +
    breakdown.need +
    breakdown.timeline +
    breakdown.bonus;

  return {
    totalScore,
    category: resolveCategory(totalScore),
    breakdown,
  };
}