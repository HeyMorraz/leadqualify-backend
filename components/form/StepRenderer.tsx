import { LeadFormAnswers } from "@/app/types/lead-form";
import {
  shouldShowBudgetRange,
  shouldShowDecisionMakerRole,
  shouldShowNeedDescription,
} from "@/app/api/lib/form/form-logic";

type StepRendererProps = {
  stepId: string;
  answers: LeadFormAnswers;
  onChange: (
    field: keyof LeadFormAnswers,
    value: string | boolean
  ) => void;
};

export default function StepRenderer({
  stepId,
  answers,
  onChange,
}: StepRendererProps) {
  if (stepId === "base") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nombre">
          <Input
            value={answers.name}
            placeholder="Nombre completo"
            onChange={(value) => onChange("name", value)}
          />
        </Field>

        <Field label="Correo corporativo">
          <Input
            type="email"
            value={answers.email}
            placeholder="correo@empresa.com"
            onChange={(value) => onChange("email", value)}
          />
        </Field>

        <Field label="Empresa">
          <Input
            value={answers.company}
            placeholder="Nombre de la empresa"
            onChange={(value) => onChange("company", value)}
          />
        </Field>

        <Field label="Industria">
          <Input
            value={answers.industry}
            placeholder="Industria o sector"
            onChange={(value) => onChange("industry", value)}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Tamaño de la empresa">
            <Input
              value={answers.companySize}
              placeholder="Ej. 1-10, 11-50, 51-200"
              onChange={(value) => onChange("companySize", value)}
            />
          </Field>
        </div>
      </div>
    );
  }

  if (stepId === "need") {
    return (
      <div className="space-y-8">
        <Field label="¿Qué describe mejor la necesidad actual?">
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <OptionCard
              selected={answers.needType === "automation"}
              label="Automatización"
              onClick={() => onChange("needType", "automation")}
            />
            <OptionCard
              selected={answers.needType === "optimization"}
              label="Optimización"
              onClick={() => onChange("needType", "optimization")}
            />
            <OptionCard
              selected={answers.needType === "lead_generation"}
              label="Generación de leads"
              onClick={() => onChange("needType", "lead_generation")}
            />
            <OptionCard
              selected={answers.needType === "cost_reduction"}
              label="Reducción de costos"
              onClick={() => onChange("needType", "cost_reduction")}
            />
            <OptionCard
              selected={answers.needType === "other"}
              label="Otro"
              onClick={() => onChange("needType", "other")}
            />
          </div>
        </Field>

        {shouldShowNeedDescription(answers) && (
          <Field label="Cuéntanos brevemente qué necesitan">
            <TextArea
              value={answers.needDescription}
              placeholder="Describe la necesidad principal del prospecto"
              onChange={(value) => onChange("needDescription", value)}
            />
          </Field>
        )}

        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">
            ¿Alguna de estas situaciones aplica?
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <CheckboxCard
              checked={answers.mentionsCompetitor}
              label="Estamos comparando otras soluciones o proveedores"
              onClick={() =>
                onChange("mentionsCompetitor", !answers.mentionsCompetitor)
              }
            />

            <CheckboxCard
              checked={answers.asksForPricing}
              label="Queremos conocer precios o rangos de inversión"
              onClick={() =>
                onChange("asksForPricing", !answers.asksForPricing)
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (stepId === "budget") {
    return (
      <div className="space-y-8">
        <Field label="¿Tienen presupuesto asignado para este proyecto?">
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <OptionCard
              selected={answers.budgetStatus === "assigned"}
              label="Sí, asignado"
              onClick={() => onChange("budgetStatus", "assigned")}
            />
            <OptionCard
              selected={answers.budgetStatus === "exploring"}
              label="Aún evaluándolo"
              onClick={() => onChange("budgetStatus", "exploring")}
            />
            <OptionCard
              selected={answers.budgetStatus === "none"}
              label="Todavía no"
              onClick={() => onChange("budgetStatus", "none")}
            />
          </div>
        </Field>

        {shouldShowBudgetRange(answers) && (
          <Field label="¿Cuál es el rango estimado?">
            <Input
              value={answers.budgetRange}
              placeholder="Ej. USD 5,000 - 10,000"
              onChange={(value) => onChange("budgetRange", value)}
            />
          </Field>
        )}
      </div>
    );
  }

  if (stepId === "authority") {
    return (
      <div className="space-y-8">
        <Field label="¿Cuál es tu rol dentro de esta decisión?">
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <OptionCard
              selected={answers.authorityLevel === "decision_maker"}
              label="Tomo la decisión"
              onClick={() => onChange("authorityLevel", "decision_maker")}
            />
            <OptionCard
              selected={answers.authorityLevel === "recommender"}
              label="Recomiendo opciones"
              onClick={() => onChange("authorityLevel", "recommender")}
            />
            <OptionCard
              selected={answers.authorityLevel === "researcher"}
              label="Estoy investigando"
              onClick={() => onChange("authorityLevel", "researcher")}
            />
          </div>
        </Field>

        {shouldShowDecisionMakerRole(answers) && (
          <Field label="¿Quién suele aprobar este tipo de proyectos?">
            <Input
              value={answers.decisionMakerRole}
              placeholder="Ej. Dirección general, gerencia, CTO"
              onChange={(value) => onChange("decisionMakerRole", value)}
            />
          </Field>
        )}
      </div>
    );
  }

  if (stepId === "timeline") {
    return (
      <Field label="¿En qué plazo les gustaría implementar una solución?">
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <OptionCard
            selected={answers.timeline === "1_3"}
            label="1 a 3 meses"
            onClick={() => onChange("timeline", "1_3")}
          />
          <OptionCard
            selected={answers.timeline === "3_6"}
            label="3 a 6 meses"
            onClick={() => onChange("timeline", "3_6")}
          />
          <OptionCard
            selected={answers.timeline === "later"}
            label="Más adelante"
            onClick={() => onChange("timeline", "later")}
          />
          <OptionCard
            selected={answers.timeline === "researching"}
            label="Solo estamos explorando"
            onClick={() => onChange("timeline", "researching")}
          />
        </div>
      </Field>
    );
  }

  return null;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
    />
  );
}

function TextArea({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      rows={5}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-sm outline-none transition focus:border-slate-400"
    />
  );
}

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[56px] rounded-2xl border px-4 py-4 text-center text-sm font-medium transition ${
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function CheckboxCard({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[72px] rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
        checked
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}