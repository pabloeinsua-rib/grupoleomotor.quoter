
import React from 'react';
import type { View } from '../App.tsx';
import { ManualsIcon, TrainingIcon, ShieldCheckIcon } from './Icons.tsx';
import NavigationCard from './NavigationCard.tsx';
import PageHeader from './PageHeader.tsx';

interface TrainingCoursesProps {
  onNavigate: (view: View) => void;
}

const TrainingCourses: React.FC<TrainingCoursesProps> = ({ onNavigate }) => {
  const cardsData = [
    { 
      title: 'Formación Seguros ASNEF/CBP', 
      description: 'Curso anual obligatorio para la distribución de seguros.',
      icon: <TrainingIcon />, 
      action: () => onNavigate('annualTraining') 
    },
    {
      title: 'Coberturas de los Seguros',
      description: 'Detalles sobre las coberturas de los seguros ofrecidos.',
      icon: <ShieldCheckIcon />,
      action: () => onNavigate('insuranceCoverage')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
      <PageHeader title="Cursos de Formación" subtitle="Accede a todos los materiales de formación." showBackButton={true} onGoBack={() => {}} />
      <div className="max-w-5xl mx-auto">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <NavigationCard key={card.title} title={card.title} description={card.description} icon={card.icon} onClick={card.action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingCourses;
