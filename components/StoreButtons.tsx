import React from 'react';

interface StoreButtonsProps {
    appStoreUrl: string;
    googlePlayUrl: string;
    layout?: 'responsive' | 'vertical';
    combinedImageUrl?: string;
}

const StoreButtons: React.FC<StoreButtonsProps> = ({ appStoreUrl, googlePlayUrl, layout = 'responsive', combinedImageUrl }) => {
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=';
    
    const containerClasses = layout === 'responsive' 
        ? 'flex flex-col sm:flex-row gap-6 mt-6 items-center justify-center'
        : 'flex flex-col gap-4 mt-2 items-center justify-center';

    if (combinedImageUrl) {
         return (
             <div className="flex justify-center w-full mt-6">
                 <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="block transform hover:scale-105 transition-transform duration-300">
                    <img src={combinedImageUrl} alt="Descargar en App Store y Google Play" className="h-16 object-contain" />
                 </a>
             </div>
         );
    }

    return (
        <div className={containerClasses}>
            <div className="text-center flex flex-col items-center">
                <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-block transform hover:scale-105 transition-transform duration-300 bg-black text-white px-4 py-2 rounded-none font-bold text-sm">
                    Descargar en App Store
                </a>
            </div>
            <div className="text-center flex flex-col items-center">
                <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="inline-block transform hover:scale-105 transition-transform duration-300 bg-black text-white px-4 py-2 rounded-none font-bold text-sm">
                     Disponible en Google Play
                </a>
            </div>
        </div>
    );
};

export default StoreButtons;