const beneficios = [
  {
    titulo: "Evaluación guiada",
    descripcion:
      "Responde paso a paso y obtén una visión más clara sobre la necesidad actual de tu empresa.",
  },
  {
    titulo: "Análisis según tu contexto",
    descripcion:
      "Tomamos en cuenta tu presupuesto, etapa actual y prioridad para ofrecerte una orientación más útil.",
  },
  {
    titulo: "Próximos pasos más claros",
    descripcion:
      "Descubre si vale la pena avanzar ahora, qué tan preparado está tu negocio y cuál podría ser el siguiente paso.",
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