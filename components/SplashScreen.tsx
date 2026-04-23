
import React from 'react';
import type { View } from '../App.tsx';
import { TeamIcon } from './Icons.tsx';

interface FirmaGestoriaProps {
  onNavigate: (view: View) => void;
}

const FirmaGestoria: React.FC<FirmaGestoriaProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <TeamIcon className="w-12 h-12 text-caixa-blue mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Petición de Firma por Gestoría</h2>
            <p className="text-gray-600 mb-6 text-center">
                Este servicio gratuito está disponible si tu cliente reside o trabaja a más de 55 Kms de tu concesión.
            </p>
            <div className="text-left bg-slate-50 p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Pasos a seguir:</h3>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Comunica la necesidad de firma a distancia a tu gestor comercial, preferiblemente por email.</li>
                    <li>Indica los datos del cliente y el número de la solicitud.</li>
                    <li>Una vez validado, una gestoría se pondrá en contacto con el cliente para agendar día y hora de firma.</li>
                    <li>El representante de la gestoría acudirá con una tablet para que el cliente pueda realizar la firma digitalmente.</li>
                </ol>
            </div>
             <div className="text-center mt-8">
                <button
                    onClick={() => onNavigate('commercialSupport')}
                    className="inline-flex items-center justify-center bg-caixa-blue text-white font-bold py-3 px-8 rounded-none hover:bg-caixa-blue-light transition-colors"
                >
                    Contactar con Soporte para solicitar
                </button>
            </div>
        </div>
    </div>
  );
};

export default FirmaGestoria;
