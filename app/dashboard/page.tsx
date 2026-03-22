'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  // 1. Agregamos 'disconnect' de nuestro hook de wallet
  const { publicKey, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    if (publicKey) {
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connected, connection, router]);

  const simularEscaneoQR = () => {
    router.push('/ticket-entrada'); 
  };

  // 2. Función para desconectar y regresar a la pantalla de inicio
  const cerrarSesion = async () => {
    await disconnect();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* HEADER: Saldo y Perfil */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-400">Bienvenido,</p>
            <p className="text-lg font-bold">
              {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Usuario'}
            </p>
            {/* 3. El nuevo botón de Cerrar Sesión */}
            <button 
              onClick={cerrarSesion}
              className="text-xs text-red-400 font-medium mt-1 hover:text-red-300 transition-colors flex items-center space-x-1"
            >
              <span>Desconectar wallet</span>
              <span>🚪</span>
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Saldo Disponible</p>
            <p className="text-2xl font-bold text-blue-400">{balance.toFixed(2)} SOL</p>
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL: El "Escáner" de QR */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0d1b2a] mb-2">Escanear Ticket</h2>
          <p className="text-gray-500">Toca el recuadro para simular el escaneo en la pluma de entrada.</p>
        </div>

        <button
          onClick={simularEscaneoQR}
          className="relative w-72 h-72 bg-white rounded-[40px] shadow-2xl border-4 border-dashed border-[#3b82f6] flex flex-col items-center justify-center space-y-4 hover:bg-blue-50 transition-colors group"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-5xl">📷</span>
          </div>
          <span className="font-bold text-[#3b82f6] text-xl">Simular Escaneo</span>
        </button>
      </div>

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div className="bg-white border-t p-4 flex justify-around text-gray-400 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-[#3b82f6]">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-bold mt-1">Inicio</span>
        </div>
        <div className="flex flex-col items-center hover:text-gray-600 transition-colors">
          <span className="text-2xl">⏱️</span>
          <span className="text-xs font-medium mt-1">Tiempo</span>
        </div>
        <div className="flex flex-col items-center hover:text-gray-600 transition-colors">
          <span className="text-2xl">👤</span>
          <span className="text-xs font-medium mt-1">Perfil</span>
        </div>
      </div>
    </div>
  );
}