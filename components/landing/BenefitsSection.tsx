const beneficios = [
  {
    titulo: "Calificación inteligente",
    descripcion:
      "Guía a los prospectos mediante un proceso estructurado y recopila la información correcta.",
  },
  {
    titulo: "Scoring basado en BANT",
    descripcion:
      "Evalúa la calidad del lead usando presupuesto, autoridad, necesidad y tiempo.",
  },
  {
    titulo: "Listo para automatización",
    descripcion:
      "Prepara leads para flujos de seguimiento y priorización comercial.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {beneficios.map((beneficio) => (
          <article
            key={beneficio.titulo}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {beneficio.titulo}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {beneficio.descripcion}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}