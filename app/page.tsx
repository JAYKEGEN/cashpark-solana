'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; 
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();
  
  // 1. NUEVO: Creamos un estado para saber si ya cargamos en el cliente (navegador)
  const [mounted, setMounted] = useState(false);

  // 2. NUEVO: Este efecto solo se ejecuta una vez en el navegador
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected) {
      // Revisamos si ya existe un perfil guardado en la memoria
      const perfilGuardado = localStorage.getItem('waypark_user_profile');
      
      if (perfilGuardado) {
        router.push('/dashboard'); // Si ya tiene perfil, entra directo
      } else {
        router.push('/registro'); // Si es nuevo, lo mandamos a registrarse
      }
    }
  }, [connected, router]);

  // 3. NUEVO: Si no estamos en el navegador (estamos en el servidor), no dibujamos nada aún.
  // Esto previene al 100% el error de hidratación.
  if (!mounted) return null; 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1b2a] text-white p-4">
      
      <div className="flex flex-col items-center space-y-12">
        
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <span className="text-[#0d1b2a] text-4xl font-bold">W</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-wider">WAY PARK</h1>
          <p className="text-gray-400 mt-2 text-sm tracking-widest">SMART PARKING</p>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-8">
          <p className="text-lg font-medium">Ingresa con tu wallet</p>
          
          <div className="wallet-button-custom">
            <WalletMultiButton 
              style={{ 
                backgroundColor: '#3b82f6', 
                borderRadius: '9999px', 
                padding: '0 32px', 
                fontWeight: 'bold' 
              }} 
            />
          </div>
        </div>

      </div>

    </main>
  );
}