import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[220px_1fr_220px] items-center gap-6 px-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Nikgu
          </span>
          <span className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Digital Innovations
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          <a
            href="#beneficios"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Beneficios
          </a>
          <a
            href="#evaluacion"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Evaluación
          </a>
          <a
            href="#footer"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Contacto
          </a>
        </nav>

        <div className="flex justify-end">
          <Link
            href="/formulario"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Empezar
          </Link>
        </div>
      </div>
    </header>
  );
}