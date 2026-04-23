
import React, { useState } from 'react';
import type { View } from '../App.tsx';
import PageHeader from './PageHeader.tsx';
import { CheckIcon, SearchIcon, WarningIcon, XIcon, type IconProps } from './Icons.tsx';
import StoreButtons from './StoreButtons.tsx';

interface ApplicationStatusProps {
  onNavigate: (view: View) => void;
}

const DocListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start text-sm">
      <svg className="w-4 h-4 text-black mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(90 10 10)"></path></svg>
      <span>{children}</span>
    </li>
);

const DocumentationNeededModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] p-6 sm:p-8 relative flex flex-col animate-fade-in-up border border-slate-200">
                 <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 hover:text-black transition-colors border border-slate-200">
                    <XIcon className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-light text-black tracking-tight mb-6 text-center">Documentación Necesaria</h2>
                <div className="overflow-y-auto pr-4">
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-2">PARTICULARES</h4>
                            <ul className="space-y-1 text-slate-600">
                                <DocListItem>DNI/NIE en color y vigor.</DocListItem>
                                <DocListItem>Certificado de cuenta bancaria.</DocListItem>
                                <DocListItem><strong>Asalariados:</strong> Última nómina.</DocListItem>
                                <DocListItem><strong>Pensionistas:</strong> Carta de revalorización.</DocListItem>
                                <DocListItem><strong>Si +25.000€:</strong> IRPF (Mod. 100).</DocListItem>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-2">AUTÓNOMOS</h4>
                            <ul className="space-y-1 text-slate-600">
                                <DocListItem>DNI/NIE en color y vigor.</DocListItem>
                                <DocListItem>Certificado de cuenta bancaria.</DocListItem>
                                <DocListItem>IRPF (Mod. 100).</DocListItem>
                                <DocListItem>Pagos trimestrales IRPF (Mod. 130/131).*</DocListItem>
                                <DocListItem>Vida Laboral o Impreso 036.</DocListItem>
                                <li className="text-[10px] mt-2 italic text-slate-500">*No pedir 130/131 si presenta autonómina (nomina sin retención).</li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-2">EMPRESAS</h4>
                            <ul className="space-y-1 text-slate-600">
                                <DocListItem>DNI/NIE del administrador/es.</DocListItem>
                                <DocListItem>IRPF del administrador/es.</DocListItem>
                                <DocListItem>CIF definitivo de la empresa.</DocListItem>
                                <DocListItem>Escrituras de Constitución y poderes.</DocListItem>
                                <DocListItem>Último Impuesto de Sociedades (Mod. 200).</DocListItem>
                                <DocListItem>Resumen anual IVA (Mod. 390) y trimestrales (Mod. 303).</DocListItem>
                                <DocListItem>Certificado de cuenta bancaria de la sociedad.</DocListItem>
                            </ul>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-2">VEHÍCULO</h4>
                            <ul className="space-y-1 text-slate-600">
                                <DocListItem><strong>Matriculado:</strong> Ficha Técnica y Permiso de Circulación.</DocListItem>
                                <DocListItem><strong>Importado:</strong> Ficha Técnica Española.</DocListItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignatureAppModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative animate-fade-in-up border border-slate-200">
                <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 hover:text-black transition-colors border border-slate-200">
                    <XIcon className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-light text-black tracking-tight mb-4">Firma APP móvil</h3>
                <p className="text-slate-600 mb-6">Descarga la app "Firma Digital CaixaBank P&C" para firmar el contrato.</p>
                <StoreButtons
                    appStoreUrl="https://apps.apple.com/es/app/firma-digital-caixabank-p-c/id1119199086"
                    googlePlayUrl="https://play.google.com/store/apps/details?id=com.ccf.firmadigital&hl=es&pli=1"
                    layout="responsive"
                    combinedImageUrl="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/in_one_android_app.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2luX29uZV9hbmRyb2lkX2FwcC5wbmciLCJpYXQiOjE3NzY2ODM5MzMsImV4cCI6ODgxNzY1OTc1MzN9.81PRo2a83gqEgqMvZuz9KMeySPY4DDyNTyOMwE7NMrM"
                />
            </div>
        </div>
    );
};

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ onNavigate }) => {
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // This is a mock. A real implementation would fetch status.
  const [status, setStatus] = useState<'approved' | 'studying' | 'denied' | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
      if (!identifier) return;
      setIsLoading(true);
      setTimeout(() => {
          // Mock logic to determine status
          if (identifier.toLowerCase().includes('a')) setStatus('approved');
          else if (identifier.toLowerCase().includes('e')) setStatus('studying');
          else if (identifier.toLowerCase().includes('d')) setStatus('denied');
          else setStatus(null);
          setIsLoading(false);
      }, 1000);
  };

  const StatusCard: React.FC<{ icon: React.ReactElement<IconProps>, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-8 text-left animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-full bg-slate-50 border border-slate-100">
                  {icon}
              </div>
              <h3 className="text-2xl font-light text-black tracking-tight">{title}</h3>
          </div>
          <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
              {children}
          </div>
      </div>
  );
  
  return (
      <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
          <div className="max-w-7xl mx-auto">
              <PageHeader title="Estado de la Solicitud" descriptiveText="Consulta el estado actual de tus operaciones." showBackButton={false} onGoBack={() => {}} />

              <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mt-10">
                  <h3 className="text-xl font-light text-black tracking-tight text-center mb-6">Consultar Solicitud</h3>
                  <div className="flex items-center gap-2">
                      <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="Introduce DNI o Nº de Solicitud"
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                      />
                      <button onClick={handleSearch} disabled={isLoading || !identifier} className="bg-black text-white p-3 rounded-none hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 transition-colors">
                          <SearchIcon className="w-5 h-5" />
                      </button>
                  </div>

                  {isLoading && <p className="text-center mt-4 text-slate-500 text-sm font-bold uppercase tracking-widest">Buscando...</p>}
                  
                  {status === 'approved' && (
                      <StatusCard icon={<CheckIcon className="w-8 h-8 text-black" />} title="APROBADA / PRE-AUTORIZADA">
                          <p><strong>¡Buenas noticias!</strong> La solicitud ha superado los criterios iniciales de riesgo y está pre-aprobada.</p>
                          <p><strong>Siguiente paso:</strong> Debes subir toda la documentación solicitada para que el equipo de validación pueda verificarla. La aprobación final depende de que la documentación sea correcta y completa.</p>
                          <div className="flex gap-4 mt-6 not-prose">
                              <button onClick={() => setIsDocModalOpen(true)} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">Ver documentación necesaria</button>
                              <button onClick={() => onNavigate('documentSubmission')} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">Enviar documentación &rarr;</button>
                          </div>
                          <p className="mt-6">Una vez validada, podrás proceder a la firma del contrato.</p>
                           <div className="mt-4 not-prose">
                              <button onClick={() => setIsSignModalOpen(true)} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">Firmar con la APP &rarr;</button>
                          </div>
                      </StatusCard>
                  )}
                  {status === 'studying' && (
                      <StatusCard icon={<WarningIcon className="w-8 h-8 text-black" />} title="EN ESTUDIO">
                           <p>La operación está siendo analizada por el equipo de analistas.</p>
                           <p><strong>¿Qué debo hacer?</strong> Ten paciencia. Consulta el estado en la plataforma o en la APP "Mi Gestor" por si se solicita documentación adicional. Si es necesario, el equipo de soporte se pondrá en contacto contigo. Para agilizar el proceso, asegúrate de haber enviado toda la documentación necesaria desde el principio.</p>
                           <div className="flex gap-4 mt-6 not-prose">
                              <button onClick={() => setIsDocModalOpen(true)} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">Ver documentación necesaria</button>
                              <button onClick={() => onNavigate('documentSubmission')} className="text-xs font-bold uppercase tracking-widest text-black hover:underline">Enviar documentación &rarr;</button>
                          </div>
                      </StatusCard>
                  )}
                  {status === 'denied' && (
                      <StatusCard icon={<XIcon className="w-8 h-8 text-black" />} title="DENEGADA">
                          <p>La solicitud no cumple con los criterios de aceptación y política de riesgos de la entidad.</p>
                          <p><strong>¿Qué debo hacer?</strong> La decisión es definitiva y <strong>no se puede recurrir</strong>. Es importante comunicar esto al cliente con transparencia para no generar falsas expectativas. No se proporcionarán los motivos exactos de la denegación para cumplir con la normativa de protección de datos.</p>
                      </StatusCard>
                  )}

              </div>

              <div className="mt-16 text-center">
                  <h3 className="text-2xl font-light text-black tracking-tight">¿Prefieres consultar desde la APP?</h3>
                  <p className="text-slate-500 mt-2 mb-8 max-w-md mx-auto">Descarga "Mi Gestor de Operaciones" para tener toda la información de tus solicitudes en la palma de tu mano.</p>
                  <button onClick={() => onNavigate('operationsManager')} className="bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">
                      Ir a Mi Gestor de Operaciones
                  </button>
              </div>
          </div>
          <DocumentationNeededModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} />
          <SignatureAppModal isOpen={isSignModalOpen} onClose={() => setIsSignModalOpen(false)} />
      </div>
  );
};

export default ApplicationStatus;
