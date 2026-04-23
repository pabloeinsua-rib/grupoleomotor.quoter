import React from 'react';
import { View } from '../App.tsx';

interface CaixabankClientOperationsProps {
  onNavigate: (view: View) => void;
}

const CaixabankClientOperations: React.FC<CaixabankClientOperationsProps> = ({ onNavigate }) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 w-full max-w-6xl mx-auto">
      <div className="bg-white p-8 sm:p-12 mb-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-light text-black tracking-tight mb-4 uppercase">
                Crédito Inmediato
            </h2>
            <p className="text-lg text-slate-600 mb-12 max-w-3xl leading-relaxed">
                Los 21 millones de clientes CaixaBank tienen crédito inmediato presentando el DNI y la tarjeta bancaria.
            </p>
            
            <div className="text-sm text-slate-500 max-w-4xl mx-auto space-y-4 text-left border-l-4 border-black pl-6 py-4 bg-slate-50 mb-12 w-full">
                <p className="font-bold text-black text-base mb-2 uppercase tracking-wide">Cuando tu cliente, ya es cliente de CaixaBank,</p>
                <p className="text-slate-600">para el estudio de una solicitud, solo necesitas:</p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-slate-700 mt-2 mb-4">
                  <li><strong>DNI</strong></li>
                  <li><strong>Número de Tarjeta CaixaBank</strong> (Crédito o Débito).</li>
                  <li>o bien <strong>Nº de Cuenta CaixaBank</strong>, que comienza por ESXX 2100.</li>
                </ul>
                <div className="h-px w-full bg-slate-200 my-4"></div>
                <p>Si el titular tiene sus ingresos domiciliados en CaixaBank, no será necesario presentar justificante de ingresos ni justificante de la Cuenta. Solo el DNI (Copia en color). Esto puedes verlo en la carta de Pre-Autorización que llega a tu correo.</p>
                <p>Operativa válida para solicitudes hasta 30.000 €, en caso de importes superiores pasaría a tramitación Estándar, y se debe presentar toda la documentación (incluyendo IRPF Mod. 100).</p>
            </div>

            <button
                onClick={() => onNavigate('newRequestWorkflow')}
                className="bg-black hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-[0.15em] py-4 px-10 rounded-none transition-all shadow-sm"
            >
                TRAMITAR SOLICITUD
            </button>
      </div>
    </div>
  );
};

export default CaixabankClientOperations;