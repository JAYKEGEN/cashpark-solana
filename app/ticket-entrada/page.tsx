'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function TicketEntrada() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [ticketData, setTicketData] = useState({
    id: '',
    hora: '',
    ubicacion: 'ESTACIONAMIENTO WAYPARK #001',
  });

  // Efecto para generar la información del ticket al cargar la página
  useEffect(() => {
    // Protección: Si no está conectada la wallet, lo regresamos al inicio
    if (!connected) {
      router.push('/');
      return;
    }

    const ahora = new Date();
    
    // Generamos un ID de ticket aleatorio para la demo (ej. T-A8F2C4)
    const idAleatorio = `T-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
    
    // Formateamos la hora (ej. 15:30)
    const horaFormateada = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTicketData(prev => ({
      ...prev,
      id: idAleatorio,
      hora: horaFormateada,
    }));
  }, [connected, router]);

  // Función para avanzar al cronómetro (simulando que el usuario confirma su entrada)
  const confirmarEntrada = () => {
    // Esto nos llevará a la vista del cronómetro (la haremos en el siguiente paso)
    router.push('/tiempo'); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 space-y-8">
      
      {/* HEADER con el título y wallet abreviada */}
      <div className="flex justify-between items-center bg-[#0d1b2a] text-white p-5 rounded-2xl shadow-lg mt-4">
        <h1 className="text-xl font-extrabold tracking-wider">WAY PARK</h1>
        <div className="bg-gray-700 p-2 rounded-full flex items-center space-x-2 border border-gray-600">
          {/* Mostramos el avatar por defecto y la wallet abreviada */}
          <span className="text-sm">👤</span>
          <p className="text-xs font-mono">
            {publicKey ? `${publicKey.toBase58().slice(0, 4)}...` : '0x00'}
          </p>
        </div>
      </div>

      {/* TÍTULO PRINCIPAL DE LA VISTA */}
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#0d1b2a]">TICKET GENERADO</h2>
        <p className="text-gray-500 mt-1">Revisa los detalles de tu entrada.</p>
      </div>

      {/* CONTENEDOR DEL TICKET (Estilo papel con sombra) */}
      <div className="bg-white p-8 rounded-[30px] shadow-2xl space-y-6 border-t-8 border-[#3b82f6]">
        
        {/* Sección: ID del Ticket */}
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">ID Ticket</p>
          <p className="text-2xl font-bold text-[#0d1b2a]">{ticketData.id || 'Generando...'}</p>
        </div>

        {/* Sección: Hora de Entrada */}
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Hora de entrada</p>
          <p className="text-2xl font-bold text-[#0d1b2a]">{ticketData.hora || 'Generando...'}</p>
        </div>

        {/* Sección: Ubicación */}
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Ubicación</p>
          <p className="text-xl font-medium text-gray-700">{ticketData.ubicacion}</p>
        </div>

        {/* Sección: Pago */}
        <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-4 border border-blue-100">
          <div className="text-3xl">💳</div>
          <div>
            <p className="font-semibold text-blue-900">Método de pago</p>
            <p className="text-sm text-blue-800">Cargos automáticos a la wallet vinculada.</p>
          </div>
        </div>
      </div>

      {/* BOTÓN DE ACCIÓN: Confirmar Entrada */}
      <div className="flex-grow flex items-end pb-4">
        <button
          onClick={confirmarEntrada}
          className="w-full bg-[#3b82f6] text-white text-lg font-bold py-5 rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
        >
          Confirmar Entrada
        </button>
      </div>

    </div>
  );
}