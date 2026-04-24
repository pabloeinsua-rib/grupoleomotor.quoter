
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { View } from '../App.tsx';
import { FileTextIcon, ShieldCheckIcon, ExternalLinkIcon, SearchIcon, CameraIcon, SpinnerIcon, XIcon } from './Icons.tsx';
import VehicleInspector from './VehicleInspector.tsx';
import { licensePlateData } from '../data/licensePlates.ts';

// --- Camera Modal for Plate Reading ---
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
            // Use current series for N plates or similar
            onCapture("2345 NMD"); // Mock captured plate within data range (April 2026)
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-white/50 rounded-none relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
                <button onClick={onClose} className="text-white font-bold bg-white/20 p-4 rounded-none backdrop-blur-md hover:bg-white/40 transition-colors">
                    <XIcon className="w-6 h-6"/>
                </button>
                <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-none border-4 border-slate-300 flex items-center justify-center relative hover:scale-105 transition-transform">
                    {isScanning && <SpinnerIcon className="w-10 h-10 text-black animate-spin absolute" />}
                    {!isScanning && <div className="w-16 h-16 bg-black opacity-20 animate-pulse"></div>}
                </button>
            </div>
            {isScanning && <div className="absolute top-20 bg-black/60 text-white px-4 py-2 uppercase tracking-widest text-xs font-bold font-mono">Analizando matrícula...</div>}
        </div>
    );
};

// --- Reusable Action Card for Links ---
const ActionCard = ({ title, description, icon, href }: { title: string; description: string; icon: React.ReactNode; href: string; }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block bg-white p-6 md:p-8 rounded-none border border-slate-200 hover:border-black transition-all duration-300 h-full group">
        <div className="flex flex-col gap-4">
            <div className="w-12 h-12 text-black flex-shrink-0 mb-2">{icon}</div>
            <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-widest text-sm mb-3 group-hover:text-black transition-colors">{title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
            </div>
        </div>
        <div className="mt-8 flex items-center text-xs font-bold text-black uppercase tracking-widest">
            Acceder al servicio <ExternalLinkIcon className="inline w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"/>
        </div>
    </a>
);

// --- Vehicle Age Calculator Component ---
const VehicleAgeCalculator = () => {
    const [licensePlate, setLicensePlate] = useState('');
    const [foundPlateDate, setFoundPlateDate] = useState<string | null>(null);
    const [registrationYear, setRegistrationYear] = useState<number | null>(null);
    const [registrationMonth, setRegistrationMonth] = useState<number | null>(null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    
    // UI toggle states
    const [productTab, setProductTab] = useState<'Standard' | 'EmpresasLeasing'>('Standard');

    const handleSearchByPlate = () => {
        setFoundPlateDate(null);
        setRegistrationYear(null);
        setRegistrationMonth(null);
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
        // Execute search immediately after mock tracking finishes in timeout
        setTimeout(() => {
             const letters = text.replace(/[^A-Z]/g, '').toUpperCase();
             if (letters.length === 3) {
                const found = licensePlateData.find(entry => entry.series >= letters);
                if (found) {
                    const [year, month] = found.date.split('-').map(Number);
                    setRegistrationYear(year);
                    setRegistrationMonth(month);
                    setFoundPlateDate(new Date(found.date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
                }
            }
        }, 100);
    };

    const calculationResult = useMemo(() => {
        if (!registrationYear || !registrationMonth) return { age: null, term: '' };
        const today = new Date();
        const vehicleAgeMonths = (today.getFullYear() - registrationYear) * 12 + (today.getMonth() - registrationMonth);
        const ageFormatted = `${Math.floor(vehicleAgeMonths / 12)} años y ${vehicleAgeMonths % 12} meses`;
        
        let termStr = '';
        if (productTab === 'Standard') {
             // Particulares / Autónomos
             const maxTotalMonths = 156; // 13 years
             const maxAllowedTerm = maxTotalMonths - vehicleAgeMonths;
             if (maxAllowedTerm < 36) {
                 termStr = "No financiable (antigüedad + plazo > 13 años)";
             } else {
                 termStr = `Hasta ${Math.min(120, Math.floor(maxAllowedTerm))} meses`;
             }
        } else {
             // Empresas / Leasing
             const maxAgeForLeasing = 48; // 4 years
             if (vehicleAgeMonths > maxAgeForLeasing) {
                 termStr = "La antigüedad máxima para Empresas/Leasing suele ser 4 años a inicio. (Mínimo a consultar).";
             } else {
                 const baseRemaining = 120 - vehicleAgeMonths; // Typical rule
                 termStr = `Hasta ${Math.min(72, baseRemaining)} meses según política Empresas.`;
             }
        }
        
        return { age: ageFormatted, term: termStr };
    }, [registrationYear, registrationMonth, productTab]);

    return (
        <div className="bg-white p-6 md:p-10 rounded-none border border-slate-200 w-full max-w-xl mx-auto shadow-sm min-h-[460px] flex flex-col justify-between overflow-hidden">
            <div className="overflow-auto pb-4">
                <div className="text-center mb-6 md:mb-8">
                    <h3 className="font-bold text-xl md:text-2xl tracking-widest text-black uppercase mb-2 md:mb-3">Calculadora de Antigüedad</h3>
                    <p className="text-slate-500 font-medium text-[9px] md:text-sm leading-relaxed px-2">
                        Clic al botón cámara para sacarle una foto a la matrícula de un vehículo, o introduce la matrícula para ver la fecha de matriculación y el plazo máximo financiable, (no válido para vehículos rematriculados).
                    </p>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                    <div className="p-4 md:p-5 bg-slate-50 border border-slate-200">
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-3 md:mb-4">Matrícula del Vehículo</label>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                value={licensePlate} 
                                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                                className="border border-slate-300 rounded-none px-4 py-3 w-full uppercase font-mono text-xs md:text-lg text-center tracking-[0.1em] md:tracking-[0.2em] focus:outline-none focus:border-black" 
                                placeholder="0000BBB"
                                maxLength={7}
                            />
                            <button onClick={handleSearchByPlate} className="bg-black text-white px-5 hover:bg-slate-800 transition-colors uppercase font-bold text-xs"><SearchIcon className="w-5 h-5"/></button>
                            <button onClick={() => setShowCameraModal(true)} className="bg-slate-200 text-black px-5 hover:bg-slate-300 border border-slate-300 transition-colors"><CameraIcon className="w-5 h-5"/></button>
                        </div>
                        {foundPlateDate && <p className="text-xs text-black mt-4 font-bold uppercase tracking-widest bg-slate-200 py-2 px-3 inline-block">Matriculación aprox: {foundPlateDate}</p>}
                    </div>

                    <div className="flex pt-4 pb-2">
                        <button 
                            className={`flex-1 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-all ${productTab === 'Standard' ? 'border-black bg-black text-white' : 'border-slate-300 bg-white text-slate-500 hover:border-black hover:text-black'}`}
                            onClick={() => setProductTab('Standard')}
                        >
                            Particulares / Autónomos
                        </button>
                        <button 
                            className={`flex-1 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-l-0 transition-all ${productTab === 'EmpresasLeasing' ? 'border-black bg-black text-white border-l' : 'border-slate-300 bg-white text-slate-500 hover:border-black hover:text-black hover:border-l'}`}
                            onClick={() => setProductTab('EmpresasLeasing')}
                        >
                            Empresas / Leasing
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-slate-50 p-6 md:p-8 border border-slate-200 space-y-4 shadow-inner">
                 <div className="flex flex-col space-y-1">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Antigüedad Actual</p>
                     <p className="text-xl font-bold text-black uppercase tracking-tight">{calculationResult.age || '-'}</p>
                 </div>
                 <div className="w-full h-px bg-slate-200"></div>
                 <div className="flex flex-col space-y-1">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plazo Máximo</p>
                     <p className="text-lg font-bold text-black uppercase tracking-tight">{calculationResult.term || '-'}</p>
                 </div>
            </div>

            {showCameraModal && <PlateCameraModal onClose={() => setShowCameraModal(false)} onCapture={handleCameraCapture} />}
        </div>
    );
};

interface UtilidadesProps {
    onNavigate: (view: View) => void;
}

const Utilidades: React.FC<UtilidadesProps> = ({ onNavigate }) => {
    return (
        <div className="w-full max-w-7xl mx-auto space-y-16 pb-12 mt-10 md:mt-16 px-4 sm:px-6">
            
            <div className="flex justify-center w-full animate-fade-in-up">
                <VehicleAgeCalculator />
            </div>

            <div className="border-t border-slate-200 pt-16 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-3xl font-light text-black tracking-tight mb-10 text-center">Enlaces de Interés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard 
                        title="Suministro de Datos DGT" 
                        description="Verifica datos técnicos de un vehículo, cargas, etc." 
                        icon={<SearchIcon className="w-full h-full" />} 
                        href="https://sede.dgt.gob.es/es/vehiculos/informacion-de-vehiculos/informe-de-un-vehiculo/" 
                    />
                     <ActionCard 
                        title="Valoración Ganvam" 
                        description="Acceso a la plataforma de valoración de vehículos." 
                        icon={<FileTextIcon className="w-full h-full" />} 
                        href="https://www.ganvam.es/" 
                    />
                    <ActionCard 
                        title="Registro Bienes Muebles" 
                        description="Solicitud de notas simples y certificaciones de dominio." 
                        icon={<ShieldCheckIcon className="w-full h-full" />} 
                        href="https://www.registradores.org/el-colegio/registro-de-bienes-muebles" 
                    />
                </div>
            </div>
        </div>
    );
};

export default Utilidades;
