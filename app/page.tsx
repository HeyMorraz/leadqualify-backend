import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
   <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
    {/*TIULO*/}
    <h1 className="text-4xl fount-bold text-center mb-6">
      Califica tus leads automáticamente con IA
    </h1>
    {/*DESCRIPCIÓN*/}
    <p className="text-lg text-gray-600 text-center max-w-xl mb-8">
      Nuestro sistema analiza tus prospectos usando IA y solo envía a tu equipo de ventas los leads realmente calificados.
    </p>

    {/*Botón CTA*/}
    <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition">Iniciar chat</button>
    <ChatWidget/>
    <div className="mt-12 text-sm text-gray-400">
      ✓ Calificación automática B2B
      ✓ Scoring basado en BANT
      ✓ Integración con tu equipo de ventas
    </div>
   </main> 
  );
}
