import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SellerRegistration({ onBack, onRegistered }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dni: '',
    rol: 'vendedor'
  });
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPdvs, setSelectedPdvs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Debounce search
  useEffect(() => {
    if (searchQ.length < 3) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/dealers/search?q=${encodeURIComponent(searchQ)}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search error", err);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQ]);

  const addPdv = (pdv) => {
    if (!selectedPdvs.find(p => p.codigo_pdv === pdv.codigo_pdv)) {
      setSelectedPdvs([...selectedPdvs, pdv]);
    }
    setSearchQ('');
    setSearchResults([]);
  };

  const removePdv = (code) => {
    setSelectedPdvs(selectedPdvs.filter(p => p.codigo_pdv !== code));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (selectedPdvs.length === 0) {
      setError('Debes añadir al menos un punto de venta (PDV)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          dni: formData.dni,
          nombre: formData.nombre,
          rol: formData.rol,
          pdvCodes: selectedPdvs.map(p => p.codigo_pdv)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error registrando usuario');
        setIsSubmitting(false);
      } else {
        // Automatically login the newly created user
        onRegistered({ email: formData.email, password: formData.dni });
      }
    } catch (err) {
      setError('Error de comunicación con el servidor');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-10 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10 relative">
          
          <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          <div className="text-center mb-8 mt-4">
            <ShieldCheck className="w-12 h-12 text-[#00A0E3] mx-auto mb-3" />
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Registro de Red Comercial</h1>
            <p className="text-sm text-slate-500 mt-1">Date de alta asignándote a tu concesionario</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Nombre Completo</label>
                <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="block w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-[#00A0E3] focus:ring-1 focus:ring-[#00A0E3] outline-none" placeholder="Ej: Maria Lopez" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Rol</label>
                <select value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})} className="block w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-[#00A0E3] focus:ring-1 focus:ring-[#00A0E3] outline-none bg-white">
                  <option value="vendedor">Vendedor</option>
                  <option value="jefe_ventas">Jefe de Ventas</option>
                  <option value="director_comercial">Director Comercial</option>
                  <option value="gerente">Gerente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="block w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-[#00A0E3] focus:ring-1 focus:ring-[#00A0E3] outline-none" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">DNI / NIE (Será tu contraseña)</label>
                <input required type="text" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="block w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-[#00A0E3] focus:ring-1 focus:ring-[#00A0E3] outline-none uppercase" placeholder="12345678A" />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <label className="block text-sm font-bold text-slate-800 mb-1">Asignar Puntos de Venta (PDVs)</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="text" value={searchQ} onChange={e => setSearchQ(e.target.value)} className="block w-full rounded-md border border-slate-300 pl-9 pr-4 py-2 text-sm focus:border-[#00A0E3] focus:ring-1 focus:ring-[#00A0E3] outline-none" placeholder="Busca por nombre PDV, código o CIF..." />
                
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm">
                    {searchResults.map(res => (
                      <li key={res.codigo_pdv} onClick={() => addPdv(res)} className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{res.nombre_pdv} <span className="text-slate-400 font-normal ml-1">({res.codigo_pdv})</span></span>
                          <span className="text-slate-500 text-xs">{res.localidad} ({res.provincia}) - {res.nombre_establecimiento}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {selectedPdvs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedPdvs.map(p => (
                    <div key={p.codigo_pdv} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{p.nombre_pdv}</p>
                          <p className="text-xs text-slate-500">Cod: {p.codigo_pdv} • {p.localidad}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removePdv(p.codigo_pdv)} className="text-slate-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button disabled={isSubmitting} type="submit" className="flex w-full justify-center rounded-none bg-[#00A0E3] py-3 px-4 text-base font-bold text-white shadow-sm hover:bg-[#008bc6] transition-colors disabled:opacity-50">
                {isSubmitting ? 'Registrando...' : 'Finalizar Registro'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
