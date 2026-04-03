import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="px-6 pb-16 pt-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow-sm">
          Precalificación inteligente de leads B2B
        </span>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Califica mejores leads con IA y scoring inteligente
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Captura información de prospectos, evalúa intención y detecta
          oportunidades de mayor valor antes de enviarlas al equipo de ventas.
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span>✓ Calificación automática B2B</span>
          <span>✓ Scoring basado en BANT</span>
          <span>✓ Leads listos para ventas</span>
        </div>
      </div>
    </section>
  );
}