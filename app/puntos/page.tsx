'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Puntos() {
  const router = useRouter();
  const [totalPuntos, setTotalPuntos] = useState('0.0000');

  useEffect(() => {
    const puntos = parseFloat(localStorage.getItem('waypark_puntos_totales') || '0');
    setTotalPuntos(puntos.toFixed(4));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-24">
      
      {/* HEADER SENCILLO */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center">
        <h1 className="text-2xl font-extrabold tracking-wider mx-auto">MIS PUNTOS</h1>
      </div>

      <div className="p-6 mt-4 space-y-6">
        
        {/* Tarjeta de Saldo */}
        <div className="bg-gradient-to-br from-[#3b82f6] to-[#0d1b2a] p-8 rounded-[30px] shadow-xl text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">✨</div>
          <p className="text-blue-200 font-medium uppercase tracking-widest text-sm mb-2">Saldo Actual</p>
          <h2 className="text-5xl font-extrabold">{totalPuntos}</h2>
          <p className="text-sm mt-2 font-light">WayPark Points (WPP)</p>
          
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 inline-block border border-white/30">
            <p className="text-xs font-bold text-yellow-300 flex items-center">
              <span>⚠️</span> <span className="ml-1">Tus puntos vencen en 6 meses</span>
            </p>
          </div>
        </div>

        {/* Nuevo Modelo de Negocio (Pitch para los jueces) */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
          <h3 className="font-bold text-[#0d1b2a] text-lg mb-5 flex items-center border-b pb-3">
            <span>🎁</span> <span className="ml-2">Beneficios WayPark</span>
          </h3>
          
          <ul className="space-y-5 text-sm text-gray-600">
            
            <li className="flex items-start bg-blue-50 p-3 rounded-xl border border-blue-100">
              <span className="text-blue-500 mr-3 text-xl">🎵</span>
              <div>
                <strong className="text-blue-900 block mb-1">Canje por Streaming</strong> 
                <p>Usa tus WPP acumulados para pagar meses de suscripción en tus plataformas de música, series y anime favoritas.</p>
              </div>
            </li>
            
            <li className="flex items-start bg-green-50 p-3 rounded-xl border border-green-100">
              <span className="text-green-500 mr-3 text-xl">🚗</span>
              <div>
                <strong className="text-green-900 block mb-1">Bonus de Cliente Frecuente</strong> 
                <p>¿Vienes seguido? Registra 5 visitas en una semana y recibe automáticamente <span className="font-bold text-green-700">3 horas gratis</span> para tu próxima visita en esta misma sucursal.</p>
              </div>
            </li>
            
            <li className="flex items-start p-3">
              <span className="text-gray-400 mr-3 text-xl">⏳</span>
              <div>
                <strong className="text-gray-800 block mb-1">Política de Caducidad</strong> 
                <p className="text-xs">Para mantener un ecosistema saludable, los puntos generados tienen una vigencia exacta de 6 meses a partir de tu visita.</p>
              </div>
            </li>

          </ul>
        </div>
        <button 
            onClick={() => router.push('/canjear')}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-3 transition-all active:scale-95"
          >
            <span>🎁</span>
            <span className="text-lg">Canjear mis Puntos</span>
            <span className="text-xl">→</span>
          </button>
      </div>

      {/* BARRA DE NAVEGACIÓN (Ancho completo) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-gray-400 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-50">
        <div onClick={() => router.push('/dashboard')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-medium mt-1">Inicio</span>
        </div>
        <div onClick={() => router.push('/puntos')} className="flex flex-col items-center text-[#3b82f6] cursor-pointer">
          <span className="text-2xl">✨</span>
          <span className="text-[10px] font-bold mt-1">Puntos</span>
        </div>
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-medium mt-1">Historial</span>
        </div>
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-medium mt-1">Perfil</span>
        </div>
      </div>

    </div>
  );
}