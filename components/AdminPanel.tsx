import React, { useState, useEffect } from 'react';
import { ChartBarIcon, UsersIcon, ExclamationTriangleIcon, SimulatorIcon, DocumentSubmissionIcon, DigitalSignatureIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, SendIcon, CheckIcon, SpinnerIcon, DownloadIcon, FileTextIcon, UploadIcon, XIcon, EmailIcon } from './Icons.tsx';
import { Settings, Shield, Building2, Search, UploadCloud, Layers, BarChart3, Users, FileSpreadsheet, UserPlus } from 'lucide-react';

interface AdminPanelProps {
  onSendAdminNotification: (title: string, description: string) => void;
}

const StatCard = ({ title, value, icon, change, changeType }: { title: string, value: string, icon: React.ReactNode, change: string, changeType: 'positive' | 'negative' }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">{title}</p>
            <div className="text-gray-400">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change} que la semana pasada
        </p>
    </div>
);

const MetricsDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Usuarios Activos" value="1,245" icon={<UsersIcon className="w-6 h-6"/>} change="+5.2%" changeType="positive" />
                <StatCard title="Instalaciones PWA" value="832" icon={<DownloadIcon className="w-6 h-6"/>} change="+12.1%" changeType="positive" />
                <StatCard title="Errores (24h)" value="12" icon={<ExclamationTriangleIcon className="w-6 h-6"/>} change="-3.5%" changeType="positive" />
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden mt-8">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><BarChart3 className="w-6 h-6" /> Portal Google Analytics Hub</h2>
                    <p className="text-blue-100 max-w-xl text-sm leading-relaxed mb-6">
                        Las métricas en vivo requieren de la configuración del Data API y una Service Account de Google Cloud en el backend (.env). A continuación se muestra un espacio preparado para Looker Studio.
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <BarChart3 className="w-64 h-64 transform rotate-12" />
                </div>
            </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex items-center justify-center bg-slate-50 relative mt-6">
                 <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Google_Analytics_logo_%282015%E2%80%932021%29.svg/1024px-Google_Analytics_logo_%282015%E2%80%932021%29.svg.png')] opacity-[0.03] bg-center bg-no-repeat bg-contain" />
                 <div className="text-center z-10">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold mb-2">Integrador de Looker Studio / GA4</p>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">Inserta aquí tu Property ID de GA4 o embute un iframe de Looker Studio.</p>
                 </div>
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h4 className="font-bold text-gray-800 mb-4">Funcionalidades Más Usadas</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3"><SimulatorIcon className="w-5 h-5 text-caixa-blue"/> <span>Simulador Financiero (45%)</span></li>
                        <li className="flex items-center gap-3"><DocumentSubmissionIcon className="w-5 h-5 text-caixa-blue"/> <span>Análisis de Documentación (25%)</span></li>
                        <li className="flex items-center gap-3"><DigitalSignatureIcon className="w-5 h-5 text-caixa-blue"/> <span>Firma de Solicitudes (15%)</span></li>
                    </ul>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h4 className="font-bold text-gray-800 mb-4">Uso por Dispositivo</h4>
                    <ul className="space-y-3 text-sm">
                       <li className="flex items-center gap-3"><DevicePhoneMobileIcon className="w-5 h-5 text-caixa-blue"/> <span>Móvil (68%)</span></li>
                       <li className="flex items-center gap-3"><ComputerDesktopIcon className="w-5 h-5 text-caixa-blue"/> <span>Escritorio (32%)</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const MessageSender: React.FC<{ onSendAdminNotification: (title: string, description: string) => void }> = ({ onSendAdminNotification }) => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientEmail || !title || !description) return;

        setIsSending(true);
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('to', recipientEmail);
            formData.append('subject', `NOTIFICACIÓN APP: ${title}`);
            formData.append('body', description);
            if (attachment) {
                formData.append('files', attachment);
            }

            const response = await fetch('/api/email/send-notification', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                onSendAdminNotification(title, description);
                setIsSent(true);
                setTitle('');
                setDescription('');
                setAttachment(null);
                setTimeout(() => setIsSent(false), 3000);
            } else {
                const errData = await response.json();
                throw new Error(errData.error || 'Error en el servidor al enviar el correo');
            }
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Error al conectar con el servidor de correo. Verifica que el backend esté ejecutándose.');
        } finally {
            setIsSending(false);
        }
    };
    
    const fillTestData = () => {
        setRecipientEmail('pabloeinsua@gmail.com');
        setTitle('Prueba de Conectividad SMTP');
        setDescription('Este es un correo de prueba para verificar que el servidor de correo está configurado correctamente.\n\nFecha: ' + new Date().toLocaleString());
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 grayscale">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Enviar Notificación / Email</h3>
                <button type="button" onClick={fillTestData} className="text-[10px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-none">
                    Rellenar Datos
                </button>
            </div>
            <p className="text-xs text-slate-500 mb-6 uppercase tracking-wider">Envía un correo electrónico con adjuntos disponibles.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="recipient" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Destinatario (Email)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EmailIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input id="recipient" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all text-sm" placeholder="usuario@ejemplo.com" required />
                    </div>
                </div>
                <div>
                    <label htmlFor="notif-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título</label>
                    <input id="notif-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all text-sm" placeholder="Ej: Mantenimiento programado" required />
                </div>
                <div>
                    <label htmlFor="notif-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mensaje</label>
                    <textarea id="notif-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white transition-all text-sm" placeholder="Describe la notificación aquí..." required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Adjuntar Archivo (Opcional)</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-shrink-0 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-200">
                            <UploadIcon className="w-4 h-4" /> Seleccionar...
                            <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                        </label>
                        {attachment && (
                            <span className="text-xs text-slate-500 truncate max-w-[200px] font-medium border border-slate-200 bg-slate-50 px-2.5 py-1 rounded">
                                {attachment.name}
                            </span>
                        )}
                        {attachment && (
                             <button type="button" onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1">
                                <XIcon className="w-4 h-4" />
                             </button>
                        )}
                    </div>
                </div>
                {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 font-medium">{errorMsg}</div>
                )}
                <button type="submit" disabled={isSending || isSent} className="w-full inline-flex items-center justify-center bg-slate-900 text-white font-bold py-3 px-8 rounded-none hover:bg-black disabled:bg-slate-400 transition-colors uppercase tracking-wider text-xs">
                    {isSending ? <><SpinnerIcon className="w-4 h-4 mr-2 animate-spin" /> Enviando...</> : isSent ? <><CheckIcon className="w-4 h-4 mr-2" /> ¡Enviado!</> : <><SendIcon className="w-4 h-4 mr-2" /> Enviar Mensaje</>}
                </button>
            </form>
        </div>
    );
};

const KnowledgeBaseUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;
        setIsUploading(true);
        setUploadStatus('idle');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);

            const response = await fetch('/api/admin/knowledge', {
                method: 'POST', body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setFile(null);
                setTitle('');
                setTimeout(() => setUploadStatus('idle'), 3000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error(error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Base de Datos Documental</h3>
            <p className="text-sm text-gray-600 mb-6">Sube documentos (PDFs, manuales, normativas) para que queden registrados en el sistema y disponibles para consulta futura.</p>
            
            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título del Documento</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-caixa-blue" placeholder="Ej: Normativa de Riesgos 2025" required />
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => document.getElementById('kb-file')?.click()}>
                    <UploadIcon className="w-10 h-10 text-slate-400 mb-2"/>
                    <span className="text-sm font-semibold text-slate-600">{file ? file.name : 'Seleccionar PDF o Documento'}</span>
                    <input id="kb-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                </div>
                {uploadStatus === 'error' && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">Error al subir el documento.</div>}
                {uploadStatus === 'success' && <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center gap-2"><CheckIcon className="w-5 h-5"/> Documento guardado correctamente en la base de datos.</div>}
                <button type="submit" disabled={isUploading || !file || !title} className="w-full bg-caixa-blue text-white font-bold py-3 rounded-none hover:bg-caixa-blue-light disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {isUploading ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <UploadIcon className="w-5 h-5"/>}
                    {isUploading ? 'Subiendo...' : 'Subir a Base de Datos'}
                </button>
            </form>
        </div>
    );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 text-sm font-bold rounded-full transition-colors ${
            isActive ? 'bg-caixa-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
        {children}
    </button>
);

const AdminPanel: React.FC<AdminPanelProps> = ({ onSendAdminNotification }) => {
    const [activeTab, setActiveTab] = useState<'metrics' | 'tariffs' | 'agreements' | 'assignments' | 'messaging' | 'knowledge'>('metrics');
    
    // Auth & Permission Data 
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const emailStr = sessionStorage.getItem('userId') || '';
        const adminEmails = ['quoter.cpc@gmail.com', 'pabloeinsua@gmail.com'];
        if (adminEmails.includes(emailStr.toLowerCase())) {
            setIsSuperAdmin(true);
            setUserName('Administrador Quoter');
        } else {
            setIsSuperAdmin(false);
            setUserName('KAS / Gestor');
        }
    }, []);

    // -------- TARIFFS & AGREEMENTS LOGIC -------- //
    const [agreements, setAgreements] = useState<any[]>([]);
    const [rawDealers, setRawDealers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState('');
    const [search, setSearch] = useState('');
    const [availableTariffs, setAvailableTariffs] = useState<any[]>([]);
    const [assignmentViewMode, setAssignmentViewMode] = useState<'hierarchy' | 'norte'>('hierarchy');
    const [filterZona, setFilterZona] = useState('');
    const [filterKas, setFilterKas] = useState('');
    const [showTariffUpload, setShowTariffUpload] = useState(false);
    const [tariffName, setTariffName] = useState('');
    const [tariffJson, setTariffJson] = useState('');
    const [uploadStatus, setUploadStatusTariff] = useState('');
    const [showAddSellerPopup, setShowAddSellerPopup] = useState<{pdvCodigo: string, pdvNombre: string} | null>(null);

    const fetchTariffs = async () => {
      try {
        const res = await fetch('/api/tariffs');
        if(res.ok) {
            const data = await res.json();
            setAvailableTariffs(data);
        }
      } catch (e) {
        console.warn("Could not fetch tariffs", e);
      }
    };
  
    const processAgreements = (dealers: any[]) => {
      const macro = new Map();
      const caden = new Map();
      const estab = new Map();
      const pdvOnly = new Map();
  
      dealers.forEach(d => {
        if (d.codigo_macrocadena && d.codigo_macrocadena.toString() !== '-1') {
          const id = d.codigo_macrocadena;
          if (!macro.has(id)) {
            macro.set(id, {
              id, type: 'macro', name: `Macrocadena: ${d.nombre_macrocadena}`, count: 0,
              tarifa_asignada: d.tarifa_asignada, premium_program: d.premium_program, ver_comisiones: d.ver_comisiones, kas: d.nombre_kas
            });
          }
          macro.get(id).count += 1;
        } else if (d.codigo_cadena && d.codigo_cadena !== 'Sin Cadena' && d.codigo_cadena.toString() !== '-1') {
          const id = d.codigo_cadena;
          if (!caden.has(id)) {
            caden.set(id, {
              id, type: 'cadena', name: `Cadena: ${d.nombre_cadena}`, count: 0,
              tarifa_asignada: d.tarifa_asignada, premium_program: d.premium_program, ver_comisiones: d.ver_comisiones, kas: d.nombre_kas
            });
          }
          caden.get(id).count += 1;
        } else if (d.codigo_establecimiento && d.codigo_establecimiento.toString() !== '-1') {
           const id = d.codigo_establecimiento;
           if (!estab.has(id)) {
             estab.set(id, {
               id, type: 'prescriptor', name: `Prescriptor: ${d.nombre_establecimiento}`, count: 0,
               tarifa_asignada: d.tarifa_asignada, premium_program: d.premium_program, ver_comisiones: d.ver_comisiones, kas: d.nombre_kas
             });
           }
           estab.get(id).count += 1;
        } else {
           const id = d.codigo_pdv;
           if (!pdvOnly.has(id)) {
             pdvOnly.set(id, {
               id, type: 'pdv', name: `PDV (Suelto): ${d.nombre_pdv}`, count: 0,
               tarifa_asignada: d.tarifa_asignada, premium_program: d.premium_program, ver_comisiones: d.ver_comisiones, kas: d.nombre_kas
             });
           }
           pdvOnly.get(id).count += 1;
        }
      });
  
      const combined = [
        ...Array.from(macro.values()),
        ...Array.from(caden.values()),
        ...Array.from(estab.values()),
        ...Array.from(pdvOnly.values()),
      ];
  
      return combined.sort((a,b) => a.name.localeCompare(b.name));
    };
  
    const fetchDealers = async () => {
      try {
        const roleStr = isSuperAdmin ? 'superadmin' : 'kas';
        const qs = new URLSearchParams({ role: roleStr, nombre: userName });
        const res = await fetch(`/api/kas/dealers?${qs}`);
        if (res.ok) {
          const data = await res.json();
          setRawDealers(data);
          setAgreements(processAgreements(data));
        } else {
          setErrorData("Error fetch dealers");
        }
      } catch (e) {
        setErrorData('Error cargando concesionarios');
      } finally {
        setLoadingData(false);
      }
    };
  
    useEffect(() => {
        if(activeTab === 'tariffs' || activeTab === 'agreements' || activeTab === 'assignments') {
             fetchDealers();
             fetchTariffs();
        }
    }, [activeTab]);
  
    const handleToggle = async (id: string, paramType: string, field: string, currentValue: any) => {
      const newVal = currentValue ? 0 : 1;
      setAgreements(prev => prev.map(a => a.id === id ? { ...a, [field]: newVal } : a));
      
      try {
          await fetch(`/api/kas/agreements`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetType: paramType, targetCode: id, [field]: newVal })
          });
      } catch (e) {
          console.error("Error saving via toggle", e);
      }
    };
  
    const handleTarifaChange = async (id: string, paramType: string, newVal: string) => {
      setAgreements(prev => prev.map(a => a.id === id ? { ...a, tarifa_asignada: newVal } : a));
      setRawDealers(prev => prev.map(d => d.codigo_pdv === id ? { ...d, tarifa_asignada: newVal } : d));
      
      try {
          await fetch(`/api/kas/agreements`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetType: paramType, targetCode: id, tarifa_asignada: newVal })
          });
      } catch (e) {
          console.error("Error saving tarifa", e);
      }
    };
  
    const handleUploadTariff = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploadStatusTariff('Subiendo...');
      try {
         const parsed = JSON.parse(tariffJson);
         const res = await fetch('/api/admin/tariffs', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ nombre: tariffName.toLowerCase().replace(/ /g,'_'), datos_json: parsed })
         });
         if (res.ok) {
             setUploadStatusTariff('✅ Tarifa cargada con éxito');
             setTariffName('');
             setTariffJson('');
             fetchTariffs();
         } else {
             setUploadStatusTariff('❌ Error del servidor');
         }
      } catch (e) {
         setUploadStatusTariff('❌ JSON Invalido');
      }
    };
  
    const handleAddSeller = async (e: any) => {
         e.preventDefault();
         alert("La creación comercial se enviará al endpoint POST /api/auth/register-seller.");
         setShowAddSellerPopup(null);
    };
  
    const filteredAgreements = agreements.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.id.toLowerCase().includes(search.toLowerCase())
    );
  
    const uniqueZones = Array.from(new Set(rawDealers.map(d => d.zona).filter(Boolean)));
    const uniqueKasKeys = Array.from(new Set(rawDealers.map(d => d.nombre_kas).filter(Boolean)));
  
    const filteredRawDealersForAgreementsTab = rawDealers.filter(d => 
         (!filterZona || d.zona === filterZona) &&
         (!filterKas || d.nombre_kas === filterKas) &&
         (d.nombre_pdv.toLowerCase().includes(search.toLowerCase()) || d.codigo_pdv.includes(search))
    );
    // -------------------------------------------- //


    return (
        <div className="w-full space-y-8 mt-4 animate-fade-in-up">
            {/* TABS NAVIGATION */}
            <div className="flex justify-center gap-2 flex-wrap border-b border-slate-200 pb-4">
                <TabButton isActive={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')}>
                    <span className="flex items-center gap-2"><ChartBarIcon className="w-4 h-4"/> Dashboard</span>
                </TabButton>
                <TabButton isActive={activeTab === 'tariffs'} onClick={() => setActiveTab('tariffs')}>
                    <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4"/> Tarifas</span>
                </TabButton>
                <TabButton isActive={activeTab === 'agreements'} onClick={() => setActiveTab('agreements')}>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Acuerdos M/C/P/P</span>
                </TabButton>
                <TabButton isActive={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')}>
                    <span className="flex items-center gap-2"><Layers className="w-4 h-4"/> Asignaciones de Red</span>
                </TabButton>
                <TabButton isActive={activeTab === 'messaging'} onClick={() => setActiveTab('messaging')}>
                    <span className="flex items-center gap-2"><SendIcon className="w-4 h-4"/> Mensajería Push</span>
                </TabButton>
                <TabButton isActive={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')}>
                    <span className="flex items-center gap-2"><FileTextIcon className="w-4 h-4"/> B. Documental</span>
                </TabButton>
            </div>

            <div className="pt-2">
                {activeTab === 'metrics' && <MetricsDashboard />}
                
                {activeTab === 'tariffs' && (
                     <div className="space-y-6">
                     {isSuperAdmin && (
                       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                         <div className="flex items-center justify-between cursor-pointer group" onClick={() => setShowTariffUpload(!showTariffUpload)}>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                  <UploadCloud className="w-5 h-5" />
                              </div>
                              <div>
                                  <h3 className="text-base font-bold text-slate-800">Cargar Nueva Tarifa JSON</h3>
                                  <p className="text-xs text-slate-500 font-medium">Sube los datos exportados para crear una nueva matriz de tarificación.</p>
                              </div>
                           </div>
                           <Settings className={`w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-transform ${showTariffUpload ? 'rotate-90' : ''}`} />
                         </div>
                         
                         {showTariffUpload && (
                           <form onSubmit={handleUploadTariff} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Identificador de la Tarifa</label>
                                    <input required type="text" value={tariffName} onChange={e => setTariffName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl outline-none text-sm focus:border-indigo-500 focus:bg-white transition-colors" placeholder="Ej: Standard_2026" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-1">Avisos</label>
                                     <p className="text-xs text-slate-500 py-3">Recuerda incluir los campos <code>tin_minimo</code>, <code>plazo_maximo</code> y los bloques <code>coeficientes_cuota</code> en tu JSON.</p>
                                 </div>
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Matriz JSON (Array)</label>
                                <textarea required value={tariffJson} onChange={e => setTariffJson(e.target.value)} rows={6} className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl outline-none text-sm focus:border-indigo-500 focus:bg-white font-mono transition-colors" placeholder='[{"tin": 8.99, "plazo_minimo": 36 ... }]' />
                             </div>
                             <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-bold text-indigo-600">{uploadStatus}</span>
                                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-none text-sm font-bold hover:bg-indigo-700 shadow-sm hover:shadow transition-all"><UploadCloud className="w-4 h-4"/> Guardar en Base de Datos</button>
                             </div>
                           </form>
                         )}
                       </div>
                     )}
     
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                         <div className="p-6 border-b border-slate-200 pb-4">
                            <h2 className="text-lg font-bold text-slate-800">Base de Datos de Tarifas</h2>
                            <p className="text-sm text-slate-500">Listado de todas las tarifas disponibles para asignar a los Puntos de Venta.</p>
                         </div>
                         <table className="w-full text-left text-sm whitespace-nowrap">
                             <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                               <tr>
                                  <th className="px-6 py-4">Nombre ID</th>
                                  <th className="px-6 py-4">Fecha de Creación</th>
                                  <th className="px-6 py-4 text-right">Acción</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {availableTariffs.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-bold text-slate-900 uppercase tracking-tight">{t.nombre}</td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{new Date(t.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-caixa-blue font-bold hover:text-blue-800">Ver Matriz</button>
                                        </td>
                                    </tr>
                                ))}
                                {availableTariffs.length === 0 && <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-500 font-medium">No hay tarifas almacenadas</td></tr>}
                             </tbody>
                         </table>
                     </div>
                  </div>
                )}

                {activeTab === 'agreements' && (
                     <div className="space-y-6">
                     <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                         <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex-1 md:w-48">
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filtrar por Zona</label>
                               <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-caixa-blue outline-none font-medium" value={filterZona} onChange={e => setFilterZona(e.target.value)}>
                                   <option value="">Todas las zonas</option>
                                   {uniqueZones.map(z => <option key={z as string} value={z as string}>{z}</option>)}
                               </select>
                            </div>
                            <div className="flex-1 md:w-48">
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filtrar por KAS</label>
                               <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-caixa-blue outline-none font-medium" value={filterKas} onChange={e => setFilterKas(e.target.value)}>
                                   <option value="">Todos los gestores</option>
                                   {uniqueKasKeys.map(k => <option key={k as string} value={k as string}>{k}</option>)}
                               </select>
                            </div>
                         </div>
                         <div className="w-full md:w-72 mt-2 md:mt-0 relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Buscar Punto Venta</label>
                            <Search className="w-4 h-4 absolute left-3 top-9 text-slate-400" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ej: SEAT..." className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm focus:ring-1 focus:ring-caixa-blue outline-none font-medium" />
                         </div>
                     </div>
    
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                  <tr>
                                    <th className="px-6 py-4">Zona / KAS</th>
                                    <th className="px-6 py-4">Jerarquía del Acuerdo</th>
                                    <th className="px-6 py-4">Punto de Venta</th>
                                    <th className="px-6 py-4 text-right">Gestión Equipo</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredRawDealersForAgreementsTab.map((d, index) => (
                                        <tr key={`acuerdo_${d.codigo_pdv}_${index}`} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 tracking-tight">{d.zona || 'SIN ZONA'}</div>
                                                <div className="text-xs text-slate-500 font-semibold uppercase">{d.nombre_kas || 'KAS NO ASIGNADO'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-medium space-y-1.5">
                                                    <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center font-bold text-[10px] text-blue-600 shadow-sm border border-blue-200">M</span> <span className="truncate max-w-[200px] inline-block">{d.nombre_macrocadena}</span></div>
                                                    <div className="flex items-center gap-2 text-slate-600 ml-2.5 border-l-2 border-slate-200 pl-2.5"><span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-500 border border-slate-200">C</span> <span className="truncate max-w-[200px] inline-block">{d.nombre_cadena}</span></div>
                                                    <div className="flex items-center gap-2 text-slate-500 ml-5 border-l-2 border-slate-200 pl-2.5"><span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center font-bold text-[9px] text-slate-500 border border-slate-200">P</span> <span className="truncate max-w-[200px] inline-block">{d.nombre_establecimiento}</span></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 text-sm">{d.nombre_pdv}</div>
                                                <div className="text-xs text-slate-500 font-medium">{d.localidad} ({d.provincia})</div>
                                                <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Cód: {d.codigo_pdv}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => setShowAddSellerPopup({ pdvCodigo: d.codigo_pdv, pdvNombre: d.nombre_pdv })}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-caixa-blue hover:text-caixa-blue hover:bg-blue-50 rounded-none text-xs font-bold text-slate-700 transition-all shadow-sm"
                                                >
                                                    <UserPlus className="w-4 h-4" /> Añadir Vendedor
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRawDealersForAgreementsTab.length === 0 && <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-500 font-medium">No se encontraron acuerdos con estos filtros.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                     </div>
                 </div>
                )}

                {activeTab === 'assignments' && (
                     <div className="space-y-6">
                     <div className="flex gap-4 border-b border-slate-200 pb-1">
                       <button 
                          onClick={() => setAssignmentViewMode('hierarchy')}
                          className={`px-5 py-3 text-sm font-bold rounded-none-xl transition-colors ${assignmentViewMode === 'hierarchy' ? 'bg-slate-100 text-slate-900 border-x border-t border-slate-200 shadow-sm relative top-[1px]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                         Asignación Jerárquica Global
                       </button>
                       
                       {isSuperAdmin && (
                          <button 
                             onClick={() => setAssignmentViewMode('norte')}
                             className={`px-5 py-3 text-sm font-bold rounded-none-xl transition-colors ${assignmentViewMode === 'norte' ? 'bg-blue-100 text-blue-900 border-x border-t border-blue-200 shadow-sm relative top-[1px]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            Modo Directo: ZONA NORTE
                          </button>
                       )}
                     </div>
     
                     {assignmentViewMode === 'hierarchy' && (
                       <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                         <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                           <div>
                             <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-caixa-blue"/>
                                Jerarquía de Acuerdos ({agreements.length} ramas)
                             </h2>
                             <p className="text-xs text-slate-500 mt-1 font-medium">Asignación estructurada: un nivel prevalece sobre los elementos que cuelgan de él.</p>
                           </div>
                           <div className="relative">
                             <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                             <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar rama o ID..." className="pl-9 pr-4 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:bg-white outline-none focus:ring-2 focus:ring-blue-100 font-medium w-64 transition-all" />
                           </div>
                         </div>
     
                         <div className="overflow-x-auto">
                           <table className="w-full text-left text-sm whitespace-nowrap">
                             <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                               <tr>
                                 <th className="px-6 py-4">Acuerdo de Red</th>
                                 <th className="px-6 py-4">Volumen</th>
                                 <th className="px-6 py-4">Tarifa Asignada</th>
                                 <th className="px-6 py-4 text-center">Comisiones Habilitadas</th>
                                 <th className="px-6 py-4 text-center">Programa Premium</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {filteredAgreements.map(a => (
                                 <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                       <span className="font-bold text-slate-800">{a.name}</span>
                                       <span className="text-xs text-slate-500 font-mono mt-0.5">ID: {a.id}</span>
                                     </div>
                                   </td>
                                   <td className="px-6 py-4">
                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600">
                                       {a.count} <Building2 className="w-3 h-3 ml-1 text-slate-400" />
                                     </span>
                                   </td>
                                   <td className="px-6 py-4">
                                     <select className="border border-slate-200 rounded-xl px-4 py-2 text-slate-800 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none font-bold shadow-sm transition-all" value={a.tarifa_asignada || 'estandar'} onChange={(e) => handleTarifaChange(a.id, a.type, e.target.value)}>
                                       {availableTariffs.map(t => (
                                           <option key={t.id} value={t.nombre}>{t.nombre.toUpperCase()}</option>
                                       ))}
                                     </select>
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                     <button onClick={() => handleToggle(a.id, a.type, 'ver_comisiones', a.ver_comisiones)} className={`relative inline-flex h-7 w-12 items-center rounded-none transition-all focus:outline-none shadow-inner ${a.ver_comisiones ? 'bg-caixa-blue' : 'bg-slate-300'}`}>
                                       <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${a.ver_comisiones ? 'translate-x-6' : 'translate-x-1'}`} />
                                     </button>
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                     <button onClick={() => handleToggle(a.id, a.type, 'premium_program', a.premium_program)} className={`relative inline-flex h-7 w-12 items-center rounded-none transition-all focus:outline-none shadow-inner ${a.premium_program ? 'bg-amber-500' : 'bg-slate-300'}`}>
                                       <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${a.premium_program ? 'translate-x-6' : 'translate-x-1'}`} />
                                     </button>
                                   </td>
                                 </tr>
                               ))}
                               {filteredAgreements.length === 0 && (
                                 <tr>
                                   <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No se han encontrado jerarquías para procesar.</td>
                                 </tr>
                               )}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     )}
     
                     {assignmentViewMode === 'norte' && (
                       <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden flex flex-col">
                         <div className="p-6 border-b border-blue-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                           <div>
                             <h2 className="text-lg font-black text-blue-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Laboratorio: Puntos de Venta ZONA NORTE
                             </h2>
                             <p className="text-xs text-blue-700 mt-1 font-medium">Gestión individual de PDVs saltándose la jerarquía. Válido solo para pruebas controladas.</p>
                           </div>
                         </div>
     
                         <div className="overflow-x-auto">
                           <table className="w-full text-left text-sm whitespace-nowrap">
                             <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                               <tr>
                                 <th className="px-6 py-4">Punto de Venta</th>
                                 <th className="px-6 py-4">Localidad</th>
                                 <th className="px-6 py-4">Tarifa Superpuesta</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {rawDealers.filter(d => d.zona === 'ZONA NORTE').map(d => (
                                 <tr key={`norte_${d.codigo_pdv}`} className="hover:bg-blue-50/50 transition-colors">
                                   <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                       <span className="font-bold text-slate-900">{d.nombre_pdv}</span>
                                       <span className="text-xs text-slate-500 font-mono mt-0.5">Cód: {d.codigo_pdv}</span>
                                     </div>
                                   </td>
                                   <td className="px-6 py-4 text-slate-600 font-semibold text-xs">
                                     {d.localidad} <span className="text-slate-400">({d.provincia})</span>
                                   </td>
                                   <td className="px-6 py-4">
                                     <select 
                                        className="border border-blue-200 rounded-xl px-4 py-2 text-blue-800 bg-white focus:bg-blue-50 focus:ring-2 focus:ring-blue-200 outline-none font-bold shadow-sm cursor-pointer transition-all" 
                                        value={d.tarifa_asignada || 'estandar'} 
                                        onChange={(e) => handleTarifaChange(d.codigo_pdv, 'pdv', e.target.value)}
                                     >
                                       {availableTariffs.map(t => (
                                           <option key={t.id} value={t.nombre}>{t.nombre.toUpperCase()}</option>
                                       ))}
                                     </select>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     )}
                  </div>
                )}
                
                {activeTab === 'messaging' && <MessageSender onSendAdminNotification={onSendAdminNotification} />}
                {activeTab === 'knowledge' && <KnowledgeBaseUploader />}

            </div>

             {/* ADD SELLER MODAL (Pop-up) */}
             {showAddSellerPopup && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                   <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl shadow-inner"><UserPlus className="w-5 h-5"/></div>
                               <div>
                                   <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-tight">Alta Comercial</h3>
                                   <p className="text-xs text-slate-500 font-medium">Registrando usuario para un PDV</p>
                               </div>
                           </div>
                           <button onClick={() => setShowAddSellerPopup(null)} className="w-8 h-8 flex items-center justify-center rounded-none hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6 flex items-start gap-3">
                               <Building2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                               <div>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asignación</p>
                                   <p className="text-sm font-bold text-slate-800">{showAddSellerPopup.pdvNombre}</p>
                                   <p className="text-xs text-slate-500 font-mono">Cód: {showAddSellerPopup.pdvCodigo}</p>
                               </div>
                            </div>
       
                            <form className="space-y-4" onSubmit={handleAddSeller}>
                               <div>
                                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Nombre y Apellidos</label>
                                   <input required type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium" placeholder="Ej: Carlos López..." />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">DNI o Contraseña</label>
                                   <input required type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium" placeholder="12345678A" />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Correo Electrónico</label>
                                   <input required type="email" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-medium" placeholder="correo@concesionario.com" />
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Cargo a desempeñar</label>
                                   <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-bold text-slate-700">
                                       <option value="Vendedor">Vendedor</option>
                                       <option value="Jefe de Ventas">Jefe de Ventas</option>
                                       <option value="Director Comercial">Director Comercial</option>
                                       <option value="Gerente">Gerente</option>
                                   </select>
                               </div>
                               <div className="pt-2">
                                   <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex justify-center items-center gap-2">
                                       Confirmar Alta y Enviar Acceso <UserPlus className="w-4 h-4" />
                                   </button>
                               </div>
                            </form>
                        </div>
                   </div>
                </div>
             )}

        </div>
    );
};

export default AdminPanel;
