import React from 'react';
import { motion } from 'motion/react';
import { 
    ShieldCheckIcon, 
    HeartIcon, 
    BriefcaseIcon, 
    ClockIcon, 
    UsersIcon, 
    StarIcon, 
    InfoIcon 
} from './Icons.tsx';

// Adding some missing icons or using existing ones
// HeartIcon isn't in my previous view of Icons.tsx, I'll check or use an alternative

const FeatureCard: React.FC<{ 
  title: string; 
  description: string; 
  tag?: string; 
  icon?: React.ReactNode; 
}> = ({ title, description, tag, icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="bg-slate-50 p-3 text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
        {icon || <ShieldCheckIcon className="w-6 h-6" />}
      </div>
      {tag && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-1">
          {tag}
        </span>
      )}
    </div>
    <h4 className="text-lg font-bold text-black mb-3 uppercase tracking-tight">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const InsuranceCoverage: React.FC = () => {
  const [activeInfo, setActiveInfo] = React.useState<string | null>(null);

  const getInfoContent = () => {
    switch(activeInfo) {
      case 'completa':
        return {
          title: "Vida + Desempleo / IT",
          content: (
            <div className="space-y-4">
              <p>Esta es la protección más completa disponible. Cubre tanto situaciones personales como laborales.</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Fallecimiento e Invalidez:</strong> Liquidación total del capital pendiente.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Desempleo:</strong> Cobertura de cuotas para trabajadores asalariados indefinidos.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Incapacidad Temporal:</strong> Cobertura de cuotas para autónomos y empleados temporales.</p>
                </li>
              </ul>
            </div>
          )
        };
      case 'vida':
        return {
          title: "Seguro de Vida",
          content: (
            <div className="space-y-4">
              <p>Protección esencial centrada en la integridad física del titular.</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Fallecimiento:</strong> Cancelación de la deuda ante cualquier causa de fallecimiento.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Invalidez Absoluta:</strong> Protección financiera ante situaciones que impidan la actividad profesional.</p>
                </li>
              </ul>
            </div>
          )
        };
      case 'senior':
        return {
          title: "Vida Senior",
          content: (
            <div className="space-y-4">
              <p>Diseñado para clientes que buscan tranquilidad en su etapa de jubilación o madurez.</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Especializados:</strong> Contratación disponible para mayores de 60 años.</p>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0" />
                  <p><strong>Sin sorpresas:</strong> Enfoque directo en la cobertura de fallecimiento.</p>
                </li>
              </ul>
            </div>
          )
        };
      case 'sin':
        return {
          title: "Sin Protección",
          content: (
            <div className="space-y-4">
              <p className="text-red-600 font-bold">Atención: Operación sin seguro asociado.</p>
              <p>Al seleccionar esta opción, el cliente asume todos los riesgos derivados de imprevistos que afecten a su capacidad de pago.</p>
              <p>En caso de fallecimiento, la deuda pendiente se trasladará a sus herederos legales como parte de la masa hereditaria.</p>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const modalData = getInfoContent();

  return (
    <div className="w-full bg-white pb-32">
      {/* Modal Overlay */}
      {activeInfo && modalData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white p-8 max-w-md w-full relative"
          >
            <button onClick={() => setActiveInfo(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black">
              <InfoIcon className="w-6 h-6 rotate-45" />
            </button>
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">{modalData.title}</h3>
            <div className="text-slate-600 leading-relaxed font-sans">
              {modalData.content}
            </div>
            <button 
              onClick={() => setActiveInfo(null)}
              className="w-full mt-8 bg-black text-white py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all rounded-full"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* --- HEADER --- */}
        <div className="pt-24 pb-16 text-center">
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-black uppercase">
              Protección de Pagos
            </h1>
        </div>

        {/* --- INSURANCE SECTIONS --- */}
        <div className="space-y-32">
            {/* 1. VIDA + DESEMPLEO / IT */}
            <section className="animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">Vida + Desempleo / IT</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            La cobertura más completa para proteger tu financiación ante cualquier imprevisto personal o profesional.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Fallecimiento e Invalidez Absoluta.
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Desempleo (para trabajadores asalariados).
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Incapacidad Temporal (para autónomos).
                            </li>
                        </ul>
                        <button onClick={() => setActiveInfo('completa')} className="bg-black text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-full">
                            Saber más
                        </button>
                    </div>
                    <div className="bg-slate-50 aspect-square flex items-center justify-center p-12 rounded-[40px] order-1 lg:order-2">
                        <div className="text-center">
                            <span className="text-9xl font-bold text-slate-200">92</span>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-4">CODE / COMPLETA</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. VIDA */}
            <section className="animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="bg-black aspect-square flex items-center justify-center p-12 rounded-[40px]">
                        <div className="text-center">
                            <span className="text-9xl font-bold text-slate-800/50">24</span>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-4">CODE / VIDA</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">Pack Vida</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Protección esencial para garantizar la tranquilidad de tu familia ante situaciones de fallecimiento o invalidez.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Cobertura de fallecimiento por cualquier causa.
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Gran Invalidez e Invalidez Permanente.
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Enfermedades graves (Cáncer, Infarto).
                            </li>
                        </ul>
                        <button onClick={() => setActiveInfo('vida')} className="bg-black text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-full">
                            Saber más
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. VIDA SENIOR */}
            <section className="animate-fade-in-up pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 order-2 lg:order-1">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">Vida Senior</h2>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Seguro diseñado específicamente para personas mayores de 60 años, garantizando la cancelación de la deuda.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Edad de contratación hasta los 78 años.
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Sin necesidad de reconocimientos médicos complejos.
                            </li>
                            <li className="flex items-center gap-4 text-sm font-medium text-slate-700">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                Protección directa del capital pendiente.
                            </li>
                        </ul>
                        <button onClick={() => setActiveInfo('senior')} className="bg-black text-white px-12 py-5 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all rounded-full">
                            Saber más
                        </button>
                    </div>
                    <div className="bg-slate-50 aspect-square flex items-center justify-center p-12 rounded-[40px] order-1 lg:order-2">
                        <div className="text-center">
                            <span className="text-9xl font-bold text-slate-200">87</span>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-4">CODE / SENIOR</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCoverage;