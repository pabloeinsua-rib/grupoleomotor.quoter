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
  return (
    <div className="w-full bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 sm:py-24 border-b border-slate-100 mb-16 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-4 block animate-fade-in">Seguridad & Confianza</span>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-black mb-6">
            Protección de <span className="font-medium">Pagos</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg sm:text-xl font-light">
            Soluciones diseñadas para garantizar la tranquilidad de tu familia y la seguridad de tus compromisos financieros ante cualquier imprevisto.
          </p>
        </motion.div>

        {/* Section: Pack Vida */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-2xl font-medium text-black tracking-tight mb-2 uppercase">Pack Vida</h2>
              <p className="text-slate-400 text-sm">Coberturas esenciales para tu tranquilidad diaria.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Fallecimiento" 
              tag="F"
              description="Liquida el capital pendiente del préstamo en caso de fallecimiento por enfermedad o accidente."
            />
            <FeatureCard 
              title="Gran Invalidez" 
              tag="GI"
              description="Garantía de liquidación del capital pendiente en supuestos de gran invalidez física comprobada."
            />
            <FeatureCard 
              title="Diagnóstico Cáncer" 
              tag="CAN"
              description="Protección financiera inmediata ante el diagnóstico de patologías oncológicas durante la vigencia."
            />
            <FeatureCard 
              title="Infarto Agudo" 
              tag="INF"
              description="Cobertura específica para infarto de miocardio agudo con necrosis muscular cardíaca acreditada."
            />
          </div>
        </section>

        {/* Section: Pack Protección */}
        <section className="mb-24 p-10 bg-slate-50 border border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-black mb-4 uppercase tracking-wide">Pack Protección Avanzada</h2>
              <p className="text-slate-500">Extiende tu seguridad con coberturas laborales específicas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-black text-white p-2">
                    <BriefcaseIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Vida + Desempleo</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Para empleados por cuenta ajena con contrato indefinido o funcionarios. Cubre la cuota del préstamo con un máximo de 400€/mes.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="border-l-2 border-slate-200 pl-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Franquicia</span>
                    <span className="text-sm font-medium">30 Días</span>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carencia</span>
                    <span className="text-sm font-medium">60 Días</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-black text-white p-2">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Vida + Incapacidad</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Diseñado para autónomos y contratos temporales. Indemnización mensual ante incapacidad por accidente o enfermedad común.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="border-l-2 border-slate-200 pl-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Franquicia</span>
                    <span className="text-sm font-medium">30 Días</span>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carencia</span>
                    <span className="text-sm font-medium">30 Días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Packs de Contratación */}
        <section className="mb-24">
          <h2 className="text-2xl font-medium text-black tracking-tight mb-12 uppercase text-center">Packs Disponibles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                num: "24", 
                name: 'Pack Básico Plus', 
                covers: 'F + GI + CAN + INF', 
                age: '18 - 60 años', 
                status: 'Estándar',
                icon: <ShieldCheckIcon />
              },
              { 
                num: "28", 
                name: 'Pack Desempleo Plus', 
                covers: 'F + GI + CAN + INF + D + IT', 
                age: '18 - 60 años', 
                status: 'Recomendado',
                featured: true,
                icon: <StarIcon />
              },
              { 
                num: "87", 
                name: 'Pack Senior', 
                covers: 'Fallecimiento', 
                age: '59 - 78 años', 
                status: 'Seniors',
                icon: <UsersIcon />
              },
            ].map((p) => (
              <div 
                key={p.num}
                className={`p-10 border ${p.featured ? 'border-black bg-black text-white scale-105 z-10 shadow-2xl' : 'border-slate-100 bg-white text-black'}`}
              >
                <div className={`${p.featured ? 'text-white' : 'text-black'} mb-8`}>
                  {p.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${p.featured ? 'text-slate-400' : 'text-slate-400'}`}>{p.status}</span>
                <h4 className="text-2xl font-bold mb-6 tracking-tight">{p.name}</h4>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center text-sm border-b border-current py-2 opacity-80">
                    <span>Coberturas</span>
                    <span className="font-bold">{p.covers}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-current py-2 opacity-80">
                    <span>Edad</span>
                    <span className="font-bold">{p.age}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-current py-2 opacity-80">
                    <span>Código Pack</span>
                    <span className="font-bold">{p.num}</span>
                  </div>
                </div>
                <button className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors ${p.featured ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'}`}>
                  Seleccionar
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Casos de Uso (FAQ Style) */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-medium text-black tracking-tight mb-12 uppercase text-center">Información Adicional</h2>
          <div className="space-y-8">
            <div className="p-8 border border-slate-100">
              <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-black" />
                Complementariedad del Seguro
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                A diferencia de un seguro de vida convencional, el seguro de préstamo garantiza la cancelación exacta de la deuda pendiente en caso de siniestro, protegiendo el patrimonio de tus herederos de cargas financieras inesperadas.
              </p>
            </div>
            <div className="p-8 border border-slate-100">
              <h4 className="text-lg font-bold text-black mb-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-black" />
                Soporte ante Desempleo
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Protegemos tus ingresos ante extinciones laborales imprevistas o incapacidades temporales que limiten tu actividad profesional (especialmente vital para autónomos), asegurando que las cuotas de tu préstamo queden cubiertas.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default InsuranceCoverage;