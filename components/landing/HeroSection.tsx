import LeadFormSection from "@/components/form/LeadFormSection";

export default function HeroSection() {
  return (
    <section
      id="evaluacion"
      className="px-6 pb-20 pt-24 md:pb-24 md:pt-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">

          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Descubre si esta solución encaja con tu empresa
          </h1>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <LeadFormSection embedded />
        </div>
      </div>
    </section>
  );
}