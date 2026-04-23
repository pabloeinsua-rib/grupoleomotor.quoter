import React from 'react';
import { LeafIcon, CustomerSupportIcon, ShieldCheckIcon, ExternalLinkIcon } from './Icons.tsx';
import PageHeader from './PageHeader.tsx';

const Sustainability: React.FC = () => {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg mt-10">
          <p className="text-center text-lg text-gray-600 mb-4">
            En CaixaBank Payments & Consumer, la sostenibilidad es una aspiración que impregna toda nuestra actividad.
          </p>
          <p className="text-gray-700 mb-12 text-center">
            Como empresa socialmente responsable, trabajamos para ser un referente en este ámbito, contribuyendo al desarrollo de una sociedad más sostenible. Nuestros valores como el compromiso social, la transparencia y la calidad de servicio nos guían en este propósito, que integramos en nuestro Plan Estratégico.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center flex flex-col items-center">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <LeafIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Medioambiente</h3>
              <p className="text-gray-600">Contribuimos a la prevención del cambio climático, apoyando proyectos que ayudan a la transición hacia una economía baja en carbono. Para ello, impulsamos iniciativas y productos que respetan el medioambiente, y colaboramos en proyectos de protección de la biodiversidad.</p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <CustomerSupportIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Social</h3>
              <p className="text-gray-600">Mantenemos un fuerte compromiso con el desarrollo socioeconómico de los territorios en los que operamos, con especial atención a los colectivos más vulnerables. Promovemos la inclusión financiera, el emprendimiento y fomentamos la formación y el voluntariado, además de velar por los derechos humanos en todas nuestras actividades y colaboraciones.</p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gobernanza</h3>
              <p className="text-gray-600">Contamos con un modelo de gobierno corporativo que se alinea con las mejores prácticas internacionales y garantiza una gestión sostenible y responsable, basada en la ética, la transparencia y la escucha activa a todos nuestros grupos de interés.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg mb-12">
            <h3 className="font-bold text-xl text-[#0085c7] mb-4">Nuestros compromisos</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Ser una entidad neutra en carbono en 2022 y financiar y invertir en proyectos sostenibles.</li>
              <li>Impulsar la diversidad y la meritocracia.</li>
              <li>Promover la inclusión financiera.</li>
              <li>Apoyar el emprendimiento.</li>
              <li>Fomentar la formación y el voluntariado.</li>
              <li>Velar por los derechos humanos en todas nuestras actividades y colaboraciones.</li>
            </ul>
          </div>
          
          <div className="text-center bg-slate-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Estado de información no financiera</h3>
              <p className="text-gray-600 mb-4">Para más detalle, consulta nuestro informe.</p>
               <a 
                  href="https://www.caixabankpc.com/assets/sostenibilidad/CaixaBank_PyC_EINF_2022_ACC.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#00a1e0] text-white font-bold py-3 px-6 rounded-none hover:bg-[#0085c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a1e0] transition-colors"
              >
                  Consultar el informe <ExternalLinkIcon className="w-5 h-5 ml-2" />
              </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;