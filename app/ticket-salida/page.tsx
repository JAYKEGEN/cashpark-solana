'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { encodeURL, createQR } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export default function TicketSalida() {
  const { connected } = useWallet();
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);

  // Efecto para generar el código QR de Solana Pay
  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // 1. Configurar los datos del cobro
    const walletEmpresa = new PublicKey('9RuwDQGNRpZ2Qf7nKiWcU1cL5BegPKCVsoAvhxah8SBf'); 
    const monto = new BigNumber(0.01); // 0.01 SOL para la prueba

    // 2. Armar la URL nativa de Solana Pay
    const url = encodeURL({
      recipient: walletEmpresa,
      amount: monto as any, // El truco de TypeScript que usamos antes
      label: 'Estacionamiento WayLearn',
      message: 'Pago de ticket de salida #001',
    });

    // 3. Generar el gráfico del QR
    const qr = createQR(url, 220, 'transparent', '#000000');

    // 4. Mostrar el QR en la pantalla
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
    }
  }, [connected, router]);

  const volverAlInicio = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-8">
      
      {/* HEADER DE SALIDA */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg text-center">
        <h1 className="text-2xl font-extrabold tracking-wider mt-4">TICKET DE SALIDA</h1>
        <p className="text-gray-400 text-sm mt-1 font-serif italic">Gracias por su visita</p>
      </div>

      <div className="px-6 mt-8 space-y-8 flex-grow">
        
        {/* RESUMEN DEL TICKET (Estilo Canva) */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de entrada:</p>
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">
              21/03/2026 - 08:30 PM
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de salida:</p>
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">
              21/03/2026 - 09:44 PM
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1">Tiempo total:</p>
              <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">
                1h 14m
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0d1b2a] mb-1">Total a pagar:</p>
              <div className="bg-green-100 text-green-800 py-2 px-4 rounded text-sm font-bold border border-green-200">
                0.01 SOL
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE PAGO (SOLANA PAY) Y PUNTOS */}
        <div className="bg-[#93c5fd] p-6 rounded-[20px] shadow-xl flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-[#0d1b2a] font-bold text-lg">Puntos: +3</span>
            <span className="bg-white text-blue-800 text-xs font-bold px-2 py-1 rounded-full">Cashback</span>
          </div>
          
          {/* Contenedor del QR */}
          <div 
            className="bg-white p-3 rounded-2xl shadow-inner mb-4 flex items-center justify-center"
            ref={qrRef}
          >
            {/* El QR se inyecta aquí */}
          </div>
          
          <p className="text-blue-900 text-sm font-medium text-center">
            Escanea con Phantom u otra wallet de Solana para pagar y abrir la pluma.
          </p>
        </div>

      </div>

      {/* BOTÓN: VOLVER AL INICIO */}
      <div className="px-6 mt-4">
        <button
          onClick={volverAlInicio}
          className="w-full border-2 border-[#0d1b2a] text-[#0d1b2a] text-lg font-bold py-4 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
        >
          Finalizar y Volver al Inicio
        </button>
      </div>

    </div>
  );
}