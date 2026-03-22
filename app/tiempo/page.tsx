'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function TiempoEstacionamiento() {
  const { connected } = useWallet();
  const router = useRouter();
  
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [costoActual, setCostoActual] = useState(12); // Empezamos con la tarifa mínima de 12

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Buscamos la hora en la que entró
    const tiempoInicio = localStorage.getItem('inicio_ticket_waypark');
    if (!tiempoInicio) {
      router.push('/dashboard'); 
      return;
    }

    const calcularTiempo = () => {
      const ahora = Date.now();
      const diferenciaSegundos = Math.floor((ahora - parseInt(tiempoInicio)) / 1000);
      setSegundosTranscurridos(diferenciaSegundos);
      
      // LÓGICA DE COBRO: $12 por hora o fracción
      let horasCobradas = Math.ceil(diferenciaSegundos / 3600);
      if (horasCobradas === 0) horasCobradas = 1; // Mínimo se cobra 1 hora ($12)
      
      setCostoActual(horasCobradas * 12);
    };

    calcularTiempo(); // Ejecuta inmediatamente
    const intervalo = setInterval(calcularTiempo, 1000); // Actualiza cada segundo
    
    return () => clearInterval(intervalo);
  }, [connected, router]);

  const formatearTiempo = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2a] text-white p-6 justify-between">
      
      <div className="text-center mt-8">
        <h2 className="text-xl font-medium tracking-widest text-gray-400 uppercase">Tiempo Transcurrido</h2>
        <p className="text-sm text-gray-500 mt-1">Estacionamiento WayPark</p>
      </div>

      <div className="flex flex-col items-center justify-center -mt-10">
        <div className="relative flex items-center justify-center w-72 h-72">
          <div className="absolute w-full h-full rounded-full border-[12px] border-blue-900 opacity-30 animate-pulse"></div>
          <div className="absolute w-64 h-64 rounded-full border-4 border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
          <h1 className="text-5xl font-mono font-bold tracking-tighter drop-shadow-lg">
            {formatearTiempo(segundosTranscurridos)}
          </h1>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/10 text-center mb-8">
        <p className="text-gray-300 uppercase tracking-widest text-sm mb-2">Total Acumulado</p>
        <p className="text-4xl font-extrabold text-[#3b82f6] transition-all duration-300">
          ${costoActual.toFixed(2)} <span className="text-lg text-gray-400 font-normal">MXN</span>
        </p>
        <p className="text-xs text-gray-400 mt-2 text-yellow-400">Tarifa: $12.00 MXN / Hora o fracción</p>
      </div>

      <div className="pb-8">
        <button 
          onClick={() => router.push('/ticket-salida')} 
          className="w-full bg-white text-[#0d1b2a] text-lg font-bold py-5 rounded-full shadow-xl hover:bg-gray-200 active:scale-95 transition-all flex justify-center items-center space-x-2"
        >
          <span>Finalizar y Pagar Salida</span>
          <span className="text-xl">💳</span>
        </button>
      </div>

    </div>
  );
}