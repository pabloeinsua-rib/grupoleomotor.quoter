
import React from 'react';

const FaciliteaIframe: React.FC = () => {
  // Using a proxy to bypass X-Frame-Options header
  const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.facilitea.com/pnbl/part/es/homepage')}`;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-10 print-p-0">
          <h1 className="inline-block glass-btn rounded-none px-8 py-2 rounded-full text-3xl font-light tracking-wide shadow-lg">
              Facilitea
          </h1>
      </div>
      <div className="flex-grow px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
            <iframe
            src={proxiedUrl}
            title="Facilitea"
            className="w-full h-full border-0"
            style={{ minHeight: 'calc(100vh - 200px)'}}
            sandbox="allow-scripts allow-same-origin allow-forms"
            />
        </div>
      </div>
    </div>
  );
};

export default FaciliteaIframe;
