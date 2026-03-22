'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function TiempoEstacionamiento() {
  const { connected } = useWallet();
  const router = useRouter();
  
  // Estados para el cronómetro y el cálculo de la tarifa
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [costoActual, setCostoActual] = useState(0);
  
  // Parámetros del estacionamiento (puedes ajustar estos valores)
  const TARIFA_POR_HORA = 15; // 15 pesos/hora
  const TARIFA_POR_SEGUNDO = TARIFA_POR_HORA / 3600;

  // Efecto principal: Inicia el cronómetro
  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Simulamos que el usuario entró hace exactamente 1 hora, 12 minutos y 45 segundos (para que se vea acción en la demo)
    // En un caso real, esto se leería de la blockchain o del estado global.
    const segundosSimuladosDeEntrada = (1 * 3600) + (12 * 60) + 45;
    setSegundosTranscurridos(segundosSimuladosDeEntrada);

    const intervalo = setInterval(() => {
      setSegundosTranscurridos((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [connected, router]);

  // Efecto secundario: Calcula el costo cada vez que pasa un segundo
  useEffect(() => {
    const costoCalculado = segundosTranscurridos * TARIFA_POR_SEGUNDO;
    setCostoActual(costoCalculado);
  }, [segundosTranscurridos]);

  // Función para formatear los segundos a "HH:MM:SS"
  const formatearTiempo = (totalSegundos: number) => {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const simularSalida = () => {
    // Esto nos llevará a la vista final de pago
    router.push('/ticket-salida'); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d1b2a] text-white p-6 justify-between">
      
      {/* HEADER */}
      <div className="text-center mt-8">
        <h2 className="text-xl font-medium tracking-widest text-gray-400 uppercase">Tiempo Transcurrido</h2>
        <p className="text-sm text-gray-500 mt-1">Estacionamiento WayPark</p>
      </div>

      {/* CRONÓMETRO CENTRAL (Estilo moderno) */}
      <div className="flex flex-col items-center justify-center -mt-10">
        <div className="relative flex items-center justify-center w-72 h-72">
          {/* Círculo animado de fondo (simulando pulso) */}
          <div className="absolute w-full h-full rounded-full border-[12px] border-blue-900 opacity-30 animate-pulse"></div>
          {/* Círculo principal */}
          <div className="absolute w-64 h-64 rounded-full border-4 border-[#3b82f6] shadow-[0_0_30px_rgba(59,130,246,0.5)]"></div>
          
          {/* El Tiempo */}
          <h1 className="text-5xl font-mono font-bold tracking-tighter drop-shadow-lg">
            {formatearTiempo(segundosTranscurridos)}
          </h1>
        </div>
      </div>

      {/* INFORMACIÓN DEL COSTO */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/10 text-center mb-8">
        <p className="text-gray-300 uppercase tracking-widest text-sm mb-2">Total Acumulado</p>
        <p className="text-4xl font-extrabold text-[#3b82f6]">
          ${costoActual.toFixed(2)} <span className="text-lg text-gray-400 font-normal">MXN</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">Tarifa: ${TARIFA_POR_HORA}/hr</p>
      </div>

      {/* BOTÓN DE ACCIÓN: Pagar Salida */}
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