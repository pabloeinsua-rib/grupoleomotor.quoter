
import React, { useState } from 'react';
import { CheckCircleIcon, WarningIcon, PhoneIcon, SearchIcon, PersonIcon, TeamIcon, EmailIcon, ShieldCheckIcon, LightbulbIcon, CameraIcon } from './Icons.tsx';
import type { View } from '../App.tsx';

interface FraudPreventionProps {
    onNavigate?: (view: View) => void;
}

const FraudPrevention: React.FC<FraudPreventionProps> = ({ onNavigate }) => {
    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-2xl border border-slate-200 mt-6 md:mt-10">
                
                {/* Mobile-only Plate Photo Button */}
                <div className="md:hidden mb-6">
                    <button 
                        onClick={() => onNavigate?.('utilidades')}
                        className="w-full flex items-center justify-center gap-3 bg-caixa-blue text-white font-bold py-4 rounded-none uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-transform"
                    >
                        <CameraIcon className="w-5 h-5" />
                        Foto-Matrícula
                    </button>
                </div>

                <div className="aspect-video bg-black rounded-xl shadow-lg overflow-hidden mb-8 md:mb-12 max-w-4xl mx-auto border border-slate-200">
                    <iframe 
                        src="https://player.vimeo.com/video/1185576513?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
                        title="Guía Antifraude en FINANCIACION en Concesionarios" 
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="border border-slate-200 p-6 rounded-xl shadow-sm bg-slate-50">
                        <h3 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
                            <span className="bg-black text-white w-6 h-6 rounded-none flex items-center justify-center text-xs tracking-wider">1</span>
                            Prioridades
                        </h3>
                        <ul className="list-none space-y-4 text-sm text-slate-600">
                            <li className="flex gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                <span><strong>Evitar usurpación de identidad:</strong> Asegurar que la imagen del DNI/NIE coincide con la persona que solicita y firma la financiación.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                <span><strong>Detectar manipulación documental:</strong> Revisar diferentes tipos de letra, tamaño, tachones o incongruencias en datos.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                <span>Preguntas de validación: <em>"¿Me puede validar su fecha de nacimiento?"</em> o <em>"¿Población de nacimiento?"</em></span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                <span><strong>Firma Verificada:</strong> Tener certeza de que la persona que firma es el titular del DNI.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border border-slate-200 p-6 rounded-xl shadow-sm bg-slate-50">
                        <h3 className="font-bold text-lg text-black mb-4 flex items-center gap-2">
                            <LightbulbIcon className="w-6 h-6 text-black" />
                            Señales de Alerta
                        </h3>
                        <ul className="list-none space-y-4 text-sm text-slate-600">
                            <li className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                                <span>Acompañantes sin relación familiar directa.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                                <span><strong>No aportan entrada</strong>, señal, ni vehículo a cambio.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                                <span>Desinterés por el precio, plazos o coste de la financiación. Decisión impulsiva.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                                <span>Cliente visiblemente <strong>nervioso e impaciente</strong>.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                                <span>Perfiles sospechosos: Domicilio alejado o intermediarios no permitidos. Vehículos de ocasión.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-black text-white p-8 rounded-xl shadow-xl mb-12">
                     <h3 className="text-xl font-bold mb-8 tracking-wide">Cómo proceder ante sospechas de fraude</h3>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex pl-4 border-l focus:outline-none border-slate-700">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold mb-2">01</span>
                                <p className="text-sm text-slate-300">Tramitar la operación de <strong>manera habitual</strong> para no levantar sospechas.</p>
                            </div>
                        </div>
                        <div className="flex pl-4 border-l border-slate-700">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold mb-2">02</span>
                                <p className="text-sm text-slate-300">En la captación, indicar: <strong>Situación laboral: otros, Ingresos: 1€, Situación: investiga</strong>.</p>
                            </div>
                        </div>
                        <div className="flex pl-4 border-l border-slate-700">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold mb-2">03</span>
                                <p className="text-sm text-slate-300">Enviar correo a <strong>FRAUDE@caixabankpc.com</strong> (Asunto: Investiga & N.º Solicitud).</p>
                            </div>
                        </div>
                         <div className="flex pl-4 border-l border-slate-700">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold mb-2">04</span>
                                <p className="text-sm text-slate-300">CaixaBank P&C responderá al correo con la resolución.</p>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xl font-bold text-black tracking-tight mb-6">Guía Rápida de Recogida de Vehículo</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border border-slate-200 p-6 rounded-xl shadow-sm bg-white">
                            <h4 className="font-bold text-black mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <PersonIcon className="w-5 h-5" />
                                El Titular recobe el vehículo
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span>Revisar <strong>DNI/NIE físico</strong> original.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span>Comprobar la foto del documento con el portador.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span>Validar fecha/población de nacimiento verbalmente.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="border border-slate-200 p-6 rounded-xl shadow-sm bg-white">
                             <h4 className="font-bold text-black mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <TeamIcon className="w-5 h-5" />
                                Un Tercero recibe el vehículo
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span>La firma de la <strong>autorización</strong> debe cuadrar con el DNI del titular.</span>
                                </li>
                                 <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span>El tercero debe presentar su propio <strong>DNI/NIE físico</strong>.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <PhoneIcon className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                                    <span><strong>Imprescindible llamar al titular</strong> para confirmar la entrega y validar datos de la financiación y personales.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm flex items-start gap-4 mb-16">
                    <WarningIcon className="w-8 h-8 text-black flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-black mb-1">Duda y contacta con prevención si..</h4>
                        <p className="text-sm text-slate-600">El titular duda en la llamada, tiene excesiva prisa, se esconde el rostro (gorra/gafas), se muestra reticente a dar información o no recuerda datos del vehículo que compra.</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xl font-bold text-black tracking-tight mb-6">Más Consejos para una Venta Segura</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <SearchIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Verificación Documental Rigurosa</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Compara la firma del DNI con la del contrato. Revisa nóminas en busca de logos extraños, fuentes inconsistentes o errores. Un documento falso a menudo tiene pequeños fallos.</p>
                            </div>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <CheckCircleIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Cruza la Información</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">¿La dirección del DNI coincide con la que te ha dado? ¿El nombre de la empresa en la nómina es coherente con el sector que dice trabajar? Las incongruencias son una señal de alerta.</p>
                            </div>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <PersonIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Analiza el Comportamiento</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Un comprador legítimo negocia y pregunta por el coche. Un estafador a menudo muestra prisa, no le importa el precio ni las condiciones, interesándose más en cómo financiar.</p>
                            </div>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <WarningIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Desconfía de la Presión</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">La urgencia es una táctica común para que bajes la guardia y no verifiques la información correctamente. Tómate tu tiempo para revisar todo con calma.</p>
                            </div>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <PhoneIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Utiliza el Teléfono</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Llama al teléfono fijo de la empresa que aparece en la nómina (búscalo, no uses el que te den) y pregunta si la persona trabaja allí para evitar problemas.</p>
                            </div>
                        </div>
                        <div className="border border-slate-200 p-5 rounded-xl bg-white shadow-sm flex items-start gap-4">
                            <TeamIcon className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-black mb-1">Confía en tu Instinto</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Si algo no te cuadra, probablemente tengas razón. No ignores esa sensación y comunícalo a tu gestor comercial o al departamento de fraude antes de continuar.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-6 pb-4">
                    <a 
                        href="mailto:FRAUDE@caixabankpc.com?subject=Sospecha%20de%20Fraude&body=Indica%20aqu%C3%AD%20el%20DNI/NIE%20o%20n%C3%BAmero%20de%20solicitud%2C%20para%20que%20el%20departamento%20de%20Fraude%2C%20revise%20la%20documentaci%C3%B3n%20del%20cliente%20y/o%20la%20solicitud."
                        className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold py-4 px-8 rounded-none hover:bg-slate-800 shadow-xl transition-transform hover:scale-105 text-xs uppercase tracking-widest min-w-[300px]"
                    >
                        <EmailIcon className="w-5 h-5"/>
                        Enviar correo a Prevención de Fraude
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FraudPrevention;
