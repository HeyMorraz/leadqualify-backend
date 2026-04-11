import { FormStep } from "@/app/types/lead-form";

export const formSteps: FormStep[] = [
  {
    id: "name",
    field: "name",
    question: "¿Cuál es tu nombre completo?",
    inputType: "text",
    placeholder: "Escribe tu nombre completo",
  },
  {
    id: "company",
    field: "company",
    question: "¿En qué empresa trabajas?",
    inputType: "text",
    placeholder: "Nombre de la empresa",
  },
  {
    id: "email",
    field: "email",
    question: "¿Cuál es tu correo electrónico?",
    inputType: "email",
    placeholder: "correo@empresa.com",
  },
  {
    id: "phone",
    field: "phone",
    question: "¿Cuál es tu teléfono?",
    inputType: "tel",
    placeholder: "Tu número de teléfono",
  },
  {
    id: "need",
    field: "need",
    question: "¿Qué necesitas resolver actualmente?",
    inputType: "options",
    options: [
      { label: "Automatización", value: "automatización" },
      { label: "Optimización", value: "optimización" },
      { label: "Otro", value: "otro" },
    ],
  },
  {
    id: "budget",
    field: "budget",
    question: "¿Con qué presupuesto aproximado cuentas? Si aún no lo defines, escribe 0.",
    inputType: "number",
    placeholder: "Ej. 5000",
  },
  {
    id: "authority",
    field: "authority",
    question: "¿Cuál es tu rol dentro de la decisión?",
    inputType: "options",
    options: [
      { label: "CEO / Dueño", value: "CEO" },
      { label: "Director / Gerencia", value: "Director" },
      { label: "Manager / Jefatura", value: "Manager" },
      { label: "Otro", value: "Otro" },
    ],
  },
  {
    id: "timeline",
    field: "timeline",
    question: "¿En qué plazo te gustaría implementar una solución?",
    inputType: "options",
    options: [
      { label: "Lo antes posible", value: "1" },
      { label: "1 a 3 meses", value: "3" },
      { label: "3 a 6 meses", value: "6" },
      { label: "Más de 6 meses", value: "12" },
    ],
  },
];