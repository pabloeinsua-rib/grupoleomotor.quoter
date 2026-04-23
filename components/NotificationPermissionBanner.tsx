import React, { useState } from 'react';
import { useNotification } from './NotificationContext.tsx';
import { BellIcon } from './Icons.tsx';

const NotificationPermissionBanner: React.FC = () => {
  const { permission, requestPermission } = useNotification();
  const [isVisible, setIsVisible] = useState(true);

  const handleAllow = () => {
    requestPermission();
    setIsVisible(false);
  };

  const handleDeny = () => {
    setIsVisible(false);
  };

  if (permission !== 'default' || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between gap-4 print-hide animate-fade-in-up">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
      <div className="flex items-center gap-3">
        <BellIcon className="w-8 h-8 text-slate-300 hidden sm:block" />
        <p className="text-sm text-slate-300 text-center sm:text-left">
          ¿Quieres recibir notificaciones sobre el estado de tus solicitudes y nuevas ofertas?
        </p>
      </div>
      <div className="flex gap-4 flex-shrink-0">
        <button
          onClick={handleAllow}
          className="bg-[#00a1e0] text-white font-bold py-2 px-6 rounded-none hover:bg-[#0085c7] transition-colors"
        >
          Permitir
        </button>
        <button
          onClick={handleDeny}
          className="text-slate-400 hover:text-white font-semibold py-2 px-4 rounded-none transition-colors"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
};

export default NotificationPermissionBanner;