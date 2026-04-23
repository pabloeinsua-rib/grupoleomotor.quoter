
import React from 'react';
import type { View } from '../App.tsx';

interface TrainingProps {
  onLogout: () => void;
  onNavigate: (view: View) => void;
}

const Training: React.FC<TrainingProps> = ({ onLogout, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col h-full rounded-none animate-fade-in-up my-8">
      <h1 className="text-2xl font-bold text-black mb-6 uppercase tracking-widest text-center sm:text-left">Formación Anual de Seguros</h1>
      
      <div className="bg-slate-50 border-l-4 border-black p-4 mb-8">
        <p className="font-bold text-black mb-2 text-sm uppercase tracking-wide">
          ¿Has realizado la formación anual de seguros este 2026? 
        </p>
        <p className="text-slate-600 font-medium">
          Sin haber superado la formación no puedes asginar seguros a tus solicitudes.
        </p>
      </div>

      <div className="text-center mb-10 flex flex-col items-center justify-center border border-slate-200 p-8 pt-10 relative">
         <p className="text-sm text-slate-800 font-medium mb-8">
            Si ya la has realizado con otra Financiera este 2026, convalidala aquí:
         </p>
         <button className="bg-black text-white px-8 py-4 uppercase font-bold text-xs tracking-widest rounded-none hover:bg-slate-800 transition-colors shadow-none max-w-sm w-full">
            Convalidar Formación Anual
         </button>
      </div>

      <div className="mt-auto flex justify-center border-t border-slate-200 pt-8 group">
          <img 
            src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/asnef%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FzbmVmIGxvZ28ucG5nIiwiaWF0IjoxNzc2OTQ0OTA1LCJleHAiOjI2NDA4NTg1MDV9.uqfu7FTxIT-wF-knEkJnpqHVW9ldu7R6mdqH1BiL7e4" 
            alt="Logo ASNEF" 
            className="w-48 h-auto object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          />
      </div>
    </div>
  );
};

export default Training;
