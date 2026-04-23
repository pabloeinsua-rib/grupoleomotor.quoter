/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, FileText, Printer, Download, Building2, Calculator, RotateCcw, MoreHorizontal, CreditCard, Wallet, Receipt, Users, HelpCircle, Settings, ChevronRight, CheckCircle2, Clock, LogOut, Car, Percent, Euro } from 'lucide-react';
import KasPanel from './components/KasPanel';
import SellerRegistration from './components/SellerRegistration';

// Types
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuoteData {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  date: string;
  validUntil: string;
  notes: string;
  taxRate: number;
  // Financial fields
  downPayment: number;
  termMonths: number;
  selectedPdv: string;
}

export default function App() {
  const [user, setUser] = useState<{id: string | number, role: string, email: string, nombre: string, cargo?: string, pdvs?: any[]} | null>(null);
  const [viewState, setViewState] = useState<'login' | 'register'>('login');
  
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [quoteData, setQuoteData] = useState<QuoteData>({
    clientName: 'John Doe',
    companyName: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Gracias por su preferencia. Esta cotización es válida por 30 días.',
    taxRate: 21,
    downPayment: 0,
    termMonths: 72,
    selectedPdv: '',
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Vehículo', quantity: 1, unitPrice: 24000.00 },
    { id: '2', description: 'Seguro', quantity: 1, unitPrice: 500.00 }
  ]);

  const [tariffsSystem, setTariffsSystem] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'seller') {
      if (user.pdvs && user.pdvs.length > 0 && !quoteData.selectedPdv) {
        setQuoteData(prev => ({ ...prev, selectedPdv: user.pdvs![0].codigo_pdv }));
      }
      fetch('/api/tariffs').then(r => r.json()).then(data => setTariffsSystem(data)).catch(console.error);
    }
  }, [user, quoteData.selectedPdv]);

  const handleQuoteDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteData(prev => ({ 
      ...prev, 
      [name]: name === 'downPayment' || name === 'termMonths' || name === 'taxRate' ? Number(value) : value 
    }));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return subtotal * (quoteData.taxRate / 100);
  }, [subtotal, quoteData.taxRate]);

  const total = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const amountFinanced = useMemo(() => {
    return Math.max(0, total - quoteData.downPayment);
  }, [total, quoteData.downPayment]);

  // Determine current active config based on selected PDV
  const activePdvConfig = useMemo(() => {
    if (!user || !user.pdvs) return null;
    return user.pdvs.find(p => p.codigo_pdv === quoteData.selectedPdv) || null;
  }, [user, quoteData.selectedPdv]);

  // Extract TIN and logic from the actual global tariffs
  const tariffDetails = useMemo(() => {
    const defaults = { 
        tin_minimo: 8.99,
        tin_maximo: 8.99,
        plazo_minimo: 36,
        plazo_maximo: 120,
        coeficientes_cuota: null as Record<string, number> | null,
        coeficientes_comision: null as Record<string, number> | null,
        comision_base: 1.0 
    };
    
    if (!activePdvConfig || !tariffsSystem.length) return defaults;
    
    const matchedTariff = tariffsSystem.find(t => t.nombre === activePdvConfig.tarifa_asignada);
    if (!matchedTariff) return defaults;

    try {
      const parsed = JSON.parse(matchedTariff.datos_json || '{}');
      return { 
        tin_minimo: parsed.tin_minimo ?? parsed.tin ?? defaults.tin_minimo,
        tin_maximo: parsed.tin_maximo ?? parsed.tin ?? defaults.tin_maximo,
        plazo_minimo: parsed.plazo_minimo ?? defaults.plazo_minimo,
        plazo_maximo: parsed.plazo_maximo ?? defaults.plazo_maximo,
        coeficientes_cuota: parsed.coeficientes_cuota || null,
        coeficientes_comision: parsed.coeficientes_comision || null,
        comision_base: parsed.comision !== undefined ? parsed.comision : defaults.comision_base
      };
    } catch {
      return defaults;
    }
  }, [activePdvConfig, tariffsSystem]);

  // Keep term bound within constraints when tariff changes
  useEffect(() => {
     if (quoteData.termMonths < tariffDetails.plazo_minimo) {
         setQuoteData(p => ({ ...p, termMonths: tariffDetails.plazo_minimo }));
     } else if (quoteData.termMonths > tariffDetails.plazo_maximo) {
         setQuoteData(p => ({ ...p, termMonths: tariffDetails.plazo_maximo }));
     }
  }, [tariffDetails.plazo_minimo, tariffDetails.plazo_maximo, quoteData.termMonths]);

  const monthlyPayment = useMemo(() => {
    if (amountFinanced <= 0 || quoteData.termMonths <= 0) return 0;
    
    // Si tenemos una tabla de coeficientes incrustada en el JSON
    if (tariffDetails.coeficientes_cuota && tariffDetails.coeficientes_cuota[quoteData.termMonths.toString()]) {
        const pmt = amountFinanced * tariffDetails.coeficientes_cuota[quoteData.termMonths.toString()];
        return Math.round(pmt * 100) / 100;
    }

    // Fallback a fórmula estándar con el TIN Mínimo (o el único TIN si son iguales)
    const monthlyRate = (tariffDetails.tin_minimo / 100) / 12;
    if (monthlyRate === 0) return amountFinanced / quoteData.termMonths;
    // Formula PMT: M = P * ( i * (1 + i)^n ) / ( (1 + i)^n - 1 )
    const pmt = amountFinanced * (monthlyRate * Math.pow(1 + monthlyRate, quoteData.termMonths)) / (Math.pow(1 + monthlyRate, quoteData.termMonths) - 1);
    return Math.round(pmt * 100) / 100;
  }, [amountFinanced, quoteData.termMonths, tariffDetails]);

  const totalComission = useMemo(() => {
    // Si la comisión se basa en coeficientes definidos por plazo
    if (tariffDetails.coeficientes_comision && tariffDetails.coeficientes_comision[quoteData.termMonths.toString()]) {
         return (amountFinanced * tariffDetails.coeficientes_comision[quoteData.termMonths.toString()]) / 100;
    }
    // Fallback a la comisión estándar de la tarifa
    return (amountFinanced * tariffDetails.comision_base) / 100;
  }, [amountFinanced, quoteData.termMonths, tariffDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    setIsLoggingIn(true);
    setLoginError('');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (data.error === 'not_found') {
              setLoginError('No encontramos tu email. Si eres de la Red Comercial, regístrate abajo.');
            } else {
              setLoginError(data.error || 'Autenticación fallida');
            }
        } else {
            setUser(data.user);
        }
    } catch (err) {
        setLoginError('Error de red comunicándose con el servidor');
    } finally {
        setIsLoggingIn(false);
    }
  };

  const attemptAutoLoginAfterRegister = async (creds: any) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: creds.email, password: creds.password })
        });
        const data = await response.json();
        if (response.ok) setUser(data.user);
    } catch (e) {
        console.error("Auto Login Fallido", e);
    }
  };

  if (!user) {
    if (viewState === 'register') {
      return <SellerRegistration onBack={() => setViewState('login')} onRegistered={attemptAutoLoginAfterRegister} />;
    }

    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10 relative">
            
            <div className="text-center mb-10">
              <h1 className="text-4xl font-light text-[#00A0E3] tracking-tight mb-2">
                Quoter Automotive
              </h1>
              <h2 className="text-lg font-semibold text-slate-500">
                Financial Assistant
              </h2>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-800 mb-1">
                  Email Corporativo / Red Comercial
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  placeholder="ejemplo@email.com o usuario"
                  className="block w-full appearance-none rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-[#00A0E3] focus:outline-none focus:ring-1 focus:ring-[#00A0E3] sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-800 mb-1">
                  DNI/NIE o Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="12345678A O CONTRASEÑA"
                  className="block w-full appearance-none rounded-md border border-slate-300 px-4 py-3 placeholder-slate-400 focus:border-[#00A0E3] focus:outline-none focus:ring-1 focus:ring-[#00A0E3] sm:text-sm"
                />
                {loginError && (
                  <p className="mt-2 text-sm text-red-500 font-medium">{loginError}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex w-full justify-center rounded-none border border-transparent bg-[#00A0E3] py-3 px-4 text-base font-bold text-white shadow-sm hover:bg-[#008bc6] focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isLoggingIn ? 'Verificando...' : 'Entrar'}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-1">¿Eres de la red comercial y es tu primer acceso?</p>
              <button onClick={() => setViewState('register')} className="text-[#00A0E3] font-bold hover:underline">
                Date de alta aquí
              </button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs text-slate-500 mb-1">© 2026. Quoter Automotive</p>
              <p className="text-xs text-slate-500">Versión: GLEO/MAR/26</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERING MAIN SCREENS DEPENDING ON ROLE ---
  if (user.role === 'superadmin' || user.role === 'kas') {
    return <KasPanel user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-slate-200 flex flex-col bg-white shrink-0 hidden md:flex">
        <div className="p-8 pb-6">
          <h1 className="text-2xl font-bold text-blue-500 tracking-tight flex items-center gap-2">
            grupo pardo
          </h1>
        </div>
        
        <div className="px-6 pb-8">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-none py-2.5 px-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Nueva cotización
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto">
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-800 mb-3">Cotizaciones</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <FileText className="w-4 h-4" />
                  Borradores
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobadas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-800 mb-3">Catálogo</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <Receipt className="w-4 h-4" />
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <Users className="w-4 h-4" />
                  Clientes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-800 mb-3">Soporte</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <HelpCircle className="w-4 h-4" />
                  Ayuda
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-none">
                  <Settings className="w-4 h-4" />
                  Configuración
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setUser(null)}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Center Column */}
        <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto lg:mx-0">
            
            <div className="mb-10">
              <p className="text-sm text-slate-500 mb-2 font-medium">Cotización en curso</p>
              <input 
                type="text"
                className="text-4xl lg:text-5xl font-bold text-slate-900 border-0 p-0 focus:ring-0 placeholder-slate-300 w-full bg-transparent outline-none"
                placeholder="Nombre del Cliente"
                value={quoteData.clientName}
                onChange={handleQuoteDataChange}
                name="clientName"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-slate-900">Detalles del cliente</h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-none hover:bg-slate-100 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-none hover:bg-slate-100 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6">Ingresa los datos de contacto y validez de la cotización</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <label className="text-xs font-medium text-slate-500 block mb-1">Empresa</label>
                <input type="text" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none" placeholder="Nombre de la empresa" name="companyName" value={quoteData.companyName} onChange={handleQuoteDataChange} />
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <label className="text-xs font-medium text-slate-500 block mb-1">Correo Electrónico</label>
                <input type="email" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none" placeholder="correo@ejemplo.com" name="email" value={quoteData.email} onChange={handleQuoteDataChange} />
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <label className="text-xs font-medium text-slate-500 block mb-1">Fecha de emisión</label>
                <input type="date" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium outline-none" name="date" value={quoteData.date} onChange={handleQuoteDataChange} />
              </div>
              <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <label className="text-xs font-medium text-slate-500 block mb-1">Válido hasta</label>
                <input type="date" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium outline-none" name="validUntil" value={quoteData.validUntil} onChange={handleQuoteDataChange} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-slate-900">Conceptos (Oferta)</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Agrega los productos o servicios a cotizar</p>

            <div className="space-y-4 mb-12">
              {items.map((item, index) => (
                <div key={item.id} className={`border rounded-none p-5 relative group transition-colors ${index === 0 ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="text-xs font-medium text-slate-500 block mb-1">Descripción</label>
                      <input type="text" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none bg-transparent" placeholder="Producto o servicio" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-slate-500 block mb-1">Cantidad</label>
                      <input type="number" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none bg-transparent" placeholder="0" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-xs font-medium text-slate-500 block mb-1">Precio Unitario</label>
                      <div className="flex items-center">
                        <span className="text-slate-400 text-sm mr-1">€</span>
                        <input type="number" className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none bg-transparent" placeholder="0.00" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Principal
                    </div>
                  )}
                  
                  {index !== 0 && (
                    <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button onClick={addItem} className="w-full border border-dashed border-slate-300 rounded-none p-4 text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar otro concepto
              </button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-slate-900">Configuración Financiera</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Detalles de la operación y financiación</p>

            <div className="space-y-4 mb-12">
              <div className={`border rounded-none p-5 relative border-blue-500 ring-1 ring-blue-500`}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  <div className="md:col-span-12">
                     <label className="text-xs font-medium text-slate-500 block mb-1">Punto de Venta / Cotización</label>
                     <select 
                        name="selectedPdv" 
                        value={quoteData.selectedPdv}
                        onChange={handleQuoteDataChange}
                        className="w-full border-0 p-0 text-lg focus:ring-0 text-slate-900 font-semibold outline-none bg-transparent"
                     >
                       {user.pdvs?.map(p => (
                         <option key={p.codigo_pdv} value={p.codigo_pdv}>{p.codigo_pdv} - {p.nombre_pdv}</option>
                       ))}
                     </select>
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-slate-500 block mb-1">Total Oferta (PVP)</label>
                    <div className="flex items-center">
                      <input type="text" readOnly className="w-full border-b border-slate-200 py-2 text-xl focus:ring-0 text-slate-900 font-bold outline-none bg-slate-50 transition-colors cursor-not-allowed" value={formatCurrency(total)} />
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-slate-500 block mb-1">Entrada Inicial</label>
                    <div className="flex items-center">
                      <input type="number" className="w-full border-b border-slate-200 py-2 text-xl focus:ring-0 text-slate-900 font-bold placeholder-slate-300 outline-none bg-transparent focus:border-blue-500 transition-colors" name="downPayment" value={quoteData.downPayment} onChange={handleQuoteDataChange} />
                      <Euro className="w-5 h-5 text-slate-400 ml-2" />
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-slate-500 block mb-1">Plazo (Meses)</label>
                    <select 
                       name="termMonths" 
                       value={quoteData.termMonths}
                       onChange={handleQuoteDataChange}
                       className="w-full border-b border-slate-200 py-2 text-xl focus:ring-0 text-slate-900 font-bold outline-none bg-transparent focus:border-blue-500 transition-colors"
                    >
                      {[12, 24, 36, 48, 60, 72, 84, 96, 108, 120]
                        .filter(m => m >= tariffDetails.plazo_minimo && m <= tariffDetails.plazo_maximo)
                        .map(m => (
                        <option key={m} value={m}>{m} meses</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium">
                  <Car className="w-3 h-3" />
                  Préstamo Lineal
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Notas adicionales</h2>
              <div className="border border-slate-200 rounded-2xl p-5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                <textarea 
                  name="notes"
                  value={quoteData.notes}
                  onChange={handleQuoteDataChange}
                  rows={3}
                  className="w-full border-0 p-0 text-sm focus:ring-0 text-slate-900 font-medium placeholder-slate-300 outline-none resize-none bg-transparent"
                  placeholder="Condiciones de pago, tiempo de entrega, etc."
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar (Summary) */}
        <aside className="w-full lg:w-[400px] border-l border-slate-200 bg-[#FAFAFA] p-8 lg:p-10 overflow-y-auto shrink-0 flex flex-col">
          <h2 className="text-2xl font-semibold text-slate-900 mb-1">Estudio Financiero</h2>
          <p className="text-sm text-slate-500 mb-8">Desglose de cuotas y condiciones</p>

          <div className="border border-slate-200 bg-white rounded-2xl p-4 flex items-center gap-3 mb-6 text-sm text-slate-600 font-medium shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <Building2 className="w-5 h-5" />
            </div>
            <div>
               <p className="text-slate-900 font-bold truncate max-w-[200px]">{user.nombre}</p>
               <p className="text-xs text-slate-500 uppercase">{user.role === 'seller' ? 'Asesor Comercial' : user.role}</p>
            </div>
          </div>

          <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm flex-1">
            <div className="p-6 border-b border-slate-100 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-center">
              <h3 className="font-medium text-slate-500 text-sm mb-1">Cuota Mensual</h3>
              <p className="text-5xl font-bold text-blue-600 tracking-tight">{formatCurrency(monthlyPayment)}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium bg-white border border-slate-100 px-3 py-1 rounded-full text-center">
                 TIN Mínimo Configurado: <span className="text-slate-700">{tariffDetails.tin_minimo}%</span>
              </p>
            </div>
            
            <div className="p-6 border-b border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Desglose del Capital</h4>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Total PVP Oferta</span>
                <span className="text-slate-900 font-semibold">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Entrada</span>
                <span className="text-slate-900 font-semibold text-red-500">- {formatCurrency(quoteData.downPayment)}</span>
              </div>
              
              <div className="pt-4 border-t border-dashed border-slate-200">
                <div className="flex justify-between items-center text-base">
                  <span className="text-slate-800 font-bold">Capital a Financiar</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(amountFinanced)}</span>
                </div>
              </div>
            </div>

            {activePdvConfig?.ver_comisiones ? (
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Retribución (Privado)</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Comisión estimada</span>
                  <span className="text-emerald-600 font-bold text-lg">+{formatCurrency(totalComission)}</span>
                </div>
              </div>
            ) : null}

            {activePdvConfig?.premium_program ? (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50/20">
                 <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">Premium Program</h4>
                        <p className="text-xs text-amber-600/80 mt-1">Puntos acumulados en esta operación</p>
                    </div>
                    <span className="text-xl font-black text-amber-600">+{Math.round(amountFinanced / 1000) * 10} pts</span>
                 </div>
              </div>
            ) : null}

          </div>

          <div className="mt-8 space-y-3">
             <button onClick={() => window.print()} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none py-4 px-4 font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
               <FileText className="w-5 h-5" />
               Generar Oferta PDF
             </button>
             <button className="w-full bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 rounded-none py-3.5 px-4 font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
               <Download className="w-4 h-4" />
               Guardar Borrador
             </button>
          </div>
          
        </aside>
      </main>
    </div>
  );
}


