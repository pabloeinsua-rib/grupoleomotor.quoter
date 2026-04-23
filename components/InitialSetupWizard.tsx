
import React, { useState } from 'react';
// FIX: Added a missing import for the 'View' type to resolve a compilation error.
import type { View } from '../App.tsx';

interface InitialSetupWizardProps {
  onComplete: (data: { product: string; vehicle: string; client: string }) => void;
  onNavigate: (view: View) => void;
}

const steps = [
  {
    question: "Tipo de Producto:",
    key: "product",
    options: [
      { value: "Financiación", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
      { value: "Leasing", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
    ]
  },
  {
    question: "Tipo de Vehículo:",
    key: "vehicle",
    options: [
      { value: "Vehículo Nuevo", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg> },
      { value: "Vehículo Matriculado", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
    ]
  },
  {
    question: "Tipo de Cliente:",
    key: "client",
    options: [
      { value: "Asalariados y Autónomos", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { value: "Sociedades. (No C.B. ni S.C.)", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> }
    ]
  }
];

const InitialSetupWizard: React.FC<InitialSetupWizardProps> = ({ onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    product: "",
    vehicle: "",
    client: ""
  });
  
  const handleSelect = (key: string, value: string) => {
    const newSelections = { ...selections, [key]: value };
    setSelections(newSelections);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newSelections as { product: string; vehicle: string; client: string });
    }
  };
  
  const handleBack = () => {
      if(currentStep > 0) {
          setCurrentStep(currentStep - 1);
      }
  }

  const stepData = steps[currentStep];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 text-center fade-in-up">
        <h1 className="text-3xl font-bold text-gray-800">{stepData.question}</h1>
        <div className="mt-8 flex justify-center gap-8 flex-wrap">
            {stepData.options.map(option => (
                <button
                    key={option.value}
                    onClick={() => handleSelect(stepData.key, option.value)}
                    className="bg-white p-8 rounded-none shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform w-full max-w-xs flex flex-col items-center justify-center space-y-4 border-2 border-transparent hover:border-[#0085c7]"
                >
                    <div className="text-[#0085c7]">{option.icon}</div>
                    <span className="text-lg font-semibold text-gray-700">{option.value}</span>
                </button>
            ))}
        </div>
        <div className="mt-12 flex justify-center items-center space-x-6">
             <button onClick={() => onNavigate('dashboard')} className="text-sm font-semibold text-gray-600 hover:text-[#0085c7] transition-colors">
                &larr; Volver al panel
            </button>
            {currentStep > 0 && (
                <button onClick={handleBack} className="text-sm font-semibold text-gray-600 hover:text-[#0085c7] transition-colors bg-white px-4 py-2 rounded-none shadow">
                    &larr; Volver
                </button>
            )}
        </div>
    </div>
  );
};

export default InitialSetupWizard;
