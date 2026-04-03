export default function Footer() {
  return (
    <footer
      id="footer"
      className="mt-24 border-t border-slate-300 px-6 py-16"
      
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-950">
                Nikgu Solutions
              </h3>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-700">
                Digital Innovations
              </p>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-900">
              Soluciones digitales enfocadas en ayudar a empresas a evaluar su
              contexto actual, entender mejor sus necesidades y avanzar con
              mayor claridad.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-950">
              Contacto
            </h4>

            <ul className="space-y-2 text-sm leading-7 text-slate-900">
              <li>Website: www.nikgu.com</li>
              <li>San José, Costa Rica</li>
              <li>Sheridan, Wyoming, USA</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-950">
              Sobre la evaluación
            </h4>

            <p className="max-w-md text-sm leading-7 text-slate-900">
              Completa el formulario o conversa con el asistente para recibir
              una orientación inicial según las necesidades, contexto y etapa
              actual de tu empresa.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-500/40 pt-6">
          <p className="text-sm text-slate-800">
            © 2026 Nikgu Solutions. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}