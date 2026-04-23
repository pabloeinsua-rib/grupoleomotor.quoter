
import React from 'react';
import type { View } from '../App.tsx';
import { ManualsIcon } from './Icons.tsx';

interface FirmaNotariaProps {
  onNavigate: (view: View) => void;
}

const FirmaNotaria: React.FC<FirmaNotariaProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <ManualsIcon className="w-12 h-12 text-caixa-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Petición de Firma ante Notario</h2>
            <p className="text-gray-600 mb-6 text-center">
                Necesaria para solicitudes de más de <strong>40.000 €</strong>, o a petición del analista o del cliente.
            </p>
             <div className="text-left bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Pasos a seguir:</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li>El Notario es de libre elección por parte del cliente.</li>
                    <li>Comunica a tu gestor de CaixaBank P&C el nombre, localidad, día y hora de la cita con el Notario.</li>
                    <li>CaixaBank P&C enviará una copia del contrato directamente a la notaría.</li>
                    <li className="font-semibold text-red-600">Importante: El titular/es se hará cargo de la minuta del Notario.</li>
                </ol>
            </div>
             <div className="text-center mt-8">
                <button
                    onClick={() => onNavigate('commercialSupport')}
                    className="inline-flex items-center justify-center bg-caixa-blue text-white font-bold py-3 px-8 rounded-none hover:bg-caixa-blue-light transition-colors"
                >
                    Contactar con Soporte para coordinar
                </button>
            </div>
        </div>
    </div>
  );
};

export default FirmaNotaria;
