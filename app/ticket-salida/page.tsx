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
  const [puntosGanados, setPuntosGanados] = useState(0);

  // ESTADO DINÁMICO: Aquí guardamos los cálculos reales
  const [resumen, setResumen] = useState({
    fechaEntrada: 'Calculando...',
    fechaSalida: 'Calculando...',
    tiempoTotal: '...',
    costoMXN: 0,
    costoSOL: 0
  });

  const walletEmpresa = new PublicKey('9RuwDQGNRpZ2Qf7nKiWcU1cL5BegPKCVsoAvhxah8SBf'); 

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
      
      // Cálculo del tiempo transcurrido
      const diferenciaSegundos = Math.floor((fechaSalida.getTime() - fechaEntrada.getTime()) / 1000);
      const horas = Math.floor(diferenciaSegundos / 3600);
      const minutos = Math.floor((diferenciaSegundos % 3600) / 60);
      
      // Cálculo del cobro
      let horasCobradas = Math.ceil(diferenciaSegundos / 3600);
      if (horasCobradas === 0) horasCobradas = 1; // Mínimo 1 hora ($12)
      const costoMXN = horasCobradas * 12;
      
      // Conversión: 1 SOL = $3000 MXN -> 12 MXN = 0.004 SOL
      const costoSOL = parseFloat((costoMXN / 3000).toFixed(4));

      // LÓGICA DE PUNTOS (5% del costo en SOL)
      const calculoPuntos = parseFloat((costoSOL * 0.05).toFixed(4));
      setPuntosGanados(calculoPuntos);

      // Actualizamos la pantalla con los datos reales
      setResumen({
        fechaEntrada: fechaEntrada.toLocaleDateString('es-MX', opcionesFecha),
        fechaSalida: fechaSalida.toLocaleDateString('es-MX', opcionesFecha),
        tiempoTotal: `${horas}h ${minutos}m`,
        costoMXN,
        costoSOL
      });
    }
  }, [connected, publicKey, router]);

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
      
      // --- GUARDAR HISTORIAL Y PUNTOS EN MEMORIA ---
      const nuevaTx = {
        fecha: resumen.fechaSalida,
        estacionamiento: 'ESTACIONAMIENTO WAYPARK #001',
        montoSOL: resumen.costoSOL,
        puntos: puntosGanados,
        firma: signature
      };
      
      // Guardar en Historial
      const historialPrevio = JSON.parse(localStorage.getItem('waypark_historial') || '[]');
      historialPrevio.unshift(nuevaTx); // unshift lo pone al principio de la lista
      localStorage.setItem('waypark_historial', JSON.stringify(historialPrevio));

      // Sumar Puntos Totales
      const puntosActuales = parseFloat(localStorage.getItem('waypark_puntos_totales') || '0');
      localStorage.setItem('waypark_puntos_totales', (puntosActuales + puntosGanados).toFixed(4));
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

      <div className="px-6 mt-8 space-y-8 flex-grow">
        
        {/* TABLA DE RESUMEN DINÁMICA */}
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
              <p className="text-sm font-semibold text-gray-600 mb-1">Tiempo total:</p>
              <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">{resumen.tiempoTotal}</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0d1b2a] mb-1">Total a pagar:</p>
              <div className="bg-green-100 text-green-800 py-2 px-4 rounded text-sm font-bold border border-green-200 flex flex-col items-center justify-center">
                <span>{resumen.costoSOL} SOL</span>
                <span className="text-xs text-green-600">(${resumen.costoMXN} MXN)</span>
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
            <div className="flex items-center space-x-2 mb-4 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
              <span className="text-lg">✅</span> <span className="text-sm font-bold uppercase tracking-widest">Pago Validado</span>
            </div>
            <h3 className="text-[#0d1b2a] font-extrabold text-xl mb-4">Su Código de Salida</h3>
            <button onClick={() => router.push('/buen-viaje')} className="bg-white p-4 rounded-3xl shadow-inner mb-5 hover:scale-105 transition-transform" title="Click para simular escaneo en la pluma">
              <QRCodeSVG value={`waypark-salida:${signatureTransaction}`} size={200} bgColor={"#FFFFFF"} fgColor={"#0d1b2a"} level={"L"} includeMargin={false} />
            </button>
            <p className="text-blue-900 text-sm font-medium text-center bg-white/50 p-3 rounded-lg">Presente este código en el lector para levantar la barrera.</p>
          </div>
        )}
      </div>
    </div>
  );
}