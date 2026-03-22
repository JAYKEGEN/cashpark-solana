'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function TicketEntrada() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [ticketData, setTicketData] = useState({ id: '', hora: '' });

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // 1. Revisamos si ya hay un ticket guardado para no re-escribirlo
    let idGuardado = localStorage.getItem('id_ticket_waypark');
    let tiempoInicioGuardado = localStorage.getItem('inicio_ticket_waypark');

    const ahora = new Date();

    if (!idGuardado || !tiempoInicioGuardado) {
      // Es un ticket nuevo: lo creamos y lo guardamos en memoria
      idGuardado = `T-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
      tiempoInicioGuardado = ahora.getTime().toString(); // Guardamos en milisegundos
      
      localStorage.setItem('id_ticket_waypark', idGuardado);
      localStorage.setItem('inicio_ticket_waypark', tiempoInicioGuardado);
    }

    // Formateamos la hora para mostrarla en pantalla (Ej. 10:32 AM)
    const fechaEntrada = new Date(parseInt(tiempoInicioGuardado));
    const horaFormateada = fechaEntrada.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    setTicketData({ id: idGuardado, hora: horaFormateada });
  }, [connected, router]);

  const confirmarEntrada = () => {
    router.push('/tiempo'); // ¡Asegúrate de que esta ruta sea /tiempo!
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#0d1b2a] text-white p-5 rounded-2xl shadow-lg mt-4">
        <h1 className="text-xl font-extrabold tracking-wider">WAY PARK</h1>
        <div className="bg-gray-700 p-2 rounded-full flex items-center space-x-2 border border-gray-600">
          <span className="text-sm">👤</span>
          <p className="text-xs font-mono">
            {publicKey ? `${publicKey.toBase58().slice(0, 4)}...` : '0x00'}
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-[#0d1b2a]">TICKET GENERADO</h2>
        <p className="text-gray-500 mt-1">Revisa los detalles de tu entrada.</p>
      </div>

      {/* CONTENEDOR DEL TICKET */}
      <div className="bg-white p-8 rounded-[30px] shadow-2xl space-y-6 border-t-8 border-[#3b82f6]">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">ID Ticket</p>
          <p className="text-2xl font-bold text-[#0d1b2a]">{ticketData.id || 'Cargando...'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Hora de entrada</p>
          <p className="text-2xl font-bold text-[#0d1b2a]">{ticketData.hora || 'Cargando...'}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Ubicación</p>
          <p className="text-xl font-medium text-gray-700">ESTACIONAMIENTO WAYPARK #001</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-4 border border-blue-100">
          <div className="text-3xl">💳</div>
          <div>
            <p className="font-semibold text-blue-900">Método de pago</p>
            <p className="text-sm text-blue-800">Cargos automáticos a la wallet vinculada.</p>
          </div>
        </div>
      </div>

      <div className="flex-grow flex items-end pb-4">
        <button onClick={confirmarEntrada} className="w-full bg-[#3b82f6] text-white text-lg font-bold py-5 rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all">
          Confirmar Entrada
        </button>
      </div>
    </div>
  );
}