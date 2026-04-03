export type BudgetStatus = "assigned" | "exploring" | "none" | "";
export type AuthorityLevel = "decision_maker" | "recommender" | "researcher" | "";
export type NeedType =
  | "automation"
  | "optimization"
  | "lead_generation"
  | "cost_reduction"
  | "other"
  | "";
export type TimelineOption = "1_3" | "3_6" | "later" | "researching" | "";

export interface LeadFormAnswers {
  name: string;
  email: string;
  company: string;
  industry: string;
  companySize: string;

  needType: NeedType;
  needDescription: string;

  budgetStatus: BudgetStatus;
  budgetRange: string;

  authorityLevel: AuthorityLevel;
  decisionMakerRole: string;

  timeline: TimelineOption;

  mentionsCompetitor: boolean;
  asksForPricing: boolean;
}

export interface LeadScoreBreakdown {
  budget: number;
  authority: number;
  need: number;
  timeline: number;
  bonus: number;
}

export type LeadCategory = "Hot" | "Warm" | "Cold";

export interface LeadScoreResult {
  totalScore: number;
  category: LeadCategory;
  breakdown: LeadScoreBreakdown;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: Array<keyof LeadFormAnswers>;
}

export const initialLeadFormAnswers: LeadFormAnswers = {
  name: "",
  email: "",
  company: "",
  industry: "",
  companySize: "",

  needType: "",
  needDescription: "",

  budgetStatus: "",
  budgetRange: "",

  authorityLevel: "",
  decisionMakerRole: "",

  timeline: "",

  mentionsCompetitor: false,
  asksForPricing: false,
};