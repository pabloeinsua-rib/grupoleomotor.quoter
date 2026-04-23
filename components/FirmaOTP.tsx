
import React, { useState } from 'react';
import { WarningIcon, CheckCircleIcon, DownloadIcon } from './Icons.tsx';
import PdfViewerModal from './PdfViewerModal.tsx';

const FirmaOTP: React.FC = () => {
    const [isPdfOpen, setIsPdfOpen] = useState(false);
    const pdfUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/CaixaBank%20P&C%20-%20Guia%20Firma%20OTP%20Auto.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0NhaXhhQmFuayBQJkMgLSBHdWlhIEZpcm1hIE9UUCBBdXRvLnBkZiIsImlhdCI6MTc3NjY4MjczOSwiZXhwIjoyNjQwNTk2MzM5fQ.kH8io_LYATFfrdnpvR5JBFzGqRnupT7I-j5HyJjkC0Q";
    const imageIconUrl = "https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICONO%20INICIAR%20FIRMA%20DIGITAL.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05PIElOSUNJQVIgRklSTUEgRElHSVRBTC5wbmciLCJpYXQiOjE3NzY2OTk3OTcsImV4cCI6ODgxNzY2MTMzOTd9.AeBQ0St-iwwvc9UvLLrMEzo0prEID7TU8J6heulGQYE";

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 mt-10">
                <div className="text-center border-b border-slate-200 pb-6 mb-8">
                    <img src={imageIconUrl} alt="Iniciar Firma Digital" className="w-24 h-24 object-contain mx-auto mb-4" />
                    <h2 className="text-3xl font-light text-black tracking-tight">Firma OTP Auto (A Distancia)</h2>
                    <p className="text-slate-500 mt-2 text-sm font-medium">
                        Proceso Web auto con firma digital por SMS
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-4">
                        <button 
                            onClick={() => setIsPdfOpen(true)}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white font-bold py-3 px-6 rounded-none hover:bg-slate-800 shadow-lg transition-transform hover:scale-105 text-xs uppercase tracking-widest border border-black w-full max-w-sm"
                        >
                            <DownloadIcon className="w-5 h-5"/>
                            Descargar Guía en PDF
                        </button>
                        <button 
                            onClick={() => window.open('https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto', '_blank')} 
                            className="inline-flex items-center justify-center bg-caixa-blue text-white font-bold py-3 px-6 rounded-none hover:bg-blue-600 shadow-lg transition-transform hover:scale-105 text-xs uppercase tracking-widest border border-transparent w-full max-w-sm text-center leading-relaxed"
                        >
                            Acceder a Plataforma Auto<br />para enviar Firma OTP a Cliente
                        </button>
                    </div>
                </div>

                <PdfViewerModal
                    isOpen={isPdfOpen}
                    src={pdfUrl}
                    filename="Guia_Firma_OTP_Auto.pdf"
                    onClose={() => setIsPdfOpen(false)}
                />
                
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start gap-3 shadow-sm">
                    <WarningIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-900 leading-relaxed">
                        <strong className="text-red-700">¡AVISO IMPORTANTE PARA SOLICITUDES CON 2 TITULARES!</strong><br />
                        Si la solicitud tiene 2 titulares, los correos electrónicos y los números de teléfono móvil de contacto <strong>tienen que ser diferentes para cada titular</strong>. Si se utiliza el mismo correo o móvil para ambos, el sistema de firma OTP <strong>no funcionará</strong>.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Section 1: Identificación */}
                    <section>
                        <h3 className="text-2xl font-light text-black tracking-tight mb-6 flex items-center gap-2">
                            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                            Guía para una correcta identificación del cliente
                        </h3>
                        
                        <div className="bg-slate-100 p-4 rounded-xl mb-6 text-black font-medium border border-slate-200">
                            Recordemos que, para utilizar la firma a distancia, es imprescindible que el cliente haya sido identificado físicamente en algún momento del proceso de venta. No realizar esta verificación presencial supone una mala praxis.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Asegúrate de contrastar y verificar el documento aportado</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">Para iniciar el proceso, <strong>el cliente siempre tiene que estar presente</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">Asegúrate de solicitar el <strong>DNI original y en vigor físicamente</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700"><strong>Comprueba</strong> que el documento está en buen estado y que la <strong>foto del DNI/NIE se corresponde</strong> con la persona que tienes delante</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700"><strong>Valida</strong> que los <strong>datos</strong> de anverso y reverso coinciden</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Fíjate en las anomalías en la actitud del titular</h4>
                                <p className="text-sm text-slate-500 mb-4">Para evitar fraude de identidad, es esencial observar la actitud y reacción del cliente durante la identificación.</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <WarningIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">¿<strong>Duda en las preguntas</strong> o mira algún documento para poder responder?</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <WarningIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">¿Se muestra reticente o <strong>reacio a facilitar datos</strong>?</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <WarningIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">¿Hay <strong>dudas entre la foto y la persona titular</strong> o sobre cualquier documento que se facilite?</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <WarningIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-700">¿La <strong>actitud es nerviosa</strong> o tiene mucha prisa?</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Validaciones visuales */}
                    <section>
                        <h3 className="text-2xl font-light text-black tracking-tight mb-6 flex items-center gap-2">
                            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                            Validaciones visuales del DNI
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Número de documento</h4>
                                <p className="text-sm text-slate-600">Debe coincidir Anverso vs MRZ</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Fecha de nacimiento</h4>
                                <p className="text-sm text-slate-600">Debe coincidir Anverso vs MRZ (en el MRZ aparece AAMMDD)</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Nombre completo</h4>
                                <p className="text-sm text-slate-600">Debe coincidir Anverso vs MRZ</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Sexo</h4>
                                <p className="text-sm text-slate-600">Debe coincidir Anverso vs MRZ</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Fecha de caducidad</h4>
                                <p className="text-sm text-slate-600">Debe coincidir Anverso vs MRZ (en el MRZ aparece AAMMDD)</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-1">Ventana translúcida</h4>
                                <p className="text-sm text-slate-600">Debe ser transparente y no opaca</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Proceso Comercial */}
                    <section>
                        <h3 className="text-2xl font-light text-black tracking-tight mb-6 flex items-center gap-2">
                            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                            Proceso de pantallas del comercial del concesionario
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <p className="mb-6 text-sm text-slate-700"><strong>Solicitud pre-autorizada captada completa</strong> con toda la información del cliente, <strong>email y teléfono</strong> y del vehículo, <strong>bastidor y matricula</strong> (si es matriculado).</p>
                            <ol className="list-decimal pl-5 space-y-4 text-sm text-slate-700">
                                <li>Clic en <strong>"Mis operaciones"</strong> en el menú principal.</li>
                                <li>Desplegamos la sección de <strong>"Aprobadas"</strong>.</li>
                                <li>Clic en el icono <strong>"Firma Digital"</strong> en la columna de Acciones. <br/><span className="text-xs text-slate-500 mt-1 block">El icono de firma enviará un mail a todos los intervinientes que les permitirá iniciar el proceso de firma.</span></li>
                                <li>En la ventana emergente "Envío enlace firma", clic en el botón <strong>"Continuar"</strong>.</li>
                                <li>Aparecerá un mensaje de confirmación: "Envío correo enlace firma realizado correctamente". Clic en <strong>"Hecho"</strong>.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Section 4: Proceso Cliente */}
                    <section>
                        <h3 className="text-2xl font-light text-black tracking-tight mb-6 flex items-center gap-2">
                            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                            Proceso de pantallas del cliente final
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <ol className="list-decimal pl-5 space-y-6 text-sm text-slate-700">
                                <li>
                                    <strong>Recepción del email para iniciar el proceso:</strong>
                                    <p className="text-sm text-slate-600 mt-1">El cliente recibe un email con las instrucciones del proceso de firma, clica en el botón de "FIRMA AQUÍ" en el propio email iniciando el proceso. El cliente revisa los datos mostrados hasta el momento y confirma para continuar.</p>
                                </li>
                                <li>
                                    <strong>Subida DNI/NIE:</strong>
                                    <p className="text-sm text-slate-600 mt-1">El cliente sube las fotos de su Documento de Identidad llegando al apartado donde se muestra el contrato para proceder a su firma.</p>
                                </li>
                                <li>
                                    <strong>Firma por SMS:</strong>
                                    <p className="text-sm text-slate-600 mt-1">El cliente recibe un código por SMS que tiene que introducir en el recuadro. Se le muestra el acceso a la documentación firmada y los certificados de la entidad validadora, también existe la posibilidad de adjuntar algún documento pendiente.</p>
                                </li>
                            </ol>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FirmaOTP;
