import { useEffect, useRef } from 'react';
import { encodeURL, createQR } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export default function ParkingQR() {
  // Usamos una referencia para saber dónde inyectar el dibujo del QR
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Configurar los datos del cobro (A dónde va el dinero y cuánto es)
    // Reemplaza esto con tu wallet de Phantom
    // En tu archivo ParkingQR.tsx
    const walletEmpresa = new PublicKey('8S8mmaCtyufGsuw8V4SefotnKgbLqzdJ48evY4uyUeQi'); 
    
    // Tarifa de prueba: 10 unidades (SOL o USDC)
    const monto = new BigNumber(0.000001);// En modo prueba, puedes usar montos pequeños 
    //cuando se hagan las transacciones reales, el valor en soles seria de
    //0.133 en soles lo que equivale a 12 pesos mexicanos, eso seria la
    //tafira por hora del estacionamiento.

    // 2. Armar la URL nativa de Solana Pay
    const url = encodeURL({
      recipient: walletEmpresa,
      amount: monto as any, // Solana Pay espera un BigNumber, pero el tipo de TypeScript puede ser complicado
      label: 'Estacionamiento WayLearn', // Nombre de tu proyecto
      message: 'Pago de ticket de salida #001',
    });

    // 3. Generar el gráfico del QR
    const qr = createQR(url, 300, 'transparent', '#000000');

    // 4. Mostrar el QR en la pantalla
    if (qrRef.current) {
      qrRef.current.innerHTML = ''; // Limpiar por si acaso
      qr.append(qrRef.current);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h2>Escanea para pagar tu salida</h2>
      {/* Aquí es donde aparece el código QR */}
      <div 
        ref={qrRef} 
        style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '15px', marginTop: '1rem' }}
      ></div>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: 'gray' }}>
        Total a pagar: 0.000001 SOL (modo prueba)

      </p>
    </div>
  );
}