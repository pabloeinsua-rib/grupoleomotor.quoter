import React from 'react';

interface LeomotorLogoProps {
  className?: string;
  userRole?: string | null;
}

const LeomotorLogo: React.FC<LeomotorLogoProps> = ({ className, userRole }) => {
  if (userRole === 'tramicar') {
    return (
      <div className={`flex items-center justify-center bg-transparent notranslate ${className}`} translate="no">
        <span className="text-slate-800 font-montserrat text-xl tracking-[0.3em] uppercase font-light">KONECTA</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center bg-black transition-transform duration-300 hover:scale-[1.02] notranslate overflow-hidden ${className}`} translate="no">
        <img 
            src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/LOGOS%20GRUPOS%20CONCESIONARIO/logo%20grupo%20leomotor.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0xPR09TIEdSVVBPUyBDT05DRVNJT05BUklPL2xvZ28gZ3J1cG8gbGVvbW90b3IuanBnIiwiaWF0IjoxNzc2OTU3MzgzLCJleHAiOjI2NDA4NzA5ODN9.cjobgWHlauFl8axLYNqcn-tig0yg2Ye8RuCXHmk2L-A" 
            alt="Grupo Leomotor" 
            className="h-9 sm:h-11 object-contain w-full mix-blend-screen brightness-110"
            data-ignore-dark="true"
        />
    </div>
  );
};

export default LeomotorLogo;
