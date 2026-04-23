
import React from 'react';
import type { View } from '../App.tsx';
import NavigationCard from './NavigationCard.tsx';
import { 
    DigitalSignatureIcon, 
    DevicePhoneMobileIcon, 
    ShieldCheckIcon, 
    DocumentSubmissionIcon, 
    TrainingIcon, 
    StarIcon, 
    BuildingOfficeIcon, 
    OperationsManagerIcon 
} from './Icons.tsx';

interface TrainingGroupProps {
  onNavigate: (view: View) => void;
}

interface CardData {
    title: string;
    description: string;
    action: () => void;
    imageUrl?: string;
    imageClassName?: string;
    icon?: React.ReactElement;
}

const TrainingGroup: React.FC<TrainingGroupProps> = ({ onNavigate }) => {
  const cardsData: CardData[] = [
    { 
      title: 'Firma OTP Auto (A Distancia)',
      description: 'Proceso Web auto con firma digital por SMS.',
      action: () => onNavigate('appFirmaDigital'),
      icon: <DigitalSignatureIcon />
    },
    {
      title: 'Firma APP Móvil Presencial',
      description: 'Firma biométrica para operaciones presenciales.',
      action: () => onNavigate('firmaAppMovilPresencial'),
      icon: <DevicePhoneMobileIcon />
    },
    { 
      title: 'Prevención del Fraude', 
      description: 'Consulta guías y protocolos de seguridad.', 
      action: () => onNavigate('fraudPrevention'),
      icon: <ShieldCheckIcon />
    },
    {
      title: 'Documentación Cliente',
      description: 'Documentación necesaria a aportar según el tipo de cliente.',
      action: () => onNavigate('clientDocumentation'),
      icon: <DocumentSubmissionIcon />
    },
    { 
      title: 'Formación Seguros ASNEF/CBP', 
      description: 'Curso anual obligatorio para la distribución de seguros.',
      action: () => onNavigate('annualTraining'),
      icon: <TrainingIcon />
    },
    {
      title: 'Protección de Pagos',
      description: 'Detalles sobre las coberturas de los seguros ofrecidos.',
      action: () => onNavigate('insuranceCoverage'),
      icon: <StarIcon />
    },
    {
      title: 'Operativa Cliente CaixaBank',
      description: 'Condiciones especiales y agilidad para clientes de CaixaBank.',
      action: () => onNavigate('operativaClienteCaixabank'),
      icon: <BuildingOfficeIcon />
    },
    {
      title: 'APP Mi gestor de Operaciones',
      description: 'Consulta el estado de tus operaciones y descarga cartas de pago.',
      action: () => onNavigate('operationsManager'),
      icon: <OperationsManagerIcon />
    },
  ];

  return (
    <div className="w-full flex flex-col flex-grow">
      <div className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {cardsData.map((card) => (
                <NavigationCard 
                    key={card.title} 
                    title={card.title} 
                    description={card.description} 
                    onClick={card.action} 
                    imageUrl={card.imageUrl}
                    imageClassName={card.imageClassName}
                    icon={card.icon}
                    containerClassName="h-44 sm:h-48"
                />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingGroup;
