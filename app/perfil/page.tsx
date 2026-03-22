'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function Perfil() {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();
  
  const [perfil, setPerfil] = useState({ nombre: '', correo: '', telefono: '', placas: '' });

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    const perfilGuardado = localStorage.getItem('waypark_user_profile');
    if (perfilGuardado) {
      setPerfil(JSON.parse(perfilGuardado));
    }
  }, [connected, router]);

  const cerrarSesion = async () => {
    await disconnect();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* HEADER SENCILLO */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center">
        <h1 className="text-2xl font-extrabold tracking-wider mx-auto">MI PERFIL</h1>
      </div>

      {/* TARJETA DE PERFIL CENTRAL */}
      <div className="px-6 mt-12 flex-grow">
        <div className="bg-white rounded-[20px] shadow-xl p-6 border border-gray-100 flex flex-col items-center relative mt-6">
          
          <div className="w-24 h-24 bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md border-4 border-white absolute -top-12">
            {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <h2 className="mt-12 text-2xl font-extrabold text-[#0d1b2a] text-center">{perfil.nombre || 'Usuario'}</h2>
          <p className="text-gray-500 text-sm">{perfil.correo}</p>
          
          <div className="flex items-center space-x-2 mt-3 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200">
            <span className="text-xs">✨</span>
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-widest">Nivel Pro</span>
          </div>

          <div className="w-full mt-8 bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">Wallet:</span>
              <span className="text-gray-800 text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                {publicKey ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}` : 'No conectada'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">Teléfono:</span>
              <span className="text-gray-800 text-sm font-bold">{perfil.telefono}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">Placas auto:</span>
              <span className="text-[#3b82f6] text-sm font-bold uppercase bg-blue-50 px-2 py-1 rounded">{perfil.placas}</span>
            </div>
          </div>
          
          <button onClick={cerrarSesion} className="mt-8 text-sm text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors">
            <span>Cerrar sesión</span> <span className="text-lg">🚪</span>
          </button>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN (Ancho completo) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-gray-400 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-50">
        <div onClick={() => router.push('/dashboard')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-medium mt-1">Inicio</span>
        </div>
        <div onClick={() => router.push('/puntos')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">✨</span>
          <span className="text-xs font-medium mt-1">Puntos</span>
        </div>
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-xs font-medium mt-1">Historial</span>
        </div>
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center text-[#3b82f6] cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-xs font-bold mt-1">Perfil</span>
        </div>
      </div>
    </div>
  );
}