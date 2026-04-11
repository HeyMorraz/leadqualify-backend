export type NeedType = "automatización" | "optimización" | "otro" | "";
export type AuthorityLevel = "CEO" | "Director" | "Manager" | "Otro" | "";
export type TimelineOption = "1" | "3" | "6" | "12" | "";

export interface LeadFormAnswers {
  name: string;
  company: string;
  email: string;
  phone: string;

  need: NeedType;
  budget: string;
  authority: AuthorityLevel;
  timeline: TimelineOption;
}

export interface FormStepOption {
  label: string;
  value: string;
}

export interface FormStep {
  id: string;
  field: keyof LeadFormAnswers;
  question: string;
  inputType: "text" | "email" | "tel" | "number" | "options";
  placeholder?: string;
  options?: FormStepOption[];
}

export const initialLeadFormAnswers: LeadFormAnswers = {
  name: "",
  company: "",
  email: "",
  phone: "",
  need: "",
  budget: "",
  authority: "",
  timeline: "",
};