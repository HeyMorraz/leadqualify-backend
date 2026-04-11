"use client";

import { useMemo, useState } from "react";
import { formSteps } from "@/app/api/form/form-steps";
import {
  FormStep,
  initialLeadFormAnswers,
  LeadFormAnswers,
} from "@/app/types/lead-form";
import StepRenderer from "./StepRenderer";

type LeadFormSectionProps = {
  embedded?: boolean;
};

const FIELD_LABELS: Record<keyof LeadFormAnswers, string> = {
  name: "Nombre",
  company: "Empresa",
  email: "Correo",
  phone: "Teléfono",
  need: "Necesidad",
  budget: "Presupuesto",
  authority: "Rol",
  timeline: "Plazo",
};

export default function LeadFormSection({
  embedded = false,
}: LeadFormSectionProps) {
  const [answers, setAnswers] = useState<LeadFormAnswers>(initialLeadFormAnswers);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentStep = formSteps[currentStepIndex];

  const currentValue = useMemo(() => {
    if (!currentStep) return "";
    return String(answers[currentStep.field] ?? "");
  }, [answers, currentStep]);

  const completedItems = useMemo(() => {
    return formSteps
      .slice(0, currentStepIndex)
      .map((step) => {
        const rawValue = String(answers[step.field] ?? "").trim();
        if (!rawValue) return null;

        return {
          key: step.field,
          label: FIELD_LABELS[step.field],
          value: getDisplayValue(step, rawValue),
        };
      })
      .filter(Boolean) as Array<{
      key: keyof LeadFormAnswers;
      label: string;
      value: string;
    }>;
  }, [answers, currentStepIndex]);

  function handleFieldChange(field: keyof LeadFormAnswers, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  }

  function isValidStep(step: FormStep, value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) return false;

    if (step.inputType === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
    }

    if (step.inputType === "tel") {
      return trimmedValue.length >= 7;
    }

    if (step.inputType === "number") {
      return !Number.isNaN(Number(trimmedValue));
    }

    return true;
  }

  async function submitLead(finalAnswers: LeadFormAnswers) {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch("/api/form/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalAnswers),
      });

      const rawText = await response.text();

      let data: { success?: boolean; message?: string; details?: string } = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(
          `El backend no devolvió JSON válido. Respuesta: ${rawText.slice(0, 180)}`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data?.details || data?.message || "No se pudo enviar el formulario"
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu información. Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleNext() {
    if (!currentStep || submitting) return;

    const value = String(answers[currentStep.field] ?? "");

    if (!isValidStep(currentStep, value)) return;

    const isLastStep = currentStepIndex === formSteps.length - 1;

    if (isLastStep) {
      await submitLead(answers);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  }

  function handleBack() {
    if (currentStepIndex === 0 || submitting) return;
    setError("");
    setCurrentStepIndex((prev) => prev - 1);
  }

  async function handleOptionSelect(value: string) {
    if (!currentStep || submitting) return;

    const updatedAnswers: LeadFormAnswers = {
      ...answers,
      [currentStep.field]: value,
    };

    setAnswers(updatedAnswers);
    setError("");

    const isLastStep = currentStepIndex === formSteps.length - 1;

    if (isLastStep) {
      await submitLead(updatedAnswers);
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  }

  if (submitted) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
            ✓
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            Gracias por compartir tu información
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Hemos recibido tus respuestas correctamente. Nuestro equipo las
            revisará y se pondrá en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!embedded && (
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Cuéntanos sobre tu necesidad
          </h1>
          <p className="mt-3 text-slate-600">
            Completa la información y te contactaremos con el siguiente paso.
          </p>
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {embedded && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Completa tu evaluación
            </h2>
            <p className="mt-3 text-slate-600">
              Responde unas preguntas rápidas para entender mejor tu caso.
            </p>
          </div>
        )}

        <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / formSteps.length) * 100}%`,
            }}
          />
        </div>

        {completedItems.length > 0 && (
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {completedItems.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {currentStep && (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-500">
                Información del prospecto
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {currentStep.question}
              </h3>
            </div>

            <StepRenderer
              step={currentStep}
              value={currentValue}
              disabled={submitting}
              onChange={(value) => handleFieldChange(currentStep.field, value)}
              onSubmit={handleNext}
              onOptionSelect={handleOptionSelect}
            />

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600 break-words">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStepIndex === 0 || submitting}
                className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Atrás
              </button>

              {currentStep.inputType !== "options" && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isValidStep(currentStep, currentValue) || submitting}
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Enviando..."
                    : currentStepIndex === formSteps.length - 1
                    ? "Enviar"
                    : "Continuar"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getDisplayValue(step: FormStep, value: string) {
  if (step.options?.length) {
    return step.options.find((option) => option.value === value)?.label ?? value;
  }

  return value;
}