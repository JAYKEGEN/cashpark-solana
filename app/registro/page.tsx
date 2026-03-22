'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

export default function RegistroPerfil() {
  const router = useRouter();
  const { connected } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '' // Placas eliminado
  });

  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  useEffect(() => {
    if (!connected) router.push('/');
    if (localStorage.getItem('waypark_user_profile')) router.push('/dashboard');
  }, [connected, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const guardarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    const perfilCompleto = { ...formData, foto: fotoBase64 };
    localStorage.setItem('waypark_user_profile', JSON.stringify(perfilCompleto));
    
    // OFUSCACIÓN DE CIBERSEGURIDAD: Guardamos '5.0000' en formato Base64
    localStorage.setItem('waypark_puntos_totales', btoa('5.0000')); 
    
    router.push('/dashboard');
  };

  const simularLoginExistente = () => {
    // Simulamos que el sistema ALPR y la blockchain reconocieron al usuario
    const perfilRecuperado = {
      nombre: 'Usuario Frecuente',
      correo: 'contacto@demo.com',
      telefono: '1234567890',
      foto: null
    };
    localStorage.setItem('waypark_user_profile', JSON.stringify(perfilRecuperado));
    
    // Si no tiene puntos, le damos unos ofuscados por defecto para la demo
    if (!localStorage.getItem('waypark_puntos_totales')) {
      localStorage.setItem('waypark_puntos_totales', btoa('10.0000')); 
    }
    
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-[30px] shadow-2xl border-t-8 border-[#3b82f6]">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#0d1b2a]">Crea tu Perfil</h2>
          <p className="text-gray-500 text-sm mt-2">Completa tus datos para agilizar tu acceso.</p>
        </div>

        <form onSubmit={guardarPerfil} className="space-y-5">
          <div className="flex flex-col items-center mb-6 space-y-3">
            <div className="relative">
              {fotoBase64 ? (
                <img src={fotoBase64} alt="Previsualización" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"/>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md border-4 border-white">
                  {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <button type="button" onClick={triggerFileInput} className="absolute bottom-0 right-0 bg-[#0d1b2a] text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all opacity-90 group-hover:opacity-100">
                <span className="text-xs">📷</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre Completo</label>
            <input required type="text" name="nombre" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Juan Pérez" />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Correo Electrónico</label>
            <input required type="email" name="correo" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="juan@correo.com" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Teléfono</label>
            <input required type="tel" name="telefono" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10 dígitos" />
          </div>

          <button type="submit" className="w-full mt-8 bg-[#3b82f6] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all">
            Guardar y Continuar
          </button>
        </form>

        {/* BOTÓN DE LOGIN RÁPIDO */}
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 mb-3">¿Ya has usado WayPark antes?</p>
          <button onClick={simularLoginExistente} className="w-full bg-white text-[#0d1b2a] border-2 border-[#0d1b2a] text-sm font-bold py-3 rounded-full hover:bg-gray-50 active:scale-95 transition-all">
            Ya tengo cuenta, iniciar sesión
          </button>
        </div>

      </div>
    </div>
  );
}