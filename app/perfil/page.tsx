'use client';

import { useEffect, useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

export default function Perfil() {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para controlar si estamos en "Modo Edición"
  const [editando, setEditando] = useState(false);

  const [perfil, setPerfil] = useState({ 
    nombre: '', 
    correo: '', 
    telefono: '', 
    foto: null as string | null 
  });

  const [estadisticas, setEstadisticas] = useState({
    puntos: '0.00',
    horas: '0.0',
    asistencias: 0,
    nivel: 1,
    progresoNivel: 0
  });

  useEffect(() => {
    if (!connected) {
      router.push('/');
      return;
    }

    const perfilGuardado = localStorage.getItem('waypark_user_profile');
    if (perfilGuardado) {
      setPerfil(JSON.parse(perfilGuardado));
    }

    let puntosActuales = 0;
    try {
      const ptGuardados = localStorage.getItem('waypark_puntos_totales');
      if (ptGuardados) puntosActuales = parseFloat(atob(ptGuardados)) || 0;
    } catch (e) {
      puntosActuales = 0;
    }

    const historial = JSON.parse(localStorage.getItem('waypark_historial') || '[]');
    const totalVisitas = historial.length;
    const horasCalculadas = (totalVisitas * 1.5).toFixed(1); 
    const asistenciasSemana = Math.min(totalVisitas, 5); 
    const nivelActual = Math.floor(puntosActuales / 20) + 1; 
    const porcentajeProgreso = Math.min(((puntosActuales % 20) / 20) * 100, 100);

    setEstadisticas({
      puntos: puntosActuales.toFixed(2),
      horas: horasCalculadas,
      asistencias: asistenciasSemana,
      nivel: nivelActual,
      progresoNivel: porcentajeProgreso
    });

  }, [connected, router]);

  const cerrarSesion = async () => {
    await disconnect();
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const nuevoPerfil = { ...perfil, foto: base64String };
        setPerfil(nuevoPerfil);
        localStorage.setItem('waypark_user_profile', JSON.stringify(nuevoPerfil));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const guardarCambios = () => {
    localStorage.setItem('waypark_user_profile', JSON.stringify(perfil));
    setEditando(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      
      {/* HEADER SIMPLIFICADO */}
      <div className="bg-[#0d1b2a] text-white p-6 rounded-b-[40px] shadow-lg flex items-center justify-center h-32 relative">
        <h1 className="text-xl font-extrabold tracking-wider uppercase">Mi Perfil</h1>
      </div>

      {/* CONTENEDOR PRINCIPAL - Cambiado max-w-md a max-w-6xl para que se vea bien en PC */}
      <div className="px-5 mt-2 flex-grow flex flex-col items-center">
        <div className="bg-white w-full max-w-6xl rounded-[20px] shadow-xl p-6 border border-gray-100 flex flex-col items-center relative -mt-16">
          
          {/* BOTÓN EDITAR EN LA TARJETA (SUPER VISIBLE) */}
          <div className="absolute top-4 right-4 z-10">
            {!editando ? (
              <button onClick={() => setEditando(true)} className="text-gray-400 hover:text-[#3b82f6] transition-colors p-2 bg-gray-50 rounded-full border border-gray-200 shadow-sm" title="Editar Perfil">
                <span className="text-lg">✏️</span>
              </button>
            ) : (
              <button onClick={guardarCambios} className="text-[#0d1b2a] bg-green-400 px-4 py-2 rounded-full hover:bg-green-300 transition-all text-xs font-bold shadow-md">
                Guardar
              </button>
            )}
          </div>

          {/* FOTO DE PERFIL */}
          <div className="relative group w-24 h-24 absolute -top-12">
            {perfil.foto ? (
              <img src={perfil.foto} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"/>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md border-4 border-white">
                {perfil.nombre ? perfil.nombre.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <button onClick={triggerFileInput} className="absolute bottom-0 right-0 bg-[#0d1b2a] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all opacity-90">
              <span className="text-xs">📷</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
          </div>
          
          {/* MODO EDICIÓN VS MODO VISTA */}
          <div className="w-full mt-12 flex flex-col items-center">
            {editando ? (
              <div className="w-full space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre</label>
                  <input type="text" name="nombre" value={perfil.nombre} onChange={handleInputChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-center focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Correo</label>
                  <input type="email" name="correo" value={perfil.correo} onChange={handleInputChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-center focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-[#0d1b2a] text-center">{perfil.nombre || 'Usuario'}</h2>
                <p className="text-gray-500 text-sm mt-1">{perfil.correo}</p>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mt-3 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 rounded-full border border-blue-200">
            <span className="text-sm">🏆</span>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Nivel {estadisticas.nivel}</span>
          </div>

          {/* DATOS EXTRAS */}
          <div className="w-full mt-6 bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">Wallet:</span>
              <span className="text-gray-800 text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                {publicKey ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}` : 'No conectada'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">Teléfono:</span>
              {editando ? (
                <input type="tel" name="telefono" value={perfil.telefono} onChange={handleInputChange} className="w-1/2 p-1 bg-white border border-gray-200 rounded text-xs font-bold text-right outline-none focus:ring-1 focus:ring-blue-500" />
              ) : (
                <span className="text-gray-800 text-sm font-bold">{perfil.telefono}</span>
              )}
            </div>
          </div>

          {/* RESUMEN DE DATOS */}
          <div className="w-full mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl mb-1 block">🪙</span>
              <h3 className="text-xl font-extrabold text-[#0d1b2a]">{estadisticas.puntos}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">Puntos (WPP)</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl mb-1 block">⏱️</span>
              <h3 className="text-xl font-extrabold text-[#0d1b2a]">{estadisticas.horas} <span className="text-sm">hrs</span></h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mt-1">Tiempo Total</p>
            </div>
          </div>

          {/* RESTAURADO: TU PROGRESO DE GAMIFICACIÓN */}
          <div className="w-full mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
            {/* Barra de Nivel */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-gray-800">Progreso de Nivel</span>
                <span className="text-xs font-bold text-[#3b82f6]">{Math.floor(estadisticas.progresoNivel)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${estadisticas.progresoNivel}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Sigue gestionando para desbloquear mejores recompensas.</p>
            </div>

            <hr className="border-gray-100" />

            {/* Asistencias Semanales */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-gray-800 flex items-center">
                  <span>🚗</span> <span className="ml-1">Bonus Semanal</span>
                </span>
                <span className="text-xs font-bold text-green-600">{estadisticas.asistencias}/5 Asistencias</span>
              </div>
              
              <div className="flex justify-between px-2">
                {[1, 2, 3, 4, 5].map((dia) => (
                  <div key={dia} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${estadisticas.asistencias >= dia ? 'bg-green-100 border-green-500 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    {estadisticas.asistencias >= dia ? '✓' : dia}
                  </div>
                ))}
              </div>

              {estadisticas.asistencias >= 5 ? (
                <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-[10px] p-2 rounded-lg font-bold text-center animate-pulse">
                  ¡Felicidades! Ganaste 3 Horas Gratis para tu próximo parking. 🎉
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 mt-3 text-center">Completa 5 asistencias en la semana para ganar 3 horas gratis.</p>
              )}
            </div>
          </div>

          <button onClick={cerrarSesion} className="mt-8 text-sm text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-full flex items-center space-x-2 transition-colors w-full justify-center border border-transparent hover:border-red-100">
            <span>Cerrar sesión de Wallet</span> <span className="text-lg">🚪</span>
          </button>
        </div>
      </div>

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
        <div onClick={() => router.push('/historial')} className="flex flex-col items-center hover:text-[#3b82f6] transition-colors cursor-pointer">
          <span className="text-2xl">📋</span>
          <span className="text-[10px] font-medium mt-1">Historial</span>
        </div>
        <div onClick={() => router.push('/perfil')} className="flex flex-col items-center text-[#3b82f6] cursor-pointer">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-bold mt-1">Perfil</span>
        </div>
      </div>

    </div>
  );
}