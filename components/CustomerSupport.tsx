
import React, { useState } from 'react';
import { PhoneIcon, ExternalLinkIcon, EmailIcon, DownloadIcon } from './Icons.tsx';

// Need to create a specific icon for the modal close and share operations
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PrintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);


const Card: React.FC<{ className?: string, children: React.ReactNode }> = ({ className, children }) => (
    <div className={`bg-white border border-slate-100 p-8 rounded-none shadow-xl ${className}`}>
        {children}
    </div>
);

const CustomerSupport: React.FC = () => {
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const appStoreUrl = "https://apps.apple.com/es/app/inone-by-caixabank-p-c/id1457190317";
    const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.caixabankpc.inone&hl=es_419";
    const manualUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/Manual%20InOne%20Reducido_CPC.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL01hbnVhbCBJbk9uZSBSZWR1Y2lkb19DUEMucGRmIiwiaWF0IjoxNzc2ODczNTEyLCJleHAiOjI2NDA3ODcxMTJ9.BW8P1FLuYX77SGx9koPwIgNnZQvxazfXjKFc5yW_NoU";
    const appLogoUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/ICONO%20APP%20INONE%20CLIENTE%20FINAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL0lDT05PIEFQUCBJTk9ORSBDTElFTlRFIEZJTkFMLndlYnAiLCJpYXQiOjE3NzY4NzQwOTEsImV4cCI6MjY0MDc4NzY5MX0._0Au_B9BaSeOSqzysUdKpbCOET1omjFzvt2lF35iL6Q";
    const appStoreIcon = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/appstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FwcHN0b3JlLWljb24uc3ZnIiwiaWF0IjoxNzc2ODczMzIwLCJleHAiOjI2NDA3ODY5MjB9.XSkViHtOLC1_2KH0QvjcgvKCR8y6MhyChfviAPmjoAw";
    const playStoreIcon = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/playstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL3BsYXlzdG9yZS1pY29uLnN2ZyIsImlhdCI6MTc3Njg3MzQwNywiZXhwIjoyNjQwNzg3MDA3fQ.aTmLQbDvHJhtB9H4MX0JCb0qgn3mbtuQw-EYZ7xc7d8";
    const qrIos = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/qr-code%20INONE%20IOS.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL3FyLWNvZGUgSU5PTkUgSU9TLnBuZyIsImlhdCI6MTc3Njg3MzM1NiwiZXhwIjoyNjQwNzg2OTU2fQ.zuH8JP5YzojPlky9A1NqC9cs2E_y3IxHEkZt0iuuFww";
    const qrAndroid = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS/qr-code%20INONE%20ANDROID.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TL3FyLWNvZGUgSU5PTkUgQU5EUk9JRC5wbmciLCJpYXQiOjE3NzY4NzM0MzksImV4cCI6MjY0MDc4NzAzOX0.9lon8Xb9LU29djaxSl3ra3GikcpBxzg-DUyM6uQYhzY";

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Guía Rápida inOne',
                    url: manualUrl
                });
            } catch (err) {
                console.log('User cancelled share or share failed');
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(manualUrl);
            alert("Enlace copiado al portapapeles.");
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto bg-slate-50 min-h-screen p-8 rounded-2xl border border-slate-200 mt-10 shadow-2xl">
                
                {/* Header Section */}
                <div className="text-center border-b border-slate-200 pb-10 mb-10">
                    <h2 className="text-4xl font-light text-black tracking-tight mb-4">Canales de Atención para tus Clientes</h2>
                    <div className="text-slate-600 max-w-3xl mx-auto space-y-4 text-sm leading-relaxed">
                        <p className="font-medium text-lg">
                            Ponemos a disposición de tus clientes un Área Privada Web, una App móvil, un Teléfono Gratuito y un Buzón de Correo.
                        </p>
                        <p>
                            Para cualquier consulta sobre copias, cambios, cancelaciones, o información de su préstamo, <strong>deben utilizar exclusivamente estos medios</strong>.
                        </p>
                        <div className="bg-red-50 p-4 border-l-4 border-red-600 inline-block mt-6">
                            <p className="font-bold text-red-800 text-xs tracking-wide uppercase">
                                Nunca proporciones a tus clientes el Contacto de tu Gestor Comercial
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
                    {/* Private Area Card */}
                    <Card className="flex flex-col h-full items-center text-center">
                        <ExternalLinkIcon className="w-10 h-10 text-black mb-6" />
                        <h3 className="text-xl font-bold text-black mb-3">Área Privada</h3>
                        <p className="text-sm text-slate-500 mb-8 flex-grow leading-relaxed">Consulta contratos, modifica datos y gestiones desde la web.</p>
                        <a 
                            href="https://www.caixabankpc.com/es/area-privada-particulares"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full inline-flex items-center justify-center bg-black text-white font-bold py-3 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
                        >
                            Acceder a la Web
                        </a>
                    </Card>

                    {/* Phone Card */}
                    <Card className="flex flex-col h-full items-center text-center">
                        <PhoneIcon className="w-10 h-10 text-black mb-6" />
                        <h3 className="text-xl font-bold text-black mb-2">Llamada Gratuita</h3>
                        <p className="text-3xl font-light text-black my-3 tracking-tight flex-grow flex items-center justify-center">900 101 601</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-8">L a S de 9:00 a 21:00h</p>
                        <a 
                            href="tel:900101601"
                            className="mt-auto w-full inline-flex items-center justify-center bg-white border border-black text-black font-bold py-3 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-black hover:text-white transition-colors"
                        >
                            Llamar
                        </a>
                    </Card>

                    {/* Email Card */}
                    <Card className="flex flex-col h-full items-center text-center">
                        <EmailIcon className="w-10 h-10 text-black mb-6" />
                        <h3 className="text-xl font-bold text-black mb-4">Correo Electrónico</h3>
                        <p className="text-black font-semibold text-lg mb-8 tracking-tight flex-grow flex items-center justify-center">hola@<br className="sm:hidden" />caixabankpc.com</p>
                        <a 
                            href="mailto:hola@caixabankpc.com"
                            className="mt-auto w-full inline-flex items-center justify-center bg-white border border-slate-300 text-slate-700 font-bold py-3 px-6 text-xs uppercase tracking-widest rounded-none hover:border-black hover:bg-black hover:text-white transition-colors"
                        >
                            Enviar Email
                        </a>
                    </Card>
                </div>

                {/* App inOne Section */}
                <div className="bg-white border border-slate-200 p-10 rounded-xl shadow-xl">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-light text-black tracking-tight mb-4">Descarga la App inOne</h3>
                        <p className="text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">
                            <strong>Propónle a tu cliente que descargue la APP inOne en su móvil</strong>, para que pueda tener a mano toda la información que necesita. Es la herramienta definitiva para que gestione fácilmente sus contratos de crédito y realice todas sus gestiones en un solo lugar.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
                        {/* QR iOS */}
                        <div className="flex flex-col items-center">
                            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="mb-4 hover:opacity-80 transition-opacity">
                                <img src={appStoreIcon} alt="Download on the App Store" className="h-12" />
                            </a>
                            <div className="w-32 h-32 bg-white border border-slate-200 p-2 shadow-sm">
                                <img src={qrIos} alt="QR Code iOS" className="w-full h-full object-contain" />
                            </div>
                        </div>

                        {/* Center Logo */}
                        <div className="hidden md:flex flex-col items-center pt-8">
                             <img src={appLogoUrl} alt="App Icon" className="w-24 h-24 object-contain opacity-80" />
                        </div>

                        {/* QR Android */}
                        <div className="flex flex-col items-center">
                            <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="mb-4 hover:opacity-80 transition-opacity">
                                <img src={playStoreIcon} alt="Get it on Google Play" className="h-12" />
                            </a>
                            <div className="w-32 h-32 bg-white border border-slate-200 p-2 shadow-sm">
                                <img src={qrAndroid} alt="QR Code Android" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex justify-center">
                        <button 
                            onClick={() => setIsPdfModalOpen(true)}
                            className="inline-flex items-center justify-center gap-3 bg-black text-white font-bold py-4 px-10 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors shadow-lg w-full md:w-auto"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            Mostrar Guía Rápida inOne
                        </button>
                    </div>
                </div>

            </div>

             {/* Modal PDF */}
             {isPdfModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
                    <div className="bg-white w-full max-w-4xl h-[90vh] flex flex-col rounded-lg shadow-2xl relative overflow-hidden">
                        
                        {/* Modal Toolbar */}
                        <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-black">
                             <h3 className="font-medium text-sm tracking-wider uppercase">Guía inOne</h3>
                             <div className="flex items-center gap-2">
                                <a 
                                    href={manualUrl} 
                                    download="Guia_Rapida_inOne.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-white/20 rounded-none transition-colors"
                                    title="Descargar PDF"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </a>
                                <button 
                                    onClick={() => {
                                        const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
                                        iframe?.contentWindow?.print();
                                    }}
                                    className="p-2 hover:bg-white/20 rounded-none transition-colors"
                                    title="Imprimir"
                                >
                                    <PrintIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleShare}
                                    className="p-2 hover:bg-white/20 rounded-none transition-colors"
                                    title="Compartir link"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                                <div className="w-px h-6 bg-slate-700 mx-2"></div>
                                <button 
                                    onClick={() => setIsPdfModalOpen(false)}
                                    className="p-2 bg-red-600 hover:bg-red-500 rounded-none transition-colors text-white"
                                    title="Cerrar"
                                >
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                             </div>
                        </div>

                        {/* Modal Content / Iframe */}
                        <div className="flex-1 w-full bg-slate-200">
                            <iframe 
                                id="pdf-iframe"
                                src={`${manualUrl}#toolbar=0`} 
                                className="w-full h-full border-none" 
                                title="Guía inOne PDF"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomerSupport;
