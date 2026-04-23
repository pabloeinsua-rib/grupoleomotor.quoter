
import React, { useState, useEffect } from 'react';
import type { View, SavedOfferData } from '../App.tsx';
import type { AnalysisResult } from './PackageDocumentation.tsx';
import Simulator from './Simulator.tsx';
import PackageDocumentation from './PackageDocumentation.tsx';
import RequestProcessing from './RequestProcessing.tsx';
import { CheckIcon, XIcon, PhoneIcon, FileTextIcon } from './Icons.tsx';
import { useNotification } from './NotificationContext.tsx';

export type Step = 'offer' | 'summary' | 'documentation_guide' | 'documents' | 'pdd';

interface NewRequestWorkflowProps {
    onNavigate: (view: View) => void;
    startStep?: Step;
    offerData: SavedOfferData | null;
    setOfferData: (data: SavedOfferData | null) => void;
    analysisFiles: File[];
    setAnalysisFiles: (files: File[]) => void;
    analysisResult: AnalysisResult | null;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    userId: string | null;
}

const SummaryCard = ({ offerData }: { offerData: SavedOfferData | null }) => {
    if (!offerData) return null;

    const formatCurrency = (value: number | null) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Resumen Económico</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">PVP Vehículo</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(offerData.salePrice)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">Entrada</p>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(offerData.downPayment)}</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg col-span-1 sm:col-span-2 border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">Importe a Financiar</p>
                    <p className="text-2xl font-bold text-caixa-blue">{formatCurrency(offerData.amountToFinance)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">Plazo</p>
                    <p className="text-lg font-bold text-slate-800">{offerData.term} meses</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">T.I.N.</p>
                    <p className="text-lg font-bold text-slate-800">{offerData.interestRate}%</p>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg col-span-1 sm:col-span-2 border border-slate-100">
                    <p className="font-semibold text-slate-500 uppercase text-xs">Tipo de Seguro</p>
                    <p className="text-lg font-bold text-slate-800">{offerData.insuranceType}</p>
                </div>
                <div className="p-4 bg-white rounded-lg col-span-1 sm:col-span-2 border-2 border-caixa-blue shadow-sm">
                    <p className="font-semibold text-slate-500 uppercase text-xs">Cuota Mensual Final</p>
                    <p className="text-3xl font-bold text-caixa-blue">{formatCurrency(offerData.monthlyPayment)}</p>
                </div>
            </div>
        </div>
    );
};

const InfoModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center relative animate-fade-in-up">
            <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors z-10">
                <XIcon className="w-5 h-5" />
            </button>
            <p className="text-gray-700 mb-6">El simulador lleva integrada la normativa de Solicitudes. Cualquier duda, consulta con Asistencia.</p>
            <div className="flex flex-col gap-3">
                <button onClick={onClose} className="w-full glass-btn rounded-none font-bold py-3 px-8 rounded-none transition-colors">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
);

const NewRequestWorkflow: React.FC<NewRequestWorkflowProps> = ({ 
    onNavigate, 
    startStep, 
    offerData, 
    setOfferData, 
    analysisFiles, 
    setAnalysisFiles,
    analysisResult,
    setAnalysisResult,
    userId
}) => {
    const [step, setStep] = useState<Step>(startStep || (offerData ? 'summary' : 'offer'));
    const [simulatorState, setSimulatorState] = useState<any | null>(null);
    const { showNotification } = useNotification();
    const [toasts, setToasts] = useState<any[]>([]);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        if (startStep) {
            setStep(startStep);
        }
    }, [startStep]);

    useEffect(() => {
        if (offerData) {
            setSimulatorState(offerData);
        }
    }, []);

    const [globalStep, setGlobalStep] = useState(1);

    useEffect(() => {
        if (step === 'offer') setGlobalStep(1);
        else if (step === 'summary') setGlobalStep(2);
        else if (step === 'documentation_guide') setGlobalStep(3);
    }, [step]);
    
    const handleOfferComplete = (data: SavedOfferData) => {
        setOfferData(data);
        setStep('summary');
    };

    const handleContinueFromSummary = () => {
        setStep('documentation_guide');
    };

    const handleDocsAnalyzed = () => {
        setStep('pdd');
    };
    
    const handleRestart = () => {
        onNavigate('newRequestWorkflow');
    };

    const handleBack = () => {
        if (step === 'pdd') setStep('documents');
        else if (step === 'documents') setStep('documentation_guide');
        else if (step === 'documentation_guide') setStep('summary');
        else if (step === 'summary') setStep('offer');
    };
    
    const renderCurrentStep = () => {
        switch (step) {
            case 'offer':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-800">1. Datos Económicos de la Solicitud</h2>
                                <button onClick={() => setShowInfoModal(true)} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-none hover:bg-slate-200 transition-colors">+ info</button>
                            </div>
                        </div>
                        <Simulator 
                            mode="workflow"
                            onContinueToWorkflow={handleOfferComplete}
                            onNavigate={onNavigate}
                            currentState={simulatorState}
                            onStateChange={setSimulatorState}
                            onReset={() => setSimulatorState(null)}
                            onSaveOffer={() => {}}
                            onShowSystemMessage={showNotification}
                            onShowToast={(title, description) => setToasts(prev => [...prev, {id: Date.now(), title, description}])}
                            userEmail={userId}
                        />
                    </div>
                );
            case 'summary':
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">2. Resumen Económico</h2>
                        <SummaryCard offerData={offerData} />
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button onClick={handleBack} className="flex-1 glass-btn rounded-none-secondary font-bold py-3 px-6 rounded-none">Atrás</button>
                            <button onClick={handleContinueFromSummary} className="flex-1 glass-btn rounded-none font-bold py-3 px-6 rounded-none">Continuar</button>
                        </div>
                    </div>
                );
            case 'documentation_guide':
                const getRequiredDocs = () => {
                    const docs: React.ReactNode[] = [];
                    const amount = offerData?.amountToFinance || 0;
                    
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonth = now.getMonth(); // 0 to 11
                    
                    const monthNames = [
                        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ];
                    
                    const getPreviousMonth = (offset: number) => {
                        const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                        return `${monthNames[d.getMonth()]} de ${d.getFullYear()}`;
                    };

                    const prevMonth1 = getPreviousMonth(1);
                    const prevMonth2 = getPreviousMonth(2);

                    // Si estamos antes de Julio (meses 0 a 5), la renta a pedir es la del año anterior
                    const isBeforeJuly = currentMonth < 6; 
                    const rentaYear = isBeforeJuly ? currentYear - 1 : currentYear;

                    // 1. Identificación y Cuenta (Común a todos)
                    docs.push(<span><strong>DNI, NIE o Pasaporte</strong> en color y en vigor.</span>);
                    docs.push(<span><strong>Justificante de cuenta bancaria</strong> (verificar que sea del año {currentYear}).</span>);

                    // 2. Cliente
                    if (offerData?.clientType === 'Asalariados') {
                        docs.push(<span><strong>Nómina del mes anterior o 2 meses antes</strong> (Debe ser de {prevMonth1} o {prevMonth2}).</span>);
                        
                        if (amount >= 30000) {
                            docs.push(<span><strong>Renta Mod. 100 (IRPF)</strong>, la presentada en el año {rentaYear}.</span>);
                        }
                    } else if (offerData?.clientType === 'Pensionistas' || offerData?.clientType === 'Jubilados') {
                        docs.push(<span><strong>Revalorización de la pensión</strong> del año en curso ({currentYear}).</span>);

                        if (amount >= 30000) {
                            docs.push(<span><strong>Renta Mod. 100 (IRPF)</strong>, la presentada en el año {rentaYear}.</span>);
                        }
                    } else if (offerData?.clientType === 'Autónomos') {
                        docs.push(<span><strong>Modelo 036 o Vida Laboral</strong>.</span>);
                        docs.push(<span><strong>Declaración de la Renta (IRPF)</strong>, la presentada en el año {rentaYear}.</span>);
                        docs.push(<span><strong>Último modelo 130 o 131</strong> presentado.</span>);
                    } else if (offerData?.clientType === 'Sociedades') {
                        docs.push(<span><strong>CIF definitivo</strong> y <strong>Escrituras de constitución</strong>.</span>);
                        docs.push(<span><strong>DNI de los apoderados</strong>.</span>);
                        docs.push(<span><strong>Impuesto de Sociedades (Modelo 200)</strong>.</span>);
                        docs.push(<span><strong>Balance y Cuenta de Pérdidas y Ganancias (PyG)</strong>.</span>);
                        docs.push(<span><strong>IRPF del administrador</strong>, la presentada en el año {rentaYear}.</span>);
                    }

                    // 3. Vehículo
                    if (offerData?.vehicleCategory?.includes('Matriculado') || offerData?.vehicleCategory?.includes('Seminuevo') || offerData?.vehicleCategory?.includes('Ocasión')) {
                        docs.push(<span><strong>Ficha Técnica</strong> y <strong>Permiso de Circulación</strong>.</span>);
                    }

                    return docs;
                };

                const displayClientType = offerData?.clientType === 'Jubilados' ? 'Pensionistas' : offerData?.clientType;

                return (
                    <div className="animate-fade-in-up w-full max-w-2xl mx-auto">
                        <div className="bg-white p-10 rounded-none shadow-2xl border border-slate-200 text-center relative overflow-hidden">
                            <div className="flex justify-center mb-6">
                                <div className="bg-slate-50 p-4 rounded-none">
                                    <FileTextIcon className="w-12 h-12 text-black" />
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-2">
                                Documentación Digitalizada Necesaria
                            </h2>
                            <p className="text-sm text-slate-500 mb-8 font-medium">
                                Por favor, asegúrate de tener <span className="font-bold text-black underline">digitalizados</span> los siguientes documentos requeridos para la solicitud de {displayClientType || 'cliente'}.
                            </p>
                            
                            <div className="text-sm text-slate-700 space-y-3 mb-10 bg-slate-50 p-6 rounded-none border border-slate-100 text-left">
                                <ul className="space-y-4">
                                    {getRequiredDocs().map((doc, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-black flex-shrink-0"></div>
                                            <span className="leading-snug">{doc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button 
                                onClick={() => setStep('documents')} 
                                className="w-full bg-black text-white hover:bg-slate-800 font-bold py-4 px-8 rounded-none text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                Continuar a Subir Documentación <span className="text-lg">&rarr;</span>
                            </button>
                            
                            <div className="mt-6">
                                 <button onClick={handleBack} className="text-slate-400 hover:text-black font-bold uppercase tracking-widest text-[10px] transition-colors">
                                    Volver al resumen
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'documents':
                 return (
                    <div className="animate-fade-in-up">
                        <PackageDocumentation 
                            title="4. Subir Documentación"
                            onNavigate={(view) => { 
                                if (view === 'requestProcessing') handleDocsAnalyzed();
                                else onNavigate(view);
                            }} 
                            setFiles={setAnalysisFiles} 
                            setAnalysisResult={setAnalysisResult} 
                            savedOfferData={offerData}
                            userRole="normal"
                            onBack={handleBack}
                            onSkip={handleDocsAnalyzed}
                            onRestart={handleRestart}
                            onGlobalStepChange={setGlobalStep}
                        />
                    </div>
                 );
            case 'pdd':
                return (
                    <div className="animate-fade-in-up">
                        <RequestProcessing 
                            savedOfferData={offerData} 
                            analysisResult={analysisResult} 
                            files={analysisFiles} 
                            onNavigate={onNavigate} 
                            onRestart={handleRestart}
                            onBack={handleBack}
                            onGlobalStepChange={setGlobalStep}
                        />
                    </div>
                );
            default:
                return <div>Paso desconocido</div>;
        }
    };

    const progressSteps = [
        "1. DATOS ECONÓMICOS",
        "2. RESUMEN ECONÓMICO",
        "3. SUBIDA DOCUMENTACIÓN",
        "4. ANALIZANDO DOCUMENTACIÓN",
        "5. TRAMITAR SOLICITUD",
        "6. ESTUDIO SOLICITUD",
        "7. DICTAMEN SOLICITUD",
        "8. ENVIAR A PLATAFORMA",
        "9. DOC. PENDIENTE"
    ];

    return (
        <div className="w-full max-w-7xl mx-auto flex gap-6 lg:gap-12">
            <style>{`
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
            
            {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}

            {/* Sidebar de Progreso */}
            <div className="hidden lg:block w-64 flex-shrink-0 pt-8">
                <div className="sticky top-24">
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-200 pb-2">Progreso</h3>
                    <div className="space-y-0 relative">
                        {/* Línea vertical */}
                        <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-slate-100 z-0"></div>
                        
                        {progressSteps.map((stepName, i) => {
                            const stepNum = i + 1;
                            const isPast = stepNum < globalStep;
                            const isCurrent = stepNum === globalStep;
                            const isClickableStep = stepNum === 3;
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`relative z-10 flex items-center gap-4 py-4 ${i !== progressSteps.length - 1 ? 'border-none' : ''} ${isClickableStep ? 'cursor-pointer hover:bg-slate-50 transition-colors p-2 -ml-2 rounded-none group' : ''}`}
                                    onClick={() => {
                                        if (isClickableStep) {
                                            setStep('documents');
                                        }
                                    }}
                                >
                                    <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-[10px] font-bold rounded-sm transition-colors ${
                                        isCurrent ? 'bg-black text-white shadow-md' : 
                                        isPast ? 'bg-slate-200 text-slate-500 border border-slate-300' : 
                                        'bg-white text-slate-400 border border-slate-200'
                                    }`}>
                                        {stepNum}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest transition-colors ${
                                        isCurrent ? 'font-bold text-black' : 
                                        isPast ? 'font-medium text-slate-500' : 
                                        'font-medium text-slate-400'
                                    } ${isClickableStep && !isCurrent ? 'group-hover:text-black font-bold' : ''}`}>
                                        {stepName.substring(3)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex-1 mt-8 min-w-0">
                {renderCurrentStep()}
            </div>
        </div>
    );
};

export default NewRequestWorkflow;
