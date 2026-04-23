
import React, { useState, useRef } from 'react';
import { 
    ExternalLinkIcon, 
    ShieldCheckIcon, 
    TrainingIcon, 
    DownloadIcon, 
    EmailIcon, 
    PhoneIcon, 
    WarningIcon,
    EuroIcon,
    StarIcon,
    FileTextIcon,
    LightbulbIcon,
    PrintIcon,
    XIcon
} from './Icons.tsx';
import type { IconProps } from './Icons.tsx';

interface PdfViewerModalProps {
    src: string;
    downloadUrl: string;
    onClose: () => void;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ src, downloadUrl, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4 sm:p-6" aria-modal="true" role="dialog">
      
      {/* Container del PDF - Ocupa el espacio disponible */}
      <div className="w-full max-w-5xl flex-grow bg-white rounded-xl overflow-hidden shadow-2xl relative">
        <iframe ref={iframeRef} src={src} className="w-full h-full border-0" title="Visor de PDF: Guía del Curso de Seguros" />
      </div>

      {/* Barra de Botones - Movida ABAJO y Centrada para mejor ergonomía */}
      <div className="w-full max-w-5xl flex justify-center items-center mt-6 gap-4 flex-wrap">
        <a 
            href={downloadUrl} 
            download="Guia_Realizacion_Curso_Seguros.pdf"
            className="bg-white text-black font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-100 transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          <DownloadIcon className="w-4 h-4" /> Descargar
        </a>
        <button 
            onClick={handlePrint} 
            className="bg-white text-black font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-100 transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          <PrintIcon className="w-4 h-4" /> Imprimir
        </button>
        <button 
            onClick={onClose} 
            className="bg-black text-white font-bold py-4 px-10 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors inline-flex items-center gap-2 shadow-xl"
        >
          <XIcon className="w-4 h-4" /> Cerrar
        </button>
      </div>
    </div>
  );
};

const BenefitCard: React.FC<{ icon: React.ReactElement<IconProps>, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
    <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 text-black flex-shrink-0">{React.cloneElement(icon, { className: 'w-full h-full' })}</div>
        <h4 className="font-bold text-black text-xs uppercase tracking-widest">{title}</h4>
    </div>
    <div className="text-xs text-slate-600 flex-grow leading-relaxed">{children}</div>
  </div>
);

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
    <button 
      onClick={onClick}
      className={`w-full inline-flex items-center justify-center bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-slate-800 transition-colors text-center text-xs uppercase tracking-widest ${className}`}
    >
      {children} <ExternalLinkIcon className="w-4 h-4 ml-2 flex-shrink-0" />
    </button>
);


interface AnnualTrainingProps {
  onNavigate: (view: any, data?: any) => void;
}

const AnnualTraining: React.FC<AnnualTrainingProps> = ({ onNavigate }) => {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  
  const inscriptionUrl = "/proxy/formacion/registro.php?auth=2b7710b8-7368-4996-be05-6775d9962c5e";
  const courseAccessUrl = "/proxy/formacion2/";
  const guideDownloadUrl = "https://drive.google.com/uc?export=download&id=124kd4puKmarVVJx8OfDkp4odkcBlUQyJ";
  const guideEmbedUrl = "https://drive.google.com/file/d/124kd4puKmarVVJx8OfDkp4odkcBlUQyJ/preview";

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {isPdfViewerOpen && <PdfViewerModal src={guideEmbedUrl} downloadUrl={guideDownloadUrl} onClose={() => setIsPdfViewerOpen(false)} />}
      
      <div className="mt-10 flex justify-center">
          <div className="bg-black text-white p-8 rounded-2xl shadow-md max-w-2xl w-full text-center">
              <h2 className="text-2xl font-light tracking-tight">ASNEF CBP Formación</h2>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-xl font-bold text-black leading-snug">
            Curso obligatorio de adaptación a normativa comunitaria para colaboradores en la distribución de seguros de entidades financieras.
          </h2>
          
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                Si participas directamente en la distribución de seguros en España, debes saber que toda tu actividad, las obligaciones que debes cumplir y los requisitos que debes reunir se regula ahora por la nueva "Norma sobre Distribución de Seguros y Reaseguros Privados", que sustituye a la Ley 26/2006 de Mediación de Seguros y Reaseguros Privados que queda derogada.
              </p>
              <p>
                Con la nueva Ley de Distribución de Seguros, existe la obligatoriedad de realizar los cursos de formación para obtener la acreditación que te permita participar en la distribución de seguros.
              </p>
          </div>
          
          <p className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
            *La vigencia de esta formación es ANUAL, por lo que cada año deberás renovar la certificación. Desde CaixaBank Payments & Consumer, te facilitamos esta formación de forma totalmente gratuita, a través de la plataforma de ASNEF & CBP.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-100">
              <ActionButton onClick={() => window.open('https://www.asnef-cbp-formacion.com/registro.php?idEmpresa=6&origen=1', '_blank', 'noopener,noreferrer')}>Inscripción en Plataforma</ActionButton>
              <ActionButton onClick={() => window.open('https://asnef-cbp-formacion.elnirg.net/login.php', '_blank', 'noopener,noreferrer')}>Acceso a la Plataforma de Formación</ActionButton>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="font-bold text-black text-xs uppercase tracking-widest mb-4">Plataforma de asistencia al alumno:</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-3"><EmailIcon className="w-5 h-5 text-black" /> <strong>Buzón de correo:</strong> <a href="mailto:asnef_cbp_comunicacion@cbp-espana.eu" className="text-black hover:underline font-mono">asnef_cbp_comunicacion@cbp-espana.eu</a></p>
              <p className="flex items-center gap-3"><PhoneIcon className="w-5 h-5 text-black" /> <strong>Teléfono:</strong> <a href="tel:919543888" className="text-black hover:underline font-mono">91 954 38 88</a></p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mt-6 flex flex-col items-start gap-4">
            <div className="flex items-start gap-4">
              <WarningIcon className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-yellow-800">Si ya has realizado la formación con otra Entidad Financiera, tendrás que convalidarla con CaixaBank P&C para el año en curso.</h4>
                <p className="text-sm text-yellow-700 mt-2 leading-relaxed">
                  Por favor, entra a través del siguiente enlace, cumplimentado los campos requeridos. Tu formación será convalidada para el presente año, y recibirás en tu correo el diploma acreditativo.
                </p>
              </div>
            </div>
            <div className="w-full">
              <ActionButton onClick={() => onNavigate('externalViewer', { url: inscriptionUrl, title: 'Convalidar Formación Anual' })} className="mt-2 bg-yellow-600 hover:bg-yellow-700">Convalidar Formación Anual</ActionButton>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-light text-black text-center mb-8 tracking-tight">¿Por qué esta formación?</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BenefitCard icon={<TrainingIcon />} title="Obligatoria">
                        <p>Para cumplir con la Ley de 26/2006 de Mediación de Seguros, que exige una formación mínima reglada para todos los que trabajan con seguros.</p>
                    </BenefitCard>
                    <BenefitCard icon={<ShieldCheckIcon />} title="Riesgo">
                        <p>Minimiza el riesgo de sanciones o inhabilitación para la distribución de seguros de cualquier tipo.</p>
                    </BenefitCard>
                    <BenefitCard icon={<StarIcon />} title="Calidad">
                        <p>Mejora la calidad del servicio a los clientes y refuerza la imagen de la empresa, disponiendo de un equipo certificado por ASNEF.</p>
                    </BenefitCard>
                    <BenefitCard icon={<EuroIcon />} title="Coste">
                        <p>Te ofrecemos la oportunidad de realizar esta formación y obtener la certificación necesaria sin coste alguno.</p>
                    </BenefitCard>
                    <BenefitCard icon={<LightbulbIcon />} title="Motivación">
                        <p>Contribuye a la satisfacción personal y profesional, aportando herramientas para el día a día y una formación curricular valiosa.</p>
                    </BenefitCard>
                    <BenefitCard icon={<FileTextIcon />} title="A Medida">
                        <p>Una formación diseñada específicamente para las necesidades y particularidades de este sector.</p>
                    </BenefitCard>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hidden md:block">
                <button 
                  onClick={() => setIsPdfViewerOpen(true)}
                  className="w-full inline-flex items-center justify-center bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-slate-800 transition-colors text-center text-xs uppercase tracking-widest"
                >
                  <FileTextIcon className="w-5 h-5 mr-3" />
                  Ver la Guía del Curso
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 block md:hidden">
              <h3 className="text-xl font-light text-black text-center mb-6 tracking-tight">Guía Realización Curso de Seguros</h3>
              <div className="aspect-[3/4] border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <iframe 
                      src={guideEmbedUrl}
                      className="w-full h-full border-0"
                      title="Guía del Curso de Seguros"
                  />
              </div>
              <a 
                  href={guideDownloadUrl}
                  download="Guia_Realizacion_Curso_Seguros.pdf"
                  className="mt-6 w-full inline-flex items-center justify-center bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-slate-800 transition-colors text-center text-xs uppercase tracking-widest"
              >
                  <DownloadIcon className="w-5 h-5 mr-3" />
                  Descargar Guía
              </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnnualTraining;
