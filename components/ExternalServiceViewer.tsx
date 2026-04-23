
import React from 'react';
import { ExternalLinkIcon } from './Icons.tsx';

interface ExternalServiceViewerProps {
  url: string;
}

const ExternalServiceViewer: React.FC<ExternalServiceViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-full flex flex-col -m-4 sm:-m-6 lg:-m-8">
      <div className="flex-grow relative w-full h-full min-h-[80vh]">
        <iframe
          src={url}
          className="absolute inset-0 w-full h-full border-0"
          title="Servicio Externo"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          allow="geolocation; microphone; camera"
        />
        {/* Fallback/Control Bar in case the site blocks iframes via headers */}
        <div className="absolute bottom-4 right-4 z-10">
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur text-caixa-blue text-xs font-bold py-2 px-4 rounded-none shadow-lg border border-slate-200 hover:bg-caixa-blue hover:text-white transition-colors flex items-center gap-2"
            >
                <ExternalLinkIcon className="w-4 h-4" /> Abrir en navegador
            </a>
        </div>
      </div>
    </div>
  );
};

export default ExternalServiceViewer;
