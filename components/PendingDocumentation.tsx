
import React, { useState } from 'react';
import { EmailIcon, CheckIcon, WarningIcon, InfoIcon, CopyIcon, UploadIcon, SpinnerIcon, XIcon } from './Icons.tsx';

const SendDocumentationModal = ({
    isOpen,
    onClose,
    email,
    title
}: {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    title: string;
}) => {
    const [dni, setDni] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSend = async () => {
        if (!dni || files.length === 0) {
            setError('El DNI y al menos un archivo son obligatorios.');
            return;
        }

        setIsSending(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('to', email);
            formData.append('subject', `${dni.toUpperCase()} / ENVIO DE DOCUMENTACION RESTANTE`);
            
            let bodyText = `Se adjunta la documentación solicitada para el DNI ${dni.toUpperCase()}.\n\n`;
            if (description) {
                bodyText += `Detalle de la documentación:\n${description}\n\n`;
            }
            bodyText += `Este es un mensaje automático generado desde Quoter Automotive.`;
            
            formData.append('body', bodyText);
            
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await fetch('/api/email/send-documentation', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert(`✅ Documentación enviada correctamente para el DNI: ${dni}.`);
                onClose();
            } else {
                const errData = await response.json();
                throw new Error(errData.error || 'Error en el servidor');
            }
        } catch (err) {
            console.error("Error sending email:", err);
            setError('Hubo un error al enviar el correo. Por favor, inténtalo de nuevo o usa tu gestor de correo.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-none shadow-2xl border border-slate-200 w-full max-w-lg p-8 relative transform transition-all duration-300 animate-fade-in-up flex flex-col">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 bg-white text-slate-400 hover:text-black rounded-none transition-colors z-10 p-2"
                >
                    <XIcon className="w-5 h-5" />
                </button>
                
                <h3 className="text-2xl font-bold text-black uppercase tracking-tight mb-6 text-center">{title}</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DNI del Titular</label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            className="w-full border border-slate-300 rounded-none p-3 text-black font-medium focus:ring-0 focus:border-black outline-none transition-all uppercase"
                            placeholder="Ej: 12345678A"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Documentación que se envía</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-slate-300 rounded-none p-3 text-black font-medium focus:ring-0 focus:border-black outline-none transition-all min-h-[80px]"
                            placeholder="Ej: Nómina de enero y justificante de titularidad bancaria..."
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Archivos Adjuntos</label>
                        <div className="mt-1 flex items-center gap-4">
                            <label className="w-full cursor-pointer bg-white border border-slate-300 rounded-none px-4 py-3 inline-flex justify-center items-center text-sm font-bold text-black hover:border-black transition-colors uppercase tracking-widest">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                <span>{files.length > 0 ? `${files.length} archivo(s) seleccionado(s)` : 'Seleccionar archivos'}</span>
                                <input type="file" className="hidden" onChange={handleFileChange} multiple accept=".pdf,.jpg,.jpeg,.png" />
                            </label>
                        </div>
                        {files.length > 0 && (
                            <ul className="mt-2 text-xs text-slate-500 space-y-1">
                                {files.map((f, i) => (
                                    <li key={i} className="truncate">• {f.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 p-4 rounded-none border border-red-100 space-y-3 mt-4">
                            <p className="text-sm text-red-600 font-semibold">{error}</p>
                            <div className="bg-white p-3 rounded-none border border-red-100">
                                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Buzón de Destino Alternativo</p>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-sm font-semibold text-black break-all">{email}</span>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(email)} 
                                        className="text-slate-400 hover:text-black p-1 rounded-none transition-colors"
                                        title="Copiar email"
                                    >
                                        <CopyIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button 
                            onClick={handleSend} 
                            disabled={isSending}
                            className="w-full bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSending ? <><SpinnerIcon className="w-5 h-5"/> Enviando...</> : 'Enviar Documentación'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmailCard = ({ 
    title, 
    description, 
    email, 
    variant 
}: { 
    title: string, 
    description: string, 
    email: string, 
    variant: 'approved' | 'study' 
}) => {
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isApproved = variant === 'approved';
    const icon = isApproved ? <CheckIcon className="w-8 h-8 text-black" /> : <WarningIcon className="w-8 h-8 text-black" />;

    return (
        <>
            <div className="bg-white p-8 flex flex-col h-full rounded-none shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-none bg-slate-100 border border-slate-200">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-bold text-black uppercase tracking-tight">{title}</h3>
                </div>
                
                <p className="text-slate-500 mb-8 flex-grow leading-relaxed">{description}</p>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 px-6 rounded-none font-bold text-white bg-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-auto"
                >
                    <UploadIcon className="w-5 h-5" />
                    Enviar Documentación
                </button>
            </div>

            <SendDocumentationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                email={email} 
                title={`Enviar a ${title}`}
            />
        </>
    );
};

const PendingDocumentation: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 pb-12 px-4 sm:px-6 lg:px-8">
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
            `}</style>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 1: Approved */}
                <EmailCard 
                    title="Solicitudes Aprobadas"
                    description="Utiliza este buzón para enviar documentación de solicitudes que ya han sido Pre-Autorizadas, para su validación final y pago."
                    email="documentacion.auto@caixabankpc.com"
                    variant="approved"
                />

                {/* Card 2: Under Study */}
                <EmailCard 
                    title="Solicitudes En Estudio"
                    description="Utiliza este buzón para aportar documentación adicional requerida por los analistas para el estudio de riesgos de la operación."
                    email="documentacion.admision@caixabankpc.com"
                    variant="study"
                />
            </div>

            {/* Card 3: Reply Info */}
            <div className="bg-slate-50 p-8 flex flex-col sm:flex-row items-start gap-6 rounded-none shadow-sm border border-slate-200 animate-fade-in-up">
                <div className="bg-white p-4 rounded-none shadow-sm text-black flex-shrink-0 border border-slate-200">
                    <InfoIcon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-3">¿Te hemos solicitado documentación por correo?</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Si has recibido un correo electrónico de un gestor o analista solicitando documentación pendiente, la forma más rápida de gestionarlo es <strong className="text-black">responder directamente a ese mismo correo</strong> adjuntando los archivos solicitados.
                    </p>
                    <p className="text-slate-500 mt-3 text-sm">
                        De esta forma, el documento llegará directamente a la persona que está gestionando tu expediente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PendingDocumentation;
