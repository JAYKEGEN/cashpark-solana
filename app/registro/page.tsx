'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

export default function RegistroPerfil() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    placas: ''
  });

  useEffect(() => {
    if (!connected) router.push('/');
  }, [connected, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardamos los datos en la memoria del navegador
    localStorage.setItem('waypark_user_profile', JSON.stringify(formData));
    // Y le regalamos sus primeros puntos de bienvenida
    localStorage.setItem('waypark_puntos_totales', '5.0000'); 
    
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 justify-center">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-[30px] shadow-2xl border-t-8 border-[#3b82f6]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#0d1b2a]">Crea tu Perfil</h2>
          <p className="text-gray-500 text-sm mt-2">Completa tus datos para agilizar tu acceso al estacionamiento.</p>
        </div>

        <form onSubmit={guardarPerfil} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre Completo</label>
            <input required type="text" name="nombre" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Juan Pérez" />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Correo Electrónico</label>
            <input required type="email" name="correo" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="juan@correo.com" />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Teléfono</label>
              <input required type="tel" name="telefono" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10 dígitos" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Placas del Auto</label>
              <input required type="text" name="placas" onChange={handleChange} className="w-full mt-1 p-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" placeholder="ABC-123" />
            </div>
          </div>

          <button type="submit" className="w-full mt-8 bg-[#3b82f6] text-white text-lg font-bold py-4 rounded-full shadow-lg hover:bg-blue-600 active:scale-95 transition-all">
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}