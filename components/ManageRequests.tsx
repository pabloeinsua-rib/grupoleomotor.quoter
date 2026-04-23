
import React from 'react';
import type { View } from '../App.tsx';
import NavigationCard from './NavigationCard.tsx';
import { WarningIcon } from './Icons.tsx';

interface ManageRequestsProps {
  onNavigate: (view: View) => void;
}

const ManageRequests: React.FC<ManageRequestsProps> = ({ onNavigate }) => {
  
  const cardsData = [
    { 
      title: '1. TramiCar', 
      description: 'Sube la documentación de Titular/es Completa, y TramiCar te dará todos los datos de la solicitud ordenados. También revisará la documentación y te dirá si se puede validar.', 
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/magicdata2.156Z.png",
      action: () => onNavigate('packageDocumentation'),
      imageClassName: "object-cover"
    },
    {
      title: '2. Modificar Solicitudes',
      description: 'Realiza cambios en solicitudes ya tramitadas (importes, plazos, datos del cliente, etc.).',
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/25_2023_0307.jpg",
      action: () => onNavigate('modificacionSolicitudes'),
      imageClassName: "object-contain"
    },
    { 
      title: '3. Firma de Solicitudes', 
      description: 'Gestiona la firma digital de los contratos y consulta las diferentes modalidades.', 
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/FIRMA%20CLIENTE.jpg",
      action: () => onNavigate('digitalSignature') 
    },
    {
      title: '4. Abono de Solicitudes',
      description: 'Información sobre el proceso de abono y descarga de cartas de pago.',
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/50_2020-063.jpg",
      action: () => onNavigate('abonoSolicitudes'),
    },
  ];

  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-3xl mx-auto mb-12 bg-slate-50 border-l-4 border-black text-black p-6 rounded-none shadow-sm">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <WarningIcon className="h-6 w-6 text-black" aria-hidden="true" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-bold text-black uppercase tracking-tight">Importante: Pasos Previos</h3>
                        <div className="mt-2 text-sm text-slate-700 space-y-2">
                             <p>
                                Para Tramitar una solicitud, antes de nada, crea una oferta en el <strong>Simulador Financiero</strong>. Una vez creada la oferta definitiva, pulsa el botón <strong>"Tramitar Solicitud"</strong> para que TramiCar guarde los datos económicos.
                            </p>
                            <p>
                                Después, ten digitalizada o escaneada toda la documentación del Titular o Titulares, ya que la necesitarás para subirla a <strong>TramiCar</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
              {cardsData.map((card) => (
                <div key={card.title} className="w-full">
                    <NavigationCard 
                        title={card.title} 
                        description={card.description} 
                        imageUrl={card.imageUrl}
                        onClick={card.action}
                        imageClassName={(card as any).imageClassName}
                        containerClassName={(card as any).containerClassName}
                    />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
