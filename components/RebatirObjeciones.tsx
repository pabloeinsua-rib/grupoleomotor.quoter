import React, { useState } from 'react';
import PageHeader from './PageHeader.tsx';
import { ChevronDownIcon } from './Icons.tsx';

interface Objection {
  title: string;
  content: string;
}

const objections: Objection[] = [
  {
    title: '“Prefiero pagar al contado.”',
    content: 'Entiendo perfectamente que prefiera no tener deudas, es una opción muy prudente. Sin embargo, ¿ha considerado las ventajas de mantener su dinero trabajando para usted? Al financiar, conserva su liquidez para imprevistos o inversiones. Además, puede acceder a un modelo superior o con más equipamiento por una pequeña diferencia mensual. Pagar al contado es como hacer una gran inversión de golpe; financiarlo le permite dosificar el esfuerzo sin descapitalizarse.',
  },
  {
    title: '“El tipo de interés es muy alto.”',
    content: 'Comprendo su preocupación por el coste. Es importante mirar no solo el tipo de interés (TIN), sino la TAE, que incluye todos los gastos y es la mejor forma de comparar. Nuestras condiciones son muy competitivas y transparentes. Piense en la cuota mensual: por solo una cantidad cómoda al mes, puede disfrutar del coche desde hoy mismo. Además, la financiación a menudo incluye seguros y garantías que, si los contratara por separado, podrían incrementar el coste total. ¿Hacemos un cálculo rápido para ver cuánto representa el interés sobre el total que va a disfrutar?',
  },
  {
    title: '“No quiero endeudarme por tantos años.”',
    content: 'Es una postura muy responsable. Por eso ofrecemos plazos totalmente flexibles. Podemos ajustarlo a un periodo en el que se sienta más cómodo, por ejemplo, 4 o 5 años, para que la deuda no se alargue. Una cuota un poco más alta durante menos tiempo puede ser una opción excelente. Además, recuerde que siempre tiene la opción de hacer una cancelación anticipada, parcial o total, con unas comisiones muy bajas. La flexibilidad es total, la idea es encontrar la fórmula que le dé tranquilidad.',
  },
  {
    title: '“Es un proceso muy largo y complicado.”',
    content: 'Todo lo contrario. Hemos simplificado el proceso al máximo para que sea lo más cómodo posible para usted. Con la firma digital, podemos tener la aprobación y formalización en cuestión de horas, a veces minutos, и todo desde su móvil sin necesidad de desplazarse. Usted solo necesita su DNI. Nosotros nos encargamos de todo el papeleo. Hoy mismo podría salir conduciendo su coche nuevo sin esperas.',
  },
  {
    title: '“Ya tengo una oferta de mi banco.”',
    content: 'Es excelente que haya explorado otras opciones. La ventaja de financiar directamente con nosotros es la comodidad y la agilidad: gestionamos todo en un solo lugar y de forma integrada con la compra del vehículo. A menudo, nuestras financieras especializadas ofrecen condiciones más flexibles y adaptadas al sector del automóvil, como periodos de carencia o seguros específicos que un banco generalista no suele contemplar. Si me permite, podemos hacer una simulación sin compromiso. Se sorprenderá de lo competitivos que podemos ser, no solo en precio, sino en servicio.'
  },
  {
    title: '“No necesito el seguro, mi seguro de coche ya lo cubre todo.”',
    content: 'Entiendo. Es importante saber que el seguro que ofrecemos es de protección de pagos. No cubre el coche, le cubre a usted. Si por desempleo o incapacidad no puede pagar la cuota, el seguro lo hace por usted. Es una tranquilidad adicional para su familia que no afecta a su seguro de auto.'
  }
];

const RebatirObjeciones: React.FC = () => {
    const [openObjection, setOpenObjection] = useState<string | null>(objections[0].title);

    const toggleObjection = (title: string) => {
        setOpenObjection(openObjection === title ? null : title);
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-4">
                {objections.map((objection) => (
                    <div key={objection.title} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <button
                            onClick={() => toggleObjection(objection.title)}
                            className="w-full flex justify-between items-center text-left p-6 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00a1e0]"
                            aria-expanded={openObjection === objection.title}
                        >
                            <span className="font-bold text-lg text-gray-800">{objection.title}</span>
                            <span className={`transform transition-transform duration-300 ${openObjection === objection.title ? 'rotate-180' : ''}`}>
                                <ChevronDownIcon className="w-6 h-6 text-[#00a1e0]" />
                            </span>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openObjection === objection.title ? 'max-h-[1000px]' : 'max-h-0'}`}
                        >
                            <div className="p-6 pt-0 text-gray-600 prose prose-sm max-w-none">
                                <p>{objection.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RebatirObjeciones;
