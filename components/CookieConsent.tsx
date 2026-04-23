import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons.tsx';
import type { CookiePreferences } from '../App.tsx';

interface CookieConsentProps {
  initialPreferences: CookiePreferences | null;
  onSave: (preferences: CookiePreferences) => void;
  onClose: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ initialPreferences, onSave, onClose }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [prefs, setPrefs] = useState<CookiePreferences>({
    accepted: false,
    necessary: true,
    functional: true,
    analytics: true,
  });

  useEffect(() => {
    // If we're managing existing preferences, open the settings view directly.
    if (initialPreferences) {
        setIsSettingsOpen(true);
        setPrefs(initialPreferences);
    }
  }, [initialPreferences]);

  const handleAcceptAll = () => {
    onSave({ accepted: true, necessary: true, functional: true, analytics: true });
  };

  const handleRejectAll = () => {
    onSave({ accepted: true, necessary: true, functional: false, analytics: false });
  };

  const handleSavePreferences = () => {
    onSave({ ...prefs, accepted: true });
  };

  const togglePreference = (key: 'functional' | 'analytics') => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const renderInitialView = () => (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Aviso de Cookies</h2>
        <p className="text-sm text-gray-600 my-4">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y para recordar tus preferencias (como la opción de "Recordar usuario").
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button onClick={handleAcceptAll} className="flex-1 bg-caixa-blue text-white font-bold py-3 px-6 rounded-none hover:bg-caixa-blue-light transition-colors">Aceptar Todas</button>
            <button onClick={() => setIsSettingsOpen(true)} className="flex-1 bg-slate-100 text-slate-800 font-semibold py-3 px-6 rounded-none hover:bg-slate-200 transition-colors">Configurar</button>
        </div>
        <div className="mt-3">
             <button onClick={handleRejectAll} className="w-full bg-slate-100 text-slate-800 font-semibold py-3 px-6 rounded-none hover:bg-slate-200 transition-colors">Rechazar Opcionales</button>
        </div>
    </div>
  );
  
  const renderSettingsView = () => (
    <>
        <button onClick={onClose} className="absolute top-6 right-6 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors z-10">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Configuración de Cookies</h2>
        </div>
        
        <div className="overflow-y-auto pr-2 space-y-4">
            <p className="text-sm text-gray-600">Puedes elegir qué tipo de cookies permites a continuación.</p>
            
            {/* Necesarias */}
            <div className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Cookies Técnicas (Necesarias)</h3>
                    <label className="relative inline-flex items-center cursor-not-allowed">
                        <input type="checkbox" checked={true} disabled className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-caixa-blue"></div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Estas cookies son esenciales para que la aplicación funcione correctamente (ej. mantener tu sesión iniciada). No se pueden desactivar.</p>
            </div>
            
            {/* Funcionales */}
            <div className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Cookies de Personalización</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.functional} onChange={() => togglePreference('functional')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-caixa-blue"></div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Nos permiten recordar tus preferencias, como la opción de "Recordar usuario", para que no tengas que introducirlas cada vez que nos visites.</p>
            </div>
            
            {/* Analíticas */}
            <div className="border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Cookies de Análisis</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.analytics} onChange={() => togglePreference('analytics')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-caixa-blue"></div>
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Nos ayudan a entender cómo se utiliza la aplicación para poder mejorarla. Todos los datos son anónimos.</p>
            </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={handleSavePreferences} className="flex-1 bg-caixa-blue text-white font-bold py-3 px-6 rounded-none hover:bg-caixa-blue-light transition-colors">Guardar Configuración</button>
            <button onClick={handleAcceptAll} className="flex-1 bg-slate-100 text-slate-800 font-semibold py-3 px-6 rounded-none hover:bg-slate-200 transition-colors">Aceptar Todas</button>
        </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up max-h-[90vh] flex flex-col">
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
            {isSettingsOpen ? renderSettingsView() : renderInitialView()}
        </div>
    </div>
  );
};

export default CookieConsent;