'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
// Usaremos QRCode.react para generar el QR de salida instantáneamente en el frontend
import { QRCodeSVG } from 'qrcode.react'; 

export default function TicketSalida() {
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();

  // ESTADOS para controlar el flujo del pago y el QR
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  const [signatureTransaction, setSignatureTransaction] = useState<string | null>(null);

  // Datos fijos para la demo
  const walletEmpresa = new PublicKey('9RuwDQGNRpZ2Qf7nKiWcU1cL5BegPKCVsoAvhxah8SBf'); 
  const montoSOL = 0.01; // Monto fijo para la prueba

  // FUNCIÓN PRINCIPAL: Pagar directamente sin QR
  const ejecutarPagoDirecto = async () => {
    if (!connected || !publicKey) {
      setError('Por favor conecta tu wallet primero.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Crear la transacción de transferencia
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey, // Tu wallet conectada
          toPubkey: walletEmpresa, // La wallet de WayPark
          lamports: montoSOL * LAMPORTS_PER_SOL, // 0.01 SOL en Lamports
        })
      );

      // 2. Obtener el blockhash más reciente para que la red acepte la Tx
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 3. Enviar la transacción a través de Phantom para que el usuario firme
      // Esto abrirá automáticamente la ventanita de Phantom en el celular/navegador
      const signature = await sendTransaction(transaction, connection);

      // 4. Guardar la firma y esperar confirmación (simulada rápida para la demo)
      setSignatureTransaction(signature);
      
      // Simulamos una espera de 1.5 segundos para la red
      setTimeout(() => {
        setPagoConfirmado(true);
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      console.error('Error en el pago:', err);
      setError(err.message || 'El pago fue cancelado o falló.');
      setLoading(false);
    }
  };

  // Función para simular el escaneo del QR de salida
  const simularEscaneoSalida = () => {
    router.push('/buen-viaje');
  };

  if (!connected) {
    router.push('/');
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-8">
      
      {/* HEADER DE SALIDA */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg text-center">
        <h1 className="text-2xl font-extrabold tracking-wider mt-4">TICKET DE SALIDA</h1>
        <p className="text-gray-400 text-sm mt-1 font-serif italic">Resumen de visita</p>
      </div>

      <div className="px-6 mt-8 space-y-8 flex-grow">
        
        {/* RESUMEN DEL TICKET */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de entrada:</p>
            <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium">
              21/03/2026 - 08:30 PM
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Fecha de salida (hoy):</p>
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
                {montoSOL} SOL
              </div>
            </div>
          </div>
        </div>

        {/* --- LÓGICA DE LA PANTALLA --- */}

        {!pagoConfirmado ? (
          // ESTADO 1: Ticket pendiente de pago
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

            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 p-4 rounded-xl text-sm font-medium">
                ❌ Error: {error}
              </div>
            )}

            <button
              onClick={ejecutarPagoDirecto}
              disabled={loading}
              className={`w-full text-white text-lg font-bold py-5 rounded-full shadow-lg flex justify-center items-center space-x-2 transition-all ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3b82f6] hover:bg-blue-600 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">🌀</span>
                  <span>Procesando pago...</span>
                </>
              ) : (
                <>
                  <span>Confirmar y Pagar {montoSOL} SOL</span>
                  <span className="text-xl">💳</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // ESTADO 2: Pago Confirmado -> MOSTRAR CÓDIGO DE SALIDA
          <div className="bg-[#93c5fd] p-8 rounded-[30px] shadow-2xl flex flex-col items-center animate-fade-in-up border-4 border-dashed border-[#0d1b2a]">
            
            <div className="flex items-center space-x-2 mb-4 bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
              <span className="text-lg">✅</span>
              <span className="text-sm font-bold uppercase tracking-widest">Pago Validado</span>
            </div>

            <h3 className="text-[#0d1b2a] font-extrabold text-xl mb-4">Su Código de Salida</h3>
            
            {/* Generamos el QR de salida instantáneamente.
                Usamos la firma de la Tx como contenido del QR para hacerlo único. */}
            <button 
              onClick={simularEscaneoSalida}
              className="bg-white p-4 rounded-3xl shadow-inner mb-5 hover:scale-105 transition-transform"
              title="Click para simular escaneo en la pluma"
            >
              <QRCodeSVG 
                value={`waypark-salida:${signatureTransaction}`} // El contenido del QR es único
                size={200}
                bgColor={"#FFFFFF"}
                fgColor={"#0d1b2a"}
                level={"L"}
                includeMargin={false}
              />
            </button>
            
            <p className="text-blue-900 text-sm font-medium text-center bg-white/50 p-3 rounded-lg">
              Presente este código en el lector de la pluma de salida para levantar la barrera.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}