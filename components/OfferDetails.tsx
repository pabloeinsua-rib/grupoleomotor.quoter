
import React from 'react';
import AmortizationTable from './AmortizationTable.tsx';
import InsuranceCoverageDetails from './InsuranceCoverageDetails.tsx';

export interface OfferDetailsData {
    pvp: number;
    entrada: number;
    importeAFinanciar: number;
    plazo: number;
    gastosApertura: number;
    importeTotalCredito: number;
    totalIntereses: number;
    importeTotalAdeudado: number;
    costeTotalCredito: number;
    precioTotalAPlazos: number;
    extendedWarranty?: number;
    residualValue?: number; // Added for Leasing
    interestRate?: number;
    tae?: number;
    commissionValue?: number;
}

interface OfferDetailsProps {
  data: OfferDetailsData;
  monthlyPayment: number | null;
  tin: number;
  tae: number | null;
  insuranceIncluded: boolean;
  clientType: string | null;
  vehicleType: string | null;
  isCuotaSolucion?: boolean;
  finalValuePercentage?: number;
  insuranceType?: string;
  productType?: string | null;
  monthlyPaymentNet?: number | null; // For Leasing
  residualValue?: number | null; // For Leasing
  showCommission?: boolean;
  showFullAmortization?: boolean;
}

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '0,00 €';
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatPercent = (value: number | null) => {
    if (value === null) return '...';
    return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Compact Data Row for the "Datos Económicos" section
const DataRow = ({ label, value, subtext }: { label: string; value: string; subtext?: string }) => (
    <div className="flex justify-between items-baseline py-1">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <div className="text-right">
            <span className="text-sm font-bold text-slate-900 block">{value}</span>
            {subtext && <span className="text-[10px] text-slate-500 italic block">{subtext}</span>}
        </div>
    </div>
);

// Helper to get documentation list based on client type
const getDocumentationList = (clientType: string | null, amount: number) => {
    const list: string[] = [];
    
    if (clientType === 'Sociedades') {
        list.push("DNI/NIE del Administrador.");
        list.push("CIF Definitivo de la Empresa.");
        list.push("Escrituras de Constitución y Poderes.");
        list.push("Impuesto Sociedades (Mod. 200).");
        list.push("Resumen IVA (Mod. 390) y Trimestrales.");
        list.push("Certificado de Titularidad Bancaria.");
    } else if (clientType === 'Autónomos') {
        list.push("DNI/NIE en color y vigor.");
        list.push("Certificado de cuenta bancaria.");
        list.push("IRPF (Modelo 100).");
        list.push("Trimestrales (M. 130/131) salvo si aporta Autonómina.");
        list.push("Vida Laboral o Impreso 036.");
    } else {
        // Particulares (Default)
        list.push("DNI/NIE en color y vigor.");
        list.push("Certificado de cuenta bancaria.");
        list.push("Asalariados: Última nómina.");
        list.push("Pensionistas: Carta Revalorización.");
        if (amount > 25000) {
            list.push("IRPF (Mod. 100) completo.");
        }
    }
    return list;
};

const OfferDetails: React.FC<OfferDetailsProps> = ({ 
    data, 
    monthlyPayment, 
    tin, 
    tae, 
    insuranceIncluded, 
    clientType, 
    vehicleType, 
    isCuotaSolucion, 
    finalValuePercentage,
    insuranceType = "Vida + Desempleo / IT",
    productType,
    monthlyPaymentNet,
    residualValue,
    showCommission,
    showFullAmortization = false
}) => {
    const today = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Calculate final quota value if Cuota Solución
    const finalValue = isCuotaSolucion && finalValuePercentage ? data.pvp * (finalValuePercentage / 100) : 0;
    const years = Math.floor(data.plazo / 12);
    const yearsText = years > 0 ? `(${years} ${years === 1 ? 'año' : 'años'})` : '';

    // Insurance text logic
    const isCompany = clientType === 'Sociedades';
    const isLeasing = productType === 'Leasing';
    
    let insuranceText = insuranceType;
    if (isLeasing) {
        insuranceText = 'Sin Seguro';
    } else if (isCompany) {
        insuranceText = 'Sin Protección (Empresas)';
    } else if (insuranceType === 'Sin Protección') {
        insuranceText = 'No Incluido';
    } else if (insuranceType === 'Vida Senior') {
        insuranceText = 'P. Vida Senior Plus (+ 60 años)';
    } else if (insuranceType === 'Vida') {
        insuranceText = 'P. Básico Plus';
    } else if (insuranceType === 'Vida + Desempleo / IT') {
        insuranceText = 'P. Desempleo Plus';
    }

    const docsList = getDocumentationList(clientType, data.importeAFinanciar);

    // --- PDF LAYOUT CONSTANTS (A4) ---
    // 210mm x 297mm
    const PAGE_STYLE = "h-[297mm] w-[210mm] bg-white text-slate-800 font-sans p-[15mm] relative box-border flex flex-col";

    // Split rows for amortization table pages
    // Assuming Page 2 fits ~49 rows and Page 3 fits the rest
    const SPLIT_INDEX = 49;

    return (
        <div className="w-[210mm] bg-white">
            
            {/* ---------------- PAGE 1: RESUMEN OFERTA ---------------- */}
            <div className={PAGE_STYLE}> 
                
                {/* HEADER */}
                <div className="flex justify-between items-start pb-4 border-b-2 border-transparent mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">Su Oferta Financiera Personalizada</h1>
                        <p className="text-sm text-black mt-1 font-bold">{today}</p>
                    </div>
                </div>

                {/* DATOS ECONÓMICOS HEADER */}
                <div className="bg-slate-100 px-3 py-1.5 mb-4">
                    <h3 className="text-sm font-bold text-black">Datos Económicos</h3>
                </div>

                {/* DATOS ECONÓMICOS GRID */}
                <div className="grid grid-cols-2 gap-x-20 gap-y-1 mb-8 text-sm">
                    {/* Left Col */}
                    <div className="space-y-1">
                        <div className="flex justify-between font-bold">
                            <span>{isLeasing ? 'Precio Base (Sin IVA)' : 'PVP'}</span>
                            <span>{formatCurrency(data.pvp)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>{isLeasing ? 'Entrada (IVA Incluido)' : 'Entrada'}</span>
                            <span>{formatCurrency(data.entrada)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>{isLeasing ? 'Importe a Financiar (Neto)' : 'Importe a Financiar'}</span>
                            <span>{formatCurrency(data.importeAFinanciar)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Plazo</span>
                            <span>{data.plazo} {isLeasing ? '+ 1 ' : ''}meses</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>{isLeasing ? 'Gastos de Apertura (Neto)' : 'Gastos de Apertura'}</span>
                            <span>{formatCurrency(data.gastosApertura)}</span>
                        </div>
                        <div className="text-[10px] italic">Incluidos en Cuota</div>
                    </div>
                    {/* Right Col */}
                    <div className="space-y-1">
                        <div className="flex justify-between font-bold"><span>Importe Total Crédito</span><span>{formatCurrency(data.importeTotalCredito)}</span></div>
                        <div className="flex justify-between font-bold"><span>Total Intereses</span><span>{formatCurrency(data.totalIntereses)}</span></div>
                        <div className="flex justify-between font-bold"><span>Importe Total Adeudado</span><span>{formatCurrency(data.importeTotalAdeudado)}</span></div>
                        <div className="flex justify-between font-bold"><span>Coste Total del Crédito</span><span>{formatCurrency(data.costeTotalCredito)}</span></div>
                        <div className="flex justify-between font-bold"><span>Precio Total a Plazos</span><span>{formatCurrency(data.precioTotalAPlazos)}</span></div>
                        <div className="text-[10px] italic">Incl. Entrada</div>
                        {isLeasing && residualValue && (
                             <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                <span>Valor Residual (Neto)</span>
                                <span>{formatCurrency(residualValue)}</span>
                            </div>
                        )}
                         {isLeasing && residualValue && (
                             <div className="flex justify-between font-bold">
                                <span>Valor Residual (IVA Inc.)</span>
                                <span>{formatCurrency(residualValue * 1.21)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* HERO BLUE BOX (QUOTA) */}
                <div className="flex w-full mb-8 h-48 border border-slate-200">
                    {/* Left Blue Part */}
                    <div className="bg-white text-black p-6 flex-grow relative flex flex-col justify-center">
                        <p className="text-xs font-bold uppercase tracking-widest mb-1 text-slate-500">{isLeasing ? 'Cuota (Con IVA)' : 'Cuota'}</p>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-6xl font-light tracking-tighter">{formatCurrency(monthlyPayment).replace(' €', '').replace('.', '')}</span>
                            <span className="text-3xl font-light text-slate-400">€/mes</span>
                        </div>
                        {isLeasing && monthlyPaymentNet && (
                             <div className="flex items-baseline gap-2 mb-2 opacity-90">
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Sin IVA:</span>
                                <span className="text-lg font-bold">{formatCurrency(monthlyPaymentNet)}</span>
                            </div>
                        )}
                        <p className="text-xl font-light mb-4">{data.plazo} meses <span className="font-normal text-slate-500">{yearsText}</span></p>
                        
                        <div className="text-[10px] font-bold uppercase tracking-widest leading-tight text-slate-500 space-y-1">
                            <p>Gastos de Apertura {isLeasing ? '(Netos)' : ''} y Cuota Mensual de Seguro {isLeasing ? '(No Aplica)' : ''} Incluido en la cuota.</p>
                            <p>Seguro: {insuranceText}</p>
                            <p>SISTEMA DE PAGO FRANCÉS {isLeasing ? '(PREPAGABLE)' : ''}</p>
                        </div>
                    </div>

                    {/* Right Black Part (TIN/TAE) */}
                    <div className="bg-black w-48 flex flex-col">
                        <div className="flex-1 p-4 flex flex-col justify-center border-b border-slate-800">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">T.I.N.</p>
                            <p className="text-3xl font-light text-white">{formatPercent(tin)}%</p>
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-center">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">(*) T.A.E.</p>
                            <p className="text-3xl font-light text-white">{formatPercent(tae)}%</p>
                        </div>
                        {showCommission && data.commissionValue !== undefined && (
                            <div className="flex-1 p-4 flex flex-col justify-center border-t border-slate-800 bg-slate-900">
                                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-widest">Comisión (Ref.)</p>
                                <p className="text-xl font-light text-white">{formatCurrency(data.commissionValue)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AVISO LEGAL */}
                <div className="border-b border-black pb-1 mb-2">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-widest">AVISO LEGAL</h4>
                </div>
                <div className="mb-8 text-[10px] text-slate-600 text-justify leading-tight">
                    <p className="mb-2">Documento NO contractual. Los cálculos y datos aquí reproducidos no constituyen oferta vinculante alguna. Importes ofrecidos de carácter informativo, no vinculantes. Sujeta a estudio y autorización por parte de la Entidad Financiera.</p>
                    <p className="mb-2">PUBLICIDAD: (*) Oferta financiera ofrecida por la Entidad Financiera, y sujeta a su autorización.</p>
                    <p>(*) Coste mensual de Seguro/s no incluido en cálculo T.A.E.. Seguro/s de carácter opcional. Incluido/s en la mensualidad pero no en el capital financiado.</p>
                </div>

                {/* DOCUMENTACIÓN NECESARIA */}
                <div className="border-b border-black pb-1 mb-2">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-widest">Documentación Necesaria Estudio Solicitud</h4>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 mb-6 space-y-1 pl-2">
                    {docsList.map((doc, i) => (
                        <li key={i}>{doc}</li>
                    ))}
                </ul>

                {/* VENTAJAS */}
                <div className="border-b border-black pb-1 mb-2">
                    <h4 className="text-[10px] font-bold text-black uppercase tracking-widest">Ventajas de Financiar su Nuevo Vehículo en su Concesionario Oficial</h4>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-2 leading-tight">
                    <li>Mantenga su capacidad de crédito con su entidad bancaria habitual.</li>
                    <li>COBERTURA TOTAL. No es necesaria Entrada.</li>
                    <li>TIPOS DE INTERÉS FIJOS. Sepa de antemano lo que va a pagar.</li>
                    <li>FLEXIBILIDAD. Hasta 120 meses (en función de la edad del vehículo).</li>
                    <li>SIN CAMBIAR DE BANCO. Domicilie los recibos en su entidad bancaria habitual.</li>
                    <li>AGILIDAD EN LA TRAMITACIÓN.</li>
                    <li>AGILIDAD EN LA CONTRATACIÓN. Firma digital presencial en Concesionario.</li>
                </ul>
            </div>

            {/* ---------------- PAGE 2: AMORTIZATION PART 1 ---------------- */}
            {showFullAmortization && (
                <div className={PAGE_STYLE}>
                     <AmortizationTable 
                        importeTotalCredito={data.importeTotalCredito}
                        plazo={data.plazo}
                        tin={tin}
                        cuotaConSeguro={monthlyPayment || 0}
                        costeSeguroMensual={0} 
                        openingFeeValue={data.gastosApertura}
                        finalValue={finalValue}
                        startRow={1}
                        endRow={SPLIT_INDEX}
                        productType={productType}
                    />
                </div>
            )}

            {/* ---------------- PAGE 3: AMORTIZATION PART 2 (If needed) ---------------- */}
            {showFullAmortization && data.plazo > SPLIT_INDEX && (
                <div className={PAGE_STYLE}>
                    <AmortizationTable 
                        importeTotalCredito={data.importeTotalCredito}
                        plazo={data.plazo}
                        tin={tin}
                        cuotaConSeguro={monthlyPayment || 0}
                        costeSeguroMensual={0} 
                        openingFeeValue={data.gastosApertura}
                        finalValue={finalValue}
                        startRow={SPLIT_INDEX + 1}
                        endRow={SPLIT_INDEX * 2}
                        productType={productType}
                    />
                </div>
            )}

            {/* ---------------- PAGE 4: AMORTIZATION PART 3 (If needed) ---------------- */}
            {showFullAmortization && data.plazo > SPLIT_INDEX * 2 && (
                <div className={PAGE_STYLE}>
                    <AmortizationTable 
                        importeTotalCredito={data.importeTotalCredito}
                        plazo={data.plazo}
                        tin={tin}
                        cuotaConSeguro={monthlyPayment || 0}
                        costeSeguroMensual={0} 
                        openingFeeValue={data.gastosApertura}
                        finalValue={finalValue}
                        startRow={SPLIT_INDEX * 2 + 1}
                        endRow={SPLIT_INDEX * 3}
                        productType={productType}
                    />
                </div>
            )}

            {/* ---------------- PAGE 5: INSURANCE COVERAGE (Conditional) ---------------- */}
            {showFullAmortization && !isLeasing && (
                <div className={PAGE_STYLE}>
                    <InsuranceCoverageDetails insuranceIncluded={true} /> 
                </div>
            )}
        </div>
    );
};

export default OfferDetails;
