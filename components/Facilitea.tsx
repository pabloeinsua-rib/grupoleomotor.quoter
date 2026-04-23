import React from 'react';
import NavigationCard from './NavigationCard.tsx';

const Facilitea: React.FC = () => {
  const cardsData = [
    { 
      title: <span className="notranslate" translate="no">Facilitea</span>, 
      description: 'Soluciones de financiación para una amplia gama de productos y servicios.',
      href: 'https://www.facilitea.com/pnbl/part/es/homepage'
    },
    { 
      title: <><span className="notranslate" translate="no">Facilitea</span> Coches</>, 
      description: 'Nuestro Portal de venta de tus vehículos de ocasión.',
      href: 'https://faciliteacoches.com/'
    },
    { 
      title: <><span className="notranslate" translate="no">Facilitea</span> Casa</>, 
      description: 'Encuentra tu próxima vivienda.',
      href: 'https://faciliteacasa.com/'
    },
  ];

  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="flex-grow mt-10">
        <div className="max-w-7xl mx-auto w-full px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cardsData.map((card, idx) => (
                    <a key={`facil-card-${idx}`} href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                        <NavigationCard 
                          title={card.title} 
                          description={card.description} 
                        />
                    </a>
                  ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Facilitea;