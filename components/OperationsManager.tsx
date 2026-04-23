import React, { useState, useRef } from 'react';
import { DownloadIcon, XIcon } from './Icons.tsx';

const OperationsManager: React.FC = () => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const pdfIframeRef = useRef<HTMLIFrameElement>(null);

  const appStoreUrl = "https://apps.apple.com/es/app/mi-gestor-caixabank-p-c/id1455325251";
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.caixabankpc.mimovil";
  const appIcon = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/MI%20GESTOR%20DE%20OPERACIONES/ICONO%20MI%20GESTOR.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01JIEdFU1RPUiBERSBPUEVSQUNJT05FUy9JQ09OTyBNSSBHRVNUT1Iud2VicCIsImlhdCI6MTc3Njg3NzA2MywiZXhwIjoyNjQwNzkwNjYzfQ.n_PUsaifR-3UsHCmInFmERwS7ffXJOKAtxMjyMaqbPw";
  
  const appStoreBadgeUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/appstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FwcHN0b3JlLWljb24uc3ZnIiwiaWF0IjoxNzc2OTQ1NzUyLCJleHAiOjI2NDA4NTkzNTJ9.1X6L9D9BHoa95GRm9jRgqv1M_qxFe-DEYEJX0ieYoO0";
  const googlePlayBadgeUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/playstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL3BsYXlzdG9yZS1pY29uLnN2ZyIsImlhdCI6MTc3Njk0NTc5NiwiZXhwIjoyNjQwODU5Mzk2fQ.jRgiy29-RdrBRZTlpZMsBW93s2F05fEE-faNJ_Mr1PE";
  
  const pdfUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/MI%20GESTOR%20DE%20OPERACIONES/GUIA%20RAPIDA%20-%20Mi%20Gestor%20de%20Operaciones.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01JIEdFU1RPUiBERSBPUEVSQUNJT05FUy9HVUlBIFJBUElEQSAtIE1pIEdlc3RvciBkZSBPcGVyYWNpb25lcy5wZGYiLCJpYXQiOjE3NzY5NDU5MDIsImV4cCI6MjY0MDg1OTUwMn0.l9Km4eJjb-m1BYt_dO3J0nkBeF3CpG1HEyXjmlvlwEY";
  const heroImage = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/MI%20GESTOR%20DE%20OPERACIONES/FOTO%20MI%20GESTOR%20DE%20OPERACIONES.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01JIEdFU1RPUiBERSBPUEVSQUNJT05FUy9GT1RPIE1JIEdFU1RPUiBERSBPUEVSQUNJT05FUy5wbmciLCJpYXQiOjE3NzY5NDU5MzQsImV4cCI6MjY0MDg1OTUzNH0.OQX7D-lnNJH3n2U-sx6az1D4DRD6w1tb7WNhImKx6-c";
  
  const handlePrint = () => {
    if (pdfIframeRef.current && pdfIframeRef.current.contentWindow) {
      pdfIframeRef.current.contentWindow.print();
    } else {
        window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 w-full max-w-6xl mx-auto">
      <div className="bg-white p-8 sm:p-12 shadow-sm border border-slate-100 rounded-xl w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-light text-black tracking-tight mb-4 text-center">Descarga la App Mi Gestor de Operaciones</h2>
        <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed text-sm">
          Descarga la APP en tu Smartphone.
          <br/>
          Podrás ver el estado de tus solicitudes en tiempo real, y también te permite descargar las cartas de pago de la solicitudes formalizadas.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 mb-12">
            {/* Left: App Store */}
            <div className="flex flex-col items-center gap-6">
                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src={appStoreBadgeUrl} alt="Download on the App Store" className="h-12 w-auto" />
                </a>
                <div className="border border-slate-200 p-2 shadow-sm bg-white">
                    <img src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/MI%20GESTOR%20DE%20OPERACIONES/qr-code%20MIGESTOR%20IOS.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01JIEdFU1RPUiBERSBPUEVSQUNJT05FUy9xci1jb2RlIE1JR0VTVE9SIElPUy5wbmciLCJpYXQiOjE3NzY5NDYzODQsImV4cCI6MjY0MDg1OTk4NH0.YUDKtuLV2T_3rkNUhKxmF7igaiSp1EYf0iaOpmuoAUE" alt="QR iOS" className="w-28 h-28 object-contain" />
                </div>
            </div>

            {/* Middle: App Icon */}
            <div className="flex flex-col items-center">
                <img src={appIcon} alt="Icono App Mi Gestor" className="w-32 h-32 md:w-36 md:h-36 object-contain" />
            </div>

            {/* Right: Google Play */}
            <div className="flex flex-col items-center gap-6">
                 <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <img src={googlePlayBadgeUrl} alt="Get it on Google Play" className="h-12 w-auto" />
                </a>
                <div className="border border-slate-200 p-2 shadow-sm bg-white">
                    <img src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/MI%20GESTOR%20DE%20OPERACIONES/qr-code%20MI%20GESTOR%20ANDROID.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01JIEdFU1RPUiBERSBPUEVSQUNJT05FUy9xci1jb2RlIE1JIEdFU1RPUiBBTkRST0lELnBuZyIsImlhdCI6MTc3Njk0NjQxOSwiZXhwIjoyNjQwODYwMDE5fQ.gP6rl38TFeH775WkCGmYWz41GoVu4olGqZ0KwTOwL44" alt="QR Android" className="w-28 h-28 object-contain" />
                </div>
            </div>
        </div>

        {/* Bottom Button */}
        <div className="flex flex-col items-center mt-8 space-y-12">
            <button 
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center justify-center gap-3 bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-[0.15em] py-4 px-10 transition-colors rounded-none w-full max-w-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>MOSTRAR GUÍA RÁPIDA MI GESTOR</span>
            </button>
            
            {/* Hero Image */}
            <div className="w-full">
                <img src={heroImage} alt="Mi Gestor de Operaciones" className="w-full h-auto object-contain border border-slate-200 p-2 bg-white" />
            </div>
        </div>
      </div>
      
      {/* PDF Modal */}
      {isPdfModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm" onClick={() => setIsPdfModalOpen(false)}>
              <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col bg-slate-100 rounded-none overflow-hidden" onClick={e => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
                        <h3 className="font-bold text-sm tracking-widest uppercase text-black">Guía Rápida - Mi Gestor</h3>
                        <div className="flex items-center gap-4">
                            <button onClick={handlePrint} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Imprimir
                            </button>
                            <a href={pdfUrl} download="Guia_Rapida_Mi_Gestor.pdf" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors flex items-center gap-2">
                                <DownloadIcon className="w-4 h-4" />
                                Descargar
                            </a>
                            <button onClick={() => setIsPdfModalOpen(false)} className="bg-black text-white p-2 hover:bg-slate-800 transition-colors">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {/* PDF Content */}
                    <div className="flex-1 w-full bg-slate-200 p-4">
                        <iframe 
                            ref={pdfIframeRef}
                            src={`${pdfUrl}#toolbar=0`} 
                            className="w-full h-full shadow-lg bg-white border border-slate-300" 
                            title="PDF Viewer" 
                        />
                    </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default OperationsManager;