import React, { useState } from 'react';
// FIX: Added .tsx extension to import path and added missing icon imports.
import { MapIcon, DigitalSignatureIcon, OperationsManagerIcon, ExternalLinkIcon, MapPinIcon, PhoneIcon } from './Icons.tsx';
import PageHeader from './PageHeader.tsx';
import AnimatedNumber from './AnimatedNumber.tsx';

const StatCard = ({ target, prefix = '', suffix = '', label }: { target: number; prefix?: string; suffix?: string; label: string }) => (
    <div>
        <AnimatedNumber 
            target={target} 
            prefix={prefix} 
            suffix={suffix} 
            className="text-4xl font-bold text-[#0085c7]"
            formatter={(num) => {
                 if (Number.isInteger(target)) {
                    return Math.round(num).toLocaleString('es-ES');
                }
                return parseFloat(num.toFixed(1)).toString().replace('.', ',');
            }}
        />
        <p className="text-gray-600 mt-2">{label}</p>
    </div>
);


const AboutUs: React.FC = () => {
    const offices = [
    {
      id: 'madrid',
      name: 'Sede Central Madrid',
      address: 'Avenida de Manoteras 20, Edificio París, 28050 Madrid',
      phone: '+34 914 84 60 00',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.092323714578!2d-3.660188623402453!3d40.49572717935602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422c1bb6249535%3A0x28766c6d260344ab!2sCaixaBank%20Payments%20%26%20Consumer!5e1!3m2!1ses!2ses'
    },
    {
      id: 'barcelona',
      name: 'Sede Barcelona',
      address: 'Gran Via de les Corts Catalanes, 159, 08014 Barcelona',
      phone: '+34 933 20 33 65',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.633783675001!2d2.148175376174543!3d41.38224937926487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a27b6a414603%3A0x23a315975424b77!2sGran%20Via%20de%20les%20Corts%20Catalanes%2C%20159%2C%2008014%20Barcelona!5e1!3m2!1ses!2ses'
    },
  ];

  const [selectedOffice, setSelectedOffice] = useState(offices[0]);

  return (
    <div className="w-full min-h-full -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Impulsamos tus proyectos y los de miles de personas
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Somos la entidad líder en financiación al consumo en España. A través de nuestras soluciones de financiación flexibles y nuestros acuerdos con socios comerciales de primer nivel, ayudamos a hacer realidad los sueños de miles de personas y a dinamizar el comercio.
          </p>

          {/* Cifras que nos avalan */}
          <div className="mb-16">
              <div className="flex justify-center">
                <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                    <StatCard target={11000} prefix="+" label="puntos de venta y agencias colaboradoras" />
                    <StatCard target={5000} prefix="~" suffix=" M€" label="de nueva producción anual" />
                    <StatCard target={2.3} suffix="M" label="nuevas operaciones formalizadas" />
                    <StatCard target={1000} prefix="+" label="personas en nuestro equipo" />
                </div>
              </div>
          </div>

          {/* Three key points */}
          <div className="flex justify-center mb-16">
            <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center flex flex-col items-center">
                <div className="bg-blue-100 text-[#0085c7] rounded-full p-4 mb-4 inline-block">
                  <MapIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl mb-2">Partnership</h4>
                <p className="text-gray-600">
                  Colaboramos con más de 11.000 puntos de venta, concesionarios de automoción y grandes marcas de distribución para ofrecer a sus clientes la mejor solución de financiación para sus compras.
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="bg-blue-100 text-[#0085c7] rounded-full p-4 mb-4 inline-block">
                  <DigitalSignatureIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl mb-2">Digitalización</h4>
                <p className="text-gray-600">
                  Somos pioneros en la firma digital y en el desarrollo de herramientas y canales que agilizan al máximo la concesión de crédito, para que financiar una compra sea un proceso fácil, rápido y sin papeleo.
                </p>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="bg-blue-100 text-[#0085c7] rounded-full p-4 mb-4 inline-block">
                  <OperationsManagerIcon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl mb-2">Omnicanalidad</h4>
                <p className="text-gray-600">
                  Ofrecemos nuestros servicios a través de múltiples canales de forma integrada (punto de venta físico, e-commerce, teléfono, etc.) para adaptarnos a las necesidades del cliente y ofrecerle el mejor servicio en todo momento.
                </p>
              </div>
            </div>
          </div>

          {/* Nuestros valores */}
          <div className="bg-slate-50 rounded-lg p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Nuestros valores nos definen</h3>
              <div className="flex justify-center">
                <div className="inline-grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-bold text-lg text-[#0085c7] mb-2">Calidad</h4>
                        <p className="text-gray-600">Buscamos la excelencia en todo lo que hacemos, para ofrecer un servicio de la máxima calidad a nuestros clientes y socios. La innovación, la mejora continua y la eficiencia son ejes clave de nuestra actividad.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-[#0085c7] mb-2">Confianza</h4>
                        <p className="text-gray-600">Es la base de nuestra relación con clientes, empleados, accionistas y la sociedad en general. Actuamos siempre con la máxima transparencia e integridad para mantener y reforzar esta confianza día a día.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-[#0085c7] mb-2">Compromiso social</h4>
                        <p className="text-gray-600">Como parte del Grupo CaixaBank, tenemos un fuerte compromiso con el entorno y contribuimos al desarrollo de una sociedad más justa y con más oportunidades para todos, con especial atención a los colectivos más vulnerables.</p>
                    </div>
                </div>
              </div>
          </div>

          {/* Interactive Map Section */}
          <div className="bg-slate-50 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">Nuestras Sedes Principales</h3>
            <div className="flex justify-center gap-4 mb-6 border-b pb-6">
              {offices.map(office => (
                <button
                  key={office.id}
                  onClick={() => setSelectedOffice(office)}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    selectedOffice.id === office.id
                      ? 'bg-caixa-blue text-white shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {office.id === 'barcelona' ? 'Barcelona' : office.name.split(' ').pop()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 h-96">
                <iframe
                  key={selectedOffice.id}
                  src={selectedOffice.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-md"
                  title={`Mapa de ${selectedOffice.name}`}
                ></iframe>
              </div>
              <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <h4 className="font-bold text-xl text-caixa-blue mb-4">{selectedOffice.name}</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700">{selectedOffice.address}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-700">{selectedOffice.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="text-center border-t pt-8">
               <a 
                  href="https://www.caixabankpc.com/es/quienes-somos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#00a1e0] text-white font-bold py-3 px-6 rounded-none hover:bg-[#0085c7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a1e0] transition-colors duration-300 text-center"
              >
                  Saber más <ExternalLinkIcon className="w-5 h-5 ml-2" />
              </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;