
import React, { useState } from 'react';
import type { View } from '../App.tsx';
import { 
    PhoneIcon, 
    EmailIcon, 
    SearchIcon, 
    XIcon, 
    FileTextIcon, 
    DigitalSignatureIcon,
    ShieldCheckIcon,
    EuroIcon,
    ArrowUturnLeftIcon,
    CogIcon,
    WarningIcon,
    InfoIcon,
    UploadIcon,
    SpinnerIcon,
    ExternalLinkIcon,
    CheckIcon,
    ArrowRightIcon,
    TeamIcon
} from './Icons.tsx';
import DealerCodesModal from './DealerCodesModal.tsx';

interface CommercialSupportProps {
    onNavigate: (view: View) => void;
    userId?: string;
}

// Reusable modal for user keys
const KeysInfoModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 animate-fade-in">
        <style>{`.animate-fade-in { animation: fade-in 0.3s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up border border-slate-100">
            <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
            <button onClick={onClose} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100">
                <XIcon className="w-4 h-4" />
            </button>
            <h3 className="text-2xl font-light text-black tracking-tight mb-6 text-center">Recordatorio de Claves de Usuario</h3>
            <div className="space-y-4">
                <div className="text-sm text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-3 leading-relaxed">
                    <p>• Su <strong className="text-black">Num. de Identificador</strong> es su DNI con Letra Mayúscula.</p>
                    <p>• Su <strong className="text-black">Clave de Acceso</strong> es una Clave de 6 dígitos.</p>
                    <p>• Si no la recuerda, pulse en <strong className="text-black">"Recuperar Código Secreto"</strong> en la web de operaciones para generar una nueva.</p>
                    <p>• Le enviarán una nueva contraseña temporal por SMS para que después pueda introducir su nueva clave definitiva.</p>
                </div>
            </div>
        </div>
    </div>
);

// Unified Modal for Support Requests
const SupportRequestModal = ({ 
    title, 
    subject, 
    targetEmail, 
    onClose,
    userEmail,
    fields = [] 
}: { 
    title: string, 
    subject: string, 
    targetEmail: string, 
    onClose: () => void,
    userEmail?: string,
    fields: { name: string, label: string, type?: string, required?: boolean, placeholder?: string, isTextarea?: boolean, halfWidth?: boolean }[]
}) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.userName || !formData.dealership) {
            setError('Nombre del Usuario y Concesión son obligatorios.');
            return;
        }

        for (const field of fields) {
            if (field.required && !formData[field.name]) {
                setError(`El campo ${field.label} es obligatorio.`);
                return;
            }
        }

        setIsSending(true);
        setError('');

        try {
            const formPayload = new FormData();
            formPayload.append('to', targetEmail);
            
            const idValue = formData.id || '';
            const fullSubject = idValue ? `${idValue.toUpperCase()} / ${subject}` : subject;
            formPayload.append('subject', fullSubject);
            
            let bodyText = `Solicitud: ${title}\n\n`;
            if (userEmail) {
                bodyText += `Email de Login: ${userEmail}\n`;
            }
            bodyText += `Usuario/Nombre: ${formData.userName}\n`;
            bodyText += `Grupo o Concesionario: ${formData.dealership}\n\n`;
            
            for (const field of fields) {
                if (formData[field.name]) {
                    bodyText += `- ${field.label}: ${formData[field.name]}\n`;
                }
            }
            
            formPayload.append('body', bodyText);
            
            files.forEach(file => {
                formPayload.append('files', file);
            });

            const response = await fetch('/api/email/send-documentation', {
                method: 'POST',
                body: formPayload,
            });

            if (response.ok) {
                alert(`✅ Solicitud enviada correctamente.`);
                onClose();
            } else {
                const errData = await response.json();
                throw new Error(errData.error || 'Error en el servidor');
            }
        } catch (err) {
            console.error("Error sending email:", err);
            setError('Hubo un error al enviar el correo. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <style>{`
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; } 
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
            
            <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose}></div>
            
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up max-h-[90vh] overflow-y-auto z-10 border border-slate-100">
                <button onClick={onClose} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100">
                    <XIcon className="w-4 h-4" />
                </button>
                <div className="text-center mb-8">
                    <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <FileTextIcon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-light text-black tracking-tight">{title}</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Tu Nombre</label>
                            <input name="userName" value={formData.userName || ''} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-white" placeholder="Ej: Juan Pérez" required />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Tu Concesión</label>
                            <input name="dealership" value={formData.dealership || ''} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all bg-white" placeholder="Ej: Motor Madrid" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {fields.map((field, idx) => (
                            <div key={idx} className={field.halfWidth ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{field.label}</label>
                                {field.isTextarea ? (
                                    <textarea name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[100px]" placeholder={field.placeholder} required={field.required} />
                                ) : (
                                    <input type={field.type || "text"} name={field.name} value={formData[field.name] || ''} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all" placeholder={field.placeholder} required={field.required} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Archivos Adjuntos (Opcional)</label>
                        <div className="mt-1 flex items-center gap-4">
                            <label className="w-full cursor-pointer bg-white border border-slate-200 rounded-lg shadow-sm px-4 py-3 inline-flex justify-center items-center text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                <span>{files.length > 0 ? `${files.length} archivo(s) seleccionado(s)` : 'Seleccionar archivos'}</span>
                                <input type="file" className="hidden" onChange={handleFileChange} multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
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
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-4">
                            <p className="text-sm text-red-600 font-semibold">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:border-black hover:text-black transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSending} className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSending ? <><SpinnerIcon className="w-5 h-5"/> Enviando...</> : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ActionCard: React.FC<{ title: string, description?: string, actionText: string, onAction: () => void, variant?: 'default' | 'warning' | 'tech' }> = ({ title, description, actionText, onAction, variant = 'default' }) => (
    <div className={`bg-white p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300 h-full rounded-none border ${variant === 'warning' ? 'border-red-100' : 'border-slate-100'}`}>
        <h3 className={`font-light tracking-tight flex-grow mb-3 text-lg ${variant === 'warning' ? 'text-red-600' : 'text-black'}`}>{title}</h3>
        {description && <p className="text-sm text-slate-500 mb-6 leading-relaxed">{description}</p>}
        <button
            onClick={onAction}
            className={`w-full font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-widest transition-all mt-auto ${
                variant === 'warning' 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-slate-50 text-slate-600 hover:bg-black hover:text-white'
            }`}
        >
            {actionText}
        </button>
    </div>
);

const CommercialSupport: React.FC<CommercialSupportProps> = ({ onNavigate, userId }) => {
    
    const [isRefiInfoModalOpen, setIsRefiInfoModalOpen] = useState(false);
    const [isRefiFormModalOpen, setIsRefiFormModalOpen] = useState(false);
    const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);
    const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
    const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
    const [isKeysModalOpen, setIsKeysModalOpen] = useState(false);
    const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);
    
    const [supportModalData, setSupportModalData] = useState<{
        isOpen: boolean;
        title: string;
        subject: string;
        targetEmail: string;
        fields: { name: string, label: string, type?: string, required?: boolean, placeholder?: string, isTextarea?: boolean, halfWidth?: boolean }[];
    } | null>(null);
    
    const [refiDni, setRefiDni] = useState('');
    const [refiFile, setRefiFile] = useState<File | null>(null);
    const [refiError, setRefiError] = useState('');
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const openSupportModal = (title: string, subject: string, targetEmail: string, fields: any[]) => () => {
        setSupportModalData({ isOpen: true, title, subject, targetEmail, fields });
    };

    const gestoriaFields = [
        { name: 'id', label: 'DNI o Nº Solicitud', required: true, placeholder: '12345678A' },
        { name: 'clientName', label: 'Nombre Cliente', required: true },
        { name: 'mobile', label: 'Móvil Cliente', type: 'tel', required: true, halfWidth: true },
        { name: 'email', label: 'Email Cliente', type: 'email', required: true, halfWidth: true },
        { name: 'city', label: 'Localidad Firma', required: true, halfWidth: true },
        { name: 'province', label: 'Provincia Firma', required: true, halfWidth: true },
    ];

    const notariaFields = [
        { name: 'id', label: 'DNI o Nº Solicitud', required: true, placeholder: '12345678A' },
        { name: 'clientName', label: 'Nombre Cliente', required: true },
        { name: 'notaryName', label: 'Nombre Notaría', required: true, placeholder: 'Notaría de...' },
        { name: 'notaryCity', label: 'Localidad Notaría', required: true, halfWidth: true },
        { name: 'notaryProvince', label: 'Provincia Notaría', required: true, halfWidth: true },
    ];

    const genericFields = [
        { name: 'id', label: 'DNI o Nº Solicitud', required: true, placeholder: '12345678A' },
        { name: 'comments', label: 'Observaciones (Opcional)', isTextarea: true, placeholder: 'Añade cualquier detalle relevante...' },
    ];

    const handleOpenWebApp = () => {
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;
        const popupWidth = Math.round(screenWidth / 2);
        const popupHeight = screenHeight;
        const url = 'https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto';
        const features = `width=${popupWidth},height=${popupHeight},left=${screenWidth - popupWidth},top=0,resizable,scrollbars,status`;
        window.open(url, 'caixabankpc_webapp_approved', features);
    };

    // Combined Actions List
    const allActions = [
        // Status Actions
        { 
            title: 'Solicitudes Denegadas', 
            actionText: '+Info', 
            onAction: () => setIsDeniedModalOpen(true),
            variant: 'warning' as const 
        },
        { 
            title: 'Solicitudes En Estudio', 
            actionText: '+ Info', 
            onAction: () => setIsStudyModalOpen(true) 
        },
        { 
            title: 'Solicitudes Aprobadas', 
            actionText: '+Info', 
            onAction: () => setIsApprovedModalOpen(true)
        },
        { 
            title: 'Resolver Incidencias', 
            actionText: 'Solicitar', 
            onAction: openSupportModal('Resolver Incidencias', 'Resolver Incidencia', 'peinsua@caixabankpc.com', genericFields) 
        },
        // Management Actions
        { title: 'Petición Firma Gestoría', actionText: 'Solicitar', onAction: openSupportModal('Petición Firma Gestoría', 'Solicitud Firma Gestoría', 'peinsua@caixabankpc.com', gestoriaFields) },
        { title: 'Petición Firma Notaría', actionText: 'Solicitar', onAction: openSupportModal('Petición Firma Notaría', 'Solicitud Firma Notaría', 'peinsua@caixabankpc.com', notariaFields) },
        { title: 'Petición de Reservas de Dominio', actionText: 'Solicitar', onAction: openSupportModal('Petición de Reservas de Dominio', 'Petición Reserva de Dominio', 'peinsua@caixabankpc.com', genericFields) },
        { title: 'Petición de Importes de Cancelación Anticipada', actionText: 'Solicitar', onAction: openSupportModal('Petición de Importes de Cancelación Anticipada', 'Petición Importe Cancelación', 'peinsua@caixabankpc.com', genericFields) },
        { title: 'Petición de Contratos para Plan Moves', actionText: 'Solicitar', onAction: openSupportModal('Petición de Contratos para Plan Moves', 'Petición Contrato Plan Moves', 'peinsua@caixabankpc.com', genericFields) },
        { title: 'Petición de Desistimiento Cliente', actionText: 'Solicitar', onAction: openSupportModal('Petición de Desistimiento Cliente', 'Petición Desistimiento Cliente', 'peinsua@caixabankpc.com', genericFields) },
        { title: 'Utilidades', actionText: 'Acceder', onAction: () => onNavigate('utilidades') },
        { title: 'Anexo de Permanencia', actionText: 'Solicitar', onAction: openSupportModal('Anexo de Permanencia', 'Petición Anexo de Permanencia', 'peinsua@caixabankpc.com', genericFields) },
        { title: 'Cancelación Financiera REFI', actionText: '+ Info', onAction: () => setIsRefiInfoModalOpen(true) }
    ];
    
    const requestActions = allActions.slice(0, 4);
    const otherActions = allActions.slice(4);
    
    const documentActions = [
        {
            title: 'Descarga de Vida Laboral (SMS)',
            actionText: 'Ir',
            onAction: () => window.open('https://portal.seg-social.gob.es/wps/portal/importass/importass/Categorias/Vida+laboral+e+informes/Informes+sobre+tu+situacion+laboral/Informe+de+tu+vida+laboral', '_blank')
        },
        {
            title: 'Descargar de IRPF (por código CSV)',
            actionText: 'Ir',
            onAction: () => window.open('https://www2.agenciatributaria.gob.es/wlpl/KATA-APLI/cotejo/forms/CotejoSv', '_blank')
        },
        {
            title: 'Descarga de modelos 130 o 131 (por código CSV)',
            actionText: 'Ir',
            onAction: () => window.open('https://www2.agenciatributaria.gob.es/wlpl/KATA-APLI/cotejo/forms/CotejoSv', '_blank')
        },
        {
            title: 'Descarga de Pensión (por código CEA)',
            actionText: 'Ir',
            onAction: () => window.open('https://w6.seg-social.es/ProsaInternetAnonimo/OnlineAccess?ARQ.SPM.ACTION=LOGIN&ARQ.SPM.APPTYPE=SERVICE&ARQ.IDAPP=AFHS0002', '_blank')
        },
        {
            title: 'Solicitud de Certificado Digital para Cliente',
            description: 'Por videollamada a través del móvil. Tiene que tener su DNI original a mano. Una vez solicitado, en 24 HH. recibe el certificado digital en su móvil. Después puede descargar cualquier documento oficial, como la vida laboral, IRPF, modelo 130, 131, etc. Seguir las instrucciones indicadas.',
            actionText: 'Ir',
            onAction: () => window.open('https://www.sede.fnmt.gob.es/certificados/persona-fisica/certificado-con-dispositivo-movil', '_blank')
        }
    ];

    const openRefiForm = () => {
        setIsRefiInfoModalOpen(false);
        setIsRefiFormModalOpen(true);
    };

    const closeRefiModals = () => {
        setIsRefiInfoModalOpen(false);
        setIsRefiFormModalOpen(false);
        setRefiDni('');
        setRefiFile(null);
        setRefiError('');
        setIsProcessingPdf(false);
        setIsSendingEmail(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setRefiFile(e.target.files[0]);
        }
    };
    
    const handleSendRefiEmail = async () => {
        if (!refiDni.trim()) {
            setRefiError('El DNI del titular es obligatorio.');
            return;
        }
        if (!refiFile) {
            setRefiError('Debe adjuntar un documento.');
            return;
        }
        setRefiError('');
        
        setIsProcessingPdf(true);
        setIsSendingEmail(true);

        try {
            const formData = new FormData();
            formData.append('dni', refiDni);
            formData.append('file', refiFile);

            // CHANGED: Point to the new local backend API
            const API_URL = '/api/email/send-refi'; 

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert(`✅ Correo enviado correctamente para el DNI: ${refiDni}.`);
                closeRefiModals();
            } else {
                const errData = await response.json();
                // If the backend returns 503 (Not Configured), fallback to mailto
                if (response.status === 503) throw new Error("Email not configured");
                throw new Error(errData.error || 'Error en el servidor');
            }

        } catch (error) {
            console.error("Error sending email automatically:", error);
            
            const subject = `${refiDni.toUpperCase()} / Justificante de Cancelación Financiera REFI`;
            const body = "Adjuntamos Documento de Cancelación REFI. (Envío manual).";
            const mailtoLink = `mailto:PEINSUA@CAIXABANKPC.COM?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            const isConfigError = (error as Error).message === "Email not configured";
            
            if (isConfigError) {
                 alert('El servidor de correo no está configurado (faltan variables de entorno). Se abrirá tu gestor de correo predeterminado. Por favor, adjunta el archivo manualmente.');
            } else {
                 alert('Hubo un error al enviar el correo automático. Se abrirá tu cliente de correo. Por favor, adjunta el archivo manualmente.');
            }
            
            window.location.href = mailtoLink;
            closeRefiModals();

        } finally {
            setIsProcessingPdf(false);
            setIsSendingEmail(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 pb-12 px-4 sm:px-6 lg:px-8">
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
            
            <div className="relative z-10">
                {/* Main contact card */}
                <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm mb-10 text-center sm:text-left border border-slate-100 animate-fade-in-up">
                    <h3 className="text-2xl font-light text-black tracking-tight mb-4">Asistencia Telefónica de Operaciones</h3>
                    <p className="text-slate-500 max-w-3xl mb-8 leading-relaxed">
                        Contacta con nuestro equipo para tramitar una solcitud, modificar o resolver cualquier duda sobre tus Solicitudes.
                    </p>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                            <div className="flex flex-col gap-4 w-full sm:w-auto">
                                <a href="tel:933203365" className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white font-bold py-4 px-8 rounded-none text-xs uppercase tracking-widest flex-shrink-0 hover:bg-slate-800 transition-colors">
                                    <PhoneIcon className="w-5 h-5 mr-3" />
                                    Llamar 933 203 365
                                </a>
                                <button 
                                    onClick={() => setIsDealerModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 font-bold py-4 px-6 rounded-none text-xs uppercase tracking-widest flex-shrink-0 hover:border-black hover:text-black transition-colors"
                                >
                                    <InfoIcon className="w-4 h-4 mr-2"/>
                                    Códigos de Concesionario
                                </button>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 w-full text-sm text-slate-600 space-y-3 text-left flex-grow leading-relaxed">
                                <p><strong className="text-black">Pulsa 1</strong>, para consultar/modificar Solicitudes en Estudio.</p>
                                <p><strong className="text-black">Pulsa 2</strong>, para consultar/modificar Solicitudes Aprobadas.</p>
                                <p><strong className="text-black">Pulsa 2</strong>, para Tramitar una Nueva Solicitud por Teléfono.</p>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            De Lunes a Sábado, de 9:00 a 21:00 HH Ininterrupidamente.<br/>
                            (Excepto Festivos Nacionales).
                        </p>
                    </div>
                </div>
                
                {/* Action Cards Grid */}
                <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    
                    <section>
                        <h3 className="text-xl font-light text-black tracking-tight mb-6">Gestionar Solicitudes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {requestActions.map(action => (
                                <ActionCard
                                    key={action.title}
                                    title={action.title}
                                    actionText={action.actionText}
                                    onAction={action.onAction}
                                    variant={action.variant}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-light text-black tracking-tight mb-6">Otros Trámites</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {otherActions.map(action => (
                                <ActionCard
                                    key={action.title}
                                    title={action.title}
                                    actionText={action.actionText}
                                    onAction={action.onAction}
                                    variant={action.variant}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-light text-black tracking-tight mb-6">Descarga de Documentación Cliente</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documentActions.map(action => (
                                <ActionCard
                                    key={action.title}
                                    title={action.title}
                                    description={action.description}
                                    actionText={action.actionText}
                                    onAction={action.onAction}
                                    variant="default"
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 1. Denied Solicitudes Modal */}
            {isDeniedModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative animate-fade-in-up border border-slate-100">
                        <button onClick={() => setIsDeniedModalOpen(false)} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100"><XIcon className="w-4 h-4" /></button>
                        
                        <div className="text-center mb-8">
                            <div className="bg-red-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-red-100">
                                <XIcon className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-light text-black tracking-tight">Solicitud Denegada</h3>
                        </div>
                        
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p className="font-medium text-black text-center">Ante una Solicitud en estado DENEGADA, no hay opción de reconsideración.</p>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-sm text-red-800 text-center">
                                <p><strong className="font-bold">NO Consultes con tu Gestor o con Asistencia de Solicitudes</strong>, ya que no se puede modificar el Decreto de Denegación.</p>
                            </div>
                            <p className="text-center text-sm">Si la solicitud se deniega después de haber aportado documentación o un cotitular, tampoco se puede Reconsiderar.</p>
                        </div>

                        <button onClick={() => setIsDeniedModalOpen(false)} className="w-full mt-8 bg-white border border-slate-200 text-slate-600 font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:border-black hover:text-black transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Study Solicitudes Modal */}
            {isStudyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto border border-slate-100">
                        <button onClick={() => setIsStudyModalOpen(false)} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100"><XIcon className="w-4 h-4" /></button>
                        
                        <div className="text-center mb-8">
                            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <WarningIcon className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-black tracking-tight">Solicitud en Estudio</h3>
                        </div>
                        
                        <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                            <p className="text-center">Ante una solicitud en estudio, si ya has subido la documentación necesaria para el estudio, solo hay que esperar a que la revise y estudie uno de nuestros Analistas.</p>
                            
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <p className="font-medium text-black mb-3">Te llegará un correo con el Decreto:</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2"><span className="text-black mt-1">•</span> <span><strong className="text-black">Aprobada:</strong> (con o sin más Garantías)</span></li>
                                    <li className="flex items-start gap-2"><span className="text-black mt-1">•</span> <span><strong className="text-black">Denegada:</strong> (Quedaría Denegada Definitiva y no se puede solicitar Reconsideración).</span></li>
                                    <li className="flex items-start gap-2"><span className="text-black mt-1">•</span> <span><strong className="text-black">Garantías:</strong> Indicando la documentación necesaria para volver a estudiarla. O bien importe o plazo máximo que se puede autorizar.</span></li>
                                </ul>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                                <p className="mb-4">Si estás de acuerdo con lo ofertado, modifica la solicitud a estos parámetros, llamando al:</p>
                                <a href="tel:933203365" className="inline-flex items-center justify-center bg-black text-white font-bold py-3 px-6 rounded-none text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                    <PhoneIcon className="w-4 h-4 mr-2"/> 933 203 365 (Opción 1)
                                </a>
                            </div>

                            <div className="pt-6 border-t border-slate-100 text-center">
                                <h4 className="font-medium text-black mb-2">¿Falta documentación?</h4>
                                <p className="mb-4">Si no has subido la documentación, o falta algún documento, puedes hacerlo ahora enviando un correo a:</p>
                                <a 
                                    href="mailto:admision.auto@caixabankpc.com"
                                    className="inline-block w-full bg-white border border-slate-200 text-black font-mono font-bold py-4 px-6 rounded-none hover:border-black transition-colors mb-3 text-sm"
                                >
                                    admision.auto@caixabankpc.com
                                </a>
                                <p className="text-xs text-slate-400 italic">*Indica en Asunto el DNI del 1er Titular o el Número de Solicitud e incluye la documentación adjunta.</p>
                            </div>
                        </div>

                        <button onClick={() => setIsStudyModalOpen(false)} className="w-full mt-8 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* 3. Approved Solicitudes Modal */}
            {isApprovedModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto border border-slate-100">
                        <button onClick={() => setIsApprovedModalOpen(false)} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100"><XIcon className="w-4 h-4" /></button>
                        
                        <div className="text-center mb-8">
                            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <ShieldCheckIcon className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-black tracking-tight">Solicitud Aprobada</h3>
                        </div>
                        
                        <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                            <p className="text-center">Ante una solicitud en estado: Aprobada, puede continuar directamente con la firma de la solicitud en tu APP Firma Digital en tu Móvil/Tablet.</p>
                            
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                                <p>Revisa que tengas capturado el <strong className="text-black">Nº de Bastidor</strong> para VN, y <strong className="text-black">Bastidor y Matrícula</strong> para VO. Si no, no te dejará continuar con la firma.</p>
                            </div>

                            <button 
                                onClick={() => { setIsApprovedModalOpen(false); onNavigate('digitalSignature'); }}
                                className="w-full flex items-center justify-center gap-3 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
                            >
                                <DigitalSignatureIcon className="w-5 h-5" /> Ir a Firma de Contratos
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={handleOpenWebApp}
                                    className="w-full bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLinkIcon className="w-4 h-4" /> Revisar Solicitud
                                </button>
                                <button 
                                    onClick={() => setIsKeysModalOpen(true)}
                                    className="w-full bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors flex items-center justify-center gap-2"
                                >
                                    <InfoIcon className="w-4 h-4" /> Mis Claves de Usuario
                                </button>
                            </div>
                            
                            <a 
                                href="tel:933203365"
                                className="w-full bg-slate-50 border border-slate-200 text-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <PhoneIcon className="w-4 h-4" /> Llamar para completar Datos
                            </a>

                            <div className="pt-6 border-t border-slate-100 text-center">
                                <h4 className="font-medium text-black mb-2">¿Documentación Incompleta?</h4>
                                <p className="mb-4">Si no has subido la documentación necesaria Completa, puedes hacerlo ahora, envía un correo a:</p>
                                <a 
                                    href="mailto:documentacion.auto@caixabankpc.com"
                                    className="inline-block w-full bg-white border border-slate-200 text-black font-mono font-bold py-4 px-6 rounded-none hover:border-black transition-colors mb-3 text-sm"
                                >
                                    documentacion.auto@caixabankpc.com
                                </a>
                                <p className="text-xs text-slate-400 italic">*Indica en Asunto el DNI del 1er Titular o el Número de Solicitud, adjunta la documentación y envíalo.</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                <p>Si tras revisar la documentación algun documento sea ilegible, esté cortado, etc, te llegará un correo con la incidencia para que la resuelvas.</p>
                            </div>

                             <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                <p>Una vez firmada la solicitud por Titular/es y validada toda la documentación, recibirás en tu correo La Carta De Pago.</p>
                            </div>

                            <div className="flex items-center justify-center gap-3 bg-slate-50 border border-slate-100 p-5 rounded-xl text-center">
                                <WarningIcon className="w-6 h-6 text-black flex-shrink-0" />
                                <p className="text-black font-medium">Nunca Entregar o Matricular Vehículo hasta tener La Carta de Pago en tu correo.</p>
                            </div>
                        </div>

                        <button onClick={() => setIsApprovedModalOpen(false)} className="w-full mt-8 bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* REFI Info Modal */}
            {isRefiInfoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in-up border border-slate-100">
                        <button onClick={closeRefiModals} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100"><XIcon className="w-4 h-4" /></button>
                        <div className="text-center mb-6">
                            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <InfoIcon className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-black tracking-tight">Información sobre Cancelación REFI</h3>
                        </div>
                        <p className="text-slate-600 mb-8 text-center leading-relaxed text-sm">Las operaciones REFI, de refinanciación de Valores Finales de Otras Financieras de Marca, requieren un justificante de transferencia del importe de la Última Cuota (Balloom) a esa financiera, con el objeto de evitar Dobles Financiaciones.</p>
                        <button onClick={openRefiForm} className="w-full bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">
                            Enviar Justificante REFI
                        </button>
                    </div>
                </div>
            )}
            
            {/* REFI Form Modal */}
            {isRefiFormModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in-up border border-slate-100">
                        <button onClick={closeRefiModals} className="absolute top-4 right-4 bg-slate-50 text-slate-400 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-colors z-10 border border-slate-100"><XIcon className="w-4 h-4" /></button>
                        <div className="text-center mb-8">
                            <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <UploadIcon className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-2xl font-light text-black tracking-tight">Enviar Justificante REFI</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="refiDni" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">DNI del Titular</label>
                                <input
                                    type="text"
                                    id="refiDni"
                                    value={refiDni}
                                    onChange={(e) => setRefiDni(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg p-3 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                    placeholder="Introduce el DNI con letra"
                                />
                            </div>
                            <div>
                                <label htmlFor="refiFile" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Justificante (PDF o imagen)</label>
                                <div className="mt-1">
                                    <label htmlFor="refi-file-upload" className="w-full cursor-pointer bg-white border border-slate-200 rounded-lg px-4 py-4 flex flex-col items-center justify-center text-sm font-medium text-slate-600 hover:border-black hover:text-black transition-colors border-dashed">
                                        <UploadIcon className="w-6 h-6 mb-2" />
                                        <span>{refiFile ? 'Cambiar archivo' : 'Seleccionar archivo'}</span>
                                    </label>
                                    <input id="refi-file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                </div>
                                {refiFile && <p className="text-xs text-slate-500 mt-3 text-center truncate">Seleccionado: {refiFile.name}</p>}
                            </div>
                            {refiError && <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-100">{refiError}</p>}
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={closeRefiModals}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 hover:text-black hover:border-black font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSendRefiEmail} 
                                    disabled={isProcessingPdf || isSendingEmail}
                                    className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 inline-flex items-center justify-center gap-2 transition-colors"
                                >
                                    {isProcessingPdf || isSendingEmail ? <><SpinnerIcon className="w-4 h-4"/> {isSendingEmail ? 'Enviando...' : 'Procesando...'}</> : 'Enviar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Support Request Modal */}
            {supportModalData && supportModalData.isOpen && (
                <SupportRequestModal
                    title={supportModalData.title}
                    subject={supportModalData.subject}
                    targetEmail={supportModalData.targetEmail}
                    fields={supportModalData.fields}
                    userEmail={userId}
                    onClose={() => setSupportModalData(null)}
                />
            )}
            
            {/* User Keys Modal */}
            {isKeysModalOpen && <KeysInfoModal onClose={() => setIsKeysModalOpen(false)} />}
            
            {/* Dealer Codes Modal */}
            {isDealerModalOpen && <DealerCodesModal onClose={() => setIsDealerModalOpen(false)} />}
        </div>
    );
};

export default CommercialSupport;
