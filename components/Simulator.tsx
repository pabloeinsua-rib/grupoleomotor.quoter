
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { View, SavedOfferData } from '../App.tsx';
import { EditIcon, InfoIcon, FileTextIcon, SearchIcon, CheckIcon, EuroIcon, WarningIcon, XIcon, SpinnerIcon, ArrowUturnLeftIcon, PrintIcon, ShareIcon, DownloadIcon, ManualsIcon, CameraIcon, EmailIcon, PhoneIcon, EyeIcon } from './Icons.tsx';
import { licensePlateData } from '../data/licensePlates.ts';
import { getAvailableTerms, getApplicableTariff } from '../data/tariffs.ts';
import { getTarifaCoefficient, getLeasingTarifa, getAvailableRates, getTariffName } from './TarifaData.ts';
import OfferDetails, { type OfferDetailsData } from './OfferDetails.tsx';
import AmortizationTable from './AmortizationTable.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';
import html2canvas from 'html2canvas';
import { RESPONSABLES_EMAILS } from './Login.tsx';

// --- Types ---
interface SimulatorProps {
  onNavigate: (view: View) => void;
  onSaveOffer: (data: SavedOfferData) => void;
  onContinueToWorkflow: (data: SavedOfferData) => void;
  currentState: any | null;
  onStateChange: (newState: any) => void;
  onReset: () => void;
  onShowSystemMessage: (title: string, options?: NotificationOptions) => void;
  onShowToast: (title: string, description: string) => void;
  mode?: 'offer' | 'workflow';
  externalConfig?: any; 
  userEmail?: string | null;
}

// --- Helper: Load Image for PDF ---
const loadImage = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } else {
                resolve(null);
            }
        };
        // Resolve null on error to prevent breaking the entire PDF generation
        img.onerror = () => resolve(null);
    });
};

const GlassOptionButton: React.FC<{ 
    label: string, 
    selected: boolean, 
    onClick: () => void,
    icon?: React.ReactNode 
}> = ({ label, selected, onClick, icon }) => (
    <button
        type="button"
        onClick={onClick}
        className={`
            group relative w-full py-2 px-4 rounded-none transition-all duration-300 ease-out border
            flex flex-col items-center justify-center gap-1 overflow-hidden
            ${selected 
                ? 'bg-black text-white border-black shadow-lg scale-[1.02] z-10 font-bold' 
                : 'bg-white text-black border-slate-200 hover:border-black hover:shadow-md'
            }
        `}
    >
        {icon && <div className={`w-6 h-6 ${selected ? 'text-white' : 'text-black'}`}>{icon}</div>}
        <span className="text-[9px] sm:text-xs tracking-tight uppercase leading-tight text-center break-words max-w-full">{label}</span>
    </button>
);

const InsuranceSelectCard: React.FC<{
    title: string;
    subtitle: string;
    selected: boolean;
    onClick: () => void;
    onInfoClick: () => void;
}> = ({ title, subtitle, selected, onClick, onInfoClick }) => (
    <div 
        onClick={onClick}
        className={`
            cursor-pointer relative p-2 md:p-3 rounded-none border-2 transition-all duration-300
            flex flex-col justify-between h-20 md:h-28
            ${selected 
                ? 'bg-black border-black shadow-lg scale-[1.02]' 
                : 'bg-white border-slate-200 hover:border-black hover:shadow-md'
            }
        `}
    >
        <div className="flex justify-between items-start">
            <span className={`font-bold text-[8px] sm:text-xs ${selected ? 'text-white' : 'text-black'} leading-[1.1]`}>{title}</span>
            {selected && <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white text-black rounded-none flex items-center justify-center flex-shrink-0 ml-0.5"><CheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3"/></div>}
        </div>
        <div className={`text-[8px] sm:text-[10px] font-semibold mt-0.5 leading-tight ${selected ? 'text-slate-300' : 'text-slate-500'} line-clamp-2`}>{subtitle}</div>
        <div className="mt-auto text-right">
             <button 
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent selection when clicking info
                    onInfoClick();
                }}
                className={`text-[8px] font-bold px-1.5 py-0.5 rounded-none transition-colors z-10 relative ${selected ? 'bg-white text-black hover:bg-slate-200' : 'text-black bg-slate-100 hover:bg-slate-200'}`}
             >
                +info
             </button>
        </div>
    </div>
);

const DocumentActionModal = ({ title, onClose, onAction }: { title: string, onClose: () => void, onAction: (action: 'view'|'share'|'download'|'print'|'email') => void }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-none p-1"><XIcon className="w-6 h-6" /></button>
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
            
            <div className="space-y-3">
                <button onClick={() => onAction('view')} className="w-full bg-white text-black border-2 border-slate-200 hover:bg-caixa-blue hover:text-white hover:border-caixa-blue font-bold py-3 rounded-none flex items-center justify-center gap-3 transition-all">
                    <EyeIcon className="w-5 h-5" /> Ver Documento
                </button>
                <button onClick={() => onAction('share')} className="w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-none hover:bg-slate-200 flex items-center justify-center gap-3 transition-colors">
                    <ShareIcon className="w-5 h-5" /> Compartir
                </button>
                <button onClick={() => onAction('download')} className="w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-none hover:bg-slate-200 flex items-center justify-center gap-3 transition-colors">
                    <DownloadIcon className="w-5 h-5" /> Descargar PDF
                </button>
                <button onClick={() => onAction('print')} className="w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-none hover:bg-slate-200 flex items-center justify-center gap-3 transition-colors">
                    <PrintIcon className="w-5 h-5" /> Imprimir
                </button>
                <button onClick={() => onAction('email')} className="w-full bg-slate-100 text-slate-800 font-bold py-3 rounded-none hover:bg-black hover:text-white flex items-center justify-center gap-3 transition-colors">
                    <EmailIcon className="w-5 h-5" /> Enviar por Email
                </button>
            </div>
        </div>
    </div>
);

const OpeningFeeModal = ({ currentFee, onSave, onClose }: { currentFee: number, onSave: (val: number) => void, onClose: () => void }) => {
    const [val, setVal] = useState(currentFee);
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-fade-in-up">
                <h3 className="text-lg font-bold mb-4 text-center">Gastos de Apertura</h3>
                <div className="flex items-center gap-2 mb-6">
                    <input 
                        type="number" 
                        value={val} 
                        onChange={e => setVal(parseFloat(e.target.value))} 
                        step="0.01"
                        className="w-full text-center text-2xl font-bold border-b-2 border-caixa-blue focus:outline-none py-2"
                    />
                    <span className="text-2xl font-bold text-slate-500">%</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 rounded-none">Cancelar</button>
                    <button onClick={() => { onSave(val); onClose(); }} className="flex-1 bg-caixa-blue text-white font-bold py-2 rounded-none">Guardar</button>
                </div>
            </div>
        </div>
    );
};

const NoInsuranceWarningModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white shadow-2xl w-full max-w-md p-8 text-center animate-fade-in-up rounded-none border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-800 rounded-none flex items-center justify-center mb-6 border border-slate-200">
                <WarningIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">Desprotección del cliente</h2>
            <div className="text-slate-600 space-y-4 text-sm leading-relaxed mb-8">
                <p className="font-bold border border-slate-300 bg-slate-50 p-3 rounded-none">La comisión a terceros es inferior.</p>
                <div className="text-left space-y-2">
                    <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>Las solicitudes sin seguro son solo para Titular pensionista por incapacidad.</span></p>
                    <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>Si quieres que la solicitud lleve seguro, añade un cotitular sin Incapacidad para asignarle seguro/s.</span></p>
                </div>
            </div>
            <div className="mt-8 flex gap-4">
                <button onClick={onCancel} className="flex-1 bg-black text-white font-bold py-3 px-6 rounded-none hover:bg-slate-800 transition-colors uppercase tracking-wider text-xs">Cancelar</button>
                <button onClick={onConfirm} className="flex-1 bg-slate-200 text-black font-bold py-3 px-6 rounded-none hover:bg-slate-300 transition-colors uppercase tracking-wider text-xs">Continuar</button>
            </div>
        </div>
    </div>
);

const InsuranceInfoModal = ({ title, content, onClose }: { title: string, content: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
        <div className="bg-white rounded-none shadow-2xl w-full max-w-lg p-6 relative border border-slate-200">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors rounded-none bg-slate-50 p-1 hover:bg-slate-200">
                <XIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6 text-black border-b border-slate-200 pb-4">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-none"><InfoIcon className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold uppercase tracking-widest">{title}</h3>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto pr-2 mb-6">
                {content}
            </div>
            <button onClick={onClose} className="w-full text-center font-bold text-[10px] bg-black text-white hover:bg-slate-800 py-3 px-6 rounded-none transition-colors uppercase tracking-widest">
                Entendido
            </button>
        </div>
    </div>
);

const PlateCameraModal = ({ onClose, onCapture }: { onClose: () => void, onCapture: (text: string) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(s => {
                stream = s;
                if (videoRef.current) videoRef.current.srcObject = s;
            })
            .catch(err => console.error("Camera error", err));

        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, []);

    const handleCapture = () => {
        setIsScanning(true);
        setTimeout(() => {
            onCapture("1234 LBB"); 
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-white/50 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-caixa-blue"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-caixa-blue"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-caixa-blue"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-caixa-blue"></div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
                <button onClick={onClose} className="text-white font-bold bg-white/20 p-4 rounded-none backdrop-blur-md">
                    <XIcon className="w-6 h-6"/>
                </button>
                <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-none border-4 border-slate-300 flex items-center justify-center relative">
                    {isScanning && <SpinnerIcon className="w-10 h-10 text-caixa-blue animate-spin absolute" />}
                    {!isScanning && <div className="w-16 h-16 bg-caixa-blue rounded-full opacity-20 animate-pulse"></div>}
                </button>
            </div>
            {isScanning && <div className="absolute top-20 bg-black/60 text-white px-4 py-2 rounded-full">Analizando matrícula...</div>}
        </div>
    );
};

const GeneratingPdfModal = () => (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fade-in-up transform scale-100">
            <SpinnerIcon className="w-16 h-16 text-caixa-blue animate-spin mb-6" />
            <h3 className="text-xl font-bold text-gray-800 tracking-wide">GENERANDO OFERTA</h3>
            <p className="text-gray-500 text-sm mt-2">Por favor, espera un momento...</p>
        </div>
    </div>
);

const insuranceContent = {
    vidaDesempleo: (
        <div className="space-y-3 text-sm text-gray-700">
            <h4 className="font-bold text-black text-base uppercase tracking-wider">Coberturas Pack Vida + Desempleo / IT</h4>
            <div className="space-y-3 mt-3">
                <p><strong>Fallecimiento por cualquier causa:</strong> Cancela el capital pendiente de amortizar del préstamo en el momento del siniestro, liberando a los herederos de la deuda.</p>
                <p><strong>Invalidez Absoluta y Permanente:</strong> Cancela el capital pendiente de amortizar del préstamo, liberando al titular de la deuda.</p>
                <p><strong>Desempleo:</strong> (SOLO PARA ASALARIADOS CON CONTRATO INDEFINIDO: SE ABONAN MÁXIMO 6 CUOTAS CONSECUTIVAS HASTA UN IMPORTE DE 400 €. EL PRIMER MES SERÍA DE FRANQUICIA Y NO SE ABONA. TITULAR TIENE QUE SEGUIR ABONANDO LOS RECIBOS, QUE SE LE REINTEGRARÁN TODOS JUNTOS. PUEDE DAR HASTA 3 PARTES DURANTE LA VIDA DEL PRESTAMO.</p>
                <p><strong>Incapacidad Temporal (I.T.):</strong> PARA AUTONOMOS O FUNCIONARIOS O ASALARIADOS CON CONTRATO TEMPORAL, SE ABONAN MÁXIMO 6 CUOTAS CONSECUTIVAS HASTA UN IMPORTE DE 400 €. EL PRIMER MES SERÍA DE FRANQUICIA Y NO SE ABONA. TITULAR TIENE QUE SEGUIR ABONANDO LOS RECIBOS, QUE SE LE REINTEGRARÁN TODOS JUNTOS. PUEDE DAR HASTA 3 PARTES DURANTE LA VIDA DEL PRESTAMO.</p>
            </div>
            <p className="text-xs mt-4 text-slate-500 font-semibold border-t pt-3">* La cuota mensual calculada ya incluye el coste de este seguro y los gastos de apertura (3,99%).</p>
        </div>
    ),
    vida: (
        <div className="space-y-3 text-sm text-gray-700">
            <h4 className="font-bold text-black text-base uppercase tracking-wider">Coberturas Pack Vida</h4>
            <div className="space-y-2 mt-3">
                <p><strong>Fallecimiento por cualquier causa:</strong> Cancela el capital pendiente de amortizar del préstamo en el momento del siniestro, liberando a los herederos de la deuda.</p>
                <p><strong>Invalidez Absoluta y Permanente:</strong> Cancela el capital pendiente de amortizar del préstamo, liberando al titular de la deuda.</p>
            </div>
            <p className="text-xs mt-4 text-slate-500 font-semibold border-t pt-3">* La cuota mensual calculada ya incluye el coste de este seguro y los gastos de apertura (3,99%).</p>
        </div>
    ),
    senior: (
        <div className="space-y-3 text-sm text-gray-700">
            <h4 className="font-bold text-black text-base uppercase tracking-wider">Coberturas Pack Vida Senior</h4>
            <p className="italic mb-2">Diseñado específicamente para clientes de 60 años en adelante.</p>
            <div className="space-y-2 mt-3">
                <p><strong>Fallecimiento por cualquier causa:</strong> Cancela el capital pendiente de amortizar del préstamo, asegurando la tranquilidad de sus familiares.</p>
            </div>
            <p className="text-xs mt-4 text-slate-500 font-semibold border-t pt-3">* La cuota mensual calculada ya incluye el coste de este seguro y los gastos de apertura (3,99%).</p>
        </div>
    ),
    sinProteccion: (
        <div className="space-y-3 text-sm">
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-lg">
                <p className="font-bold text-slate-800">SIN PROTECCIÓN DE PAGOS</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                    <li>No se incluye ningún seguro de protección de pagos.</li>
                    <li>El cliente asume el riesgo total en caso de fallecimiento, invalidez, desempleo o incapacidad temporal.</li>
                    <li>La deuda pasará a los herederos en caso de fallecimiento.</li>
                </ul>
            </div>
            <p className="text-xs mt-4 text-slate-500 font-semibold">* La cuota mensual calculada ya incluye los gastos de apertura (3,99%).</p>
        </div>
    )
};

const PensionerAgeModal = ({ onClose }: { onClose: () => void }) => {
    const [birthMonth, setBirthMonth] = useState<number>(new Date().getMonth() + 1);
    const [birthYear, setBirthYear] = useState<number>(new Date().getFullYear() - 65);
    const [maxTerm, setMaxTerm] = useState<number | null>(null);

    const calculateMaxTerm = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        // The person turns 77 in birthYear + 77, birthMonth
        const targetYear = birthYear + 77;
        const targetMonth = birthMonth;

        // Calculate total months from now to the target date
        const monthsToTarget = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);

        // Contract must end 1 month before turning 77
        const calculatedMaxTerm = monthsToTarget - 1;

        setMaxTerm(calculatedMaxTerm > 0 ? calculatedMaxTerm : 0);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-none w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up border border-slate-200">
                <div className="bg-white text-black p-6 flex justify-between items-center border-b border-slate-200">
                    <h3 className="font-bold text-lg tracking-tight uppercase">Calculadora Plazo Máximo</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        El titular no debe pasar de 77 años cuando termine el contrato. El contrato debe finalizar un mes antes de que cumpla los 77 años.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Mes</label>
                            <select 
                                value={birthMonth} 
                                onChange={(e) => setBirthMonth(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-none p-3 text-black font-medium focus:border-black focus:ring-0 outline-none transition-colors"
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Año</label>
                            <input 
                                type="number" 
                                value={birthYear} 
                                onChange={(e) => setBirthYear(Number(e.target.value))}
                                className="w-full border border-slate-300 rounded-none p-3 text-black font-medium focus:border-black focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={calculateMaxTerm}
                        className="w-full bg-black text-white font-bold py-4 rounded-none hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
                    >
                        Calcular Plazo Máximo
                    </button>

                    {maxTerm !== null && (
                        <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-none text-center">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Plazo máximo permitido</p>
                            <p className="text-4xl font-light text-black">{maxTerm} <span className="text-lg text-slate-400">meses</span></p>
                            {maxTerm < 36 && (
                                <p className="text-xs text-red-600 font-bold mt-4 uppercase tracking-wider">
                                    El plazo no es suficiente (mínimo 36 meses). Se debe añadir un cotitular más joven.
                                </p>
                            )}
                            {maxTerm >= 36 && maxTerm < 48 && (
                                <p className="text-xs text-orange-500 font-bold mt-4 uppercase tracking-wider">
                                    Si el plazo no es suficiente para la cuota deseada, se debe añadir un cotitular más joven.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Simulator: React.FC<SimulatorProps> = ({ onNavigate, onSaveOffer, onContinueToWorkflow, currentState, onStateChange, onReset, onShowSystemMessage, onShowToast, mode = 'offer', externalConfig, userEmail }) => {
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 

    // --- State ---
    const [step, setStep] = useState(0); 
    const [productType, setProductType] = useState<string | null>(currentState?.productType || null);
    const [clientType, setClientType] = useState<string | null>(currentState?.clientType || null);
    const [retirementType, setRetirementType] = useState<string | null>(currentState?.retirementType || null);
    const [vehicleType, setVehicleType] = useState<string | null>(currentState?.vehicleType || null);
    const [vehicleUse, setVehicleUse] = useState<string | null>(currentState?.vehicleUse || 'Turismo'); 
    
    const [registrationTaxRate, setRegistrationTaxRate] = useState<number>(currentState?.registrationTaxRate || 0);
    const [financeRegistrationTax, setFinanceRegistrationTax] = useState<boolean>(currentState?.financeRegistrationTax ?? true);

    const [licensePlate, setLicensePlate] = useState<string>(currentState?.licensePlate || '');
    const [registrationYear, setRegistrationYear] = useState<number>(currentState?.registrationYear || currentYear);
    const [registrationMonth, setRegistrationMonth] = useState<number>(currentState?.registrationMonth || currentMonth);
    const [foundPlateDate, setFoundPlateDate] = useState<string | null>(null);
    
    const [salePrice, setSalePrice] = useState<number>(currentState?.salePrice || 30000);
    const [downPayment, setDownPayment] = useState<number>(currentState?.downPayment || 0);
    const [term, setTerm] = useState<number>(currentState?.term || 84);
    const [interestRate, setInterestRate] = useState<number>(currentState?.interestRate || 9.99);
    const [insuranceType, setInsuranceType] = useState<string>(currentState?.insuranceType || 'Vida + Desempleo / IT');
    const [openingFeePercentage, setOpeningFeePercentage] = useState(3.99);
    
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
    const [monthlyPaymentNet, setMonthlyPaymentNet] = useState<number | null>(null);
    const [residualValue, setResidualValue] = useState<number | null>(null); 
    const [tae, setTae] = useState<number | null>(null);
    const [premiumPoints, setPremiumPoints] = useState<number>(0);
    const [potentialPremiumPoints, setPotentialPremiumPoints] = useState<number>(0);
    const [commissionValue, setCommissionValue] = useState<number | null>(null);
    const [offerDetails, setOfferDetails] = useState<OfferDetailsData | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [showInsuranceModal, setShowInsuranceModal] = useState<{title: string, content: React.ReactNode} | null>(null);
    const [showNoInsuranceWarningModal, setShowNoInsuranceWarningModal] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [showPensionerModal, setShowPensionerModal] = useState(false);
    const [isAmortizationModalOpen, setIsAmortizationModalOpen] = useState(false);
    
    // Assign to window for child components to access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).closeAmortizationModal = () => setIsAmortizationModalOpen(false);
        }
        return () => {
             if (typeof window !== 'undefined') {
                delete (window as any).closeAmortizationModal;
            }
        };
    }, []);
    
    const [actionModalType, setActionModalType] = useState<'offer' | 'ine' | null>(null);
    const [showPdfViewer, setShowPdfViewer] = useState<{ type: 'offer' | 'ine', title: string, src?: string | null } | null>(null);

    const step1Ref = useRef<HTMLDivElement>(null);
    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);
    const stepUsedRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const inePrintRef = useRef<HTMLDivElement>(null);
    const offerDetailsRef = useRef<HTMLDivElement>(null); 

    // Constants
    const minAllowedYear = currentYear - 15; 

    // Calculate dynamic minimum year based on product and vehicle use
    const dynamicMinYear = useMemo(() => {
        let maxAgeMonths = 180; // default 15 years

        if (productType === 'Leasing') {
            const isIndustrial = vehicleUse === 'Industrial';
            maxAgeMonths = isIndustrial ? 36 : 48;
        } else if (productType === 'Financiación Lineal') {
            if (clientType === 'Sociedades') {
                const isIndustrial = vehicleUse === 'Industrial';
                maxAgeMonths = isIndustrial ? 36 : 48;
            } else {
                maxAgeMonths = 96;
            }
        }

        const maxAgeYears = Math.floor(maxAgeMonths / 12);
        return currentYear - maxAgeYears;
    }, [productType, clientType, vehicleUse, currentYear]);

    // Ensure registrationYear is within bounds
    useEffect(() => {
        if (registrationYear < dynamicMinYear) {
            setRegistrationYear(dynamicMinYear);
        }
    }, [dynamicMinYear, registrationYear]);

    // Calculate max term based on vehicle age (Golden Rule)
    const vehicleAgeInfo = useMemo(() => {
        // Case: NUEVO
        if (vehicleType !== 'Matriculado') {
            if (productType === 'Leasing') {
                if (clientType === 'Autónomos') return { maxTerm: 72, ageText: 'Nuevo', isFinanciable: true, message: '' };
                if (clientType === 'Sociedades') return { maxTerm: 84, ageText: 'Nuevo', isFinanciable: true, message: '' };
                return { maxTerm: 0, ageText: 'Nuevo', isFinanciable: false, message: `Leasing no disponible para ${clientType}` };
            }
            if (productType === 'Financiación Lineal') {
                 if (clientType === 'Sociedades') return { maxTerm: 84, ageText: 'Nuevo', isFinanciable: true, message: '' };
                 if (clientType === 'Autónomos') return { maxTerm: 120, ageText: 'Nuevo', isFinanciable: true, message: '' };
            }
            // Default for Particulares or Cuota Solución
            return { maxTerm: 120, ageText: 'Nuevo', isFinanciable: true, message: '' };
        }

        // Case: MATRICULADO
        const ageMonths = (currentYear - registrationYear) * 12 + (currentMonth - registrationMonth);
        const ageYears = Math.floor(ageMonths / 12);
        const remainingMonths = ageMonths % 12;
        const ageText = `${ageYears} años y ${remainingMonths} meses`;

        let maxTerm = 120; // Default fallback
        let isFinanciable = true;
        let message = '';

        // 1. LEASING (Matriculado)
        if (productType === 'Leasing') {
            if (clientType === 'Asalariados' || clientType === 'Jubilados') {
                return { maxTerm: 0, ageText, isFinanciable: false, message: `Leasing no disponible para ${clientType}` };
            }
            
            const isIndustrial = vehicleUse === 'Industrial';
            
            if (isIndustrial) {
                // INDUSTRIAL
                if (ageMonths > 36) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE ( > 36 Meses para Leasing Industrial)";
                    maxTerm = 0;
                } else {
                    if (ageMonths > 24) {
                        maxTerm = 48;
                    } else {
                        // Age <= 24
                        maxTerm = clientType === 'Sociedades' ? 72 : 60;
                    }
                }
            } else {
                // TURISMO
                if (ageMonths > 48) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE ( > 48 Meses para Leasing Turismo)";
                    maxTerm = 0;
                } else {
                    if (ageMonths > 36) {
                        maxTerm = 60;
                    } else {
                        // Age <= 36
                        maxTerm = clientType === 'Sociedades' ? 84 : 72;
                    }
                }
            }
        } 
        // 2. FINANCIACIÓN LINEAL (Matriculado)
        else if (productType === 'Financiación Lineal') {
             if (clientType === 'Sociedades') {
                const isIndustrial = vehicleUse === 'Industrial';
                const maxAge = isIndustrial ? 36 : 48;
                const maxTotalLife = isIndustrial ? 72 : 96;

                if (ageMonths > maxAge) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE (EXCEDE LA ANTIGUEDAD MÁXIMA NORMATIVA)";
                    maxTerm = 0;
                } else {
                    maxTerm = maxTotalLife - ageMonths;
                }
             } else {
                 // Asalariados / Autónomos
                 if (ageMonths > 96) {
                    isFinanciable = false;
                    message = "VEHÍCULO NO FINANCIABLE (EXCEDE LA ANTIGUEDAD MÁXIMA NORMATIVA)";
                    maxTerm = 0;
                } else if (ageMonths >= 85) maxTerm = 60;
                else if (ageMonths >= 73) maxTerm = 72;
                else if (ageMonths >= 61) maxTerm = 84;
                else if (ageMonths >= 49) maxTerm = 96;
                else if (ageMonths >= 37) maxTerm = 108;
                else maxTerm = 120;
             }
        }

        return { maxTerm, ageText, isFinanciable, message };
    }, [vehicleType, registrationYear, registrationMonth, currentYear, currentMonth, productType, clientType, vehicleUse]);

    const isNoInsuranceScenario = useMemo(() => {
        return productType === 'Leasing' || clientType === 'Sociedades';
    }, [productType, clientType]);

    // Update term if it exceeds new max
    useEffect(() => {
        if (vehicleAgeInfo.isFinanciable && term > vehicleAgeInfo.maxTerm) {
            setTerm(vehicleAgeInfo.maxTerm);
        }
    }, [vehicleAgeInfo.maxTerm, term, vehicleAgeInfo.isFinanciable]);

    // Force default insurance for Particular/Autonomo/Jubilados
    useEffect(() => {
        if (productType === 'Leasing' || clientType === 'Sociedades') {
            setInsuranceType('Sin Protección');
        } else if (clientType === 'Jubilados') {
            if (retirementType === 'Por Incapacidad') {
                setInsuranceType('Sin Protección');
            } else if (retirementType === 'Jubilación Normal') {
                setInsuranceType('Vida Senior');
            }
        } else if (clientType === 'Asalariados' || clientType === 'Autónomos') {
            setInsuranceType('Vida + Desempleo / IT');
        }
    }, [clientType, productType, retirementType]);


    const currentPrincipal = useMemo(() => {
        if (productType === 'Leasing') {
            const baseImponible = salePrice;
            const entradaNet = downPayment / 1.21;
            let principal = baseImponible - entradaNet;
            if (vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && registrationTaxRate > 0) {
                const regTaxAmount = baseImponible * (registrationTaxRate / 100);
                principal += regTaxAmount;
            }
            return Math.max(0, principal);
        } else {
            return Math.max(0, salePrice - downPayment);
        }
    }, [productType, salePrice, downPayment, vehicleType, vehicleUse, registrationTaxRate]);

    const finalValuePercentage = useMemo(() => {
        if (productType !== 'Resicuota') return 0;
        switch (term) {
            case 24: return 55;
            case 36: return 50;
            case 48: return 45;
            case 60: return 38;
            default: return 0;
        }
    }, [productType, term]);

    const availableTerms = useMemo(() => {
        return getAvailableTerms().filter(t => t <= vehicleAgeInfo.maxTerm);
    }, [vehicleAgeInfo.maxTerm]);

    useEffect(() => {
        if (availableTerms.length > 0 && !availableTerms.includes(term)) {
            const closest = availableTerms.reduce((prev, curr) => Math.abs(curr - term) < Math.abs(prev - term) ? curr : prev);
            setTerm(closest);
        }
    }, [availableTerms, term]);

    const hasInsurance = insuranceType !== 'Sin Protección';
    const currentTariff = useMemo(() => getApplicableTariff(term, insuranceType), [term, insuranceType]);
    
    // Authorization array checks for commission visibility
    const authorizedCommissionEmails = RESPONSABLES_EMAILS;
    
    const canSeeCommission = userEmail ? (authorizedCommissionEmails.includes(userEmail.toLowerCase()) || userEmail.toLowerCase().endsWith('@caixabankpc.com')) : false;

    const availableRates = useMemo(() => {
        if (productType === 'Leasing') {
            return [5.99, 6.99, 7.99];
        }
        const rates = getAvailableRates(insuranceType);
        return rates.map(r => parseFloat(r));
    }, [insuranceType, productType]);

    useEffect(() => {
        if (availableRates.length > 0) {
            const defaultRate = currentTariff.type === 'SALON' ? 9.95 : 9.99;
            if (!availableRates.includes(interestRate)) {
                if (availableRates.includes(defaultRate)) {
                    setInterestRate(defaultRate);
                } else {
                    setInterestRate(availableRates[0]);
                }
            }
        }
    }, [availableRates, interestRate, currentTariff.type]);

    // Handlers
    const handleProductSelect = (prod: string) => {
        setProductType(prod);
        if (prod === 'Resicuota') {
            setInterestRate(7.49);
            setTerm(48);
            setDownPayment(salePrice * 0.10);
            setOpeningFeePercentage(3.99);
        } else if (prod === 'Leasing') {
            setInterestRate(5.99); 
            setTerm(60);
            setOpeningFeePercentage(2.00); 
            if (clientType === 'Asalariados') setClientType(null); 
            setInsuranceType('Sin Protección'); 
        } else {
            setInterestRate(9.99);
            setTerm(84);
            setOpeningFeePercentage(3.99);
        }
        setStep(Math.max(step, 1));
        setTimeout(() => step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const handleClientSelect = (client: string) => {
        setClientType(client);
        if (client !== 'Jubilados') {
            setRetirementType(null);
            setStep(Math.max(step, 2));
            setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } else {
            setRetirementType(null);
        }
    };

    const handleRetirementSelect = (type: string) => {
        setRetirementType(type);
        setStep(Math.max(step, 2));
        setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const handleVehicleSelect = (veh: string) => {
        setVehicleType(veh);
        
        // --- LEASING LOGIC UPDATE ---
        if (productType === 'Leasing' || (productType === 'Financiación Lineal' && clientType === 'Sociedades')) {
            // Force reset of vehicle use to ensure the user explicitly selects it again
            setVehicleUse(null); 
            // Do NOT advance step. Stay in Step 2 to show "Uso del Vehículo".
        } else {
            // Standard Flow
            if (veh === 'Nuevo') {
                setStep(Math.max(step, 3));
                setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            } else {
                // Matriculado: Stay in Step 2 area but reveal Matriculado options (handled by rendering)
                setStep(Math.max(step, 2));
            }
        }
    };

    const handleVehicleUseSelect = (use: string) => {
        setVehicleUse(use);
        // Advance to Financials Step after selecting Use
        setStep(Math.max(step, 3));
        setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    const handleSearchByPlate = () => {
        setFoundPlateDate(null);
        const letters = licensePlate.replace(/[^A-Z]/g, '').toUpperCase();
        if (letters.length !== 3) return;
        const found = licensePlateData.find(entry => entry.series >= letters);
        if (found) {
            const [year, month] = found.date.split('-').map(Number);
            setRegistrationYear(year);
            setRegistrationMonth(month);
            setFoundPlateDate(new Date(found.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
        }
    };
    
    const handleCameraCapture = (text: string) => {
        setLicensePlate(text);
        handleSearchByPlate();
    };

    // Calculation Effect
    useEffect(() => {
        let adjustedDownPayment = downPayment;
        
        // Validation: Down payment max 80% (or 30% for Leasing)
        const maxDown = productType === 'Leasing' ? salePrice * 0.3 : salePrice * 0.8;
        if (adjustedDownPayment > maxDown) adjustedDownPayment = maxDown;

        if (step < 3) return;
        
        setIsCalculating(true);
        const timer = setTimeout(() => {
            const monthlyRate = interestRate / 100 / 12;
            let principal = 0;
            let feeValue = 0;
            let financedAmount = 0;
            let netPmt = 0;
            let residVal = 0;
            let pmt = 0;
            let insuranceCost = 0;
            let taeCalc = 0;
            let commValue = 0;

            if (productType === 'Leasing') {
                const baseImponible = salePrice;
                // Entrada for leasing is usually IVA included in user input logic, so we need net for calc
                const entradaNet = adjustedDownPayment / 1.21;
                
                principal = baseImponible - entradaNet;
                
                // Add Registration Tax if applicable (Calculated on Base Imponible)
                if (vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && registrationTaxRate > 0) {
                    const regTaxAmount = baseImponible * (registrationTaxRate / 100);
                    principal += regTaxAmount;
                }

                feeValue = principal * (openingFeePercentage / 100); 
                financedAmount = principal + feeValue; 
                
                const leasingTarifa = getLeasingTarifa(interestRate, term);
                if (leasingTarifa) {
                    netPmt = principal * leasingTarifa.cuotaSinProteccion;
                    commValue = principal * (leasingTarifa.ref / 100);
                } else {
                    // Fallback Formula for Leasing (Prepayable Annuity / Payment in Advance)
                    if (monthlyRate > 0 && term > 0) {
                        const n = term + 1;
                        const numerator = financedAmount * monthlyRate;
                        const denominator = (1 - Math.pow(1 + monthlyRate, -n)) * (1 + monthlyRate);
                        netPmt = numerator / denominator;
                    }
                }
                
                // Residual value is equal to 1 quota in this leasing model
                residVal = netPmt; 
                
                // Gross Monthly Payment
                const grossPmt = netPmt * 1.21;
                
                setMonthlyPaymentNet(netPmt);
                setResidualValue(residVal); 
                pmt = grossPmt; 

                // Calculate TAE for Leasing
                let minRate = 0;
                let maxRate = 1;
                let r = 0.01;
                for (let i = 0; i < 50; i++) {
                    r = (minRate + maxRate) / 2;
                    // Prepayable annuity present value
                    let pv = grossPmt * (1 - Math.pow(1 + r, -term)) / r * (1 + r);
                    if (Math.abs(pv - principal) < 0.001) break;
                    if (pv > principal) minRate = r;
                    else maxRate = r;
                }
                taeCalc = (Math.pow(1 + r, 12) - 1) * 100;

            } else {
                // Linear
                principal = salePrice - adjustedDownPayment;
                if (principal < 0) principal = 0;
                
                feeValue = principal * (openingFeePercentage / 100);
                financedAmount = principal + feeValue;

                const calcInsuranceType = insuranceType;
                let cuotaSinProteccion = 0;

                if (monthlyRate > 0 && term > 0) {
                    const factor = monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
                    cuotaSinProteccion = financedAmount * factor;
                    
                    const tarifaData = getTarifaCoefficient(interestRate, term, calcInsuranceType);
                    
                    if (tarifaData) {
                        pmt = principal * tarifaData.coefficient;
                        commValue = principal * (tarifaData.ref / 100);
                    } else {
                        // Fallback
                        if (calcInsuranceType !== 'Sin Protección') {
                            let insuranceRate = 1.20 / 1000;
                            if (calcInsuranceType.includes('Desempleo')) insuranceRate += 0.29 / 1000;
                            if (calcInsuranceType === 'Vida Senior') insuranceRate += 0.20 / 1000;
                            pmt = cuotaSinProteccion + (principal * insuranceRate);
                        } else {
                            pmt = cuotaSinProteccion;
                        }
                    }
                }
                setMonthlyPaymentNet(null);
                setResidualValue(null);
                
                // Calculate TAE based on cuotaSinProteccion
                let minRate = 0;
                let maxRate = 1;
                let r = 0.01;
                for (let i = 0; i < 50; i++) {
                    r = (minRate + maxRate) / 2;
                    let pv = cuotaSinProteccion * (1 - Math.pow(1 + r, -term)) / r;
                    if (Math.abs(pv - principal) < 0.001) break;
                    if (pv > principal) minRate = r;
                    else maxRate = r;
                }
                taeCalc = (Math.pow(1 + r, 12) - 1) * 100;
            }

            // Calculate Premium Points
            let points = 0;
            let potentialPoints = 0;
            
            const isEmpresa = clientType === 'Sociedades';
            const hasProteccionBasica = insuranceType === 'Vida' || insuranceType === 'Vida + Desempleo / IT' || insuranceType === 'Vida Senior';
            const hasProteccionDesempleo = insuranceType === 'Vida + Desempleo / IT';
            const antiguedad = vehicleType === 'Nuevo' ? 0 : ((currentYear - registrationYear) * 12 + (currentMonth - registrationMonth));

            // Logic to calculate base points before checking insurance
            const calculatePoints = (basica: boolean, desempleo: boolean) => {
                let p = 0;
                if (principal >= 6000 && interestRate >= 5.45 && term > 35 && (isNoInsuranceScenario || basica)) {
                    p += 30;
                    if (principal >= 10000) p += 40;
                    if (principal >= 15000) p += 60;
                    if (principal >= 24000) p += 30;
                    
                    // Empresa/Leasing get the "Protección" points by default since they can't hire it
                    if (isNoInsuranceScenario || desempleo) p += 40;
                    
                    if (antiguedad + term <= 144) p += 10;
                    if (antiguedad + term <= 120) p += 20;
                }
                return p;
            };

            points = calculatePoints(hasProteccionBasica, hasProteccionDesempleo);
            // If they don't have insurance, calculate what they COULD get with max insurance
            potentialPoints = calculatePoints(true, true);

            setPremiumPoints(points);
            setPotentialPremiumPoints(potentialPoints);

            setMonthlyPayment(pmt);
            setTae(taeCalc); 
            setCommissionValue(commValue); 

            setOfferDetails({
                pvp: salePrice,
                entrada: adjustedDownPayment,
                importeAFinanciar: principal,
                plazo: term,
                gastosApertura: feeValue,
                importeTotalCredito: financedAmount,
                totalIntereses: (pmt * term) - financedAmount, 
                importeTotalAdeudado: pmt * term,
                costeTotalCredito: (pmt * term) - principal,
                precioTotalAPlazos: (pmt * term) + adjustedDownPayment,
                residualValue: residVal,
                interestRate: interestRate,
                tae: taeCalc,
                commissionValue: commValue
            });

            setIsCalculating(false);
            if (onStateChange) {
                onStateChange({
                    productType, clientType, vehicleType, salePrice, downPayment: adjustedDownPayment, term, interestRate, insuranceType, monthlyPayment: pmt
                });
            }

        }, 500);
        return () => clearTimeout(timer);
    }, [salePrice, downPayment, term, interestRate, productType, clientType, vehicleType, insuranceType, step, openingFeePercentage, registrationTaxRate, financeRegistrationTax, vehicleUse, currentTariff]);

    const generateOfferPdf = async (action: 'view' | 'print' | 'share' | 'download' | 'email' = 'view') => {
        setIsGeneratingPdf(true);
        try {
            const element = offerDetailsRef.current;
            if (!element) throw new Error('Offer details ref not found');

            const canvas = await html2canvas(element, { 
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Adjust page height handling if the content spans multiple pages
            const pageHeight = pdf.internal.pageSize.getHeight();
            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
              position = heightLeft - pdfHeight; // top is negative
              pdf.addPage();
              pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
              heightLeft -= pageHeight;
            }

            const filename = `oferta_${new Date().getTime()}.pdf`;

            if (action === 'download') {
                pdf.save(filename);
            } else if (action === 'print') {
                pdf.autoPrint();
                window.open(pdf.output('bloburl'), '_blank');
            } else if (action === 'share') {
                const blob = pdf.output('blob');
                const file = new File([blob], filename, { type: 'application/pdf' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Oferta Financiera',
                        text: 'Aquí tienes la oferta financiera.'
                    });
                }
            } else if (action === 'email') {
                const blob = pdf.output('blob');
                if (blob.size > 4400000) {
                    onShowToast("Error", "PDF demasiado grande para enviar por email");
                    return;
                }
                const file = new File([blob], filename, { type: 'application/pdf' });
                const formData = new FormData();
                formData.append('files', file);
                formData.append('to', userEmail || 'documentacion@quoter.es');
                formData.append('subject', 'Oferta Financiera - Quoter Automotive');
                formData.append('body', 'Adjuntamos la oferta financiera generada según lo solicitado.\n\nAtentamente,\nEquipo comercial (Generado automáticamente)');
                
                const res = await fetch('/api/email/send-documentation', {
                    method: 'POST',
                    body: formData
                });
                
                if (res.ok) {
                    onShowToast("Éxito", "Oferta enviada por email");
                } else {
                    const text = await res.text();
                    throw new Error(`Fallo del servidor de correo: ${text || res.status}`);
                }
            } else {
                const blobUrl = pdf.output('bloburl');
                setShowPdfViewer({ type: 'offer', title: 'Oferta Financiera', src: blobUrl });
            }
        } catch (error) {
            console.error("Error generating PDF", error);
            onShowToast("Error", "No se pudo generar el PDF");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const formatMoney = (num: number) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' €';

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 pb-20">
            {/* Step 0: Product */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-4 uppercase tracking-widest">1. Selecciona Producto</h3>
                <div className="grid grid-cols-2 gap-3">
                    <GlassOptionButton label="Financiación Lineal" selected={productType === 'Financiación Lineal'} onClick={() => handleProductSelect('Financiación Lineal')} />
                    <GlassOptionButton label="Leasing" selected={productType === 'Leasing'} onClick={() => handleProductSelect('Leasing')} />
                </div>
            </div>

            {/* Step 1: Client */}
            {step >= 1 && (
                <div ref={step1Ref} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-4 uppercase tracking-widest">2. Tipo de Cliente</h3>
                    <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                        {productType !== 'Leasing' && <GlassOptionButton label="Asalariado" selected={clientType === 'Asalariados'} onClick={() => handleClientSelect('Asalariados')} />}
                        {productType !== 'Leasing' && <GlassOptionButton label="Pensionista" selected={clientType === 'Jubilados'} onClick={() => handleClientSelect('Jubilados')} />}
                        <GlassOptionButton label="Autónomo" selected={clientType === 'Autónomos'} onClick={() => handleClientSelect('Autónomos')} />
                        <GlassOptionButton label="Empresa" selected={clientType === 'Sociedades'} onClick={() => handleClientSelect('Sociedades')} />
                    </div>
                    
                    {clientType === 'Jubilados' && (
                        <div className="mt-4 animate-fade-in-up border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-semibold text-gray-800">Tipo de Pensión</h4>
                                <button 
                                    onClick={() => setShowPensionerModal(true)}
                                    className="text-xs font-bold text-caixa-blue underline flex items-center gap-1"
                                >
                                    <InfoIcon className="w-3 h-3" />
                                    Calcular Plazo Máximo
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <GlassOptionButton label="Por Incapacidad" selected={retirementType === 'Por Incapacidad'} onClick={() => handleRetirementSelect('Por Incapacidad')} />
                                <GlassOptionButton label="Por Jubilación" selected={retirementType === 'Jubilación Normal'} onClick={() => handleRetirementSelect('Jubilación Normal')} />
                            </div>
                            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2 items-start">
                                <InfoIcon className="w-4 h-4 text-caixa-blue flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    <strong>Importante:</strong> El titular no debe pasar de 77 años cuando termine el contrato. Si el plazo no es suficiente, se debe añadir un cotitular más joven.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Vehicle */}
            {step >= 2 && (clientType !== 'Jubilados' || retirementType) && (
                <div ref={step2Ref} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-4 uppercase tracking-widest">3. Vehículo</h3>
                    <div className="flex gap-3">
                        <GlassOptionButton label="Nuevo" selected={vehicleType === 'Nuevo'} onClick={() => handleVehicleSelect('Nuevo')} />
                        <GlassOptionButton label="Matriculado" selected={vehicleType === 'Matriculado'} onClick={() => handleVehicleSelect('Matriculado')} />
                    </div>
                    
                    {/* LEASING VEHICLE USE SELECTOR (Appears only if vehicleType selected) */}
                    {vehicleType && ((productType === 'Leasing') || (productType === 'Financiación Lineal' && clientType === 'Sociedades')) && (
                        <div className="mt-4 animate-fade-in-up border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Uso del Vehículo</h4>
                            <div className="flex gap-3">
                                <GlassOptionButton label="Turismo" selected={vehicleUse === 'Turismo'} onClick={() => handleVehicleUseSelect('Turismo')} />
                                <GlassOptionButton label="Industrial" selected={vehicleUse === 'Industrial'} onClick={() => handleVehicleUseSelect('Industrial')} />
                            </div>
                        </div>
                    )}
                    
                    {/* LEASING REGISTRATION TAX SELECTOR (Appears only if New + Turismo) */}
                    {productType === 'Leasing' && vehicleType === 'Nuevo' && vehicleUse === 'Turismo' && (
                        <div className="mt-6 animate-fade-in-up border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-semibold text-gray-800">Impuesto de Matriculación</h4>
                                <span className="text-[10px] bg-blue-100 text-caixa-blue px-2 py-1 rounded-full font-bold uppercase tracking-wider">Financiado</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {[0, 4.75, 9.75, 14.75, 16].map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => setRegistrationTaxRate(rate)}
                                        className={`py-1 px-1 rounded-none text-sm font-bold border transition-colors ${
                                            registrationTaxRate === rate
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-slate-300 hover:border-black'
                                        }`}
                                    >
                                        {rate === 0 ? '0,0% ECO' : `${rate}%`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {vehicleType === 'Matriculado' && (
                        <div className="mt-4 space-y-6">
                            <div className="p-4 bg-slate-50 rounded-xl relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Matrícula (Opcional)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={licensePlate} 
                                        onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                                        className="border rounded-lg px-4 py-2 w-full uppercase" 
                                        placeholder="0000BBB"
                                    />
                                    <button onClick={handleSearchByPlate} className="bg-caixa-blue text-white p-2 rounded-none"><SearchIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setShowCameraModal(true)} className="bg-slate-800 text-white p-2 rounded-none"><CameraIcon className="w-5 h-5"/></button>
                                </div>
                                {foundPlateDate && <p className="text-xs text-green-600 mt-2 font-bold">Fecha estimada: {foundPlateDate}</p>}
                            </div>

                            <div className="bg-white border rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Antigüedad del Vehículo</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-semibold text-gray-500">Año Matriculación</label>
                                            <span className="text-sm font-bold">{registrationYear}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min={dynamicMinYear} 
                                            max={currentYear} 
                                            value={registrationYear} 
                                            onChange={(e) => setRegistrationYear(Number(e.target.value))} 
                                            className="w-full h-2 rounded-lg cursor-pointer" 
                                        />
                                    </div>
                                    
                                    {registrationYear === dynamicMinYear && (
                                        <div className="mb-4 animate-fade-in-up">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs font-semibold text-gray-500">Mes</label>
                                                <span className="text-sm font-bold">{registrationMonth}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="12" 
                                                value={registrationMonth} 
                                                onChange={(e) => setRegistrationMonth(Number(e.target.value))} 
                                                className="w-full h-2 rounded-lg cursor-pointer" 
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className={`mt-4 p-3 border rounded-none ${!vehicleAgeInfo.isFinanciable ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-semibold uppercase ${!vehicleAgeInfo.isFinanciable ? 'text-red-600' : 'text-blue-600'}`}>Edad del Vehículo</span>
                                        <span className={`text-sm font-bold ${!vehicleAgeInfo.isFinanciable ? 'text-red-900' : 'text-blue-900'}`}>{vehicleAgeInfo.ageText}</span>
                                    </div>
                                    {vehicleAgeInfo.isFinanciable ? (
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-blue-600 font-semibold uppercase">Plazo Máximo Financiable</span>
                                            <span className="text-sm font-bold text-blue-900">{vehicleAgeInfo.maxTerm} meses</span>
                                        </div>
                                    ) : (
                                        <div className="text-center font-bold text-red-600 text-xs uppercase mt-2">
                                            {vehicleAgeInfo.message}
                                        </div>
                                    )}
                                </div>
                                {vehicleAgeInfo.isFinanciable && (
                                    <button 
                                        onClick={() => {
                                            setStep(Math.max(step, 3));
                                            setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                        }}
                                        className="w-full mt-4 bg-white text-black border-2 border-slate-200 hover:bg-caixa-blue hover:text-white hover:border-caixa-blue font-bold py-2 rounded-none text-sm shadow-sm transition-all"
                                    >
                                        Continuar
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Financials */}
            {step >= 3 && vehicleAgeInfo.isFinanciable && (
                <div ref={step3Ref} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up space-y-4 md:space-y-6">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 uppercase tracking-widest">4. Datos Económicos</h3>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold">{productType === 'Leasing' ? 'Base Imponible (Sin IVA)' : 'Precio (PVP)'}</label>
                            <input 
                                type="number" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={salePrice} 
                                onChange={(e) => {
                                    let val = Number(e.target.value);
                                    if (val > 50000) val = Math.round(val / 5000) * 5000;
                                    setSalePrice(val);
                                }} 
                                className="text-2xl font-extrabold text-black text-right border-b border-gray-300 focus:border-black outline-none w-40"
                            />
                        </div>
                        <input type="range" min="3000" max="150000" step="500" value={salePrice} onChange={(e) => {
                            let val = Number(e.target.value);
                            if (val > 50000) val = Math.round(val / 5000) * 5000;
                            setSalePrice(val);
                        }} className="hidden md:block w-full h-2 rounded-lg cursor-pointer" />
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold">{productType === 'Leasing' ? 'Entrada (IVA Incluido)' : 'Entrada'}</label>
                            <input 
                                type="number" 
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={downPayment} 
                                onChange={(e) => setDownPayment(Number(e.target.value))} 
                                className="text-2xl font-extrabold text-black text-right border-b border-gray-300 focus:border-black outline-none w-40"
                            />
                        </div>
                        <input type="range" min="0" max={Math.max(0, Math.min(salePrice - 3000, salePrice * (productType === 'Leasing' ? 0.3 : 0.8)))} step="500" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="hidden md:block w-full h-2 rounded-lg cursor-pointer" />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-700">Importe a Financiar</span>
                        <span className="text-xl font-extrabold text-black">{formatMoney(currentPrincipal)}</span>
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-2 block">Plazo (meses)</label>
                        <div className="grid grid-cols-4 sm:flex sm:flex-nowrap gap-2">
                            {availableTerms.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTerm(t)}
                                    className={`py-1 px-1 flex-1 rounded-none text-sm font-bold border transition-colors ${
                                        term === t
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-slate-300 hover:border-black'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-2 block uppercase tracking-wider text-slate-500">T.I.N. (%)</label>
                        <div className="grid grid-cols-5 sm:flex sm:flex-nowrap gap-1 sm:gap-2">
                            {availableRates.map(r => {
                                let refValue: number | undefined = undefined;
                                if (productType === 'Leasing') {
                                    const leasingData = getLeasingTarifa(r, term);
                                    if (leasingData) refValue = leasingData.ref;
                                } else {
                                    const tarifaData = getTarifaCoefficient(r, term, insuranceType);
                                    if (tarifaData) refValue = tarifaData.ref;
                                }
                                
                                return (
                                    <div key={r} className="flex flex-col gap-1 flex-1">
                                        <button
                                            onClick={() => setInterestRate(r)}
                                            className={`py-1 px-1 rounded-none text-sm font-bold border transition-colors w-full ${
                                                interestRate === r
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-black border-slate-300 hover:border-black'
                                            }`}
                                        >
                                            {r}%
                                        </button>
                                        {canSeeCommission && refValue !== undefined && (
                                            <div className="text-[10px] text-center text-slate-500 font-medium print-hide flex flex-col">
                                                <span>Ref. {refValue.toFixed(2)}%</span>
                                                <span className="text-green-600 font-bold">
                                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(((offerDetails?.importeAFinanciar || 0) * refValue) / 100)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center justify-between mb-2">
                             <label className="text-gray-600 font-bold text-xs uppercase tracking-wider">Tarifa Aplicada</label>
                             <div className="flex flex-col items-end">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-none uppercase tracking-widest ${getTariffName(insuranceType).includes('Salón') ? 'bg-caixa-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {getTariffName(insuranceType)}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                                    Válida hasta {getTariffName(insuranceType).includes('Salón') ? '15/05/2026' : '31/12/2026'}
                                </span>
                             </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-gray-600 font-bold text-xs uppercase tracking-wider">Gastos de Apertura</label>
                            <button onClick={() => setShowFeeModal(true)} className="text-black hover:text-slate-700 text-xs font-bold underline flex items-center gap-1">{openingFeePercentage}% <EditIcon className="w-3 h-3" /></button>
                        </div>
                    </div>

                    {/* Insurance Selection - GRID LAYOUT */}
                    {(productType === 'Leasing' || clientType === 'Sociedades') ? (
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-800 text-sm">Seguro Protección de Pagos</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="opacity-40 pointer-events-none">
                                    <InsuranceSelectCard title="Vida + Desempleo / IT" subtitle="Cobertura Completa" selected={false} onClick={() => {}} onInfoClick={() => {}} />
                                </div>
                                <div className="opacity-40 pointer-events-none">
                                    <InsuranceSelectCard title="Vida" subtitle="Fallecimiento e Invalidez" selected={false} onClick={() => {}} onInfoClick={() => {}} />
                                </div>
                                <div className="opacity-40 pointer-events-none">
                                    <InsuranceSelectCard title="Vida Senior" subtitle="Mayores de 60 años" selected={false} onClick={() => {}} onInfoClick={() => {}} />
                                </div>
                                <div className="ring-2 ring-black">
                                    <InsuranceSelectCard title="Sin Protección" subtitle="Sin seguro asociado" selected={true} onClick={() => {}} onInfoClick={() => setShowInsuranceModal({title: 'Sin Protección', content: insuranceContent.sinProteccion})} />
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2">
                                <InfoIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">Esta solicitud no puede llevar seguro asociado por el tipo de producto o cliente.</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h4 className="font-bold text-gray-800 mb-3 text-sm">Seguro Protección de Pagos</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className={clientType === 'Jubilados' ? 'opacity-50 pointer-events-none' : ''}>
                                    <InsuranceSelectCard title="Vida + Desempleo / IT" subtitle="Cobertura Completa" selected={insuranceType === 'Vida + Desempleo / IT'} onClick={() => setInsuranceType('Vida + Desempleo / IT')} onInfoClick={() => setShowInsuranceModal({title: 'Vida + Desempleo / IT', content: insuranceContent.vidaDesempleo})} />
                                </div>
                                <div className={clientType === 'Jubilados' ? 'opacity-50 pointer-events-none' : ''}>
                                    <InsuranceSelectCard title="Vida" subtitle="Fallecimiento e Invalidez" selected={insuranceType === 'Vida'} onClick={() => setInsuranceType('Vida')} onInfoClick={() => setShowInsuranceModal({title: 'Vida', content: insuranceContent.vida})} />
                                </div>
                                <div className={clientType === 'Jubilados' && retirementType === 'Por Incapacidad' ? 'opacity-50 pointer-events-none' : ''}>
                                    <InsuranceSelectCard title="Vida Senior" subtitle="Mayores de 60 años" selected={insuranceType === 'Vida Senior'} onClick={() => setInsuranceType('Vida Senior')} onInfoClick={() => setShowInsuranceModal({title: 'Vida Senior', content: insuranceContent.senior})} />
                                </div>
                                <div>
                                    <InsuranceSelectCard title="Sin Protección" subtitle="Sin seguro asociado" selected={insuranceType === 'Sin Protección'} onClick={() => setShowNoInsuranceWarningModal(true)} onInfoClick={() => setShowInsuranceModal({title: 'Sin Protección', content: insuranceContent.sinProteccion})} />
                                </div>
                            </div>
                            {clientType === 'Jubilados' && (
                                <p className="text-xs text-caixa-blue mt-2 italic">
                                    * El tipo de seguro viene predeterminado por el tipo de jubilación.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Result Area - BLUE BOX UPDATED */}
            {monthlyPayment !== null && step >= 3 && vehicleAgeInfo.isFinanciable && (
                <div ref={resultRef} className="animate-fade-in-up">
                    <div className="bg-black rounded-none p-6 text-white shadow-xl relative overflow-hidden mb-6 border border-slate-800">
                        {productType === 'Leasing' ? (
                            <div className="relative z-10 flex flex-col items-center w-full">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 opacity-90">Cuota Mensual Leasing</h3>
                                
                                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center border-r border-slate-700">
                                        <p className="text-xs text-slate-400 uppercase mb-1">Cuota Sin IVA</p>
                                        <div className="flex justify-center items-baseline gap-1">
                                            <span className="text-3xl font-extrabold">{formatMoney(monthlyPaymentNet || 0).replace(' €', '')}</span>
                                            <span className="text-xs">+ I.V.A.</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-400 uppercase mb-1">Cuota Con IVA</p>
                                        <div className="flex justify-center items-baseline gap-1">
                                            <span className="text-3xl font-extrabold">{formatMoney(monthlyPayment).replace(' €', '')}</span>
                                            <span className="text-xs text-slate-500">IVA Inc.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full border-t border-slate-800 pt-4 mb-4">
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center border-r border-slate-700">
                                            <p className="text-xs text-slate-400 uppercase mb-1">V. Residual Sin IVA</p>
                                            <div className="flex justify-center items-baseline gap-1">
                                                <span className="text-xl font-bold">{formatMoney(residualValue || 0).replace(' €', '')}</span>
                                                <span className="text-[10px]">+ I.V.A.</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-400 uppercase mb-1">V. Residual Con IVA</p>
                                            <div className="flex justify-center items-baseline gap-1">
                                                <span className="text-xl font-bold">{formatMoney((residualValue || 0) * 1.21).replace(' €', '')}</span>
                                                <span className="text-[10px] text-slate-500">IVA Inc.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center mt-2 text-slate-500 italic">El Valor Residual es una cuota más al final del contrato.</p>
                                </div>

                                {premiumPoints > 0 ? (
                                    <div className="mb-4 bg-slate-800 px-4 py-2 rounded-none shadow-lg border border-slate-700 flex items-center gap-2 animate-pulse w-full justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-bold text-sm tracking-wide">
                                            Puntos Premium Program por esta solicitud: {premiumPoints}
                                        </span>
                                    </div>
                                ) : (!isNoInsuranceScenario && potentialPremiumPoints > 0 && (
                                    <div className="mb-4 bg-slate-800 px-4 py-2 rounded-none border border-slate-700 flex flex-col items-center gap-1 w-full justify-center">
                                        <span className="text-white font-bold text-sm tracking-wide opacity-50">
                                            Puntos Premium Program por esta solicitud: 0
                                        </span>
                                        <span className="text-[10px] text-caixa-blue font-bold tracking-wide uppercase">
                                            Si llevase seguro aportaría {potentialPremiumPoints} puntos
                                        </span>
                                    </div>
                                ))}

                                {canSeeCommission && commissionValue !== null && (
                                    <div className="mb-4 bg-slate-800/50 px-4 py-2 rounded-none shadow-sm border border-slate-700 flex items-center gap-2 w-full justify-center print-hide">
                                        <span className="text-green-400 font-bold">€</span>
                                        <span className="text-slate-300 font-bold text-sm tracking-wide">
                                            Comisión (Ref.): {commissionValue.toFixed(2)} €
                                        </span>
                                    </div>
                                )}
                                
                                {/* Mini Cards Grid for Leasing */}
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full border-t border-slate-800 pt-6">
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">T.I.N.</span>
                                        <span className="font-bold text-lg">{interestRate}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">T.A.E.</span>
                                        <span className="font-bold text-xl underline decoration-2 underline-offset-2">{tae ? tae.toFixed(2) : '---'}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Apertura</span>
                                        <span className="font-bold text-lg">{openingFeePercentage}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Plazo</span>
                                        <span className="font-bold text-lg">{term} + 1 m</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Años</span>
                                        <span className="font-bold text-lg">{Math.floor(term / 12)} a</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium mt-4 text-center uppercase tracking-wide">
                                    PERMANENCIA MÍNIMA SON 14 CUOTAS PAGADAS POR CLIENTE.
                                </p>
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1 opacity-90">Cuota Mensual</h3>
                                
                                {/* Main Quota Display */}
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-6xl font-extrabold tracking-tighter drop-shadow-md">{formatMoney(monthlyPayment).replace(' €','')}</span>
                                    <span className="text-2xl text-white font-medium">€/mes</span>
                                </div>
                                
                                <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wide">
                                    Prima de Seguros y Gastos de Apertura incluidos en Cuota Mensual
                                </p>
                                <p className="text-xs text-white font-bold mb-4 bg-slate-800 px-3 py-1 rounded-none border border-slate-700">
                                    Seguro: {
                                        insuranceType === 'Vida Senior' ? 'P. Vida Senior Plus (+ 60 años)' :
                                        insuranceType === 'Vida' ? 'P. Básico Plus' :
                                        insuranceType === 'Vida + Desempleo / IT' ? 'P. Desempleo Plus' :
                                        insuranceType
                                    }
                                </p>

                                {premiumPoints > 0 ? (
                                    <div className="mb-6 bg-slate-800 px-4 py-2 rounded-none shadow-lg border border-slate-700 flex items-center gap-2 animate-pulse">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white font-bold text-sm tracking-wide">
                                            Puntos Premium Program por esta solicitud: {premiumPoints}
                                        </span>
                                    </div>
                                ) : (!isNoInsuranceScenario && potentialPremiumPoints > 0 && (
                                    <div className="mb-6 bg-slate-800 px-4 py-2 rounded-none border border-slate-700 flex flex-col items-center gap-1 w-full justify-center">
                                        <span className="text-white font-bold text-sm tracking-wide opacity-50">
                                            Puntos Premium Program por esta solicitud: 0
                                        </span>
                                        <span className="text-[10px] text-caixa-blue font-bold tracking-wide uppercase">
                                            Si llevase seguro aportaría {potentialPremiumPoints} puntos
                                        </span>
                                    </div>
                                ))}

                                {canSeeCommission && commissionValue !== null && (
                                    <div className="mb-6 bg-slate-800/50 px-4 py-2 rounded-none shadow-sm border border-slate-700 flex items-center gap-2 w-full justify-center print-hide">
                                        <span className="text-green-400 font-bold">€</span>
                                        <span className="text-slate-300 font-bold text-sm tracking-wide">
                                            Comisión (Ref.): {commissionValue.toFixed(2)} €
                                        </span>
                                    </div>
                                )}
                                
                                {/* Mini Cards Grid */}
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full border-t border-slate-800 pt-6">
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">T.I.N.</span>
                                        <span className="font-bold text-lg">{interestRate}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">T.A.E.</span>
                                        <span className="font-bold text-xl underline decoration-2 underline-offset-2">{tae ? tae.toFixed(2) : '---'}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Apertura</span>
                                        <span className="font-bold text-lg">{openingFeePercentage}%</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Plazo</span>
                                        <span className="font-bold text-lg">{term} m</span>
                                    </div>
                                    <div className="bg-slate-900 rounded-none p-2 flex flex-col items-center justify-center border border-slate-800">
                                        <span className="text-[10px] uppercase text-slate-400 font-bold mb-1">Años</span>
                                        <span className="font-bold text-lg">{Math.floor(term / 12)} a</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium mt-4 text-center uppercase tracking-wide">
                                    PERMANENCIA MÍNIMA SON 14 CUOTAS PAGADAS POR CLIENTE.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* External Buttons */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setActionModalType('offer')} 
                                className="w-1/2 bg-black text-white hover:bg-slate-900 font-bold py-3 rounded-none flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <FileTextIcon className="w-5 h-5"/> Generar Oferta
                            </button>
                            <button 
                                onClick={() => setIsAmortizationModalOpen(true)} 
                                className="w-1/2 bg-slate-100 text-black border border-slate-300 hover:bg-slate-200 font-bold py-3 rounded-none flex items-center justify-center gap-2 transition-all shadow-sm"
                            >
                                <SearchIcon className="w-5 h-5"/> Ver Cuadro Amortización
                            </button>
                        </div>

                        <button 
                            onClick={() => {
                                if (offerDetails) {
                                    const savedData: SavedOfferData = {
                                        productType,
                                        clientType,
                                        vehicleCategory: vehicleType === 'Nuevo' ? 'Nuevo Turismo' : 'Ocasión Turismo', 
                                        vehicleUse,
                                        registrationDate: `${registrationMonth}/${registrationYear}`,
                                        salePrice,
                                        downPayment,
                                        amountToFinance: offerDetails.importeAFinanciar,
                                        term,
                                        interestRate,
                                        insuranceType,
                                        monthlyPayment: monthlyPayment || 0,
                                        tae,
                                        openingFeeValue: offerDetails.gastosApertura,
                                        openingFeeType: 'Financiados' 
                                    };
                                    onContinueToWorkflow(savedData);
                                }
                            }}
                            className="w-full bg-black text-white hover:bg-slate-900 hover:text-white font-bold py-4 rounded-none shadow-sm flex items-center justify-center text-lg transition-all"
                        >
                            {mode === 'workflow' ? 'Confirmar y Continuar' : 'Tramitar Solicitud'}
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden Components for PDF Generation */}
            <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -9999, opacity: 0, pointerEvents: 'none' }}>
                {offerDetails && (
                    <div ref={offerDetailsRef} style={{ width: '210mm', backgroundColor: 'white' }}>
                        <OfferDetails 
                            data={offerDetails}
                            monthlyPayment={monthlyPayment}
                            tin={interestRate}
                            tae={tae}
                            insuranceIncluded={insuranceType !== 'Sin Protección'}
                            insuranceType={insuranceType}
                            clientType={clientType}
                            vehicleType={vehicleType}
                            isCuotaSolucion={productType === 'Resicuota'}
                            finalValuePercentage={finalValuePercentage}
                            productType={productType} 
                            monthlyPaymentNet={monthlyPaymentNet} 
                            residualValue={residualValue} 
                            showFullAmortization={true}
                        />
                    </div>
                )}
            </div>

            {showFeeModal && <OpeningFeeModal currentFee={openingFeePercentage} onSave={setOpeningFeePercentage} onClose={() => setShowFeeModal(false)} />}
            {showInsuranceModal && <InsuranceInfoModal title={showInsuranceModal.title} content={showInsuranceModal.content} onClose={() => setShowInsuranceModal(null)} />}
            {showNoInsuranceWarningModal && (
                <NoInsuranceWarningModal 
                    onConfirm={() => {
                        setInsuranceType('Sin Protección');
                        setShowNoInsuranceWarningModal(false);
                    }}
                    onCancel={() => setShowNoInsuranceWarningModal(false)}
                />
            )}
            {showCameraModal && <PlateCameraModal onClose={() => setShowCameraModal(false)} onCapture={handleCameraCapture} />}
            {showPensionerModal && <PensionerAgeModal onClose={() => setShowPensionerModal(false)} />}
            {isGeneratingPdf && <GeneratingPdfModal />}
            
            {showPdfViewer && (
                <PdfViewerModal 
                    isOpen={true} 
                    src={showPdfViewer.src || ''} 
                    filename={showPdfViewer.title} 
                    onClose={() => setShowPdfViewer(null)} 
                />
            )}
            
            {isAmortizationModalOpen && offerDetails && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in-up">
                    <div className="bg-white rounded-none shadow-2xl w-full max-w-4xl p-4 md:p-6 relative flex flex-col h-[90vh] md:h-[80vh]">
                        <button onClick={() => setIsAmortizationModalOpen(false)} className="absolute top-2 right-2 text-slate-400 hover:text-white rounded-none p-2 bg-slate-100 hover:bg-black transition-all z-50"><XIcon className="w-5 h-5" /></button>
                        <div className="flex-1 overflow-y-auto pr-0 custom-scrollbar relative">
                            <AmortizationTable 
                                importeTotalCredito={offerDetails.importeTotalCredito}
                                plazo={offerDetails.plazo}
                                tin={interestRate}
                                cuotaConSeguro={monthlyPayment || 0}
                                costeSeguroMensual={0} 
                                openingFeeValue={offerDetails.gastosApertura}
                                finalValue={productType === 'Resicuota' && finalValuePercentage ? (salePrice * (finalValuePercentage / 100)) : 0}
                                startRow={1}
                                endRow={offerDetails.plazo + (productType === 'Resicuota' ? 1 : 0) + (productType === 'Leasing' ? 1 : 0)}
                                productType={productType}
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {actionModalType === 'offer' && (
                <DocumentActionModal 
                    title="Oferta Financiera"
                    onClose={() => setActionModalType(null)}
                    onAction={(action) => {
                        setActionModalType(null);
                        generateOfferPdf(action);
                    }}
                />
            )}
        </div>
    );
};

export default Simulator;
