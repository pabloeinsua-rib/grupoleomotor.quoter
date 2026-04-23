
import React from 'react';
import type { View } from '../App.tsx';
import { EuroIcon, DevicePhoneMobileIcon, FileTextIcon, BriefcaseIcon, BuildingOfficeIcon, DownloadIcon } from './Icons.tsx';

interface AbonoSolicitudesProps {
  onNavigate: (view: View) => void;
}

const AbonoSolicitudes: React.FC<AbonoSolicitudesProps> = ({ onNavigate }) => {
  return (
    <div className="w-full relative min-h-full pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        `}</style>
        
        <div className="relative z-10 pt-6">
            
            {/* Main Alert Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-10 animate-fade-in-up">
                <h3 className="text-2xl font-light text-black tracking-tight mb-6">
                    Abono de Solicitudes
                </h3>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                    <p>Sólo al recibir la <strong className="text-black">Carta de Pago</strong> es cuando puedes proceder a Matricular vehículo o bien a entregarlo, si está matriculado.</p>
                    <p>Nunca antes, ya que existen ficheros de Solvencia, que solo se pueden consultar cuando el titular ha firmado el contrato, y no antes.</p>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-black font-medium mt-4">
                        Una vez la solicitud está firmada y toda la documentación está validada por nuestro equipo, enviaremos a tu correo la Carta de Pago.
                    </div>
                </div>
            </div>

            {/* Grid of Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {/* APP Móvil */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
                            <DevicePhoneMobileIcon className="w-6 h-6 text-black" />
                        </div>
                        <h4 className="font-light text-lg text-black tracking-tight">Firma OTP a Distancia y Firma APP móvil Presencial</h4>
                    </div>
                    <div className="text-sm text-slate-500 space-y-4 flex-grow leading-relaxed">
                        <p>No es necesario comunicar que la solicitud ha sido firmada, la propia APP solicita el pago.</p>
                        <p>Tienes que fijarte, al finalizar el proceso de firma, que indique: <strong className="text-black">Solicitud Firmada Correctamente</strong>.</p>
                        <p>El pago suele producirse en el dia, siempre y cuando esté toda la documentación validada y no falte ningún Documento.</p>
                        <p className="italic bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">Revisa tu correo por si te ha llegado alguna incidencia que resolver de la solicitud.</p>
                    </div>
                </div>

                {/* Contrato Papel */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
                            <FileTextIcon className="w-6 h-6 text-black" />
                        </div>
                        <h4 className="font-light text-lg text-black tracking-tight">Firma en Papel</h4>
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                            Si la firma ha sido en contrato de papel, tienes que enviar una copia a:
                        </p>
                        <p className="text-xs font-mono font-semibold text-black mb-4 break-all bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">documentacion.auto@caixabankpc.com</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            con el contrato firmado y escaneado, para que podamos proceder a emitir el pago.
                        </p>
                    </div>
                </div>

                {/* Gestoría */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
                            <BriefcaseIcon className="w-8 h-8 text-black" />
                        </div>
                        <h4 className="font-light text-lg text-black tracking-tight">Firma por Gestoría</h4>
                    </div>
                    <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                        Si la firma ha sido a distancia, mediante Gestoría, tendrás el pago el mismo día que se haya firmado con cliente.
                    </p>
                </div>

                {/* Notaría */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
                            <BuildingOfficeIcon className="w-8 h-8 text-black" />
                        </div>
                        <h4 className="font-light text-lg text-black tracking-tight">Firma Notaría</h4>
                    </div>
                    <p className="text-sm text-slate-500 flex-grow leading-relaxed">
                        Si la firma ha sido mediante Notaría, tendrás el pago el mismo día que la Notaría nos envíe una copia del contrato firmado.
                    </p>
                </div>
            </div>

            {/* Bottom CTA Card */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-light text-black tracking-tight mb-4">Gestiona tus operaciones en cualquier lugar</h3>
                <p className="text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Puedes ver el estado de tu solicitud, en tiempo real, descargar cartas de pago, enviar copias de contrato y más cosas desde la APP Mi Gestor de Operaciones.
                    Pulsa en el botón para descargarla a tu Smartphone.
                </p>
                <button
                    onClick={() => onNavigate('operationsManager')}
                    className="inline-flex items-center justify-center bg-black text-white font-bold py-4 px-8 rounded-none hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                >
                    <DownloadIcon className="w-5 h-5 mr-3" />
                    Ir a Mi Gestor de Operaciones
                </button>
            </div>
        </div>
    </div>
  );
};

export default AbonoSolicitudes;
