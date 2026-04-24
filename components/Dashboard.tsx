import React from 'react';
import type { View } from '../App.tsx';
import { 
  Calculator, 
  FileText, 
  Settings, 
  Briefcase, 
  GraduationCap, 
  ShoppingBag, 
  Headset, 
  Smartphone,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: View) => void;
  userId: string | null;
  onOpenChat?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userId, onOpenChat }) => {
    
  let greeting = 'Hola';
  if (userId) {
      const name = userId.split('@')[0];
      if (name && name !== 'quoter.cpc') {
          greeting = `HOLA, ${name.toUpperCase()}`;
      }
  }

  const primaryActions = [
    { 
      title: 'Oferta Financiera', 
      description: 'Crear nueva simulación y cuadro de amortización',
      icon: <Calculator className="w-8 h-8 text-black" />,
      action: () => onNavigate('simulator'),
      color: 'bg-white border-slate-200'
    },
    { 
      title: 'Tramitar Nueva Solicitud', 
      description: 'Iniciar proceso de financiación con cliente', 
      icon: <FileText className="w-8 h-8 text-black" />,
      action: () => onNavigate('newRequestWorkflow'),
      color: 'bg-white border-slate-200'
    },
    { 
      title: 'Firma OTP a Distancia', 
      description: 'Firma digital mediante código al móvil', 
      icon: <Smartphone className="w-8 h-8 text-black" />,
      action: () => onNavigate('digitalSignature'),
      color: 'bg-white border-slate-200'
    },
  ];

  const secondaryActions = [
    { 
      title: 'Gestionar Solicitudes', 
      description: 'Modificar, añadir cotitular, firmas...', 
      icon: <Settings className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onNavigate('commercialSupport') 
    },
    {
      title: 'Cliente CaixaBank',
      description: 'Operativa especial para clientes',
      icon: <Briefcase className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onNavigate('operativaClienteCaixabank')
    },
    { 
      title: 'Formación', 
      description: 'Cursos, manuales y guías', 
      icon: <GraduationCap className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onNavigate('trainingGroup')
    },
    {
      title: 'Asistente Quoter',
      description: 'Soporte inteligente sobre operativa',
      icon: <MessageSquare className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onOpenChat && onOpenChat()
    },
    { 
      title: <span className="notranslate" translate="no">Facilitea</span>, 
      description: 'Catálogo de productos y servicios',
      icon: <ShoppingBag className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onNavigate('facilitea')
    },
    { 
      title: 'Soporte Cliente', 
      description: 'Atención al cliente final', 
      icon: <Headset className="w-6 h-6 text-black group-hover:text-white transition-colors" />,
      action: () => onNavigate('customerSupport') 
    },

  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 md:space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-1 md:space-y-2">
        <h1 className="text-xl md:text-4xl font-light text-black tracking-widest uppercase">
          {greeting}
        </h1>
        <p className="text-[10px] md:text-sm font-semibold uppercase tracking-widest text-slate-400">¿Qué gestión deseas realizar hoy?</p>
      </div>
      
      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {primaryActions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`flex flex-col items-start p-4 md:p-8 rounded-none border ${item.color} hover:border-black transition-all duration-300 group text-left relative overflow-hidden bg-white hover:bg-slate-50 min-h-[140px] md:min-h-0`}
          >
            <div className="bg-slate-100 p-2 md:p-4 rounded-none mb-2 md:mb-6 group-hover:bg-slate-200 transition-colors">
              {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5 md:w-8 md:h-8 text-black' })}
            </div>
            <h2 className="text-[10px] md:text-xl font-medium text-black mb-1 md:mb-2 tracking-widest uppercase">{item.title}</h2>
            <p className="text-slate-400 text-[9px] md:text-xs tracking-wider line-clamp-2 leading-tight">{item.description}</p>
            <ArrowRight className="absolute bottom-3 right-3 md:bottom-8 md:right-8 w-4 h-4 md:w-6 md:h-6 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
          </button>
        ))}
      </div>

      {/* Secondary Actions */}
      <div>
        <h3 className="text-[10px] md:text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 md:mb-6">Otras gestiones</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 font-mono">
          {secondaryActions.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="flex items-center justify-between p-3 md:p-5 rounded-none border border-slate-200 bg-white hover:bg-black transition-all duration-300 group text-left h-full"
            >
              <div className="flex-1">
                <h4 className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-black group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-300 mt-0.5 transition-colors leading-tight line-clamp-1 md:line-clamp-none">{item.description}</p>
              </div>
               <div className="bg-slate-50 p-1.5 md:p-3 rounded-lg ml-2 md:ml-4 group-hover:bg-slate-800 transition-colors flex-shrink-0">
                {React.cloneElement(item.icon as React.ReactElement, { className: 'w-4 h-4 md:w-6 md:h-6 text-black group-hover:text-white transition-colors' })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;