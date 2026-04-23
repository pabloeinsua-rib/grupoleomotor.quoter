
import React from 'react';
import { FileTextIcon, WarningIcon, ArrowRightIcon } from './Icons.tsx';
import { SavedOfferData } from '../App.tsx';

interface WorkflowDocumentationGuideProps {
  offerData: SavedOfferData | null;
  clientType: string | null;
  isVehicleUsed: boolean;
  onContinue: () => void;
  onBack: () => void;
}

const DocListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start text-sm">
      <svg className="w-4 h-4 text-caixa-blue mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(90 10 10)"></path></svg>
      <span>{children}</span>
    </li>
);

const WorkflowDocumentationGuide: React.FC<WorkflowDocumentationGuideProps> = ({ offerData, clientType, isVehicleUsed, onContinue, onBack }) => {

    const amountToFinance = offerData?.amountToFinance || 0;
    
    // Determine notary requirement based on client type
    let isNotaryRequired = false;
    let notaryThreshold = 40000;
    
    if (clientType === 'Sociedades') {
        notaryThreshold = 30000;
        if (amountToFinance >= 30000) isNotaryRequired = true;
    } else {
        // Asalariados / Autónomos
        if (amountToFinance >= 40000) isNotaryRequired = true;
    }

    const getDocsList = () => {
        // If we don't have offer data, we are in "Start Without Offer" mode
        if (!offerData) {
            return (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <p className="font-bold text-lg text-slate-800 mb-6 uppercase tracking-wide leading-relaxed">
                        TEN DIGITALIZADA LA DOCUMENTACIÓN COMPLETA DEL TITULAR O TITULARES, Y EN EL CASO DE V.O. FICHA TÉCNICA Y PERMISO.
                    </p>
                </div>
            );
        }

        let clientDocs: React.ReactNode[] = [];
        switch (clientType) {
            case 'Asalariados':
                clientDocs = [
                    <DocListItem key="dni">DNI/NIE en color y vigor.</DocListItem>,
                    <DocListItem key="cuenta">Certificado de cuenta bancaria.</DocListItem>,
                    <DocListItem key="asalariados"><strong>Asalariados:</strong> Última nómina.</DocListItem>,
                    <DocListItem key="pensionistas"><strong>Pensionistas:</strong> Carta de revalorización.</DocListItem>,
                ];
                if (amountToFinance >= 25000) {
                    clientDocs.push(<DocListItem key="irpf"><strong>(Financiación &gt;= 25.000€):</strong> IRPF (Mod. 100).</DocListItem>);
                }
                break;
            case 'Autónomos':
                clientDocs = [
                    <DocListItem key="dni">DNI/NIE en color y vigor.</DocListItem>,
                    <DocListItem key="cuenta">Certificado de cuenta bancaria.</DocListItem>,
                    <DocListItem key="irpf">IRPF (Mod. 100).</DocListItem>,
                    <DocListItem key="trimestrales">Pagos trimestrales IRPF (Mod. 130/131).*</DocListItem>,
                    <DocListItem key="vida">Vida Laboral o Impreso 036.</DocListItem>,
                    <li key="nota-autonomina" className="text-[10px] mt-2 italic text-slate-500">*No pedir 130/131 si presenta autonómina (nomina sin retención).</li>
                ];
                break;
            case 'Sociedades':
                clientDocs = [
                     <DocListItem key="dni-admin">DNI/NIE del administrador/es.</DocListItem>,
                     <DocListItem key="irpf-admin">IRPF del administrador/es.</DocListItem>,
                     <DocListItem key="cif">CIF definitivo de la empresa.</DocListItem>,
                     <DocListItem key="escrituras">Escrituras de Constitución y poderes.</DocListItem>,
                     <DocListItem key="sociedades">Último Impuesto de Sociedades (Mod. 200).</DocListItem>,
                     <DocListItem key="iva">Resúmenes de IVA (anual Mod. 390 y trimestrales Mod. 303).</DocListItem>,
                     <DocListItem key="cuenta-soc">Certificado de cuenta bancaria de la sociedad.</DocListItem>,
                ];
                if (offerData.productType === 'Leasing') {
                    clientDocs.push(<DocListItem key="proforma-soc"><strong>Factura Proforma.</strong></DocListItem>);
                }
                break;
            default:
                return <p>Selecciona un tipo de cliente en el paso anterior para ver la documentación necesaria.</p>;
        }

        let vehicleDocs: React.ReactNode[] = [];
        if (isVehicleUsed) {
            vehicleDocs = [
                <DocListItem key="ficha">Ficha Técnica.</DocListItem>,
                <DocListItem key="permiso">Permiso de Circulación.</DocListItem>,
                <DocListItem key="dgt">(Alternativa si no se dispone de Ficha y Permiso) Documento de Suministro de Datos del Vehículo de la DGT.</DocListItem>
            ];
        }

        if (offerData?.productType === 'Resicuota') {
             vehicleDocs.push(
                <DocListItem key="factura">
                    <strong>Factura de Vehículo a nombre del Titular.</strong>
                </DocListItem>
            );
        } else if (offerData?.productType === 'Leasing') {
            vehicleDocs.push(
                <DocListItem key="proforma">
                    <strong>Factura Proforma.</strong>
                    <div className="pl-4 text-xs">
                        A nombre de: <strong>CaixaBank Payments &amp; Consumer E.F.C., E.P., S.A.U.</strong><br />
                        Domicilio: <strong>Avenida Manoteras 20, Edif. París. 28050 Madrid.</strong><br/>
                        C.I.F.: <strong>A08980153</strong>
                    </div>
                </DocListItem>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">Cliente</h4>
                    <ul className="space-y-2">{clientDocs}</ul>
                </div>
                {vehicleDocs.length > 0 && (
                     <div>
                        <h4 className="font-semibold mb-2">Vehículo</h4>
                        <ul className="space-y-2">{vehicleDocs}</ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg animate-fade-in-up">
            <style>{`.animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; } @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">3. Documentación a Aportar</h3>
                {offerData && <p className="text-gray-600 mb-6">Prepara los siguientes documentos para el cliente de tipo: <strong>{clientType || 'No definido'}</strong></p>}
            </div>
            
            <div className="bg-slate-50 p-6 rounded-lg border">
                {getDocsList()}
            </div>
            
            {isNotaryRequired && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg flex items-start gap-3">
                    <WarningIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-bold">Aviso de Intervención Notarial</h4>
                        <p className="text-sm">Debido a que el importe de la financiación supera los {notaryThreshold.toLocaleString('es-ES')} €, será necesaria la firma del contrato ante notario.</p>
                    </div>
                </div>
            )}


            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <button 
                    onClick={onBack} 
                    className="flex-1 sm:flex-none bg-caixa-yellow text-slate-800 font-bold py-3 px-6 rounded-none hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg"
                >
                    Atrás
                </button>
                <button 
                    onClick={onContinue} 
                    className="flex-1 sm:flex-none bg-white text-black border-2 border-slate-200 hover:bg-caixa-blue hover:text-white hover:border-caixa-blue font-bold py-4 px-8 rounded-none transition-all flex items-center justify-center gap-2"
                >
                    CONTINUAR A SUBIR DOCUMENTACIÓN <ArrowRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

export default WorkflowDocumentationGuide;
