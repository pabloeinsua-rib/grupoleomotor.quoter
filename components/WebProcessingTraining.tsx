
import React, { useState } from 'react';
import { View } from '../App.tsx';
import { InfoIcon, XIcon, WarningIcon, PhoneIcon, ExternalLinkIcon } from './Icons.tsx';
import DealerCodesModal from './DealerCodesModal.tsx';

// Reusable modal for user keys
const KeysInfoModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-none border border-slate-200 w-full max-w-lg p-8 relative fade-in-up" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors z-10 p-2">
                <XIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-black tracking-widest uppercase mb-6 text-center">Claves de Usuario</h3>
            <div className="space-y-4">
                <div className="text-sm text-black p-6 border border-slate-200 space-y-4">
                    <p>Tu <strong className="font-bold">Número de Identificador</strong> es tu DNI/NIE con letra mayúscula.</p>
                    <p>Tu <strong className="font-bold">Clave de acceso</strong> es un código de al menos 6 dígitos.</p>
                    <p>Si no lo recuerdas, pulsa el botón para abrir la Web de Auto y haz clic en <strong className="font-bold">Recuperar Código Secreto</strong>.</p>
                    <p>Te llegará un código temporal de 6 cifras, que tendrás que cambiar por otro definitivo de al menos 6 caracateres.</p>
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <button onClick={onClose} className="bg-black text-white px-8 py-4 font-bold text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">
                    Aceptar
                </button>
            </div>
        </div>
    </div>
  );

interface ModificacionSolicitudesProps {
  onNavigate: (view: View) => void;
}

const ModificacionSolicitudes: React.FC<ModificacionSolicitudesProps> = ({ onNavigate }) => {
    const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
    const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);

    const handleOpenWebApp = () => {
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;
        const popupWidth = Math.round(screenWidth / 2);
        const popupHeight = screenHeight;
        const url = 'https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto';
        
        // Open on the right side of the screen
        const left = screenWidth - popupWidth;
        
        const features = `width=${popupWidth},height=${popupHeight},left=${left},top=0,resizable,scrollbars,status`;
        window.open(url, 'caixabankpc_webapp_modify', features);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-12 animate-fade-in bg-white min-h-full">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Card for "En Estudio" */}
                <div className="bg-white p-8 sm:p-10 rounded-none border border-slate-200 flex flex-col justify-between min-h-[400px]">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-black tracking-widest uppercase mb-4">Estado "En Estudio"</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium">
                            Para modificar una solicitud que está En Estudio, por favor, contacta con Asistencia Solicitudes.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-none text-left text-sm text-slate-600 space-y-2">
                            <p className="font-bold text-black text-xs uppercase tracking-widest mb-3">Antes de llamar</p>
                            <p>• Ten a mano el <strong className="text-black font-bold">DNI del titular</strong> o el <strong className="text-black font-bold">Número de Solicitud</strong>.</p>
                            <p>• También tienes que tener a mano tu <strong className="text-black font-bold">código de Concesionario</strong>.</p>
                            <p className="text-xs text-slate-400 mt-4">Pulsa en el botón de más abajo para conocer el codigo de tu concesionario.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full mt-auto">
                        <a
                            href="tel:933203365"
                            className="w-full py-4 px-6 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <PhoneIcon className="w-4 h-4" />
                            Llamar 933 203 365 (Opción 1)
                        </a>
                        <button 
                            onClick={() => setIsDealerModalOpen(true)}
                            className="w-full py-4 px-6 bg-white border border-black text-black font-bold text-xs uppercase tracking-widest rounded-none hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <InfoIcon className="w-4 h-4"/>
                            VER CÓDIGOS DE CONCESIONARIO
                        </button>
                    </div>
                </div>
                
                {/* Card for "Aprobada" */}
                <div className="bg-white p-8 sm:p-10 rounded-none border border-slate-200 flex flex-col justify-between min-h-[400px]">
                    <div>
                        <h3 className="text-xl font-bold text-black tracking-widest uppercase mb-4">Estado "Pre-Autorizada" o "Aprobada"</h3>
                        <p className="text-sm text-slate-500 mb-6 font-medium">
                            Puedes contactar con Asistencia o bien, entrar a la Web de Operaciones para realizar la modificación.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-none flex items-start gap-3 text-left mb-8">
                            <WarningIcon className="w-5 h-5 flex-shrink-0 text-slate-800 mt-0.5" />
                            <p className="text-xs text-slate-800 font-bold leading-relaxed uppercase tracking-wider">
                                Cualquier modificación en los datos económicos puede revertir la solicitud a "En Estudio" o "Denegada".
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full mt-auto">
                        <a
                            href="tel:933203365"
                            className="w-full py-4 px-6 bg-white border border-slate-200 text-black font-bold text-xs uppercase tracking-widest rounded-none hover:border-black transition-colors flex items-center justify-center gap-2"
                        >
                            <PhoneIcon className="w-4 h-4" />
                            Llamar 933 203 365 (Opción 2)
                        </a>
                        <button
                            onClick={handleOpenWebApp}
                            className="w-full py-4 px-6 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLinkIcon className="w-4 h-4" />
                            Web de Auto
                        </button>
                        <button 
                            onClick={() => setIsKeysModalOpen(true)}
                            className="w-full py-4 px-6 bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest rounded-none hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2"
                        >
                            <InfoIcon className="w-4 h-4"/>
                            Mis Claves de Usuario
                        </button>
                        <button 
                            onClick={() => setIsDealerModalOpen(true)}
                            className="w-full py-4 px-6 bg-white border border-black text-black font-bold text-xs uppercase tracking-widest rounded-none hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <InfoIcon className="w-4 h-4"/>
                            VER CÓDIGOS DE CONCESIONARIO
                        </button>
                    </div>
                </div>

            </div>
            {isKeysModalOpen && <KeysInfoModal onClose={() => setIsKeysModalOpen(false)} />}
            {isDealerModalOpen && <DealerCodesModal onClose={() => setIsDealerModalOpen(false)} />}
        </div>
    );
};

export default ModificacionSolicitudes;
