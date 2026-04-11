type FormProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export default function FormProgress({
  currentStep,
  totalSteps,
}: FormProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Paso {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-slate-500">
         ---------
        </span>
        <span className="text-sm font-medium text-slate-500">
          {percentage}% completado
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}