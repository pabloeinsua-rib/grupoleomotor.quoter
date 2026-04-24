import React, { useState } from 'react';
import { DownloadIcon, DevicePhoneMobileIcon } from './Icons.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';

const InPersonDigitalSignature: React.FC = () => {
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    const iosQrUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA%20APP%20FIRMA/NUEVA_APP_FIRMA_IOS.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBIEFQUCBGSVJNQS9OVUVWQV9BUFBfRklSTUFfSU9TLnBuZyIsImlhdCI6MTc3NzA1MDA1MywiZXhwIjoyNjQwOTYzNjUzfQ.geenUz6PmX3ssUMorwDfYxWr_5B11CTKDyLtyL1IbFM";
    const androidQrUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA%20APP%20FIRMA/NUEVA_APP_FIRMA_ANDROID.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBIEFQUCBGSVJNQS9OVUVWQV9BUFBfRklSTUFfQU5EUk9JRC5wbmciLCJpYXQiOjE3NzcwNTAwNzMsImV4cCI6MjY0MDk2MzY3M30.yXS22TgihpH-tTY-SxNvbyqZ564jSDi2d2u9bYc62R0";
    
    const appStoreBadge = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/appstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FwcHN0b3JlLWljb24uc3ZnIiwiaWF0IjoxNzc2Njg1OTE2LCJleHAiOjI2NDA1OTk1MTZ9.X2lDiieCfgYS79zAQU3BBct6pG9z_TR3U1xISYS4gb0";
    const googlePlayBadge = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/playstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL3BsYXlzdG9yZS1pY29uLnN2ZyIsImlhdCI6MTc3NjY4NTk2MiwiZXhwIjoyNjQwNTk5NTYyfQ.6qQ2BCRv_RvwmuIOgFsdeheg33qxSEs79kJQ3Bmo_j0";
    
    const centerLogoUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20NUEVA%20APP%20FIRMA%20DIGITAL%20PRESENCIAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIE5VRVZBIEFQUCBGSVJNQSBESUdJVEFMIFBSRVNFTkNJQUwud2VicCIsImlhdCI6MTc3NjY4Mjk3MSwiZXhwIjoyNjQwNTk2NTcxfQ.z2D6OIslucUxNCJiUnSw1UHEw0IczT-ho_Man6ugLSk";
    const guidePdfUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/20260226_Proceso%20firma%20nueva%20app%20captacion%20cpc_%20v3.0.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDLzIwMjYwMjI2X1Byb2Nlc28gZmlybWEgbnVldmEgYXBwIGNhcHRhY2lvbiBjcGNfIHYzLjAucGRmIiwiaWF0IjoxNzc2NjgzMDUzLCJleHAiOjI2NDA1OTY2NTN9.Zusk9XF8FODa20kJNLZb1AOzQpUiW0FuRYsLpAoeJRE";

    return (
        <div className="w-full flex items-center justify-center py-10 px-4">
            <div className="max-w-4xl w-full bg-white p-12 rounded-2xl shadow-2xl border border-slate-200 animate-fade-in-up">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-light text-slate-800 tracking-tight mb-6">Descarga la App inOne</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-sm font-medium">
                        Propónle a tu cliente que descargue la <strong>APP inOne en su móvil</strong>, para que pueda tener a mano toda la información que necesita. Es la herramienta definitiva para que gestione fácilmente sus contratos de crédito y realice todas sus gestiones en un solo lugar.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    {/* iOS Section */}
                    <div className="flex flex-col items-center gap-6 flex-1">
                        <img src={appStoreBadge} alt="App Store" className="h-14 object-contain" />
                        <div className="bg-white p-3 border border-slate-100 shadow-sm rounded-lg">
                            <img src={iosQrUrl} alt="iOS QR" className="w-32 h-32 object-contain" />
                        </div>
                    </div>

                    {/* Center Logo */}
                    <div className="flex flex-col items-center justify-center px-4">
                         <div className="bg-[#3b454e] p-6 rounded-none shadow-md">
                            <img src={centerLogoUrl} alt="CaixaBank P&C" className="w-16 h-16 object-contain" />
                            <div className="mt-2 text-center">
                                <p className="text-white text-[8px] font-bold uppercase tracking-widest leading-tight">CaixaBank</p>
                                <p className="text-white text-[6px] font-medium uppercase tracking-[0.2em] leading-tight opacity-70">Payments & Consumer</p>
                            </div>
                         </div>
                    </div>

                    {/* Android Section */}
                    <div className="flex flex-col items-center gap-6 flex-1">
                        <img src={googlePlayBadge} alt="Google Play" className="h-14 object-contain" />
                        <div className="bg-white p-3 border border-slate-100 shadow-sm rounded-lg">
                            <img src={androidQrUrl} alt="Android QR" className="w-32 h-32 object-contain" />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => setIsPdfOpen(true)}
                        className="flex items-center gap-3 bg-black text-white font-bold py-4 px-10 rounded-none hover:bg-slate-800 transition-all shadow-lg uppercase tracking-[0.2em] text-xs"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        MOSTRAR GUÍA RÁPIDA INONE
                    </button>
                </div>
                
                <PdfViewerModal
                    isOpen={isPdfOpen}
                    src={guidePdfUrl}
                    filename="Guia_APP_inOne_CaixaBankPC.pdf"
                    onClose={() => setIsPdfOpen(false)}
                />
            </div>
        </div>
    );
};

export default InPersonDigitalSignature;
