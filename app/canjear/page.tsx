'use client'; // Mantenemos esto

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// --- IMPORTANTE: NO IMPORTAR 'next/image' AQUÍ ---
// Borra cualquier línea que diga: import Image from 'next/image'

export default function CanjearPuntos() {
  const router = useRouter();
  const [totalPuntos, setTotalPuntos] = useState('0.0000');

  useEffect(() => {
    const puntos = parseFloat(localStorage.getItem('waypark_puntos_totales') || '0');
    setTotalPuntos(puntos.toFixed(4));
  }, []);

  // --- LISTA DE RECOMPENSAS CORREGIDA (Con RUTAS SIMPLES DE TEXTO) ---
  // IMPORTANTE: Asegúrate de que las rutas empiecen con /logos/ y coincidan EXACTAMENTE con tus nombres en VS Code
  const recompensas = [
    { id: 1, nombre: 'Netflix (1 Mes Básico)', puntos: 15.0, iconPath: '/logos/netflix.png', color: 'bg-red-50 text-red-900 border-red-200' },
    { id: 2, nombre: 'Spotify Premium (1 Mes)', puntos: 10.0, iconPath: '/logos/spotify.png', color: 'bg-green-50 text-green-900 border-green-200' },
    { id: 3, nombre: 'Crunchyroll Fan (1 Mes)', puntos: 8.0, iconPath: '/logos/crunchyroll.png', color: 'bg-orange-50 text-orange-900 border-orange-200' },
    { id: 4, nombre: 'Prime Video (1 Mes)', puntos: 12.0, iconPath: '/logos/prime.png', color: 'bg-blue-50 text-blue-900 border-blue-200' },
    { id: 5, nombre: 'Apple Music (1 Mes)', puntos: 10.0, iconPath: '/logos/apple_music.png', color: 'bg-red-50 text-red-900 border-red-200' }, 
    { id: 6, nombre: 'HBO Max (1 Mes)', puntos: 13.0, iconPath: '/logos/hbo_max.png', color: 'bg-purple-50 text-purple-900 border-purple-200' }, 
    { id: 7, nombre: 'Disney+ (1 Mes)', puntos: 14.0, iconPath: '/logos/disney.png', color: 'bg-cyan-50 text-cyan-900 border-cyan-200' }, 
    { id: 8, nombre: 'YouTube Premium (1 Mes)', puntos: 11.0, iconPath: '/logos/youtube.png', color: 'bg-red-50 text-red-900 border-red-200' },
  ];

  const intentarCanje = (premio: any) => {
    if (parseFloat(totalPuntos) < premio.puntos) {
      alert(`⚠️ Puntos insuficientes. Te faltan ${(premio.puntos - parseFloat(totalPuntos)).toFixed(2)} WPP para este canje.`);
    } else {
      alert(`🎉 ¡Solicitud recibida! Se enviará tu código para ${premio.nombre} por correo. (Demo)`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-24">
      
      {/* HEADER CON BOTÓN ATRÁS */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center">
        <button onClick={() => router.push('/puntos')} className="text-2xl mr-4 hover:scale-110 transition-transform">←</button>
        <h1 className="text-xl font-extrabold tracking-wider mx-auto uppercase">Marketplace</h1>
      </div>

      <div className="p-6 mt-4 flex-grow space-y-6">
        
        {/* Marcador de Saldo (Simplificado) */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 text-center relative overflow-hidden">
          <p className="text-gray-500 font-medium text-sm mb-1">Tu Saldo para canjes</p>
          <h2 className="text-4xl font-extrabold text-[#3b82f6]">{totalPuntos} <span className="text-lg font-normal text-gray-400">WPP</span></h2>
          <div className="absolute top-0 right-0 p-3 text-3xl opacity-10">✨</div>
        </div>

        {/* RECOMPENSAS (Grid de 2 columnas) */}
        <div className="grid grid-cols-2 gap-4">
          {recompensas.map((premio) => (
            <div key={premio.id} className={`p-5 rounded-2xl shadow-xl border flex flex-col items-center text-center justify-between ${premio.color}`}>
              
              {/* LÓGICA DEL LOGO REAL CON 'img' MINÚSCULA Y RUTA SIMPLE DE TEXTO */}
              <div className="flex justify-center items-center h-20 w-full mb-3 bg-white p-2 rounded-xl border border-gray-100">
                <img 
                  src={premio.iconPath} // Aquí Next.js buscará automáticamente en /public
                  alt={premio.nombre} 
                  className="h-16 w-auto max-w-full object-contain"
                />
              </div>

              {/* Título (Truncado para que no descuadre) */}
              <p className="text-xs font-bold leading-tight mb-3 truncate w-full">{premio.nombre}</p>
              
              {/* Contenedor del Precio */}
              <div className="w-full bg-white/60 p-2 rounded-lg border border-gray-100 mb-3 mt-auto">
                <p className="text-lg font-extrabold text-[#0d1b2a]">{premio.puntos.toFixed(1)} Pts</p>
              </div>

              {/* Botón de Canje */}
              <button 
                onClick={() => intentarCanje(premio)}
                className={`w-full text-white text-xs font-bold py-2 px-3 rounded-full shadow-sm transition-all active:scale-95 ${
                    parseFloat(totalPuntos) >= premio.puntos ? 'bg-[#3b82f6] hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {parseFloat(totalPuntos) >= premio.puntos ? 'Canjear Rewards' : 'Puntos insuficientes'}
              </button>
            </div>
          ))}
        </div>

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