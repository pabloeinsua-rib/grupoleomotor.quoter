import React from 'react';
import { XIcon, DownloadIcon, ShareIcon } from './Icons.tsx';

interface PwaInstallPromptProps {
  onInstall: () => void;
  onCancel: () => void;
  isIos: boolean;
}

const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ onInstall, onCancel, isIos }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 p-4 pointer-events-none" aria-modal="true" role="dialog">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-8 relative transform transition-all duration-300 animate-fade-in-up border border-slate-100 pointer-events-auto">
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
        
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-none p-2 transition-colors">
            <XIcon className="w-5 h-5" />
        </button>

        <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-xl opacity-20"></div>
                <img src="/icon.svg" alt="Quoter App Icon" className="w-full h-full rounded-3xl shadow-lg relative z-10 border border-slate-100" />
            </div>

            {isIos ? (
                <>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Instalar Quoter</h2>
                    <p className="text-slate-500 mt-2 mb-6 text-sm">Añade la app a tu iPhone o iPad para una experiencia nativa.</p>
                    <ol className="text-left space-y-4 text-sm text-slate-700 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                            <span>Pulsa <strong>Compartir</strong> (<ShareIcon className="w-4 h-4 inline-block text-blue-500" />) en la barra de Safari.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                            <span>Selecciona <strong>"Añadir a pantalla de inicio"</strong> en el menú.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                            <span>Confirma pulsando <strong>"Añadir"</strong> arriba a la derecha.</span>
                        </li>
                    </ol>
                    <button
                        onClick={onCancel}
                        className="w-full mt-6 bg-slate-900 text-white font-bold py-3.5 px-6 rounded-none hover:bg-slate-800 transition-colors shadow-md"
                    >
                        Entendido
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Instalar Quoter</h2>
                    <p className="text-slate-500 mt-2 mb-8 text-sm">Añade la aplicación a tu dispositivo para un acceso más rápido, notificaciones y mejor rendimiento.</p>
                    <div className="flex flex-col gap-3 mt-2">
                        <button
                            onClick={onInstall}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-none hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Instalar Aplicación
                        </button>
                        <p className="text-[11px] text-slate-400 mt-2 px-4 leading-tight">
                            Si el botón no abre ningún menú, pulsa en el icono de instalación 💻 (pantalla con flecha) que aparece a la derecha de la barra de direcciones de tu navegador Chrome.
                        </p>
                        <button
                            onClick={onCancel}
                            className="w-full bg-slate-100 text-slate-700 font-semibold py-3.5 px-6 rounded-none hover:bg-slate-200 transition-colors"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;