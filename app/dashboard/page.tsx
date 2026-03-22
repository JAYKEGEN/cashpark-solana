'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  
  const [balance, setBalance] = useState<number>(0);
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    // Revisamos si tiene perfil
    const perfilGuardado = localStorage.getItem('waypark_user_profile');
    if (perfilGuardado) {
      setNombreUsuario(JSON.parse(perfilGuardado).nombre);
    } else {
      router.push('/registro');
    }

    if (publicKey) {
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connected, connection, router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* HEADER LIMPIO */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg">
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-gray-400">Bienvenido,</p>
            <p className="text-lg font-bold truncate max-w-[150px]">{nombreUsuario}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Saldo Disponible</p>
            <p className="text-2xl font-bold text-blue-400">{balance.toFixed(2)} SOL</p>
          </div>
        </div>
      </div>

      {/* CUERPO PRINCIPAL: Solo el Escáner */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-8 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#0d1b2a] mb-2">Escanear Ticket</h2>
          <p className="text-gray-500">Toca el recuadro para simular el escaneo en la entrada.</p>
        </div>

        <button
          onClick={() => router.push('/ticket-entrada')}
          className="relative w-72 h-72 bg-white rounded-[40px] shadow-2xl border-4 border-dashed border-[#3b82f6] flex flex-col items-center justify-center space-y-4 hover:bg-blue-50 transition-colors group"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-5xl">📷</span>
          </div>
          <span className="font-bold text-[#3b82f6] text-xl">Simular Escaneo</span>
        </button>
      </div>

      {/* BARRA DE NAVEGACIÓN (Ancho completo) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-gray-400 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-50">
        
        <div onClick={() => router.push('/dashboard')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-bold mt-1">Inicio</span>
        </div>
        
        <div onClick={() => router.push('/puntos')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">✨</span>
          <span className="text-xs font-medium mt-1">Puntos</span>
        </div>
        
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-xs font-medium mt-1">Historial</span>
        </div>
        
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-xs font-bold mt-1">Perfil</span>
        </div>
        
      </div>

    </div>
  );
}