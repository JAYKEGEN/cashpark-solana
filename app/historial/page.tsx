'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Historial() {
  const router = useRouter();
  const [transacciones, setTransacciones] = useState<any[]>([]);

  useEffect(() => {
    // Cargamos el historial guardado
    const data = JSON.parse(localStorage.getItem('waypark_historial') || '[]');
    setTransacciones(data);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center">
        <button onClick={() => router.push('/dashboard')} className="text-2xl mr-4">←</button>
        <h1 className="text-2xl font-extrabold tracking-wider">HISTORIAL</h1>
      </div>

      <div className="p-6 flex-grow overflow-y-auto space-y-4 mt-4">
        {transacciones.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Aún no tienes visitas registradas.</p>
        ) : (
          transacciones.map((tx, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-[#0d1b2a] text-lg">{tx.estacionamiento}</h3>
                  <p className="text-xs text-gray-400">{tx.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">-{tx.montoSOL} SOL</p>
                  <p className="text-xs font-bold text-yellow-500">✨ +{tx.puntos} Pts</p>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-[10px] font-mono text-gray-400 truncate border border-gray-100">
                Tx: {tx.firma}
              </div>
            </div>
          ))
        )}
      </div>
      {/* BARRA DE NAVEGACIÓN (Ancho completo) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-gray-400 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-50">
        <div onClick={() => router.push('/dashboard')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-medium mt-1">Inicio</span>
        </div>
        <div onClick={() => router.push('/puntos')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">✨</span>
          <span className="text-xs font-medium mt-1">Puntos</span>
        </div>
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center text-[#3b82f6] cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-xs font-bold mt-1">Historial</span>
        </div>
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-xs font-medium mt-1">Perfil</span>
        </div>
      </div>
    </div>
  );
}