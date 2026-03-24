'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; 
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const { connected, connect } = useWallet();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [tryAutoConnect, setTryAutoConnect] = useState(false);
  
  // NUEVO ESTADO: ¿Estamos adentro de Phantom?
  const [inPhantomBrowser, setInPhantomBrowser] = useState(false);

  // 🔴🔴🔴 IMPORTANTE: PON AQUÍ TU LINK DE VERCEL 🔴🔴🔴
  // Ejemplo: "https://cashpark-demo.vercel.app"
  const URL_VERCEL = "https://tu-proyecto.vercel.app"; 

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setTryAutoConnect(true);

      // Verificamos si Phantom ya inyectó su código (solo pasa adentro de la app de Phantom)
      const checkPhantom = () => {
        // @ts-ignore
        if (window.phantom?.solana?.isPhantom) {
          setInPhantomBrowser(true);
        }
      };
      
      checkPhantom();
      // Hacemos una segunda revisión medio segundo después por si tarda en cargar
      setTimeout(checkPhantom, 500);
    }
  }, []);

  useEffect(() => {
    if (tryAutoConnect && !connected && inPhantomBrowser) {
      setTryAutoConnect(false);
      setConnecting(true);
      connect().catch((error) => {
        console.warn('Autoconnect failed', error);
      }).finally(() => setConnecting(false));
    }
  }, [tryAutoConnect, connected, connect, inPhantomBrowser]);

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

  // --- LA MAGIA DEL DEEP LINK (VERSIÓN UNIVERSAL) ---
  const abrirEnPhantom = () => {
    // Esta es la forma oficial y más segura según la documentación de Phantom
    const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(URL_VERCEL)}`;
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
          <h1 className="text-4xl font-extrabold tracking-wider">CASH PARK</h1>
          <p className="text-gray-400 mt-2 text-sm tracking-widest">SMART PARKING</p>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-8">
          <p className="text-lg font-medium">Ingresa con tu wallet</p>

          {/* LÓGICA INTELIGENTE DE BOTONES */}
          {inPhantomBrowser ? (
            // SI ESTÁ ADENTRO DE PHANTOM -> MUESTRA EL AZUL
            <div className="wallet-button-custom animate-fade-in">
              <WalletMultiButton 
                style={{ 
                  backgroundColor: '#3b82f6', 
                  borderRadius: '9999px', 
                  padding: '0 32px', 
                  fontWeight: 'bold' 
                }} 
              />
            </div>
          ) : (
            // SI ESTÁ EN LA APK O CHROME NORMAL -> MUESTRA EL MORADO
            <div className="flex flex-col items-center animate-fade-in">
              <button
                onClick={abrirEnPhantom}
                className="inline-block rounded-full bg-violet-500 px-8 py-3.5 text-white font-bold text-lg hover:bg-violet-400 shadow-lg active:scale-95 transition-all"
              >
                Abrir en Phantom 👻
              </button>
              <p className="mt-4 text-center text-xs text-gray-400 max-w-xs">
                Usa este botón para abrir la aplicación de Phantom de forma segura.
              </p>
            </div>
          )}

          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 text-sm text-gray-400 hover:text-white border border-gray-600 px-4 py-2 rounded-full transition-colors"
          >
            Entrar como invitado (sin wallet)
          </button>

          {connecting ? (
            <p className="text-xs mt-2 text-yellow-300">Intentando conectar...</p>
          ) : null}

        </div>

      </div>

    </main>
  );
}