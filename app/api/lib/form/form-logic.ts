import { LeadFormAnswers } from "@/app/types/lead-form";

export function shouldShowNeedDescription(answers: LeadFormAnswers): boolean {
  return answers.needType !== "";
}

export function shouldShowBudgetRange(answers: LeadFormAnswers): boolean {
  return answers.budgetStatus === "assigned" || answers.budgetStatus === "exploring";
}

export function shouldShowDecisionMakerRole(answers: LeadFormAnswers): boolean {
  return answers.authorityLevel === "recommender" || answers.authorityLevel === "researcher";
}

export function isCorporateEmail(email: string): boolean {
  if (!email.includes("@")) return false;

  const domain = email.split("@")[1]?.toLowerCase() ?? "";

  const personalDomains = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
    "live.com",
  ];

  return domain !== "" && !personalDomains.includes(domain);
}

export function validateStep(stepId: string, answers: LeadFormAnswers): boolean {
  switch (stepId) {
    case "base":
      return Boolean(
        answers.name.trim() &&
          answers.email.trim() &&
          answers.company.trim() &&
          answers.industry.trim() &&
          answers.companySize.trim()
      );

    case "need":
      return Boolean(
        answers.needType &&
          (!shouldShowNeedDescription(answers) || answers.needDescription.trim())
      );

    case "budget":
      if (!answers.budgetStatus) return false;
      if (shouldShowBudgetRange(answers)) {
        return Boolean(answers.budgetRange.trim());
      }
      return true;

    case "authority":
      if (!answers.authorityLevel) return false;
      if (shouldShowDecisionMakerRole(answers)) {
        return Boolean(answers.decisionMakerRole.trim());
      }
      return true;

    case "timeline":
      return Boolean(answers.timeline);

    default:
      return false;
  }
}