'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from "jspdf";

export default function Historial() {
  const router = useRouter();
  const [historial, setHistorial] = useState<any[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<any | null>(null);

  useEffect(() => {
    const dataGuardada = JSON.parse(localStorage.getItem('waypark_historial') || '[]');
    const dataEnriquecida = dataGuardada.map((tx: any) => {
      // Si el ticket es de los viejos y no tiene fecha de entrada, le ponemos un texto genérico, 
      // pero si es nuevo (de los que generemos hoy), tomará la hora real.
      return {
        ...tx,
        tiempoTotal: tx.tiempoTotal || 'Tiempo no registrado',
        fechaEntrada: tx.fechaEntrada || 'Hora de entrada no registrada'
      };
    });
    setHistorial(dataEnriquecida);
  }, []);

  // --- BOTÓN 1: DESCARGA DIRECTA DE PDF (Robusto con jsPDF) ---
  const descargarPDFDirecto = (tx: any) => {
    try {
      // Creamos un nuevo documento PDF en orientación vertical
      const doc = new jsPDF({ format: 'a5' }); // Tamaño A5 (tipo recibo grande)
      
      // Configuración de fuente estilo ticket de máquina
      doc.setFont("courier", "normal");
      
      // Cabecera
      doc.setFontSize(24);
      doc.setFont("courier", "bold");
      doc.text("CASHPARK", 74, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      doc.text("Comprobante de Parking Web3", 74, 28, { align: "center" });
      
      doc.setLineDashPattern([2, 2], 0);
      doc.line(10, 35, 138, 35); // Línea punteada divisoria

      // Datos de la ubicación y tiempo
      doc.setFontSize(11);
      doc.setFont("courier", "bold");
      doc.text("Locacion:", 15, 45);
      doc.setFont("courier", "normal");
      doc.text(tx.estacionamiento, 45, 45);

      doc.setFont("courier", "bold");
      doc.text("Entrada:", 15, 55);
      doc.setFont("courier", "normal");
      doc.text(tx.fechaEntrada, 45, 55);

      doc.setFont("courier", "bold");
      doc.text("Salida:", 15, 65);
      doc.setFont("courier", "normal");
      doc.text(tx.fecha, 45, 65);

      doc.setFont("courier", "bold");
      doc.text("Tiempo:", 15, 75);
      doc.setFont("courier", "normal");
      doc.text(tx.tiempoTotal, 45, 75);

      doc.line(10, 85, 138, 85); // Línea punteada divisoria

      // Cobro y Recompensas
      doc.setFontSize(12);
      doc.setFont("courier", "bold");
      doc.text("Pagado:", 15, 95);
      doc.text(`${tx.montoSOL} SOL`, 133, 95, { align: "right" });

      doc.text("Cashback:", 15, 105);
      doc.text(`+${tx.puntos} WPP`, 133, 105, { align: "right" });

      doc.line(10, 115, 138, 115); // Línea punteada divisoria

      // Firma Blockchain
      doc.setFontSize(10);
      doc.setFont("courier", "bold");
      doc.text("Tx Hash:", 15, 125);
      doc.setFontSize(8);
      doc.setFont("courier", "normal");
      
      // Dividimos el hash si es muy largo para que no se salga del PDF
      const hashDividido = doc.splitTextToSize(tx.firma, 110);
      doc.text(hashDividido, 15, 132);

      // Pie de página
      doc.setFontSize(9);
      doc.text("¡Gracias por usar la red de Solana!", 74, 160, { align: "center" });
      doc.text("Validez fiscal sujeta a regulacion local.", 74, 165, { align: "center" });

      // Guardar el PDF directamente en la computadora
      doc.save(`Recibo_CashPark_${tx.firma.slice(0, 8)}.pdf`);

    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al crear PDF. Usa el botón de Imprimir.");
    }
  };

  // --- BOTÓN 2: IMPRIMIR ---
  const imprimirTicket = (tx: any) => {
    const contenidoHTML = `
      <html>
        <head>
          <title>Recibo_CashPark_${tx.firma.slice(0, 8)}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #000; padding: 20px; background: #fff; }
            .ticket-container { max-width: 350px; margin: 0 auto; border: 2px dashed #000; padding: 20px; }
            .logo { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { text-align: center; font-size: 12px; margin-bottom: 20px; color: #555; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .bold { font-weight: bold; }
            .divider { border-bottom: 1px dashed #000; margin: 15px 0; }
            .footer { text-align: center; font-size: 12px; margin-top: 30px; }
            .hash { font-size: 10px; word-break: break-all; text-align: right; width: 60%; }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="logo">CASHPARK</div>
            <div class="subtitle">Comprobante de Parking Web3</div>
            <div class="row"><span class="bold">Locación:</span> <span>${tx.estacionamiento}</span></div>
            <div class="divider"></div>
            <div class="row"><span class="bold">Entrada:</span> <span style="text-align: right; max-width: 60%;">${tx.fechaEntrada}</span></div>
            <div class="row"><span class="bold">Salida:</span> <span style="text-align: right; max-width: 60%;">${tx.fecha}</span></div>
            <div class="row"><span class="bold">Tiempo Total:</span> <span>${tx.tiempoTotal}</span></div>
            <div class="divider"></div>
            <div class="row"><span class="bold">Pagado:</span> <span>${tx.montoSOL} SOL</span></div>
            <div class="row"><span class="bold">Cashback:</span> <span>+${tx.puntos} WPP</span></div>
            <div class="divider"></div>
            <div class="row"><span class="bold">Tx Hash:</span> <span class="hash">${tx.firma}</span></div>
            <div class="footer">¡Gracias por usar la red de Solana!<br>Validez fiscal sujeta a regulación local.</div>
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 500); }
          </script>
        </body>
      </html>
    `;

    const ventana = window.open('', '_blank');
    if (ventana) {
      ventana.document.write(contenidoHTML);
      ventana.document.close();
    } else {
      alert("Por favor permite las ventanas emergentes para imprimir el ticket.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans pb-24 relative">
      
      {/* HEADER */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center h-32">
        <h1 className="text-2xl font-extrabold tracking-wider mx-auto uppercase">Mi Historial</h1>
      </div>

      <div className="px-5 mt-6 flex-grow space-y-4">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Transacciones Recientes</p>

        {historial.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <span className="text-5xl mb-4 block">📭</span>
            <h3 className="text-lg font-bold text-[#0d1b2a]">Aún no hay visitas</h3>
            <p className="text-sm text-gray-500 mt-2">Tus pagos de estacionamiento con Solana aparecerán aquí.</p>
          </div>
        ) : (
          historial.map((tx, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-xl text-xl">🅿️</div>
                  <div>
                    <h4 className="font-bold text-[#0d1b2a] text-sm">{tx.estacionamiento}</h4>
                    <p className="text-xs text-gray-500">{tx.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#3b82f6]">{tx.montoSOL} SOL</p>
                  <p className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded mt-1 inline-block">+{tx.puntos} WPP</p>
                </div>
              </div>
              
              <button 
                onClick={() => setTicketSeleccionado(tx)}
                className="w-full mt-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs py-3 rounded-xl transition-colors border border-gray-200"
              >
                Ver recibo detallado
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- MODAL DEL TICKET DETALLADO --- */}
      {ticketSeleccionado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[30px] shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-[#0d1b2a] p-6 text-center relative">
              <button 
                onClick={() => setTicketSeleccionado(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
              >
                ✕
              </button>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-2xl">🧾</span>
              </div>
              <h3 className="text-white font-extrabold text-lg tracking-wide uppercase">Comprobante</h3>
              <p className="text-blue-200 text-xs mt-1 font-mono">{ticketSeleccionado.firma.slice(0, 12)}...</p>
            </div>

            <div className="p-6 bg-[#fdfdfd] relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] -mt-1"></div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Locación</p>
                  <p className="font-semibold text-gray-800">{ticketSeleccionado.estacionamiento}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Entrada</p>
                    <p className="font-semibold text-gray-800 text-xs leading-tight">{ticketSeleccionado.fechaEntrada}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Salida</p>
                    <p className="font-semibold text-gray-800 text-xs leading-tight">{ticketSeleccionado.fecha}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-gray-300 pt-4">
                  <span className="text-gray-500 font-medium">Tiempo Total</span>
                  <span className="font-bold text-gray-800">{ticketSeleccionado.tiempoTotal}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total Pagado</span>
                  <span className="font-extrabold text-[#3b82f6] text-lg">{ticketSeleccionado.montoSOL} SOL</span>
                </div>

                <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl border border-yellow-100 mt-2">
                  <span className="text-yellow-700 font-bold text-xs flex items-center"><span>✨</span> <span className="ml-1">Puntos Ganados</span></span>
                  <span className="font-extrabold text-yellow-600">+{ticketSeleccionado.puntos} WPP</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3 bg-[#fdfdfd]">
              <button 
                onClick={() => descargarPDFDirecto(ticketSeleccionado)}
                className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex justify-center items-center space-x-2"
              >
                <span>Descargar PDF</span>
                <span className="text-lg">📥</span>
              </button>
              
              <button 
                onClick={() => imprimirTicket(ticketSeleccionado)}
                className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all active:scale-95 flex justify-center items-center space-x-2"
              >
                <span>Imprimir Recibo</span>
                <span className="text-lg">🖨️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-gray-400 pb-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-50">
        <div onClick={() => router.push('/dashboard')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-medium mt-1">Inicio</span>
        </div>
        <div onClick={() => router.push('/puntos')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">✨</span>
          <span className="text-[10px] font-medium mt-1">Puntos</span>
        </div>
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center text-[#3b82f6] cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-bold mt-1">Historial</span>
        </div>
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-medium mt-1">Perfil</span>
        </div>
      </div>

    </div>
  );
}