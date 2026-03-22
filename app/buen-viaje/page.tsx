'use client';

import { useRouter } from 'next/navigation';

export default function BuenViaje() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#3b82f6] text-white p-6 justify-center items-center">
      
      {/* Icono animado de auto saliendo */}
      <div className="text-9xl mb-12 animate-fade-in-right">
        🚗💨
      </div>

      {/* Mensaje principal */}
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
          ¡PAGO VALIDADO!
        </h1>
        <p className="text-2xl font-medium text-blue-100 drop-shadow">
          La pluma de salida está abierta.
        </p>
      </div>

      {/* Deseo final con tipografía elegante */}
      <div className="text-center border-t border-b border-blue-400 py-8 w-full max-w-sm mb-16">
        <p className="font-serif italic text-4xl text-white">
          ¡Feliz Viaje!
        </p>
        <p className="text-blue-100 mt-2 text-sm tracking-widest uppercase">
          Gracias por usar Way Park
        </p>
      </div>

      {/* Botón para regresar al Dashboard y empezar de nuevo */}
      <button
        onClick={() => router.push('/dashboard')}
        className="w-full max-w-sm bg-white text-[#0d1b2a] text-lg font-bold py-5 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition-all"
      >
        Finalizar y Volver al Inicio
      </button>

    </div>
  );
}