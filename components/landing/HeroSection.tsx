import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="evaluacion"
      className="px-6 pb-20 pt-24 md:pb-24 md:pt-28"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow-sm">
          Evaluación inteligente para empresas B2B
        </span>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Descubre si esta solución encaja con tu empresa
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Responde unas preguntas y conoce qué tan preparada está tu empresa
          para dar el siguiente paso. Analizamos tu necesidad, presupuesto y
          etapa actual para ofrecerte una orientación inicial más clara y
          precisa.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/formulario"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Completar formulario
          </Link>

          <Link
            href="/chat"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Hablar con IA
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <span>✓ Evaluación rápida</span>
          <span>✓ Orientación inicial</span>
          <span>✓ Próximos pasos más claros</span>
        </div>
      </div>
    </section>
  );
}