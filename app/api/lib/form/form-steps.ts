import { FormStep } from "@/app/types/lead-form";

export const formSteps: FormStep[] = [
  {
    id: "base",
    title: "Cuéntanos sobre ti y tu empresa",
    description: "Empecemos con la información principal del prospecto.",
    fields: ["name", "email", "company", "industry", "companySize"],
  },
  {
    id: "need",
    title: "Entendamos la necesidad",
    description: "Queremos saber qué problema están buscando resolver.",
    fields: ["needType", "needDescription", "mentionsCompetitor", "asksForPricing"],
  },
  {
    id: "budget",
    title: "Hablemos del presupuesto",
    description: "Esto nos ayuda a entender el nivel de prioridad y viabilidad.",
    fields: ["budgetStatus", "budgetRange"],
  },
  {
    id: "authority",
    title: "Nivel de decisión",
    description: "Necesitamos conocer el rol del contacto dentro del proceso.",
    fields: ["authorityLevel", "decisionMakerRole"],
  },
  {
    id: "timeline",
    title: "Tiempo estimado",
    description: "¿En qué etapa se encuentra actualmente esta oportunidad?",
    fields: ["timeline"],
  },
];