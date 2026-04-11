import { FormStep } from "@/app/types/lead-form";

type StepRendererProps = {
  step: FormStep;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onOptionSelect: (value: string) => void;
};

export default function StepRenderer({
  step,
  value,
  disabled = false,
  onChange,
  onSubmit,
  onOptionSelect,
}: StepRendererProps) {
  if (step.inputType === "options" && step.options) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {step.options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onOptionSelect(option.value)}
              disabled={disabled}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <input
        type={step.inputType}
        value={value}
        placeholder={step.placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            e.preventDefault();
            onSubmit();
          }
        }}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}