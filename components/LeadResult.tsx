"use client";

export default function LeadResult({ result }: any) {
  const getColor = () => {
    if (result.category === "Hot") return "bg-green-100 text-green-700";
    if (result.category === "Warm") return "bg-yellow-100 text-yellow-700";
    if (result.category === "Cold") return "bg-red-100 text-red-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="mt-4 p-4 rounded-xl shadow bg-white border">
      
      {/* Estado */}
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getColor()}`}>
        {result.category === "Hot" && "Un asesor te contactará pronto"}
        {result.category === "Warm" && " Te mantendremos informado con más contenido"}
        {result.category === "Cold" && "Gracias por tu interés. Podemos ayudarte más adelante"}
      </div>

      {/* Score */}
      <h2 className="text-xl font-bold mt-3">
        Score: {result.score}/100
      </h2>

      {/* Resumen */}
      <p className="text-gray-600 mt-2">
       {result.summary || `
            Lead con ${result.answers?.need?.toLowerCase()} 
            y presupuesto ${result.answers?.budget}. 
            Nivel de autoridad: ${result.answers?.authority}.
         `}
      </p>

      {/* Detalles */}
      <div className="mt-4 text-sm text-gray-700 space-y-1">
        <p><strong>💰 Presupuesto:</strong> {result.answers.budget}</p>
        <p><strong>👤 Autoridad:</strong> {result.answers.authority}</p>
        <p><strong>🎯 Necesidad:</strong> {result.answers.need}</p>
        <p><strong>⏱ Timeline:</strong> {result.answers.timeline}</p>
      </div>

      {result.signals && (
        <div className="mt-3 text-sm text-gray-500">
            <strong>Señales detectadas:</strong>
            <ul className="list-disc ml-5">
            {result.signals.map((s: string, i: number) => (
                <li key={i}>{s}</li>
            ))}
            </ul>
        </div>
        )}

    </div>
  );
}