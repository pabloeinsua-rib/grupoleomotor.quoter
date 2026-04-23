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
                
                {/* PACK VIDA */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">COBERTURAS PACK VIDA</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Fallecimiento (F)</h4>
                            <p>Proporciona al asegurado la garantía de liquidar el capital pendiente del préstamo en caso de fallecimiento, sea por enfermedad o accidente.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Gran Invalidez (GI)</h4>
                            <p>Proporciona al asegurado la garantía de liquidar el capital pendiente del préstamo en caso de gran invalidez, sea por enfermedad o accidente.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Cáncer (CAN)</h4>
                            <p>Proporciona al asegurado la garantía de liquidar el capital pendiente del préstamo en caso de diagnóstico de cáncer (tras 30 días de carencia).</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Infarto de Miocardio (INF)</h4>
                            <p>Proporciona al asegurado la garantía de liquidar el capital pendiente del préstamo en caso de que sufra un infarto de miocardio agudo, con muerte o necrosis de parte del músculo cardíaco producidas por un insuficiente aporte sanguíneo, siempre que hayan transcurrido más de 30 días desde la fecha de inicio de vigencia de la operación de seguro, y que no concurra supuesto de exclusión.</p>
                        </div>
                    </div>
                </div>

                {/* PACK PROTECCIÓN */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">COBERTURAS PACK PROTECCIÓN</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Vida + Desempleo (D)</h4>
                            <p>Cubre la pérdida del empleo para trabajadores por cuenta ajena indefinidos. Indemnización de la cuota (máx 400€/mes, 6 meses). Franquicia 30 días, Carencia 60 días.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-caixa-blue text-xs">Vida + Incapacidad Temporal (IT)</h4>
                            <p>Cubre la incapacidad temporal (baja médica) para Autónomos o temporales. Indemnización de la cuota (máx 400€/mes, 6 meses). Franquicia 30 días, Carencia 30 días.</p>
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