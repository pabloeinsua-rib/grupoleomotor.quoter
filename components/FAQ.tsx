
import React, { useState, useMemo } from 'react';
import PageHeader from './PageHeader.tsx';
import type { View } from '../App.tsx';

interface FAQProps {
  navigateTo?: (view: View) => void;
}

const FAQ: React.FC<FAQProps> = ({ navigateTo }) => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = useMemo(() => [
    // Mis Contraseñas
    {
      section: 'Mis Contraseñas',
      question: '¿Cuál es mi usuario y cómo obtengo mi contraseña?',
      answer: (
        <>
          <p>Tu <strong>usuario</strong> es siempre tu <strong>DNI/NIE con letra</strong>. La <strong>contraseña</strong> se genera desde la web de tramitación. Si no la recuerdas, puedes restablecerla fácilmente.</p>
        </>
      ),
    },
    // Ofertas de Cuotas
    {
      section: 'Ofertas de Cuotas',
      question: '¿Cómo puedo simular una oferta de cuotas para un cliente?',
      answer: (
        <>
          <p>Utiliza el <strong>Simulador Financiero</strong> para generar ofertas de cuotas precisas y detalladas. Es una herramienta clave para agilizar el proceso de venta y mostrar al cliente todas sus opciones.</p>
          
          <h5 className="font-bold mt-3">¿Qué datos se necesitan?</h5>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Tipo de operación:</strong> Financiación o Leasing.</li>
            <li><strong>Datos del vehículo:</strong> Si es nuevo o matriculado y, en este último caso, su fecha de matriculación para calcular los plazos máximos.</li>
            <li><strong>Tipo de cliente:</strong> Asalariados, Autónomos o Sociedades.</li>
            <li><strong>Datos económicos:</strong> Precio de venta, entrada que aporta el cliente, plazo deseado y tipo de interés (TIN) negociado.</li>
          </ul>

          <h5 className="font-bold mt-3">¿Cómo interpretar los resultados?</h5>
          <p className="mt-1">Una vez introducidos los datos, el simulador te mostrará la <strong>cuota mensual estimada</strong>. Al pulsar en <strong>"Ver Oferta Completa"</strong>, obtendrás un desglose detallado que incluye:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Importe total a financiar:</strong> Suma del capital solicitado más los gastos de apertura.</li>
            <li><strong>Coste del seguro:</strong> Si se ha incluido, se muestra el coste mensual.</li>
            <li><strong>TAE (Tasa Anual Equivalente):</strong> El indicador clave que refleja el coste total del crédito, incluyendo intereses y gastos. Es el mejor valor para comparar diferentes ofertas.</li>
            <li><strong>Cuadro de amortización:</strong> Una tabla que muestra, mes a mes, qué parte de la cuota se destina a amortizar capital y qué parte a pagar intereses.</li>
          </ul>

          <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('simulator')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Ir al Simulador &rarr;
            </button>
          </div>
        </>
      ),
    },
    // Coberturas de Seguros
    {
      section: 'Coberturas de Seguros',
      question: '¿Qué seguros puedo ofrecer y qué cubren?',
      answer: (
        <>
          <p>Puedes ofrecer el <strong>Pack Vida</strong> (cubre Fallecimiento, Gran Invalidez, Cáncer e Infarto) y el <strong>Pack Protección</strong> (añade Desempleo para asalariados o Incapacidad Temporal para autónomos). Consulta la sección de coberturas para ver todos los detalles, condiciones y packs vigentes.</p>
          <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('insuranceCoverage')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Ver Coberturas de Seguros &rarr;
            </button>
          </div>
        </>
      ),
    },
     {
      section: 'Coberturas de Seguros',
      question: '¿Es obligatorio hacer alguna formación para vender seguros?',
      answer: (
        <>
        <p>Sí, es <strong>obligatorio y fundamental</strong> realizar la formación anual en materia de seguros para poder comercializar las protecciones. Es un requisito legal para garantizar el correcto asesoramiento al cliente.</p>
        <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('annualTraining')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Acceder a la Formación Anual &rarr;
            </button>
          </div>
        </>
      ),
    },
    // Tramitar/Modificar Solicitudes
    {
      section: 'Tramitar/Modificar Solicitudes',
      question: '¿Cómo puedo iniciar una nueva solicitud o modificar una existente?',
      answer: (
        <>
          <p>Puedes gestionar tus solicitudes de forma online a través de la plataforma web o con la ayuda de un agente por teléfono. Ambas opciones están disponibles en la sección 'Tramitar / Modificar Solicicitud'.</p>
          
          <div className="mt-4 bg-slate-50 p-4 rounded-lg">
            <h5 className="font-bold text-gray-800">Vía Web (Recomendado)</h5>
            <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
              <li>Desde "Gestionar Solicitudes", pulsa en "Ir a la web" en la tarjeta "Tramitar / Modificar Solicitud Web".</li>
              <li>Accede con tu usuario (DNI/NIE) y la contraseña que recibes por SMS.</li>
              <li><strong>Para una nueva solicitud:</strong> Pulsa "Nueva oferta y solicitud" y sigue los pasos para introducir los datos de inicio, financiación y del titular.</li>
              <li><strong>Para modificar una solicitud:</strong> Dentro de la plataforma, ve a "Mis Operaciones". Utiliza el buscador para encontrar la solicitud (por DNI, nº de solicitud, etc.) y haz los cambios necesarios.</li>
            </ol>
          </div>

          <div className="mt-4 bg-slate-50 p-4 rounded-lg">
            <h5 className="font-bold text-gray-800">Por Teléfono</h5>
             <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
              <li>Desde "Gestionar Solicitudes", pulsa "Contactar" en la tarjeta "Tramitar / Modificar por Teléfono".</li>
              <li><strong>Ten a mano toda la documentación</strong> del cliente antes de llamar.</li>
              <li><strong>Para una nueva solicitud:</strong> El agente te solicitará tu código de concesionario para iniciar el proceso.</li>
              <li><strong>Para modificar una solicitud:</strong> Facilita al agente el DNI del titular o el número de la solicitud que quieres modificar.</li>
            </ol>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('requestProcessing')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Ir a Tramitar Solicitud &rarr;
            </button>
          </div>
        </>
      ),
    },
    {
      section: 'Tramitar/Modificar Solicitudes',
      question: '¿Qué significan los estados: Aprobada, Denegada o En Estudio?',
      answer: (
        <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <h5 className="font-bold text-green-800">APROBADA / PRE-AUTORIZADA</h5>
                <p className="mt-1"><strong>¿Qué significa?</strong> ¡Buenas noticias! La solicitud ha superado los criterios iniciales de riesgo y está pre-aprobada.</p>
                <p className="mt-2"><strong>¿Qué debo hacer?</strong> El siguiente paso es fundamental: debes <strong>subir toda la documentación</strong> solicitada para que el equipo de validación pueda verificarla. La aprobación final depende de que la documentación sea correcta y completa. Una vez validada, podrás proceder a la firma del contrato.</p>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <h5 className="font-bold text-yellow-800">EN ESTUDIO</h5>
                <p className="mt-1"><strong>¿Qué significa?</strong> La operación está siendo analizada por el equipo de analistas de CaixaBank Payments & Consumer. Esto puede ocurrir porque se necesita una revisión manual o porque falta alguna información.</p>
                <p className="mt-2"><strong>¿Qué debo hacer?</strong> Ten paciencia. Consulta el estado en la plataforma o en la APP "Mi Gestor" por si se solicita documentación adicional. Si es necesario, el equipo de soporte se pondrá en contacto contigo. Para agilizar el proceso, asegúrate de haber enviado toda la documentación necesaria desde el principio.</p>
            </div>
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <h5 className="font-bold text-red-800">DENEGADA</h5>
                <p className="mt-1"><strong>¿Qué significa?</strong> La solicitud no cumple con los criterios de aceptación y política de riesgos de la entidad.</p>
                <p className="mt-2"><strong>¿Qué debo hacer?</strong> La decisión es definitiva y <strong>no se puede recurrir</strong>. Es importante comunicar esto al cliente con transparencia para no generar falsas expectativas. No se proporcionarán los motivos exactos de la denegación para cumplir con la normativa de protección de datos.</p>
            </div>
        </div>
      ),
    },
    // Documentación
    {
      section: 'Documentación',
      question: '¿Qué es una "Autonómina" y cómo se tramita?',
      answer: (
        <>
          <p>Una <strong>autonómina</strong> es una nómina que percibe un trabajador asalariado (por lo general socio de la empresa o directivo) <strong>sin retenciones</strong>.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
             <li>Estas nóminas solo sirven para ver quién es el pagador y la antigüedad.</li>
             <li>Las tratamos internamente como situación laboral de <strong>Autónomo</strong>, es totalmente legal.</li>
             <li>En la Vida Laboral constará como Autónomo (esto no es fraude).</li>
             <li>A la hora de tramitar, se pedirá obligatoriamente el <strong>IRPF</strong> y se utilizará el importe de la <strong>Casilla 435</strong> como ingresos, indicando "1 paga".</li>
             <li><strong>NO</strong> se solicitarán los modelos 130 ni 131.</li>
          </ul>
        </>
      ),
    },
    {
      section: 'Documentación',
      question: '¿Qué documentación es necesaria para un particular?',
      answer: (
        <>
          <p>Varía si es cliente de CaixaBank o no. Para clientes de CaixaBank con ingresos domiciliados, solo se necesita DNI y tarjeta/CCC. Para el resto, se requiere DNI, certificado de cuenta, y justificantes de ingresos (nómina, IRPF, etc.).</p>
        </>
      ),
    },
    {
      section: 'Documentación',
      question: '¿Cómo envío la documentación de una operación?',
      answer: (
        <>
          <p>La forma más rápida es <strong>adjuntarla directamente en la web</strong> durante la tramitación. Si no es posible, puedes usar los buzones de correo electrónico designados, indicando siempre en el asunto el DNI del titular o el nº de solicitud.</p>
        </>
      ),
    },
    // Formalización y Abono
    {
      section: 'Formalización y Abono',
      question: '¿Qué opciones de firma de contrato existen?',
      answer: (
        <>
          <p>La opción principal y más ágil es la <strong>Firma Digital a través de la App</strong>. También existen opciones de firma en papel (para sociedades o clientes sin email), a distancia por gestoría (si el cliente está a más de 55km) o ante notario para operaciones de importe elevado.</p>
           <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('digitalSignature')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Ver Opciones de Firma &rarr;
            </button>
          </div>
        </>
      ),
    },
    {
      section: 'Formalización y Abono',
      question: 'Una vez firmado el contrato, ¿cuándo se realiza el abono?',
      answer: 'Tras la firma (especialmente con la Firma Digital), la solicitud pasa automáticamente a la cola de pagos. Una vez el equipo de validación verifica que toda la documentación es correcta, se procede al abono de la operación. Recibirás una carta de pago en tu correo electrónico.',
    },
    // Soporte y Ayuda
    {
      section: 'Soporte y Ayuda',
      question: 'Tengo una duda específica sobre una operación, ¿a quién contacto?',
      answer: (
        <>
          <p>Tienes a tu disposición el equipo de <strong>Soporte al Comercial</strong>. Son un equipo especializado que puede ayudarte a tramitar, modificar o resolver cualquier duda sobre tus operaciones. Puedes llamar por teléfono o contactar por email.</p>
          <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('commercialSupport')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Contactar con Soporte &rarr;
            </button>
          </div>
        </>
      ),
    },
    {
      section: 'Soporte y Ayuda',
      question: 'Mi cliente tiene una consulta sobre su contrato ya activo, ¿dónde debe dirigirse?',
      answer: (
        <>
          <p>Para cualquier gestión post-venta (cancelaciones, cambio de cuenta, copias de contrato, etc.), el cliente debe contactar directamente con <strong>Atención al Cliente Final</strong>. Disponen de un teléfono gratuito y un área privada en la web.</p>
          <div className="mt-4">
            <button
              onClick={() => navigateTo && navigateTo('customerSupport')}
              className="text-sm font-semibold text-[#0085c7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00a1e0] rounded-none"
            >
              Ver Datos de Atención al Cliente &rarr;
            </button>
          </div>
        </>
      ),
    },
  ], [navigateTo]);


  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return faqData;
    return faqData.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, faqData]);

  const groupedFaqs = useMemo(() => {
    return filteredFaqs.reduce((acc, faq) => {
      (acc[faq.section] = acc[faq.section] || []).push(faq);
      return acc;
    }, {} as Record<string, typeof faqData>);
  }, [filteredFaqs]);

  const toggleQuestion = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-10 w-full">
      <div className="max-w-7xl mx-auto">
        <PageHeader title={['PREGUNTAS', 'FRECUENTES']} descriptiveText="Tu chuleta para el día a día. Respuestas rápidas a las dudas más comunes." showBackButton={true} onGoBack={() => {}} />
        
        <div className="mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Busca por palabra clave (p. ej. 'documentación', 'fraude'...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00a1e0] transition-shadow shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            {Object.keys(groupedFaqs).length > 0 ? (
                Object.entries(groupedFaqs).map(([section, faqs]) => (
                    <div key={section} className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mt-4 mb-2 pt-4 border-t">{section}</h3>
                        {Array.isArray(faqs) && faqs.map((faq) => (
                          <div key={faq.question} className="border-b border-gray-200">
                              <button
                                  onClick={() => toggleQuestion(faq.question)}
                                  className="w-full flex justify-between items-center text-left py-5 px-2 hover:bg-slate-50 transition-colors rounded-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00a1e0]"
                                  aria-expanded={openQuestion === faq.question}
                              >
                                  <span className="font-semibold text-gray-800">{faq.question}</span>
                                  <span className={`transform transition-transform duration-300 ${openQuestion === faq.question ? 'rotate-180' : ''}`}>
                                      <svg className="w-5 h-5 text-[#00a1e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </span>
                              </button>
                              <div
                                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openQuestion === faq.question ? 'max-h-[10000px]' : 'max-h-0'}`}
                              >
                                  <div className="p-4 pt-0 text-gray-600 prose prose-sm max-w-none">
                                      {faq.answer}
                                  </div>
                              </div>
                          </div>
                        ))}
                    </div>
                ))
            ) : (
              <div className="text-center py-12">
                  <p className="text-gray-600 font-semibold">No se encontraron resultados para tu búsqueda.</p>
                  <p className="text-gray-500 mt-2">Intenta con otras palabras clave.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
