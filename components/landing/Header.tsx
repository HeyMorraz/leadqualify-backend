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
      </div>
    </header>
  );
}