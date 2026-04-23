import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './Icons.tsx';

interface DealerCodesModalProps {
  onClose: () => void;
}

const dealerCodes = [
  { code: '76693002', name: 'AUTERSA CASTELLÓN', cif: 'A44123636', society: 'AUTERSA', province: 'CASTELLÓN' },
  { code: '35223001', name: 'LEOMOVIL', cif: 'B24268120', society: 'LEOMOVIL', province: 'LEÓN' },
  { code: '46455001', name: 'LEOMOTOR ZAMORA', cif: 'B49143910', society: 'LEOMOTOR ZAMORA', province: 'ZAMORA' },
  { code: '46455002', name: 'LEOMOTOR PONFERRADA', cif: 'B49143910', society: 'LEOMOTOR ZAMORA', province: 'LEÓN' },
  { code: '49638001', name: 'GARAJE IBAN', cif: 'B24210098', society: 'GARAJE IBAN', province: 'LEÓN' },
  { code: '49638002', name: 'GARAJE IBAN EBRO ASTURIAS', cif: 'B24210098', society: 'GARAJE IBAN', province: 'ASTURIAS' },
  { code: '41159001', name: 'LEOMOTOR ASTURIAS', cif: 'B36691236', society: 'LEOMOTOR ASTURIAS', province: 'ASTURIAS' },
  { code: '41159007', name: 'LEOMOTOR BENAVENTE', cif: 'B36691236', society: 'LEOMOTOR ASTURIAS', province: 'ZAMORA' },
  { code: '60424001', name: 'TOYOTA ASTURIAS', cif: 'B74435090', society: 'TOYOTA ASTURIAS', province: 'ASTURIAS' },
  { code: '46455004', name: 'LEOMOTOR NISSAN ZARAGOZA', cif: 'B49143910', society: 'LEOMOTOR ZAMORA', province: 'ZARAGOZA' },
  { code: '76212001', name: 'LEOMOTOR ARAGÓN', cif: 'B75448332', society: 'LEOMOTOR ARAGÓN', province: 'ZARAGOZA' },
  { code: '76693001', name: 'AUTERSA TERUEL', cif: 'A44123636', society: 'AUTERSA', province: 'TERUEL' },
];

const DealerCodesModal: React.FC<DealerCodesModalProps> = ({ onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-8 relative transform transition-all duration-300 opacity-0 animate-fade-in-up max-h-[90vh] flex flex-col">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-black rounded-none transition-colors z-10 p-2 shadow-sm border border-slate-200"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-light text-black tracking-tight mb-6 text-center">Códigos de Concesionario</h3>
        
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Código</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Establecimiento</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">CIF</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Sociedad</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Provincia</th>
              </tr>
            </thead>
            <tbody>
              {dealerCodes.map((dealer, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-black font-semibold">{dealer.code}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{dealer.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{dealer.cif}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{dealer.society}</td>
                  <td className="py-3 px-4 text-sm text-slate-700">{dealer.province}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-black text-white font-bold py-3 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};

export default DealerCodesModal;
