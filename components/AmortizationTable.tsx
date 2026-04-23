
import React from 'react';

export interface AmortizationTableProps {
    importeTotalCredito: number;
    plazo: number;
    tin: number;
    cuotaConSeguro: number;
    costeSeguroMensual: number;
    openingFeeValue?: number;
    openingFeePaymentType?: 'Financiados' | 'Al Contado';
    finalValue?: number;
    startRow?: number; // Pagination start
    endRow?: number;   // Pagination end
    productType?: string | null; // Added productType
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true 
    }).format(value);
};

const AmortizationTable: React.FC<AmortizationTableProps> = ({
    importeTotalCredito,
    plazo,
    tin,
    cuotaConSeguro,
    costeSeguroMensual,
    openingFeeValue = 0,
    openingFeePaymentType = 'Financiados',
    finalValue = 0,
    startRow = 1,
    endRow = 1000,
    productType
}) => {
    
    const isLeasing = productType === 'Leasing';
    const schedule = [];
    
    if (importeTotalCredito > 0 && plazo > 0) {
        let capitalPendiente = importeTotalCredito;
        let capitalAmortizado = 0;
        
        // For Leasing, 'cuotaConSeguro' passed here is Gross. We need Net for amortization calculation.
        // For Linear, it is the total payment.
        // Let's re-derive standard amortization payment.
        
        const monthlyRate = tin / 100 / 12;
        // Standard amortization formula for Net Payment
        // PMT = (PV * r) / (1 - (1+r)^-n)
        // If Leasing (Prepayable): PMT = (PV * r) / (1 - (1+r)^-n) / (1+r)
        
        let netPmt = 0;
        // N terms. Usually term + residual. The loop runs for 'term' months.
        // If Leasing, the 'term' passed is usually e.g. 60.
        // The residual is the 61st payment? Or is it part of the 60th?
        // Typically Leasing is Term + 1 Residual.
        
        const n = isLeasing ? plazo + 1 : plazo; 
        
        if (isLeasing) {
             // Prepayable annuity formula for Net Payment
             const numerator = importeTotalCredito * monthlyRate;
             const denominator = (1 - Math.pow(1 + monthlyRate, -n)) * (1 + monthlyRate);
             netPmt = numerator / denominator;
        } else {
             // Standard annuity formula
             // If finalValue > 0 (Resicuota), different formula.
             // We use the passed `cuotaConSeguro` (minus insurance) as the target PMT for linear usually.
             const cuotaSinSeguroFinanciada = cuotaConSeguro > 0 ? cuotaConSeguro - costeSeguroMensual : 0;
             netPmt = cuotaSinSeguroFinanciada;
        }

        // Loop limit: For leasing, we show 'plazo' installments. Residual is separate or last line.
        // Let's iterate up to 'plazo'.
        const loopLimit = plazo + (finalValue > 0 ? 1 : 0);

        for (let i = 1; i <= loopLimit; i++) {
            if (capitalPendiente <= 0) break; // Prevent over-amortization

            let intereses = capitalPendiente * monthlyRate;
            let amortizacion = 0;
            let currentCuotaSinSeguro = 0;
            
            if (i === loopLimit && !isLeasing) { // Final Adjustments for last installment
                amortizacion = capitalPendiente;
                if (finalValue > 0 && i > plazo) {
                    currentCuotaSinSeguro = finalValue;
                    intereses = 0;
                } else {
                    currentCuotaSinSeguro = amortizacion + intereses;
                }
            } else if (isLeasing && i === loopLimit) {
                // If leasing and this is the balloon (residual), or just final payment
                if (i > plazo && finalValue > 0) {
                     amortizacion = capitalPendiente;
                     currentCuotaSinSeguro = finalValue;
                     intereses = 0;
                } else {
                     currentCuotaSinSeguro = netPmt;
                     amortizacion = currentCuotaSinSeguro - intereses;
                     // Prevent negative balance
                     if (amortizacion > capitalPendiente) {
                         amortizacion = capitalPendiente;
                         currentCuotaSinSeguro = amortizacion + intereses;
                     }
                }
            } else {
                if (isLeasing) {
                    currentCuotaSinSeguro = netPmt;
                    amortizacion = currentCuotaSinSeguro - intereses;
                } else {
                    if (finalValue > 0) {
                        currentCuotaSinSeguro = netPmt;
                        amortizacion = currentCuotaSinSeguro - intereses;
                    } else {
                        amortizacion = netPmt - intereses;
                        currentCuotaSinSeguro = netPmt;
                    }
                }
                
                // Extra check just in case intermediate payments exceed capital
                if (amortizacion > capitalPendiente) {
                     amortizacion = capitalPendiente;
                     currentCuotaSinSeguro = amortizacion + intereses;
                }
            }
            
            let displayCuota = 0;
            let iva = 0;
            
            if (isLeasing) {
                iva = currentCuotaSinSeguro * 0.21;
                displayCuota = currentCuotaSinSeguro + iva;
            } else {
                displayCuota = currentCuotaSinSeguro + costeSeguroMensual;
            }
            
            if (i >= startRow && i <= endRow) {
                schedule.push({
                    nCuota: i,
                    cuotaSinSeguro: currentCuotaSinSeguro,
                    intereses,
                    amortizacion,
                    capitalPendiente, 
                    capitalAmortizado, 
                    cuotaTotal: displayCuota,
                    iva: iva 
                });
            }

            capitalAmortizado += amortizacion;
            capitalPendiente -= amortizacion;
            if (Math.abs(capitalPendiente) < 0.01) capitalPendiente = 0;
        }
    }

    return (
        <div className="w-full bg-white font-sans text-slate-800 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-transparent">
                <h2 className="text-xl font-bold text-black">Cuadro de Amortización</h2>
            </div>

            <div className="flex-grow">
                <table className="w-full text-xs border-collapse table-fixed">
                    <thead>
                        <tr className="bg-slate-100 text-slate-900 font-bold border-none">
                            <th className="py-2 px-1 text-left w-10">Mes</th>
                            <th className="py-2 px-1 text-right">{isLeasing ? 'Cuota Neta' : 'Cuota s/ Seg'}</th>
                            <th className="py-2 px-1 text-right">Intereses</th>
                            <th className="py-2 px-1 text-right">Amortización</th>
                            <th className="py-2 px-1 text-right">Cap. Pendiente</th>
                            {!isLeasing && <th className="py-2 px-1 text-right">Cap. Amortizado</th>}
                            {isLeasing && <th className="py-2 px-1 text-right">IVA (21%)</th>}
                            <th className="py-2 px-1 text-right text-caixa-blue">{isLeasing ? 'Cuota Total' : 'Cuota Total'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, index) => (
                            <tr key={row.nCuota} className={`border-b border-gray-100 ${index % 2 !== 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                <td className="py-1.5 px-1 text-left text-gray-600">{row.nCuota}</td>
                                <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.cuotaSinSeguro)}</td>
                                <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.intereses)}</td>
                                <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.amortizacion)}</td>
                                <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.capitalPendiente)}</td>
                                {!isLeasing && <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.capitalAmortizado)}</td>}
                                {isLeasing && <td className="py-1.5 px-1 text-right text-gray-600">{formatCurrency(row.iva)}</td>}
                                <td className="py-1.5 px-1 text-right font-bold text-caixa-blue">{formatCurrency(row.cuotaTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AmortizationTable;
