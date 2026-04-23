import React, { useState } from 'react';
import { ExternalLinkIcon } from './Icons.tsx';

const PremiumProgram: React.FC = () => {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleOpenPlatform = () => {
        window.open('https://www.premiumprogram.es/login_page', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 shadow-sm flex flex-col h-full rounded-none animate-fade-in-up">
            
            <div className="mb-10 text-slate-800">
                <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-black">Ventajas del Programa</h2>
                <p className="mb-6 leading-relaxed font-medium">
                    El Premium Program es nuestro programa de incentivos diseñado para recompensar tu esfuerzo y dedicación. 
                    Por cada solicitud financiada, acumularás puntos que podrás canjear por un amplio catálogo de regalos y experiencias.
                </p>
                <ul className="space-y-4 mb-2">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-black mt-2 rounded-none flex-shrink-0"></span>
                        <span><strong className="font-bold text-black">Suma puntos</strong> por cada operación financiada.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-black mt-2 rounded-none flex-shrink-0"></span>
                        <span><strong className="font-bold text-black">Elige</strong> entre cientos de regalos en nuestro catálogo exclusivo.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-black mt-2 rounded-none flex-shrink-0"></span>
                        <span><strong className="font-bold text-black">Disfruta</strong> de tus recompensas.</span>
                    </li>
                </ul>
            </div>

            <div className="mb-2 w-full border border-slate-200 p-2 relative group">
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                    <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest rounded-none">Ampliar</span>
                </div>
                <img 
                    src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/TABLA%20DE%20PUNTOS%20PREMIUM%20PROGRAM%202026.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL1RBQkxBIERFIFBVTlRPUyBQUkVNSVVNIFBST0dSQU0gMjAyNi5wbmciLCJpYXQiOjE3NzY5NDQ1MDAsImV4cCI6MTgwODQ4MDUwMH0.3o7O_xhMYSY3oDfgAnxN-dFi5ixYiC3n5xG8D5ZXrno" 
                    alt="Tabla de Puntos Premium Program 2026" 
                    className="w-full object-cover rounded-none cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                />
            </div>
            
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6 text-center">
                En solicitudes sin seguro para Particulares y Autónomo no llevan puntos asignados.
            </p>

            <div className="bg-blue-50 border-l-4 border-caixa-blue p-4 mb-8 mx-auto w-full max-w-2xl text-center shadow-sm">
                <p className="text-sm font-bold text-caixa-blue">
                    ¿Has entrado en la web y aceptado las bases de 2026, para que te carguen los puntos de tus solicitudes formalizadas?
                </p>
            </div>

            <div className="mt-4 flex justify-center w-full max-w-sm mx-auto">
                 <button 
                    onClick={handleOpenPlatform}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-none"
                >
                    Acceder a PremiumProgram.es
                    <ExternalLinkIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-12 text-center border-t border-slate-200 pt-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Contacto Usuarios</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold text-black">
                    <a href="tel:937205638" className="hover:text-slate-600 transition-colors">Tel: 93 720 56 38</a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href="mailto:consultas@premiumprogram.es" className="hover:text-slate-600 transition-colors">Email: consultas@premiumprogram.es</a>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setIsImageModalOpen(false)}>
                    <div className="relative max-w-7xl max-h-[90vh] w-full flex flex-col items-center justify-center animate-fade-in" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute -top-12 right-0 sm:-right-12 text-white hover:text-gray-300 transition-colors bg-black/50 hover:bg-black/80 rounded-none p-2"
                            title="Cerrar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/TABLA%20DE%20PUNTOS%20PREMIUM%20PROGRAM%202026.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL1RBQkxBIERFIFBVTlRPUyBQUkVNSVVNIFBST0dSQU0gMjAyNi5wbmciLCJpYXQiOjE3NzY5NDQ1MDAsImV4cCI6MTgwODQ4MDUwMH0.3o7O_xhMYSY3oDfgAnxN-dFi5ixYiC3n5xG8D5ZXrno" 
                            alt="Tabla de Puntos Premium Program 2026 Pantalla Completa" 
                            className="w-full h-full object-contain max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumProgram;
