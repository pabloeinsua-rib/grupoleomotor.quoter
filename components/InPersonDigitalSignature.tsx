import React, { useState } from 'react';
import PageHeader from './PageHeader.tsx';
import { ChevronDownIcon, DownloadIcon, DevicePhoneMobileIcon } from './Icons.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-lg text-left text-[#0085c7]">{title}</span>
      <ChevronDownIcon className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
      <div className="p-4 text-gray-700 border-t prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  </div>
);

const InPersonDigitalSignature: React.FC = () => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('signing');
    const [isPdfOpen, setIsPdfOpen] = useState(false);

    const appStoreUrl = "https://apps.apple.com/es/app/firma-digital-caixabank-p-c/id1119199086";
    const appIconUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20NUEVA%20APP%20FIRMA%20DIGITAL%20PRESENCIAL.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIE5VRVZBIEFQUCBGSVJNQSBESUdJVEFMIFBSRVNFTkNJQUwud2VicCIsImlhdCI6MTc3NjY4Mjk3MSwiZXhwIjoyNjQwNTk2NTcxfQ.z2D6OIslucUxNCJiUnSw1UHEw0IczT-ho_Man6ugLSk";
    const guidePdfUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/20260226_Proceso%20firma%20nueva%20app%20captacion%20cpc_%20v3.0.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDLzIwMjYwMjI2X1Byb2Nlc28gZmlybWEgbnVldmEgYXBwIGNhcHRhY2lvbiBjcGNfIHYzLjAucGRmIiwiaWF0IjoxNzc2NjgzMDUzLCJleHAiOjI2NDA1OTY2NTN9.Zusk9XF8FODa20kJNLZb1AOzQpUiW0FuRYsLpAoeJRE";

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 mt-10">
                <div className="text-center border-b border-slate-200 pb-6 mb-8">
                    <DevicePhoneMobileIcon className="w-16 h-16 text-black mx-auto mb-4" />
                    <h2 className="text-3xl font-light text-black tracking-tight">Firma APP Móvil Presencial</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">
                        Firma biométrica para operaciones presenciales
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-10 flex-wrap">
                  {/* App Icon */}
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="block transform hover:scale-105 transition-transform duration-300">
                    <div className="rounded-3xl shadow-lg w-48 h-48 overflow-hidden bg-white text-white flex items-center justify-center border border-slate-100 p-2">
                        <img src={appIconUrl} alt="Firma Digital App" className="w-full h-full object-contain" />
                    </div>
                  </a>
                  
                  {/* QR Codes Section */}
                  <div className="flex gap-6 mx-4">
                      <div className="flex flex-col items-center">
                          <img 
                              src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA_APP_FIRMA_IOS.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBX0FQUF9GSVJNQV9JT1MucG5nIiwiaWF0IjoxNzc2Njg1ODM4LCJleHAiOjI2NDA1OTk0Mzh9.BSDldTuTY0Ir03qnWUSRGmFucbzhBaDjAf8RcWmbxUE" 
                              alt="iOS QR Code" 
                              className="h-32 w-32 object-contain mb-3 border border-slate-200 rounded-md p-1 shadow-sm"
                          />
                          <img 
                              src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/appstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL2FwcHN0b3JlLWljb24uc3ZnIiwiaWF0IjoxNzc2Njg1OTE2LCJleHAiOjI2NDA1OTk1MTZ9.X2lDiieCfgYS79zAQU3BBct6pG9z_TR3U1xISYS4gb0" 
                              alt="Descargar en App Store" 
                              className="h-8 object-contain"
                          />
                      </div>
                      <div className="flex flex-col items-center">
                          <img 
                              src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/NUEVA_APP_FIRMA_ANDROID.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL05VRVZBX0FQUF9GSVJNQV9BTkRST0lELnBuZyIsImlhdCI6MTc3NjY4NTg3MCwiZXhwIjoyNjQwNTk5NDcwfQ.hICI_vX66Dci55OWGpqPfAbInDXg5_c8Kkxpt-i9iKA" 
                              alt="Android QR Code" 
                              className="h-32 w-32 object-contain mb-3 border border-slate-200 rounded-md p-1 shadow-sm"
                          />
                          <img 
                              src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/playstore-icon.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL3BsYXlzdG9yZS1pY29uLnN2ZyIsImlhdCI6MTc3NjY4NTk2MiwiZXhwIjoyNjQwNTk5NTYyfQ.6qQ2BCRv_RvwmuIOgFsdeheg33qxSEs79kJQ3Bmo_j0" 
                              alt="Disponible en Google Play" 
                              className="h-8 object-contain"
                          />
                      </div>
                  </div>

                  {/* Download Button */}
                  <button 
                    onClick={() => setIsPdfOpen(true)}
                    className="flex flex-col items-center justify-center bg-black p-6 rounded-none text-center font-bold text-white hover:bg-slate-800 transition-colors transform hover:scale-105 duration-300 w-48 h-48 shadow-lg border border-black uppercase tracking-widest"
                  >
                    <DownloadIcon className="w-12 h-12 mb-3" />
                    <span className="text-xs">Descargar Guía en PDF</span>
                  </button>
                </div>
                
                <PdfViewerModal
                    isOpen={isPdfOpen}
                    src={guidePdfUrl}
                    filename="Guia_APP_Firma_Digital_Presencial.pdf"
                    onClose={() => setIsPdfOpen(false)}
                />

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mt-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <AccordionItem title="1. Proceso de Firma: Paso a Paso" isOpen={openAccordion === 'signing'} onClick={() => toggleAccordion('signing')}>
                            <h4>Condiciones para habilitar el botón "Firmar":</h4>
                            <ul>
                                <li>Bastidor informado en Vehículo Nuevo.</li>
                                <li>Matrícula y bastidor informado en otros sectores (Demo, VO).</li>
                                <li>Email de los intervinientes informado.</li>
                                <li>No firmada previamente por app (si ya se ha firmado, hay que contactar con plataforma para que habilite nuevamente la firma).</li>
                            </ul>
                            <h4>Pasos del Proceso de Firma:</h4>
                            <ol>
                                <li><strong>Seleccionar método de Firma:</strong> Para el negocio de auto solo está habilitada la firma digital con un grafo sobre la pantalla del terminal ("Firma en pantalla").</li>
                                <li><strong>Confirmar datos:</strong> Es muy importante que antes de seguir, el cliente confirme sus datos (teléfono y email). Al email se enviará el INE, la Oferta Vinculante y el contrato firmado.</li>
                                <li><strong>Identificación del cliente (DNI/NIF):</strong> Se puede usar la cámara para capturar una foto del DNI o seleccionar una imagen de la galería.</li>
                                <li><strong>Identificación del cliente (NIE):</strong>
                                    <ul>
                                        <li>Con Tarjeta de Residencia (rosa): subir foto de ambas caras.</li>
                                        <li>Sin Tarjeta de Residencia: subir Certificado de Registro (tarjeta verde) y, en un segundo paso, el Pasaporte o Documento de Identidad del país de origen.</li>
                                    </ul>
                                </li>
                                <li><strong>Confirmación del INE:</strong> Se ha enviado automáticamente un e-mail al cliente con el INE. Es necesario que el cliente lo lea y acepte marcando la casilla "El cliente ha recibido y leído las condiciones".</li>
                                <li><strong>Envío y Validación:</strong> El sistema valida el DNI del cliente y envía la documentación a CaixaBank P&C. Este proceso puede tardar varios minutos, no vuelvas atrás ni realices ninguna acción.</li>
                                <li><strong>Condiciones de uso (Tercero):</strong> Aceptar la cesión de datos a la entidad certificadora homologada (Logalty).</li>
                                <li><strong>Aceptación tratamiento de datos e INE:</strong> Es obligatorio marcar ambos consentimientos para poder continuar.</li>
                                <li><strong>Visualización y firma del contrato:</strong> Pide al cliente que revise el contrato en la pantalla y que firme en el espacio en blanco.</li>
                                <li><strong>Descarga documentos:</strong> Una vez finalizada la firma, puedes descargar el contrato firmado y el acta de certificación del proceso.</li>
                                <li><strong><span style={{color: 'red'}}>¡MUY IMPORTANTE!</span> Pulsar "Finalizar":</strong> El proceso de firma acaba al pulsar <strong>Finalizar</strong>. En caso de no hacerlo, el proceso no habrá finalizado y no se habrá realizado la firma.</li>
                            </ol>
                        </AccordionItem>

                        <AccordionItem title="2. Firma con Múltiples Intervinientes" isOpen={openAccordion === 'multiple'} onClick={() => toggleAccordion('multiple')}>
                            <p>En el caso de que haya más de un interviniente, hay que volver a repetir el proceso de firma para los intervinientes restantes.</p>
                            <ul>
                                <li>Se puede acceder a la firma del resto de intervinientes desde la pantalla de resultado de la firma ("Contrato firmado correctamente") pulsando en <strong>"Seleccionar intervinientes"</strong>.</li>
                                <li>También se puede acceder desde el detalle de la solicitud pulsando de nuevo en “Firmar”.</li>
                                <li>La app mostrará quién está <strong>"PENDIENTE DE FIRMA"</strong> y quién ya ha <strong>"FIRMADO"</strong>. Se podrá acceder al proceso de firma para el interviniente pendiente.</li>
                                <li>Un interviniente que ya ha firmado no puede volver a acceder al proceso. Para volver a firmar, habría que llamar a plataforma para desmarcar la firma.</li>
                            </ul>
                        </AccordionItem>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InPersonDigitalSignature;