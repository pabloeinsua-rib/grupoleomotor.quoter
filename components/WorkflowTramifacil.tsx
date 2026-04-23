
import React from 'react';
import { SavedOfferData } from '../App.tsx';
import { AnalysisResult } from './PackageDocumentation.tsx';

interface WorkflowTramifacilProps {
    savedOfferData: SavedOfferData | null;
    analysisResult: AnalysisResult | null;
}

// Helper components
const PddSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="bg-white p-4 rounded shadow mb-4">
        <h4 className="font-bold border-b pb-2 mb-2">{title}</h4>
        {children}
    </div>
);

const PddRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex justify-between py-1 border-b border-gray-100">
        <span className="text-gray-600 text-sm">{label}</span>
        <span className="font-semibold text-sm">{value || '-'}</span>
    </div>
);

const WorkflowTramifacil: React.FC<WorkflowTramifacilProps> = ({ savedOfferData, analysisResult }) => {
    const pdd = analysisResult?.pdd || {};
    const finalData = savedOfferData;
    
    // Fix logic for monthly payment
    const monthlyPaymentValue = finalData?.monthlyPayment;
    const displayMonthlyPayment = monthlyPaymentValue 
        ? new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monthlyPaymentValue) + ' €' 
        : '...';

    // Logic for License Plate
    const matriculaDisplay = pdd.datosVehiculo?.matricula 
        ? pdd.datosVehiculo.matricula.replace(/\s+/g, '').toUpperCase() 
        : '';
        
    const powerString = pdd.datosVehiculo?.potenciaKW 
        ? `${pdd.datosVehiculo.potenciaKW} KW / ${pdd.datosVehiculo.potenciaCV || (pdd.datosVehiculo.potenciaKW * 1.36).toFixed(2)} CV` 
        : '-';

    return (
         <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">8. Datos de la Solicitud (PDD)</h3>
            
            <PddSection title="1. Datos de Vehículo">
                <PddRow label="Tipo de Vehículo" value={finalData?.vehicleCategory} />
                <PddRow label="Marca" value={pdd.datosVehiculo?.marca} />
                <PddRow label="Modelo" value={pdd.datosVehiculo?.modelo} />
                <PddRow label="Tipo Motorización" value={pdd.datosVehiculo?.motorizacion || pdd.datosVehiculo?.tipoMotorizacion} />
                <PddRow label="Cilindrada" value={pdd.datosVehiculo?.cilindrada} />
                <PddRow label="Potencia (KW/CV)" value={powerString} />
                <PddRow label="Versión" value={pdd.datosVehiculo?.version} />
                <PddRow label="Número de Bastidor" value={pdd.datosVehiculo?.bastidor} />
                <PddRow label="Matrícula" value={matriculaDisplay} />
                <PddRow label="Antigüedad del vehículo" value={finalData?.registrationDate} />
            </PddSection>

            <PddSection title="2. Datos de Financiación">
                <PddRow label="Cuota Mensual" value={displayMonthlyPayment} />
                <PddRow label="Precio" value={finalData?.salePrice} />
                <PddRow label="Entrada" value={finalData?.downPayment} />
                <PddRow label="Importe a Financiar" value={finalData?.amountToFinance} />
            </PddSection>
        </div>
    );
};

export default WorkflowTramifacil;
