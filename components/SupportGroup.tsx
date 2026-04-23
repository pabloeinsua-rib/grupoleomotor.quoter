
import React from 'react';
import type { View } from '../App.tsx';
import NavigationCard from './NavigationCard.tsx';

interface SupportGroupProps {
  onNavigate: (view: View) => void;
}

const SupportGroup: React.FC<SupportGroupProps> = ({ onNavigate }) => {
  const cardsData = [
    { 
      title: 'Soporte al Comercial', 
      description: 'Contacta con nuestro equipo de soporte especializado.',
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/Foto%20concesionarios.jpg",
      action: () => onNavigate('commercialSupport') 
    },
    { 
      title: 'Atención a Cliente Final', 
      description: 'Información de contacto para que compartas con tus clientes.',
      imageUrl: "https://storage.googleapis.com/bucket_quoter_auto2/fortos/img_atencion_cliente.png",
      action: () => onNavigate('customerSupport')
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full flex flex-col flex-grow">
      <div className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {cardsData.map((card) => (
                <NavigationCard 
                    key={card.title} 
                    title={card.title} 
                    description={card.description} 
                    onClick={card.action} 
                />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupportGroup;
