"use client";

import { useMemo, useState } from "react";
import { calculateFormScore } from "@/app/api/lib/form/calculate-form-score";
import { formSteps } from "@/app/api/lib/form/form-steps";
import { validateStep } from "@/app/api/lib/form/form-logic";
import {
  initialLeadFormAnswers,
  LeadFormAnswers,
} from "@/app/types/lead-form";
import FormProgress from "./FormProgress";
import StepRenderer from "./StepRenderer";

export default function LeadFormSection() {
  const [answers, setAnswers] = useState<LeadFormAnswers>(initialLeadFormAnswers);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentStep = formSteps[currentStepIndex];
  const totalSteps = formSteps.length;

  const scoreResult = useMemo(() => {
    return calculateFormScore(answers);
  }, [answers]);

  const isCurrentStepValid = validateStep(currentStep.id, answers);

  function handleChange(
    field: keyof LeadFormAnswers,
    value: string | boolean
  ) {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleNext() {
    if (!isCurrentStepValid) return;

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }

    setSubmitted(true);
  }

  function handleBack() {
    if (currentStepIndex === 0) return;
    setCurrentStepIndex((prev) => prev - 1);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Resultado de precalificación
          </h1>
          <p className="mt-3 text-slate-600">
            Este lead fue evaluado con base en reglas BANT.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Score total</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              {scoreResult.totalScore}
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-700">
              Categoría: {scoreResult.category}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700">
              Desglose del score
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Budget: {scoreResult.breakdown.budget}</li>
              <li>Authority: {scoreResult.breakdown.authority}</li>
              <li>Need: {scoreResult.breakdown.need}</li>
              <li>Timeline: {scoreResult.breakdown.timeline}</li>
              <li>Bonus: {scoreResult.breakdown.bonus}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-700">
            Resumen del prospecto
          </p>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <p><strong>Nombre:</strong> {answers.name}</p>
            <p><strong>Correo:</strong> {answers.email}</p>
            <p><strong>Empresa:</strong> {answers.company}</p>
            <p><strong>Industria:</strong> {answers.industry}</p>
            <p><strong>Tamaño:</strong> {answers.companySize}</p>
            <p><strong>Necesidad:</strong> {answers.needType || "N/A"}</p>
            <p><strong>Presupuesto:</strong> {answers.budgetStatus || "N/A"}</p>
            <p><strong>Timeline:</strong> {answers.timeline || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Formulario de precalificación
        </h1>
        <p className="mt-3 text-slate-600">
          Responde paso a paso y evaluaremos el lead según criterios BANT.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <FormProgress
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
        />

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className="mt-2 text-slate-600">{currentStep.description}</p>
          )}
        </div>

        <StepRenderer
          stepId={currentStep.id}
          answers={answers}
          onChange={handleChange}
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid}
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentStepIndex === totalSteps - 1 ? "Ver resultado" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}