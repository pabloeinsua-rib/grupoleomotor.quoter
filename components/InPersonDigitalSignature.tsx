import React, { useState } from 'react';
import { DownloadIcon, DevicePhoneMobileIcon } from './Icons.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';

const InPersonDigitalSignature: React.FC = () => {
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    const appStoreUrl = "https://apps.apple.com/es/app/firma-digital-caixabank-p-c/id1119199086";
    const appIconUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20NUEVA%20APP%20FIRMA%20DIGITAL%20PRESENCIAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIE5VRVZBIEFQUCBGSVJNQSBESUdJVEFMIFBSRVNFTkNJQUwud2VicCIsImlhdCI6MTc3NjY4Mjk3MSwiZXhwIjoyNjQwNTk2NTcxfQ.z2D6OIslucUxNCJiUnSw1UHEw0IczT-ho_Man6ugLSk";
    const guidePdfUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/20260226_Proceso%20firma%20nueva%20app%20captacion%20cpc_%20v3.0.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDLzIwMjYwMjI2X1Byb2Nlc28gZmlybWEgbnVldmEgYXBwIGNhcHRhY2lvbiBjcGNfIHYzLjAucGRmIiwiaWF0IjoxNzc2NjgzMDUzLCJleHAiOjI2NDA1OTY2NTN9.Zusk9XF8FODa20kJNLZb1AOzQpUiW0FuRYsLpAoeJRE";

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 mt-10">
                <div className="text-center border-b border-slate-200 pb-6 mb-8">
                    <DevicePhoneMobileIcon className="w-16 h-16 text-black mx-auto mb-4" />
                    <h2 className="text-3xl font-light text-black tracking-tight">Firma APP Móvil Presencial</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">
                        Firma biométrica para operaciones presenciales
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-10 flex-wrap">
                  {/* App Icon */}
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="block transform hover:scale-105 transition-transform duration-300">
                    <div className="rounded-3xl shadow-lg w-48 h-48 overflow-hidden bg-white flex items-center justify-center border border-slate-100 p-2">
                        <img src={appIconUrl} alt="Firma Digital App" className="w-full h-full object-contain" />
                    </div>
                  </a>
                  
                  {/* Download Button */}
                  <button 
                    onClick={() => setIsPdfOpen(true)}
                    className="flex flex-col items-center justify-center bg-black p-6 rounded-none text-center font-bold text-white hover:bg-slate-800 transition-colors transform hover:scale-105 duration-300 w-48 h-48 shadow-lg border border-black uppercase tracking-widest"
                  >
                    <DownloadIcon className="w-12 h-12 mb-3" />
                    <span className="text-xs">Descargar Guía en PDF</span>
                  </button>
                </div>
                
                <PdfViewerModal
                    isOpen={isPdfOpen}
                    src={guidePdfUrl}
                    filename="Guia_APP_Firma_Digital_Presencial.pdf"
                    onClose={() => setIsPdfOpen(false)}
                />
            </div>
        </div>
    );
};

export default InPersonDigitalSignature;
