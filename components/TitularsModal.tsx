import React from 'react';
import { XIcon, PersonIcon } from './Icons.tsx';

export interface Titular {
  nombre: string | null;
  dni: string | null;
  fechaNacimiento: string | null;
  direccion: string | null;
  ingresosAnuales: number | null;
  tipoContrato: string | null;
  antiguedad: string | null;
}

interface TitularsModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulares: Titular[];
}

const DetailItem = ({ label, value }: { label: string; value: string | number | null }) => (
    <div>
        <dt className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</dt>
        <dd className="text-sm text-black font-medium">{value ?? 'No disponible'}</dd>
    </div>
);

const TitularsModal: React.FC<TitularsModalProps> = ({ isOpen, onClose, titulares }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 sm:p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up max-h-[90vh] flex flex-col">
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-light text-black tracking-tight">Datos de Titulares Extraídos</h2>
          <button onClick={onClose} className="bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 hover:text-black transition-colors border border-slate-200">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {titulares.map((titular, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <PersonIcon className="w-5 h-5" />
                  Titular {index + 1}
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <DetailItem label="Nombre Completo" value={titular.nombre} />
                  <DetailItem label="DNI/NIE" value={titular.dni} />
                  <DetailItem label="Fecha de Nacimiento" value={titular.fechaNacimiento} />
                  <DetailItem label="Ingresos Anuales (Aprox.)" value={titular.ingresosAnuales ? `${titular.ingresosAnuales.toLocaleString('es-ES')} €` : null} />
                  <DetailItem label="Tipo de Contrato" value={titular.tipoContrato} />
                  <DetailItem label="Antigüedad Laboral" value={titular.antiguedad} />
                  <div className="sm:col-span-2">
                    <DetailItem label="Dirección" value={titular.direccion} />
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitularsModal;
