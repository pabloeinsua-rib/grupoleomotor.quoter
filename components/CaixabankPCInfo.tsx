
import React from 'react';
import type { View } from '../App.tsx';
import NavigationCard from './NavigationCard.tsx';

interface CaixabankPCInfoProps {
  onNavigate: (view: View) => void;
}

const CaixabankPCInfo: React.FC<CaixabankPCInfoProps> = ({ onNavigate }) => {

  const cards = [
    { 
      type: 'internal' as const,
      view: 'aboutUs' as View, 
      title: '¿Quiénes Somos?', 
      description: 'Descubre más sobre nuestra empresa y valores.'
    },
    { 
      type: 'internal' as const,
      view: 'sustainability' as View, 
      title: 'Sostenibilidad', 
      description: 'Conoce nuestro compromiso con la sostenibilidad.'
    },
    { 
      type: 'internal' as const,
      view: 'facilitea' as View, 
      title: 'Facilitea', 
      description: 'Te acercamos los mejores productos y Servicios.'
    },
    { 
      type: 'external' as const,
      href: 'https://www.caixabankpc.com', 
      title: 'Nuestra Web', 
      description: 'Visita nuestra página web oficial.'
    },
    { 
      type: 'external' as const,
      href: 'https://fundacionlacaixa.org/es/', 
      title: 'Obra Social CaixaBank', 
      description: 'Conoce la labor social de la Fundación "la Caixa".'
    },
    { 
      type: 'external' as const,
      href: 'https://www.voluntariadocaixabank.org/', 
      title: '¡Haz Voluntariado!', 
      description: 'Únete a la red de voluntariado de CaixaBank.'
    },
  ];

  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="flex-grow flex items-center mt-10">
        <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => {
                  if (card.type === 'external') {
                    return (
                      <a key={card.title} href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                        <NavigationCard 
                          title={card.title}
                          description={card.description}
                          imageUrl={'imageUrl' in card ? card.imageUrl : undefined}
                          videoUrl={'videoUrl' in card ? card.videoUrl : undefined}
                          videoAutoPlay={'videoAutoPlay' in card ? card.videoAutoPlay : undefined}
                          imageClassName={'imageClassName' in card ? card.imageClassName : undefined}
                        />
                      </a>
                    );
                  }
                  
                  return (
                    <NavigationCard 
                      key={card.title} 
                      title={card.title}
                      description={card.description}
                      imageUrl={'imageUrl' in card ? card.imageUrl : undefined}
                      videoUrl={'videoUrl' in card ? card.videoUrl : undefined}
                      videoAutoPlay={'videoAutoPlay' in card ? card.videoAutoPlay : undefined}
                      imageClassName={'imageClassName' in card ? card.imageClassName : undefined}
                      onClick={() => onNavigate(card.view)}
                    />
                  );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CaixabankPCInfo;
