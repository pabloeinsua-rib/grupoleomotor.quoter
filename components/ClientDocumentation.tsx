import React, { useState } from 'react';
import { XIcon, FileTextIcon, InfoIcon } from './Icons.tsx';

type ClientType = 'Particulares' | 'Autónomos' | 'Pensionistas' | 'Sociedades' | 'Leasing';

const ClientDocumentation: React.FC = () => {
    const [selectedType, setSelectedType] = useState<ClientType | null>(null);

    const documentationData: Record<ClientType, { title: string, content: React.ReactNode }> = {
        'Particulares': {
            title: 'Documentación para Particulares',
            content: (
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente CaixaBank</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI FÍSICO</strong> en vigor y en color (NO eDNI). En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Numeración de la cuenta de CaixaBank</strong> o tarjeta asociada (no necesario justificar documentalmente).</li>
                            <li><strong>NO necesario justificar ingresos</strong> si tiene nómina/pensión domiciliada en CaixaBank.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente Estándar</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI/NIE FÍSICO</strong> (NO eDNI) o PASAPORTE ORIGINAL EN VIGOR, EN COLOR Y EN PERFECTO ESTADO. En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Justificante de titularidad bancaria</strong> (del año en curso). Donde aparezca el titular o cotitular.</li>
                            <li><strong>Última o penúltima nómina</strong> (mes completo). No se aceptan nóminas en Práctica o en Formación.</li>
                            <li><strong>Nóminas extranjeras:</strong> Solo son válidas si se cobran por una cuenta española.</li>
                        </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-4 border border-slate-200 mt-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Subcasos Especiales (Asalariados)</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Empleador familiar:</strong> Nómina + Modelo 100 (IRPF anual) + Vida Laboral actualizada o Modelo 190.</li>
                            <li><strong>Importes &gt; 25.000€:</strong> Aportar Modelo 100 (IRPF anual) o certificado de retenciones.</li>
                            <li><strong>Baja médica:</strong> Parte de baja, última nómina previa a la baja y apunte de ingreso en cuenta del importe de la última baja.</li>
                            <li><strong>Baja Maternidad/Paternidad:</strong> Resolución de la Seguridad Social, última nómina previa y apunte de ingreso en cuenta del importe de la última baja.</li>
                            <li><strong>Fijos discontinuos:</strong> Última nómina y vida laboral actualizada.</li>
                            <li><strong>Empleadas/os de Hogar:</strong> Última nómina y vida laboral actualizada.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        'Autónomos': {
            title: 'Documentación para Autónomos',
            content: (
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente CaixaBank</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI FÍSICO</strong> en vigor y en color (NO eDNI). En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Numeración de la cuenta de CaixaBank</strong> o tarjeta asociada (no necesario justificar documentalmente).</li>
                            <li><strong>NO necesario justificar ingresos</strong> si tiene ingresos domiciliados en CaixaBank.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente Estándar</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI/NIE FÍSICO</strong> (NO eDNI) o PASAPORTE ORIGINAL EN VIGOR, EN COLOR Y EN PERFECTO ESTADO. En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Justificante de titularidad bancaria</strong> (del año en curso). Donde aparezca el titular o cotitular.</li>
                            <li><strong>Modelo 100 (IRPF anual)</strong> y <strong>modelo 130 o 131</strong> (el que realice) de los trimestres del año en curso. (No se piden trimestrales de IVA 303 ni 390).</li>
                            <li><strong>Modelo 036 o Vida Laboral</strong> para saber el tiempo que lleva en la actividad.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mt-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Subcasos Especiales</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Autónomos con nómina / Autonóminas (Socio-trabajador / Administrador):</strong> Aportar IRPF completo + Autonómina. Las nóminas sin retenciones NO son de asalariado, son autonóminas. En estos casos <strong>NO ES FRAUDE</strong> que figure como asalariado en la nómina y autónomo en la Vida Laboral. <strong>NO presentar modelo 130 ni 131.</strong> En el PDD se pondrá 1 sola paga y el importe de la Casilla 435 del IRPF.</li>
                            <li><strong>Autónomo colaborador:</strong> Nómina de autónomo colaborador y vida laboral actualizada.</li>
                            <li><strong>Baja médica:</strong> Parte de baja, justificante de ingresos previos y apunte de ingreso en cuenta del importe de la última baja.</li>
                            <li><strong>Baja Maternidad/Paternidad:</strong> Resolución de la Seguridad Social y apunte de ingreso en cuenta del importe de la última baja.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        'Pensionistas': {
            title: 'Documentación para Pensionistas',
            content: (
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente CaixaBank</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI FÍSICO</strong> en vigor y en color (NO eDNI). En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Numeración de la cuenta de CaixaBank</strong> o tarjeta asociada (no necesario justificar documentalmente).</li>
                            <li><strong>NO necesario justificar ingresos</strong> si tiene pensión domiciliada en CaixaBank.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente Estándar</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>DNI/NIE FÍSICO</strong> (NO eDNI) o PASAPORTE ORIGINAL EN VIGOR, EN COLOR Y EN PERFECTO ESTADO. En caso de NIE comunitario, incluir carta verde.</li>
                            <li><strong>Justificante de titularidad bancaria</strong> (del año en curso). Donde aparezca el titular o cotitular.</li>
                            <li><strong>Revalorización de la pensión</strong> del año en curso, donde aparezca tipo de pensión y líquido a percibir o Certificado de retenciones.</li>
                            <li>No se aceptan pensiones de orfandad ni ayudas a la dependencia.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        'Sociedades': {
            title: 'Documentación para Sociedades',
            content: (
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Tipos de Sociedades</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Financiables:</strong> S.L., S.A., S. COOP., S.A.T., S.L.L.</li>
                            <li><strong className="text-red-600">NO Financiables:</strong> C.B. (Comunidad de bienes) ni S.C. (Sociedad Colectiva o Civil). Al no tener personalidad jurídica no podemos otorgarles crédito.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Operativa Cliente Estándar (pertenezca o no a CaixaBank)</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Escrituras de constitución</strong>, últimas escrituras de poderes vigentes y cualquier otra relevante.</li>
                            <li><strong>CIF definitivo.</strong></li>
                            <li><strong>Documento acreditativo de la cuenta bancaria</strong> donde aparezcan los 20 dígitos del banco y el nombre de la sociedad.</li>
                            <li><strong>Documento de identidad físico original en vigor y en color</strong> del apoderado. En caso de NIE comunitario, incluir carta verde.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-200 mt-4">
                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-2">Documentación Económica</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>IRPF del administrador.</strong></li>
                            <li><strong>Balance provisional y Cuenta de Pérdidas y Ganancias (PyG) provisional.</strong></li>
                            <li><strong>Si operación tramitada PRIMER SEMESTRE del año:</strong> Último Impuesto Sociedades presentado (Modelo 200) + Balance Cuenta Pérdidas y Ganancias del año anterior + Resumen IVA anual año anterior.</li>
                            <li><strong>Si operación tramitada SEGUNDO SEMESTRE del año:</strong> Último Impuesto Sociedades presentado (Modelo 200) + Balance Cuenta Pérdidas y Ganancias del año en curso + Resumen IVA anual año anterior + Trimestrales IVAs año en curso.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        'Leasing': {
            title: 'Documentación para Leasing',
            content: (
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="bg-slate-50 p-4 border border-slate-200 mb-4">
                        <p className="font-semibold text-black uppercase tracking-widest text-[10px]">Para operaciones de Leasing, se requiere la documentación habitual según la naturaleza jurídica del cliente (Autónomo o Sociedad), más la factura proforma.</p>
                    </div>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Documentación completa de Autónomos o Sociedades</strong> (ver apartados correspondientes).</li>
                        <li><strong>Factura Proforma</strong> del vehículo a financiar.</li>
                    </ul>
                </div>
            )
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 md:p-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">Documentación Cliente</h1>
                <p className="text-slate-500">Selecciona el tipo de cliente para consultar la documentación necesaria a aportar en la solicitud.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(documentationData) as ClientType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className="bg-white border border-slate-200 p-6 flex flex-col items-center justify-center gap-4 hover:border-black hover:shadow-lg transition-all group"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                            <FileTextIcon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold text-black uppercase tracking-widest text-sm">{type}</span>
                    </button>
                ))}
            </div>

            {/* Modal */}
            {selectedType && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-white rounded-none shadow-2xl border border-slate-200 w-full max-w-2xl p-8 relative transform transition-all duration-300 animate-fade-in-up flex flex-col max-h-[90vh]">
                        <button 
                            onClick={() => setSelectedType(null)} 
                            className="absolute top-4 right-4 bg-white text-slate-400 hover:text-black rounded-none transition-colors z-10 p-2"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4 pr-8">
                            <FileTextIcon className="w-8 h-8 text-black" />
                            <h3 className="text-2xl font-bold text-black uppercase tracking-tight">{documentationData[selectedType].title}</h3>
                        </div>
                        
                        <div className="overflow-y-auto pr-2 flex-grow">
                            {documentationData[selectedType].content}

                            {/* Common VO Note */}
                            <div className="mt-6 bg-slate-100 p-4 border-l-4 border-black">
                                <div className="flex items-start gap-3">
                                    <InfoIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-black uppercase tracking-widest text-[10px] mb-1">En caso de Vehículo de Ocasión (VO)</h4>
                                        <p className="text-sm text-slate-700">
                                            Adicionalmente se deberá aportar siempre: <strong>Ficha Técnica</strong> y <strong>Permiso de Circulación</strong> (no importa a nombre de quién esté).<br/>
                                            • Si el vehículo es importado: <strong>Ficha Técnica Española</strong>.<br/>
                                            • Si no se dispone de Permiso o Ficha (o ninguno de los dos), en su lugar es válido un <strong>Informe de Tráfico (Suministro de datos DGT)</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100">
                            <button 
                                onClick={() => setSelectedType(null)}
                                className="w-full bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDocumentation;
