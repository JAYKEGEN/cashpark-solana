'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { QRCodeSVG } from 'qrcode.react'; 

export default function TicketSalida() {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  const [signatureTransaction, setSignatureTransaction] = useState<string | null>(null);

  // ESTADO DEL TEMPORIZADOR (600 segundos = 10 minutos)
  // TIP: Cámbialo a 10 para probar rápido en tu demo
  const [tiempoRestante, setTiempoRestante] = useState(600);

  const [resumen, setResumen] = useState({
    fechaEntrada: 'Calculando...',
    fechaSalida: 'Calculando...',
    tiempoTotal: '...',
    costoMXN: 0,
    costoSOL: 0
  });

  const [puntosGanados, setPuntosGanados] = useState(0);
  
  // 👇 AQUÍ ESTÁ EL CAMBIO MAGISTRAL 👇
  // Tu nueva cuenta recaudadora maestra en Devnet
  const walletEmpresa = new PublicKey('8S8mmaCtyufGsuw8V4SefotnKgbLqzdJ48evY4uyUeQi'); 

  useEffect(() => {
    if (!connected || !publicKey) {
      router.push('/');
      return;
    }

    const tiempoInicio = localStorage.getItem('inicio_ticket_waypark');
    if (tiempoInicio) {
      const fechaEntrada = new Date(parseInt(tiempoInicio));
      const fechaSalida = new Date();
      
      const opcionesFecha: Intl.DateTimeFormatOptions = { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      };
      
      const diferenciaSegundos = Math.floor((fechaSalida.getTime() - fechaEntrada.getTime()) / 1000);
      const horas = Math.floor(diferenciaSegundos / 3600);
      const minutos = Math.floor((diferenciaSegundos % 3600) / 60);
      
      let horasCobradas = Math.ceil(diferenciaSegundos / 3600);
      if (horasCobradas === 0) horasCobradas = 1; 
      const costoMXN = horasCobradas * 12;
      
      const costoSOL = parseFloat((costoMXN / 3000).toFixed(4));
      const calculoPuntos = parseFloat((costoSOL * 0.05).toFixed(4));
      setPuntosGanados(calculoPuntos);

      setResumen({
        fechaEntrada: fechaEntrada.toLocaleDateString('es-MX', opcionesFecha),
        fechaSalida: fechaSalida.toLocaleDateString('es-MX', opcionesFecha),
        tiempoTotal: `${horas}h ${minutos}m`,
        costoMXN,
        costoSOL
      });
    }
  }, [connected, publicKey, router]);

  // --- LÓGICA DEL TEMPORIZADOR ---
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (pagoConfirmado && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [pagoConfirmado, tiempoRestante]);

  // Formatear segundos a MM:SS
  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const ejecutarPagoDirecto = async () => {
    if (!connected || !publicKey) return;
    setLoading(true);
    setError(null);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: walletEmpresa,
          lamports: resumen.costoSOL * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      setSignatureTransaction(signature);
      
      const nuevaTx = {
        fecha: resumen.fechaSalida,
        fechaEntrada: resumen.fechaEntrada, 
        tiempoTotal: resumen.tiempoTotal,  
        estacionamiento: 'ESTACIONAMIENTO WAYPARK #001',
        montoSOL: resumen.costoSOL,
        puntos: puntosGanados,
        firma: signature
      };
      
      const historialPrevio = JSON.parse(localStorage.getItem('waypark_historial') || '[]');
      historialPrevio.unshift(nuevaTx); 
      localStorage.setItem('waypark_historial', JSON.stringify(historialPrevio));

      // --- LECTURA Y ESCRITURA OFUSCADA DE PUNTOS ---
      let puntosActualesSeguros = 0;
      try {
        const guardado = localStorage.getItem('waypark_puntos_totales');
        if (guardado) puntosActualesSeguros = parseFloat(atob(guardado)) || 0;
      } catch (e) {
        puntosActualesSeguros = 0;
      }
      
      // Sumamos y encriptamos antes de guardar
      const nuevosPuntos = (puntosActualesSeguros + puntosGanados).toFixed(4);
      localStorage.setItem('waypark_puntos_totales', btoa(nuevosPuntos));
      // ----------------------------------------------
      
      setTimeout(() => {
        setPagoConfirmado(true);
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'El pago falló.');
      setLoading(false);
    }
  };

  if (!connected || !publicKey) return null; 

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-8">
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg text-center">
        <h1 className="text-2xl font-extrabold tracking-wider mt-4">TICKET DE SALIDA</h1>
        <p className="text-gray-400 text-sm mt-1 font-serif italic">Resumen de visita</p>
      </div>

      <div className="px-6 mt-8 space-y-8 flex-grow">
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de entrada:</p>
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">{resumen.fechaEntrada}</div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de salida (hoy):</p>
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">{resumen.fechaSalida}</div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0d1b2a] mb-1">Total a pagar:</p>
              <div className="bg-green-100 text-green-800 py-2 px-4 rounded text-sm font-bold border border-green-200 flex flex-col items-center justify-center">
                <span>{resumen.costoSOL} SOL</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0d1b2a] mb-1">Puntos a ganar:</p>
              <div className="bg-yellow-100 text-yellow-800 py-2 px-4 rounded text-sm font-bold border border-yellow-200 flex flex-col items-center justify-center">
                <span>✨ +{puntosGanados} Pts</span>
              </div>
            </div>
          </div>
        </div>

        {!pagoConfirmado ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[20px] shadow-xl border border-gray-100 flex items-center space-x-4">
              <div className="text-4xl">👤</div>
              <div>
                <p className="font-semibold text-gray-900">Wallet conectada:</p>
                <p className="text-xs font-mono text-gray-500 bg-gray-100 p-1 rounded">
                  {publicKey.toBase58().slice(0,6)}...{publicKey.toBase58().slice(-6)}
                </p>
              </div>
            </div>

            {error && <div className="bg-red-100 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-medium">❌ Error: {error}</div>}

            <button onClick={ejecutarPagoDirecto} disabled={loading} className={`w-full text-white text-lg font-bold py-5 rounded-full shadow-lg flex justify-center items-center space-x-2 transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3b82f6] hover:bg-blue-600 active:scale-95'}`}>
              {loading ? (
                <> <span className="animate-spin text-xl">🌀</span> <span>Procesando pago...</span> </>
              ) : (
                <> <span>Confirmar y Pagar {resumen.costoSOL} SOL</span> <span className="text-xl">💳</span> </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-[#93c5fd] p-8 rounded-[30px] shadow-2xl flex flex-col items-center animate-fade-in-up border-4 border-dashed border-[#0d1b2a]">
            
            <div className="flex items-center space-x-2 mb-2 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
              <span className="text-lg">✅</span> <span className="text-sm font-bold uppercase tracking-widest">Pago Validado</span>
            </div>

            {/* RELOJ DE EXPIRACIÓN */}
            <div className="mb-4 text-center">
              <p className="text-sm text-blue-900 font-medium">Tiempo para salir:</p>
              <p className={`text-3xl font-mono font-bold ${tiempoRestante < 60 ? 'text-red-600 animate-pulse' : 'text-[#0d1b2a]'}`}>
                {formatearTiempo(tiempoRestante)}
              </p>
            </div>
            
            {tiempoRestante > 0 ? (
              <>
                <button onClick={() => router.push('/buen-viaje')} className="bg-white p-4 rounded-3xl shadow-inner mb-5 hover:scale-105 transition-transform" title="Click para simular escaneo">
                  <QRCodeSVG value={`waypark-salida:${signatureTransaction}`} size={180} bgColor={"#FFFFFF"} fgColor={"#0d1b2a"} level={"L"} includeMargin={false} />
                </button>
                <p className="text-blue-900 text-xs font-medium text-center bg-white/50 p-3 rounded-lg">Presente este código en el lector para levantar la barrera.</p>
              </>
            ) : (
              // ESTADO DE QR EXPIRADO
              <div className="bg-red-100 p-6 rounded-2xl border-2 border-red-300 flex flex-col items-center text-center mt-2">
                <span className="text-5xl mb-2">⏱️</span>
                <h3 className="text-red-800 font-bold text-lg mb-1">Tu código expiró</h3>
                <p className="text-red-600 text-sm">Excediste los 10 minutos de tolerancia. Por favor, genera un nuevo ticket de salida.</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">Actualizar Ticket</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}