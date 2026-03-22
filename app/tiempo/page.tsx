'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function TiempoEstacionamiento() {
  const { connected } = useWallet();
  const router = useRouter();
  
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [costoActual, setCostoActual] = useState(0);
  
  // TARIFA DE HACKATHON: $1 peso por segundo para que se vea el cobro en vivo
  const TARIFA_POR_SEGUNDO = 1.00;

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // 1. Buscamos si ya hay un ticket activo en la memoria del celular
    let tiempoInicio = localStorage.getItem('inicio_ticket_waypark');
    
    // 2. Si es un ticket nuevo, guardamos la hora actual exacta
    if (!tiempoInicio) {
      tiempoInicio = Date.now().toString();
      localStorage.setItem('inicio_ticket_waypark', tiempoInicio);
    }

    // 3. Calculamos la diferencia entre la hora actual y la hora de entrada
    const calcularTiempo = () => {
      const ahora = Date.now();
      const diferenciaSegundos = Math.floor((ahora - parseInt(tiempoInicio as string)) / 1000);
      setSegundosTranscurridos(diferenciaSegundos);
    };

    calcularTiempo(); // Arrancamos el cálculo
    const intervalo = setInterval(calcularTiempo, 1000); // Actualizamos cada segundo

    return () => clearInterval(intervalo);
  }, [connected, router]);

  useEffect(() => {
    setCostoActual(segundosTranscurridos * TARIFA_POR_SEGUNDO);
  }, [segundosTranscurridos]);

  const formatearTiempo = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const simularSalida = () => {
    router.push('/ticket-salida'); 
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
        <p className="text-xs text-gray-400 mt-2 text-yellow-400">Tarifa Dinámica Activa</p>
      </div>

      <div className="pb-8">
        <button
          onClick={simularSalida}
          className="w-full bg-white text-[#0d1b2a] text-lg font-bold py-5 rounded-full shadow-xl hover:bg-gray-200 active:scale-95 transition-all flex justify-center items-center space-x-2"
        >
          <span>Finalizar y Pagar Salida</span>
          <span className="text-xl">💳</span>
        </button>
      </div>

    </div>
  );
}