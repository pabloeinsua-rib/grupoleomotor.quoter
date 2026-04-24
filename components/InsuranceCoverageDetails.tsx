import React from 'react';

interface InsuranceCoverageDetailsProps {
    insuranceIncluded: boolean;
}

const InsuranceCoverageDetails: React.FC<InsuranceCoverageDetailsProps> = ({ insuranceIncluded }) => {
    return (
        <div className="w-full bg-white h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-2">
                <div className="bg-slate-100 px-3 py-1.5 w-full">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                        COBERTURAS DE LOS SEGUROS DE PROTECCIÓN DE PAGOS
                    </h2>
                </div>
            </div>

            <div className="space-y-6 text-xs text-slate-800 leading-relaxed font-sans flex-grow">
                
                {/* VIDA + DESEMPLEO / IT */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase">COBERTURAS VIDA + DESEMPLEO / IT</h3>
                    <p className="mb-3 text-[10px] text-slate-500 italic">Cobertura Completa para el titular del préstamo.</p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Fallecimiento e Invalidez</h4>
                            <p>Cubre la liquidación total del préstamo en caso de fallecimiento o invalidez absoluta y permanente del asegurado.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Desempleo (Asalariados)</h4>
                            <p>Cubre el pago de las cuotas mensuales en caso de pérdida involuntaria de empleo para trabajadores con contrato indefinido (hasta 6 cuotas consecutivas).</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Incapacidad Temporal (Autónomos)</h4>
                            <p>Cubre el pago de las cuotas mensuales en caso de baja médica temporal para trabajadores autónomos o con contrato temporal (hasta 6 cuotas consecutivas).</p>
                        </div>
                    </div>
                </div>

                {/* VIDA */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase">COBERTURAS PACK VIDA</h3>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Fallecimiento e Invalidez</h4>
                            <p>Garantiza la cancelación del capital pendiente del préstamo en caso de fallecimiento o invalidez absoluta y permanente.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Enfermedades Graves</h4>
                            <p>Cubre la cancelación del préstamo ante diagnósticos de Cáncer o Infarto de Miocardio (sujeto a periodos de carencia).</p>
                        </div>
                    </div>
                </div>

                {/* VIDA SENIOR */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase">COBERTURAS VIDA SENIOR</h3>
                    <p className="mb-3 text-[10px] text-slate-500 italic">Específico para clientes mayores de 60 años.</p>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Fallecimiento</h4>
                            <p>Cancela el capital pendiente del préstamo para evitar que la deuda recaiga sobre los herederos o familiares en caso de fallecimiento.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEGAL FOOTER */}
            <div className="mt-auto pt-4 border-t border-slate-300 text-[9px] text-slate-500 text-justify leading-tight">
                <p>
                    <strong>1. Información sujeta a las condiciones de la póliza.</strong> Seguro contratado con la entidad aseguradora correspondiente. En caso de suscripción del producto del seguro, la realizará la Entidad Financiera, que hace de intermediario en la contratación del seguro como operador de banca-seguros vinculado y está inscrito en el Registro de Distribuidores de Seguros y Reaseguros de la Dirección de Seguros y Fondos de Pensiones. La Entidad Financiera tiene concertado el correspondiente seguro de responsabilidad civil profesional para la cobertura de las responsabilidades que pudieran surgir por negligencia profesional, todo ello de conformidad con lo establecido en la legislación vigente, y dispone de una capacidad financiera de acuerdo con los requisitos legales.
                </p>
            </div>
        </div>
    );
};

export default InsuranceCoverageDetails;