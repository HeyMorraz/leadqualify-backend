import LeadFormSection from "@/components/form/LeadFormSection";
import Link from "next/link";

export default function FormularioPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            ← Volver al inicio
          </Link>
        </div>

        <LeadFormSection />
      </div>
    </main>
  );
}