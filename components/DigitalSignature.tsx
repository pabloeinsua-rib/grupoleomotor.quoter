
import React, { useState, useEffect } from 'react';
import { XIcon, WarningIcon, DevicePhoneMobileIcon, FileTextIcon, DownloadIcon } from './Icons.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';
import { View } from '../App.tsx';

// --- Reusable Modal Component ---
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

interface DigitalSignatureProps {
  onNavigate: (view: View) => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose, size = 'lg' }) => {
  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} p-6 sm:p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up max-h-[90vh] flex flex-col`}>
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
        <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors z-10">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="flex-shrink-0 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="overflow-y-auto pr-2 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Helper Functions ---
const validateDniNie = (value: string): boolean => {
    const sanitizedValue = value.trim().toUpperCase();
    const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/;
    if (!dniRegex.test(sanitizedValue)) return false;
    const controlChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let numberStr = sanitizedValue.slice(0, -1);
    const char = sanitizedValue.slice(-1);
    if (sanitizedValue.startsWith('X')) numberStr = '0' + sanitizedValue.slice(1, -1);
    else if (sanitizedValue.startsWith('Y')) numberStr = '1' + sanitizedValue.slice(1, -1);
    else if (sanitizedValue.startsWith('Z')) numberStr = '2' + sanitizedValue.slice(1, -1);
    const number = parseInt(numberStr, 10);
    if (isNaN(number)) return false;
    return controlChars[number % 23] === char;
};

const calculateNotaryFee = (amount: number, clientType: 'particular' | 'empresa') => {
    let baseFee = 0;
    if (amount <= 6010.12) baseFee = 90.151816;
    else if (amount <= 30050.61) baseFee = amount * 0.0045;
    else if (amount <= 60101.21) baseFee = amount * 0.0015;
    else if (amount <= 150253.03) baseFee = amount * 0.0005;
    else if (amount <= 601012.10) baseFee = amount * 0.0003;
    else baseFee = amount * 0.00015;

    if (clientType === 'empresa') {
        // Add 25% for one guarantor, as per document interpretation
        baseFee *= 1.25;
    } else { // 'particular'
        baseFee *= 0.75; // 25% reduction for individuals
    }

    const folios = 12; // As requested, updated from 25
    const numCopies = 2;
    const folioFee = folios * 3.005061;
    const copyFee = numCopies * (3.005061 + (folios - 1) * 1.50253);
    const suplicaFee = 6.01;

    const baseImponible = baseFee + folioFee + copyFee + suplicaFee;
    
    let retencion = 0;
    if (clientType === 'empresa') {
        retencion = baseImponible * 0.15;
    }

    const iva = baseImponible * 0.21;
    const total = baseImponible + iva;

    return { baseFee, folioFee, copyFee, suplicaFee, baseImponible, iva, retencion, total };
};


const DigitalSignature: React.FC<DigitalSignatureProps> = ({ onNavigate }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    
    // Gestoria Form State
    const [gestoriaForm, setGestoriaForm] = useState({ identifier: '', name: '', location: '', email: '', phone: '' });
    const [gestoriaErrors, setGestoriaErrors] = useState<any>({});
    
    // Notaria Form State
    const [notariaForm, setNotariaForm] = useState({ identifier: '', notaryName: '', notaryLocation: '' });
    const [notariaErrors, setNotariaErrors] = useState<any>({});

    // Calculator State
    const [calculatorForm, setCalculatorForm] = useState({ amount: 40000, clientType: 'particular' as 'particular' | 'empresa' });
    const [calculatorResult, setCalculatorResult] = useState<ReturnType<typeof calculateNotaryFee> | null>(null);
    
    // Mobile Detection
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOS, setMobileOS] = useState<'ios' | 'android' | null>(null);
    
    // Instructions Zoom & PDF
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [showPdfGuide, setShowPdfGuide] = useState(false);
    const [showPaperPdfGuide, setShowPaperPdfGuide] = useState(false);
    const [showOtpPdfGuide, setShowOtpPdfGuide] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            setIsMobile(true);
            setMobileOS('ios');
        } else if (/android/i.test(userAgent)) {
            setIsMobile(true);
            setMobileOS('android');
        } else {
            setIsMobile(false);
            setMobileOS(null);
        }
    }, []);

    const handleOpenApp = () => {
        const appStoreUrl = "https://apps.apple.com/es/app/firma-digital-caixabank-p-c/id1119199086";
        const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.ccf.firmadigital&hl=es&pli=1";

        if (mobileOS === 'ios') {
            window.location.href = appStoreUrl;
        } else if (mobileOS === 'android') {
            window.location.href = googlePlayUrl;
        } else {
            // Fallback for non-mobile or undetected
             window.open(appStoreUrl, '_blank');
        }
    };


    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, formSetter: React.Dispatch<React.SetStateAction<any>>) => {
        formSetter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGestoriaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: any = {};
        if (!gestoriaForm.identifier) errors.identifier = "Campo requerido.";
        if (!gestoriaForm.name) errors.name = "Campo requerido.";
        if (!validateDniNie(gestoriaForm.identifier) && !/^\d{14}$/.test(gestoriaForm.identifier)) {
            errors.identifier = "Formato de DNI/NIE o Nº Solicitud no válido.";
        }
        setGestoriaErrors(errors);

        if (Object.keys(errors).length === 0) {
            const subject = `${gestoriaForm.identifier.toUpperCase()} / Solicitud Firma Gestoría`;
            const body = `Ruego solicitar firma gestoría para el titular.\n\nNombre: ${gestoriaForm.name}\nEmail: ${gestoriaForm.email}\nTeléfono: ${gestoriaForm.phone}\nLocalidad de firma: ${gestoriaForm.location}`;
            window.location.href = `mailto:PEINSUA@CAIXABANKPC.COM?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setActiveModal(null);
        }
    };
    
    const handleNotariaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: any = {};
        if (!notariaForm.identifier) errors.identifier = "Campo requerido.";
        if (!notariaForm.notaryName) errors.notaryName = "Campo requerido.";
         if (!validateDniNie(notariaForm.identifier) && !/^\d{14}$/.test(notariaForm.identifier)) {
            errors.identifier = "Formato de DNI/NIE o Nº Solicitud no válido.";
        }
        setNotariaErrors(errors);

        if (Object.keys(errors).length === 0) {
            const subject = `${notariaForm.identifier.toUpperCase()} / Solicitud Firma Notaría`;
            const body = `Ruego solicitar firma notaría para el titular.\n\nNotaría: ${notariaForm.notaryName}\nLocalidad: ${notariaForm.notaryLocation}`;
            window.location.href = `mailto:PEINSUA@CAIXABANKPC.COM?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setActiveModal(null);
        }
    };

    const handleCalculateFee = () => {
        const result = calculateNotaryFee(calculatorForm.amount, calculatorForm.clientType);
        setCalculatorResult(result);
    };

    const topCards = [
        { id: 'otp', title: 'Firma OTP Auto (A Distancia)', subtitle: 'Proceso Web auto con firma digital por SMS', details: 'Firma a distancia mediante envío de código SMS.', imageUrl: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20INICIAR%20FIRMA%20DIGITAL.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIElOSUNJQVIgRklSTUEgRElHSVRBTC5wbmciLCJpYXQiOjE3NzY2OTk3OTcsImV4cCI6ODgxNzY2MTMzOTd9.AeBQ0St-iwwvc9UvLLrMEzo0prEID7TU8J6heulGQYE', imageClass: 'object-contain h-40 w-40 scale-125' },
        { id: 'app', title: 'Firma APP Móvil Presencial', subtitle: 'Presencial', imageUrl: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20NUEVA%20APP%20FIRMA%20DIGITAL%20PRESENCIAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIE5VRVZBIEFQUCBGSVJNQSBESUdJVEFMIFBSRVNFTkNJQUwud2VicCIsImlhdCI6MTc3NjY4NTU0NCwiZXhwIjoyNjQwNTk5MTQ0fQ.BbUwpDdtVqQugn5arKwdTIyhto1dPlNhLIjLEkf1rpo', imageClass: 'object-contain h-24 w-24 p-2' },
    ];

    const bottomCards = [
        { id: 'paper', title: 'Firma Contratos en Papel', imageUrl: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/vector-icon-contract-pen-signature-600nw-2732161579.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL3ZlY3Rvci1pY29uLWNvbnRyYWN0LXBlbi1zaWduYXR1cmUtNjAwbnctMjczMjE2MTU3OS53ZWJwIiwiaWF0IjoxNzc2NzgyNDE2LCJleHAiOjI2NDA2OTYwMTZ9.JFiG3xC49pWH9Hh-0ifJUDsCyukoQ_DxWtgD4ExHpjQ', imageClass: 'object-contain h-24 w-24 p-2' },
        { 
            id: 'agency', 
            title: 'Firma Gestoría (A Distancia)', 
            imageUrl: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/GestoriaAdministrativa.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL0dlc3RvcmlhQWRtaW5pc3RyYXRpdmEucG5nIiwiaWF0IjoxNzc2NzgyMjg3LCJleHAiOjEwNDE2Njk1ODg3fQ.kTFMCUOii8nNqh9Fr_LBxB1nwLR1MRVcsJPgUSoA6y8',
            subtitle: 'Servicio Gratuito.',
            details: 'Para titulares a +55 Kms.',
            imageClass: 'object-contain h-40 w-40 p-2'
        },
        { 
            id: 'notary', 
            title: 'Firma Notaría', 
            imageUrl: 'https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/logonotarios.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL2xvZ29ub3Rhcmlvcy5wbmciLCJpYXQiOjE3NzY3ODIzNTAsImV4cCI6MTA0MTY2OTU5NTB9.sCm3YfN1BxJWAJmCy_jCD_4ysxqIWsl8MZxyOvK0G4A',
            subtitle: 'Gastos por cuenta de cliente.',
            details: '+40k€ (Asalariados) / +30k€ (Empresas).',
            imageClass: 'object-contain h-28 w-28 p-2'
        },
    ];
    
    const formatCurrency = (value: number | undefined) => value?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) || '0,00 €';

    const renderCard = (card: any) => (
        <div key={card.id} className="bg-white rounded-none shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 flex flex-col text-center group grayscale hover:grayscale-0 overflow-hidden">
            <div className="p-4 min-h-[5rem] flex flex-col items-center justify-center">
                <h3 className="text-base font-bold text-slate-800 tracking-tight leading-tight">{card.title}</h3>
                {card.subtitle && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{card.subtitle}</p>}
                {card.details && <p className="text-[10px] text-slate-400 mt-1 max-w-[15rem] leading-tight">{card.details}</p>}
            </div>
            <div className="h-28 flex-grow flex items-center justify-center bg-slate-50 relative">
                {card.imageUrl ? (
                    <img src={card.imageUrl} alt={card.title} className={card.imageClass || "w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"} />
                ) : (
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                        <FileTextIcon className="w-8 h-8 text-slate-500" />
                    </div>
                )}
            </div>
            <div className="p-4">
                {card.id === 'app' && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveModal('appInfo')} className="w-full bg-black text-white font-bold py-2 px-5 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">+ Info</button>
                        <button onClick={() => setShowPdfGuide(true)} className="w-full bg-black text-white font-bold py-2 px-5 hover:bg-slate-800 transition-transform hover:scale-105 text-xs tracking-wider flex items-center justify-center gap-2 rounded-none">
                        <DownloadIcon className="w-4 h-4"/> Descargar Guía pdf
                        </button>
                        {isMobile && (
                        <button 
                            onClick={handleOpenApp} 
                            className="w-full bg-black text-white font-bold py-2 px-5 hover:bg-slate-800 text-xs tracking-wider shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 rounded-none"
                        >
                            <DevicePhoneMobileIcon className="w-4 h-4"/>
                            Ir a APP
                        </button>
                        )}
                    </div>
                )}
                {card.id === 'otp' && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => window.open('https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto', '_blank')} className="w-full bg-caixa-blue text-white font-bold py-3 px-2 hover:bg-blue-600 transition-all text-[10px] tracking-wider rounded-none uppercase leading-tight shadow-sm">
                            Acceder a Plataforma Auto para enviar Firma OTP a Cliente
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => onNavigate('appFirmaDigital')} className="flex-1 bg-black text-white font-bold py-2 px-2 hover:bg-slate-800 transition-all text-[10px] tracking-wider rounded-none uppercase">+ Info</button>
                            <button onClick={() => setShowOtpPdfGuide(true)} className="flex-1 bg-black text-white font-bold py-2 px-2 hover:bg-slate-800 transition-transform hover:scale-105 text-[10px] tracking-wider flex items-center justify-center gap-1 rounded-none">
                                <DownloadIcon className="w-4 h-4"/> Guía pdf
                            </button>
                        </div>
                    </div>
                )}
                {card.id === 'paper' && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveModal('paperInfo')} className="w-full bg-black text-white font-bold py-2 px-5 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">+ Info</button>
                        <button onClick={() => setActiveModal('paperInstructions')} className="w-full bg-black text-white font-bold py-2 px-5 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">Instrucciones</button>
                    </div>
                )}
                {card.id === 'agency' && (
                    <div className="flex flex-col gap-2 w-full">
                        <button onClick={() => setActiveModal('gestoriaInfo')} className="w-full bg-black text-white font-bold py-2 px-4 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">+ Info</button>
                        <button onClick={() => setActiveModal('gestoriaForm')} className="w-full bg-black text-white font-bold py-2 px-4 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">Solicitud Firma</button>
                    </div>
                )}
                {card.id === 'notary' && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setActiveModal('notariaInfo')} className="w-full bg-black text-white font-bold py-2 px-4 hover:bg-slate-800 transition-all text-xs tracking-wider rounded-none">+ Info</button>
                        <div className="flex flex-col lg:flex-row gap-2">
                            <button onClick={() => setActiveModal('notariaForm')} className="flex-1 bg-black text-white font-bold py-2 px-2 hover:bg-slate-800 transition-all text-[10px] sm:text-xs tracking-wider rounded-none">Solicitar</button>
                            <button onClick={() => setActiveModal('calculator')} className="flex-1 bg-black text-white font-bold py-2 px-2 hover:bg-slate-800 transition-all text-[10px] sm:text-xs tracking-wider rounded-none">Calcular Coste</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full flex flex-col flex-grow">
            <div className="flex-grow flex items-start mt-4">
                <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topCards.map(renderCard)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {bottomCards.map(renderCard)}
                    </div>
                </div>
            </div>
            
             {/* PDF Viewers */}
             <PdfViewerModal
                isOpen={showPdfGuide}
                src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/20260226_Proceso%20firma%20nueva%20app%20captacion%20cpc_%20v3.0.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDLzIwMjYwMjI2X1Byb2Nlc28gZmlybWEgbnVldmEgYXBwIGNhcHRhY2lvbiBjcGNfIHYzLjAucGRmIiwiaWF0IjoxNzc2Njg2MDM1LCJleHAiOjI2NDA1OTk2MzV9.23zHTUahR1J1_Y2ADrFLDQxPf44U64Mj74O3z3Fgmq8"
                filename="Manual_de_uso_APP_Firma_Digital.pdf"
                onClose={() => setShowPdfGuide(false)}
            />
             <PdfViewerModal
                isOpen={showPaperPdfGuide}
                src="https://storage.googleapis.com/bucket_quoter_auto2/fortos/Manual%20de%20Firma%20Contratos%20en%20Papel.pdf"
                filename="Manual_Firma_Papel.pdf"
                onClose={() => setShowPaperPdfGuide(false)}
            />
            <PdfViewerModal
                isOpen={showOtpPdfGuide}
                src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/CaixaBank%20P&C%20-%20Guia%20Firma%20OTP%20Auto.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0NhaXhhQmFuayBQJkMgLSBHdWlhIEZpcm1hIE9UUCBBdXRvLnBkZiIsImlhdCI6MTc3NjY4MjczOSwiZXhwIjoyNjQwNTk2MzM5fQ.kH8io_LYATFfrdnpvR5JBFzGqRnupT7I-j5HyJjkC0Q"
                filename="Guia_Firma_OTP_Auto.pdf"
                onClose={() => setShowOtpPdfGuide(false)}
            />

            {/* --- Modals --- */}
            {activeModal === 'gestoriaForm' && (
                <Modal title="Solicitud Firma Gestoría" onClose={() => setActiveModal(null)}>
                    <form onSubmit={handleGestoriaSubmit} className="space-y-4">
                        <InputField label="Nº DNI Titular o Nº Solicitud" name="identifier" value={gestoriaForm.identifier} onChange={e => handleFormChange(e, setGestoriaForm)} error={gestoriaErrors.identifier} />
                        <InputField label="Nombre y Apellidos del Titular" name="name" value={gestoriaForm.name} onChange={e => handleFormChange(e, setGestoriaForm)} error={gestoriaErrors.name} />
                        <InputField label="Localidad de Firma" name="location" value={gestoriaForm.location} onChange={e => handleFormChange(e, setGestoriaForm)} />
                        <InputField label="Email del Titular" name="email" type="email" value={gestoriaForm.email} onChange={e => handleFormChange(e, setGestoriaForm)} />
                        <InputField label="Móvil del Titular" name="phone" type="tel" value={gestoriaForm.phone} onChange={e => handleFormChange(e, setGestoriaForm)} />
                        <button type="submit" className="w-full bg-black text-white hover:bg-slate-800 font-bold py-3 rounded-none mt-4 transition-all uppercase tracking-widest text-xs">Generar Correo</button>
                    </form>
                </Modal>
            )}
            {activeModal === 'notariaForm' && (
                <Modal title="Solicitud Firma Notaría" onClose={() => setActiveModal(null)}>
                     <form onSubmit={handleNotariaSubmit} className="space-y-4">
                        <InputField label="Nº DNI Titular o Nº Solicitud" name="identifier" value={notariaForm.identifier} onChange={e => handleFormChange(e, setNotariaForm)} error={notariaErrors.identifier} />
                        <InputField label="Nombre de la Notaría" name="notaryName" value={notariaForm.notaryName} onChange={e => handleFormChange(e, setNotariaForm)} error={notariaErrors.notaryName} />
                        <InputField label="Localidad de la Notaría" name="notaryLocation" value={notariaForm.notaryLocation} onChange={e => handleFormChange(e, setNotariaForm)} />
                        <button type="submit" className="w-full bg-black text-white hover:bg-slate-800 font-bold py-3 rounded-none mt-4 transition-all uppercase tracking-widest text-xs">Generar Correo</button>
                    </form>
                </Modal>
            )}
             {activeModal === 'calculator' && (
                <Modal title="Calculadora Coste Notaría" onClose={() => setActiveModal(null)} size="xl">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Importe del Contrato (€)</label>
                                <input type="number" value={calculatorForm.amount} onChange={e => setCalculatorForm(p => ({...p, amount: Number(e.target.value)}))} className="mt-1 w-full px-3 py-2 border rounded-lg" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo de Cliente</label>
                                <div className="mt-1 flex gap-2">
                                    <button onClick={() => setCalculatorForm(p => ({...p, clientType: 'particular'}))} className={`flex-1 py-2 rounded-none border ${calculatorForm.clientType === 'particular' ? 'bg-caixa-blue text-white border-caixa-blue' : 'bg-white text-black border-slate-200'}`}>Particular</button>
                                    <button onClick={() => setCalculatorForm(p => ({...p, clientType: 'empresa'}))} className={`flex-1 py-2 rounded-none border ${calculatorForm.clientType === 'empresa' ? 'bg-caixa-blue text-white border-caixa-blue' : 'bg-white text-black border-slate-200'}`}>Empresa</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleCalculateFee} className="w-full bg-black text-white hover:bg-slate-800 font-bold py-3 rounded-none uppercase tracking-widest text-xs transition-colors">Calcular</button>
                        {calculatorResult && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2 border">
                                <h4 className="font-bold text-lg text-center">Estimación de Costes</h4>
                                <p className="text-xs text-center text-gray-500">(Basado en 12 folios y 2 copias)</p>
                                <ResultRow label="Derechos de Matriz" value={formatCurrency(calculatorResult.baseFee)} />
                                <ResultRow label="Folios (x12)" value={formatCurrency(calculatorResult.folioFee)} />
                                <ResultRow label="Copias (x2)" value={formatCurrency(calculatorResult.copyFee)} />
                                <ResultRow label="Súplica" value={formatCurrency(calculatorResult.suplicaFee)} />
                                <ResultRow label="Base Imponible" value={formatCurrency(calculatorResult.baseImponible)} isBold={true} />
                                <ResultRow label="IVA (21%)" value={formatCurrency(calculatorResult.iva)} />
                                <div className="pt-2 mt-2 border-t text-center">
                                    <p className="font-bold text-gray-500">TOTAL COSTE NOTARÍA</p>
                                    <p className="font-bold text-2xl text-caixa-blue">{formatCurrency(calculatorResult.total)}</p>
                                </div>
                                {calculatorResult.retencion > 0 && (
                                    <div className="pt-2 mt-2 border-t text-sm text-center bg-yellow-50 p-2 rounded-md">
                                        <p className="font-semibold text-yellow-800">Este importe está sujeto a una retención IRPF del 15% ({`-${formatCurrency(calculatorResult.retencion)}`}). El importe final a abonar a la notaría será de {formatCurrency(calculatorResult.total - calculatorResult.retencion)}.</p>
                                    </div>
                                )}
                                <div className="pt-4 mt-4 border-t">
                                    <p className="text-[10px] text-gray-500 text-justify">
                                        Se trata de un presupuesto meramente informativo y no vinculante. El mismo está
                                        calculado en base al Arancel Notarial vigente. Por lo tanto, sólo tiene en cuenta los posibles
                                        conceptos propiamente arancelarios previstos en la norma, dejando al margen los posibles
                                        conceptos extra arancelarios que pudieran tener lugar por el servicio solicitado en su oficina
                                        notarial. Para obtener importe exacto, consulte con su Notaría.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
            {activeModal === 'appInfo' && (
                 <Modal title="Descarga la App inOne" onClose={() => setActiveModal(null)} size="lg">
                     <div className="flex flex-col items-center">
                        <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed max-w-md">
                            Propónle a tu cliente que descargue la <strong>APP inOne en su móvil</strong>, para que pueda tener a mano toda la información que necesita. Es la herramienta definitiva para que gestione fácilmente sus contratos de crédito y realice todas sus gestiones en un solo lugar.
                        </p>
                        
                        <div className="flex justify-center gap-8 mb-10 w-full">
                            <div className="flex flex-col items-center flex-1">
                                <img 
                                    src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/appstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FwcHN0b3JlLWljb24uc3ZnIiwiaWF0IjoxNzc2Njg1OTE2LCJleHAiOjI2NDA1OTk1MTZ9.X2lDiieCfgYS79zAQU3BBct6pG9z_TR3U1xISYS4gb0" 
                                    alt="App Store" 
                                    className="h-10 object-contain mb-4"
                                />
                                <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                                    <img 
                                        src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA%20APP%20FIRMA/NUEVA_APP_FIRMA_IOS.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBIEFQUCBGSVJNQS9OVUVWQV9BUFBfRklSTUFfSU9TLnBuZyIsImlhdCI6MTc3NzA1MDA1MywiZXhwIjoyNjQwOTYzNjUzfQ.geenUz6PmX3ssUMorwDfYxWr_5B11CTKDyLtyL1IbFM" 
                                        alt="iOS QR Code" 
                                        className="h-28 w-28 object-contain"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <div className="bg-[#3b454e] p-4 rounded-none shadow-sm flex flex-col items-center">
                                    <img 
                                        src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20NUEVA%20APP%20FIRMA%20DIGITAL%20PRESENCIAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIE5VRVZBIEFQUCBGSVJNQSBESUdJVEFMIFBSRVNFTkNJQUwud2VicCIsImlhdCI6MTc3NjY4Mjk3MSwiZXhwIjoyNjQwNTk2NTcxfQ.z2D6OIslucUxNCJiUnSw1UHEw0IczT-ho_Man6ugLSk" 
                                        alt="CaixaBank P&C" 
                                        className="w-10 h-10 object-contain" 
                                    />
                                    <div className="mt-1 text-center">
                                        <p className="text-white text-[5px] font-bold uppercase tracking-widest leading-none">CaixaBank</p>
                                        <p className="text-white text-[4px] font-medium uppercase tracking-[0.2em] leading-none opacity-70">Payments & Consumer</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center flex-1">
                                <img 
                                    src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/playstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL3BsYXlzdG9yZS1pY29uLnN2ZyIsImlhdCI6MTc3NjY4NTk2MiwiZXhwIjoyNjQwNTk5NTYyfQ.6qQ2BCRv_RvwmuIOgFsdeheg33qxSEs79kJQ3Bmo_j0" 
                                    alt="Google Play" 
                                    className="h-10 object-contain mb-4"
                                />
                                <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-sm">
                                    <img 
                                        src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA%20APP%20FIRMA/NUEVA_APP_FIRMA_ANDROID.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBIEFQUCBGSVJNQS9OVUVWQV9BUFBfRklSTUFfQU5EUk9JRC5wbmciLCJpYXQiOjE3NzcwNTAwNzMsImV4cCI6MjY0MDk2MzY3M30.yXS22TgihpH-tTY-SxNvbyqZ564jSDi2d2u9bYc62R0" 
                                        alt="Android QR Code" 
                                        className="h-28 w-28 object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setShowPdfGuide(true); setActiveModal(null); }}
                            className="w-full bg-black text-white font-bold py-4 px-6 hover:bg-slate-800 transition-all text-xs tracking-widest uppercase flex items-center justify-center gap-3 rounded-none shadow-md"
                        >
                            <DownloadIcon className="w-5 h-5"/> MOSTRAR GUÍA RÁPIDA INONE
                        </button>
                     </div>
                 </Modal>
            )}
            {activeModal === 'gestoriaInfo' && (
                <Modal title="Información Firma a Distancia por Gestoría Administrativa" onClose={() => setActiveModal(null)} size="xl">
                    <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                        <p className="bg-slate-50 p-4 border-l-4 border-slate-300 font-medium">
                            Servicio Gratuito para firmas a distancia, siempre que el cliente se encuentre fuera de Provincia o a más de 55 KMS. del Concesionario.
                        </p>
                        
                        <div className="space-y-3">
                            <p>Comunica a tu gestor la necesidad de Firma por Gestoría del Titular/es, haciendo Clik y cumplimentado los campos del botón <strong>Solicitar Firma Gestoría</strong>, y enviando el Correo generado automaticamente a tu Gestor Comercial de Caixabank PC (xxxxxxxxxxx@caixabankpc.com).</p>
                            <p>Para iniciar este proceso es imprescindible que hayas enviado la documentación completa del titular/es y que haya sido validada.</p>
                        </div>
                        
                        <div className="border border-slate-200 p-5 rounded-none">
                            <p className="font-bold text-black mb-2 uppercase tracking-wider text-xs">Envío de Documentación:</p>
                            <p className="text-slate-600">Si falta documentación, puedes enviarla ahora mismo al buzón: <strong>documentacion.auto@caixabankpc.com</strong>, indicando en Asunto el DNI del Titular y adjuntando los documentos.</p>
                        </div>

                        <div className="flex items-start gap-3 text-[#b91c1c] font-medium bg-[#fef2f2] p-4 rounded-none text-sm text-left border border-red-100">
                            <WarningIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#ef4444]" />
                            <p>Si has recibido un correo con Incidencia/s, solucionalas, antes de solicitar la Firma por Gestoría.</p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-3">
                            <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>Una vez validada la documentación y haber solicitado la Firma por Gestoría, se pondrán en contacto con Titular, para acordar Fecha y Hora de Firma.</span></p>
                            <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>El Titular sólo tendrá que llevar su DNI/NIE original para identificarse.</span></p>
                            <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>Una vez acordada fecha y lugar de firma, te llegará un correo indicándote Hora, Día y Lugar.</span></p>
                            <p className="flex items-start gap-2"><span className="w-1 h-1 bg-slate-400 rounded-full mt-2 shrink-0"></span><span>El representante de la Gestoría acudirá a la cita con una Tablet para que el Titular/es pueda realizar la firma digitalmente.</span></p>
                            
                            <div className="h-px w-full bg-slate-200 my-4"></div>
                            
                            <p className="font-bold text-black">Una vez firmada la solicitud, recibirás en tu correo la Carta de Pago, para que puedas entregar/matricular el vehículo.</p>
                        </div>
                    </div>
                </Modal>
            )}
            {activeModal === 'notariaInfo' && (
                <Modal title="Información Firma Notaría" onClose={() => setActiveModal(null)} size="xl">
                     <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
                        <h4 className="font-bold text-black uppercase tracking-widest text-sm border-b border-slate-200 pb-2">Firma con Intervención Notarial para:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black rounded-full shrink-0"></span><span>Asalariados y Autónomos: Importe Financiado ≥ <strong>40.000 €</strong></span></li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black rounded-full shrink-0"></span><span>Empresas y Leasing: Importe Financiado ≥ <strong>30.000 €</strong></span></li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-black rounded-full shrink-0"></span><span>A petición de Analista o Cliente.</span></li>
                            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-black rounded-full shrink-0 mt-1.5"></span><span>Cuando titular tenga más contratos vivos con CaixaBank P&C, y las suma de los importes a financiar superen los umbrales.</span></li>
                        </ul>

                        <p className="bg-slate-50 p-4 border-l-4 border-slate-300 font-medium">El Notario es de libre elección por parte del Cliente.</p>

                        <div className="bg-slate-100 p-6 rounded-none border border-slate-200">
                             <p className="font-bold text-black uppercase tracking-wider mb-2">Costes de Intervención Notarial por Cuenta de Cliente</p>
                             <p className="text-slate-600 mb-2">Puedes calcular el coste aproximado, pulsando el botón <strong>Calcular Coste</strong>.</p>
                             <p className="text-slate-500 text-xs italic">CaixBank P&C no abona los gastos de Notaría, son siempre por cuenta del Cliente.</p>
                        </div>

                        <div className="space-y-3">
                            <p>Una vez te hayamos informado de la necesidad de Intervención Notarial para la solicitud Aprobada, contacta con tu cliente, para que te indique la Notaría de su Elección.</p>
                            <p>Pulsa el Botón <strong>Solicitar Firma Notaría</strong>, cumplimenta los datos y envía el correo generado a tu Gestor Comercial de CaixaBank P&C (xxxxxxxx@caixabankpc.com).</p>
                        </div>

                        <div className="border border-slate-200 p-5 rounded-none">
                             <p className="font-bold text-black mb-2 uppercase tracking-wider text-xs">Documentación Completa:</p>
                             <p className="text-slate-600">Para que se pueda enviar el contrato a la notaría, la documentación Titular/es tiene que estar completa. Si no lo está, envía un correo a: <strong>documentacion.auto@caixabankpc.com</strong>, indicando en el Asunto el DNI del Titular y adjutando la documentación que sea necesaria.</p>
                        </div>
                        
                        <div className="flex items-start gap-3 text-[#b91c1c] font-medium bg-[#fef2f2] p-4 rounded-none text-sm text-left border border-red-100">
                            <WarningIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#ef4444]" />
                            <p>Si recibes un correo con una incidencia, tienes que solucionarla antes de solicitar la Firma en Notaría.</p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-3">
                            <p>CaixaBank le enviará el contrato para su intervención a la notaría elegida.<br/>Titular tendrá que solicitar cita para su firma.</p>
                            <div className="h-px w-full bg-slate-200 my-2"></div>
                            <p className="font-bold text-black">Una vez firmado el contrato en Notaría, recibirás un correo con la Carta de Pago.</p>
                            <p className="font-bold text-black">Cuando la recibas ya puedes entregar/matricular vehículo (nunca antes).</p>
                        </div>
                    </div>
                </Modal>
            )}
            {activeModal === 'paperInfo' && (
                <Modal title="Información Firma en Papel" onClose={() => setActiveModal(null)}>
                    <div className="prose prose-sm max-w-none">
                        <p>En el caso de <strong>Sociedades</strong>, o si tu cliente no dispone de correo electrónico, tendrás que firmar el contrato en papel.</p>
                        <p>Puedes descargarte el contrato desde la web de operaciones o desde la APP "Mi Gestor". Imprimir 1 sola vez, a 1 sola cara.</p>
                        <p>Una vez firmados, envía una copia a tu Gestor Comercial de CaixaBank P&C, para que pueda solicitar el pago de la solicitud. Después guarda los contrato en un sobre, ya que enviaremos un mensajero a recoger los originales.</p>
                        <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 text-sm">
                            <p className="font-bold text-yellow-800 mb-2">Aviso Importante:</p>
                            <p className="text-yellow-800">Contratos de Empresa superiores a <strong>30.000 €</strong>, deben intervenirse en Notaría.</p>
                        </div>
                    </div>
                </Modal>
            )}
             {activeModal === 'paperInstructions' && (
                <Modal title="Instrucciones Firma en Papel" onClose={() => setActiveModal(null)}>
                    <div className="space-y-4 text-gray-700">
                        <p>La firma de Contratos en Papel es obligatoria para aquellas solicitudes de Empresa o Leasing (siempre que no tengan que ir a Notaría, cuando sean ≥ de 30.000 €). </p>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 text-sm">
                            <p><strong>Descarga una copia del contrato</strong> desde la Web de Operaciones (Mis Operaciones -&gt; Aprobadas -&gt; Nº de Solicitud -&gt; Icono Imprimir).</p>
                        </div>
                        <p><strong>Imprimir archivo descargado 1 sola vez a 1 sola cara</strong>, así saldrán las 3 copias que necesitamos.</p>
                        <p>Una vez firmado, envía una copia completa a tu Gestor, para que pueda solicitar el abono de la solicitud. Después guarda los contrato en un sobre, ya que te enviaremos un mensajero a recoger los originales.</p>
                        
                        <button 
                            onClick={() => { setShowPaperPdfGuide(true); setActiveModal(null); }}
                            className="w-full mt-4 bg-black text-white hover:bg-slate-800 font-bold py-3 px-8 rounded-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <FileTextIcon className="w-5 h-5"/> Guía Completa Firma Solicitudes en Papel
                        </button>
                        
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="w-full bg-black text-white hover:bg-slate-800 border border-slate-200 mt-2 font-bold py-3 px-8 rounded-none transition-all uppercase tracking-widest text-xs"
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
            {activeModal === 'instructionsImage' && (
                <Modal title="Instrucciones Firma Digital" onClose={() => setActiveModal(null)} size="2xl">
                    <div className="flex flex-col items-center">
                         <div 
                            className={`overflow-auto max-h-[60vh] w-full flex justify-center border rounded-none shadow-inner bg-slate-50 p-8`}
                         >
                             <div className="text-center">
                                 <h3 className="text-xl font-bold text-caixa-blue mb-4">Instrucciones de Firma Digital</h3>
                                 <p className="text-gray-700">Por favor, consulta la guía completa en PDF para ver las instrucciones detalladas.</p>
                             </div>
                         </div>
                         <p className="text-xs text-gray-500 mt-2 mb-4">Pulsa en la imagen para ampliar detalles</p>
                         
                         <button 
                            onClick={() => { setShowPdfGuide(true); setActiveModal(null); }}
                            className="w-full mb-2 bg-black text-white hover:bg-slate-800 font-bold py-3 px-8 rounded-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                         >
                            <FileTextIcon className="w-5 h-5"/> Ver Guía Completa Firma Digital
                         </button>

                         <button 
                            onClick={() => { setActiveModal(null); setIsImageZoomed(false); }}
                            className="w-full bg-black text-white hover:bg-slate-800 font-bold mt-2 py-3 px-8 rounded-none transition-all uppercase tracking-widest text-xs"
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// --- Sub-components for Modals ---
const InputField = ({ label, name, value, onChange, error, type = 'text' }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error?: string, type?: string }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            id={name} name={name} type={type} value={value} onChange={onChange}
            className={`mt-1 w-full px-3 py-2 border rounded-none focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-caixa-blue'}`}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
);

const ResultRow = ({ label, value, isBold = false }: { label: string, value: string, isBold?: boolean }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${isBold ? 'text-gray-800' : 'text-gray-700'}`}>{value}</span>
    </div>
);


export default DigitalSignature;
