'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; 
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const { connected, connect, publicKey } = useWallet();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [tryAutoConnect, setTryAutoConnect] = useState(false);

  // 🔴🔴🔴 IMPORTANTE: PON AQUÍ TU LINK DE VERCEL 🔴🔴🔴
  const URL_VERCEL = "https://cashpark-solana.vercel.app/"; 

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setTryAutoConnect(true);
    }
  }, []);

  useEffect(() => {
    if (tryAutoConnect && !connected) {
      setTryAutoConnect(false);
      setConnecting(true);
      connect().catch((error) => {
        console.warn('Autoconnect failed', error);
        setWalletError('No fue posible conectar automáticamente.');
      }).finally(() => setConnecting(false));
    }
  }, [tryAutoConnect, connected, connect]);

  useEffect(() => {
    if (connected) {
      const perfilGuardado = localStorage.getItem('waypark_user_profile');
      if (perfilGuardado) {
        router.push('/dashboard');
      } else {
        router.push('/registro');
      }
    }
  }, [connected, router]);

  // --- LA MAGIA DEL DEEP LINK ---
  const abrirEnPhantom = () => {
    // Esto obliga a Android a abrir la app nativa de Phantom
    // y cargar tu página de Vercel en su navegador interno seguro
    const phantomDeepLink = `https://phantom.app/ul/browse/${URL_VERCEL}`;
    window.location.href = phantomDeepLink;
  };

  if (!mounted) return null; 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1b2a] text-white p-4">
      
      <div className="flex flex-col items-center space-y-12">
        
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <span className="text-[#0d1b2a] text-4xl font-bold">C</span>
          </div>
          {/* Actualicé el nombre a CashPark para que coincida con el logo */}
          <h1 className="text-4xl font-extrabold tracking-wider">CASH PARK</h1>
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

          <div className="mt-3 text-center text-sm text-gray-400">
            Si usas la APK en móvil, abre la app desde Phantom.
            <br />
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              Instalar Phantom
            </a>
          </div>

          {/* --- BOTÓN MORADO CON LA FUNCIÓN NUEVA --- */}
          {!connected && (
            <button
              onClick={abrirEnPhantom}
              className="mt-4 inline-block rounded-full bg-violet-500 px-6 py-3 text-white font-bold hover:bg-violet-400 shadow-lg active:scale-95 transition-all"
            >
              Abrir en Phantom 👻
            </button>
          )}

          <button
            onClick={() => router.push('/dashboard')}
            className="mt-2 text-sm text-gray-300 hover:text-white"
          >
            Entrar como invitado (probar app sin wallet)
          </button>

          {connecting ? (
            <p className="text-xs mt-2 text-yellow-300">Intentando conectar con wallet...</p>
          ) : null}
          {walletError ? (
            <p className="text-xs mt-2 text-red-400">{walletError}</p>
          ) : null}

        </div>

      </div>

    </main>
  );
}