
import React, { useState } from 'react';
import { XIcon, EmailIcon, ChevronDownIcon } from './Icons.tsx';

export const SendDocumentationModal = ({ onClose }: { onClose: () => void; }) => {
  const [step, setStep] = useState<'initial' | 'estudio' | 'pago' | 'empresa'>('initial');
  const [identifier, setIdentifier] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const validateIdentifier = (value: string): string => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return 'Este campo es obligatorio.';
    }

    const isDniNieCifValid = (() => {
      const sanitizedValue = trimmedValue.toUpperCase();
      // DNI/NIE
      const dniRegex = /^[XYZ]?\d{7,8}[A-Z]$/;
      // CIF
      const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/;
      
      if (dniRegex.test(sanitizedValue)) {
          const controlChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
          let numberStr = sanitizedValue.slice(0, -1);
          const char = sanitizedValue.slice(-1);
          if (sanitizedValue.startsWith('X')) numberStr = '0' + sanitizedValue.slice(1, -1);
          else if (sanitizedValue.startsWith('Y')) numberStr = '1' + sanitizedValue.slice(1, -1);
          else if (sanitizedValue.startsWith('Z')) numberStr = '2' + sanitizedValue.slice(1, -1);
          const number = parseInt(numberStr, 10);
          if (isNaN(number)) return false;
          return controlChars[number % 23] === char;
      } else if (cifRegex.test(sanitizedValue)) {
          return true; // Basic CIF format validation
      }
      return false;
    })();

    if (isDniNieCifValid) {
      return '';
    }

    const isSolicitudValid = (() => {
      const currentYear = new Date().getFullYear().toString();
      const solicitudRegex = /^\d{14}$/;
      if (!solicitudRegex.test(trimmedValue)) return false;
      return trimmedValue.startsWith(currentYear);
    })();

    if (isSolicitudValid) {
      return '';
    }

    return 'Formato no válido. Introduce un DNI/NIE/CIF o un Nº de Solicitud (14 dígitos, que empiece con el año actual).';
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (identifierError) {
      setIdentifierError('');
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };


  const handleContinue = () => {
    const validationError = validateIdentifier(identifier);
    if (validationError) {
      setIdentifierError(validationError);
      return;
    }

    let to = '';
    let subjectDescription = '';
    let checklist = '';

    if (step === 'estudio') {
      to = 'documentacion.admision@caixabankpc.com';
      subjectDescription = 'Documentación Estudio Solicitud';
    } else if (step === 'pago') {
      to = 'documentacion.auto@caixabankpc.com';
      subjectDescription = 'Documentación Validación-Pago Solicitud';
    } else if (step === 'empresa') {
      to = 'empresasdoc@caixabankpc.com';
      subjectDescription = 'Documentación Empresa';
    }

    const subject = encodeURIComponent(`${identifier.trim().toUpperCase()} / ${subjectDescription}`);
    
    const fileList = selectedFiles.map(file => `- ${file.name}`).join('\n');
    const attachmentReminder = selectedFiles.length > 0 
        ? `\n\nIMPORTANTE: No olvide adjuntar los siguientes ficheros a este correo antes de enviarlo:\n${fileList}`
        : '';
        
    if (step === 'empresa') {
        checklist = `\n\n--------------------------------------------------
DOCUMENTACIÓN A ADJUNTAR (Marque lo que envía):

--- EMPRESAS (Sociedades) ---
[ ] Ficha Tramicar
[ ] Oferta Financiera
[ ] DNI / NIE Administrador/es
[ ] IRPF Administrador/es
[ ] CIF Definitivo
[ ] ESCRITURAS (Constitución y Poderes)
[ ] IMPUESTO SOCIEDADES Mod. 200 (Último)
[ ] IVA Mod. 390 (Anual) y Mod. 303 (Trimestrales)
[ ] BALANCE y P y G provisional
[ ] Certificado cuenta bancaria de la sociedad

--- VEHÍCULO ---
[ ] FICHA TÉCNICA y PERMISO DE CIRCULACIÓN (Vehículos matriculados)
[ ] FICHA TÉCNICA ESPAÑOLA (Vehículos de importación)
[ ] FACTURA PROFORMA (Solo para Resicuota o Leasing)
--------------------------------------------------`;
    } else {
        checklist = `\n\n--------------------------------------------------
DOCUMENTACIÓN A ADJUNTAR (Marque lo que envía):

--- PERSONAS FÍSICAS (Particulares / Autónomos) ---
[ ] DNI / NIE (en color y vigor)
[ ] Certificado de cuenta bancaria (o recibo domiciliado)
[ ] NÓMINA (Asalariados - Última o penúltima)
[ ] CARTA REVALORIZACIÓN (Pensionistas)
[ ] IRPF Mod. 100 (Declaración de la Renta)
[ ] IRPF Mod. 130/131 (Autónomos - Trimestrales)
[ ] VIDA LABORAL o Impreso 036 (Autónomos)

--- EMPRESAS (Sociedades) ---
[ ] DNI / NIE Administrador/es
[ ] IRPF Administrador/es
[ ] CIF Definitivo
[ ] ESCRITURAS (Constitución y Poderes)
[ ] IMPUESTO SOCIEDADES Mod. 200 (Último)
[ ] IVA Mod. 390 (Anual) y Mod. 303 (Trimestrales)
[ ] BALANCE y P y G provisional
[ ] Certificado cuenta bancaria de la sociedad

--- VEHÍCULO ---
[ ] FICHA TÉCNICA y PERMISO DE CIRCULACIÓN (Vehículos matriculados)
[ ] FICHA TÉCNICA ESPAÑOLA (Vehículos de importación)
[ ] FACTURA PROFORMA (Solo para Resicuota o Leasing)
--------------------------------------------------`;
    }

    const body = encodeURIComponent(
      `Hola,\n\nAdjunto la documentación para la referencia: ${identifier.trim().toUpperCase()}.${attachmentReminder}\n\n(Este correo ha sido generado por la aplicación Quoter).${checklist}\n\nGracias.`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    onClose();
  };
  
  const reset = () => {
      setStep('initial');
      setIdentifier('');
      setIdentifierError('');
      setSelectedFiles([]);
  }

  const renderStepContent = () => {
    switch (step) {
      case 'initial':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cliente de Correo Interno</h2>
            <p className="text-center text-gray-600 mb-8">Selecciona el propósito del envío para dirigirlo al buzón correcto.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button onClick={() => setStep('estudio')} className="flex-1 bg-blue-100 text-blue-800 font-bold py-4 px-4 rounded-none hover:bg-blue-200 transition-colors">
                Para Estudio
              </button>
              <button onClick={() => setStep('pago')} className="flex-1 bg-green-100 text-green-800 font-bold py-4 px-4 rounded-none hover:bg-green-200 transition-colors">
                Para Validación y Pago
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => setStep('empresa')} className="w-full bg-purple-100 text-purple-800 font-bold py-4 px-4 rounded-none hover:bg-purple-200 transition-colors">
                Para Empresas
              </button>
            </div>
          </>
        );
      case 'estudio':
      case 'pago':
      case 'empresa':
        return (
          <>
             <button onClick={reset} className="text-sm text-gray-600 hover:text-caixa-blue mb-4 flex items-center gap-1">
                <ChevronDownIcon className="w-4 h-4 rotate-90" /> Volver
             </button>
             <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {step === 'estudio' ? 'Envío para Estudio' : step === 'pago' ? 'Envío para Pago' : 'Envío de Empresa'}
             </h2>
             
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI/CIF o Nº Solicitud</label>
                    <input 
                        type="text" 
                        value={identifier} 
                        onChange={handleIdentifierChange}
                        className={`w-full px-4 py-3 border rounded-none focus:outline-none focus:ring-2 ${identifierError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-caixa-blue'}`}
                        placeholder="Ej: B12345678"
                    />
                    {identifierError && <p className="text-red-500 text-xs mt-1">{identifierError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Archivos (Opcional)</label>
                    <p className="text-xs text-gray-500 mb-2">Selecciona los archivos para que aparezca la lista en el cuerpo del correo (recordatorio). Debes adjuntarlos manualmente en tu gestor de correo.</p>
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {selectedFiles.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm bg-gray-50 p-2 rounded">
                            {selectedFiles.map((file, idx) => (
                                <li key={idx} className="flex justify-between items-center">
                                    <span className="truncate">{file.name}</span>
                                    <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700"><XIcon className="w-4 h-4" /></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {step === 'empresa' && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-800">
                    <p><strong>¡ATENCIÓN!</strong> Para operaciones de Empresa o Leasing, debes cumplimentar primero la <strong>Ficha Tramicar</strong> desde el menú principal. Utiliza el botón "Crear Email" dentro de esa Ficha para asegurar que incluyes el PDD y todos los datos del administrador.</p>
                  </div>
                )}

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-yellow-800">
                    <p><strong>Nota:</strong> Al pulsar "Continuar", se abrirá tu gestor de correo predeterminado con el asunto y cuerpo pre-redactados. <strong>Recuerda adjuntar los archivos manualmente</strong> en el correo antes de enviarlo.</p>
                </div>

                <button 
                    onClick={handleContinue}
                    className="w-full bg-caixa-blue text-white font-bold py-3 px-6 rounded-none hover:bg-caixa-blue-light transition-colors flex items-center justify-center gap-2"
                >
                    <EmailIcon className="w-5 h-5" />
                    Continuar a Email
                </button>
             </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true" role="dialog">
        <style>{`.animate-fade-in { animation: fade-in 0.3s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
            <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 text-slate-600 rounded-none w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors z-10">
                <XIcon className="w-5 h-5" />
            </button>
            {renderStepContent()}
        </div>
    </div>
  );
};

const DocumentSubmission: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
             <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 text-caixa-blue rounded-full flex items-center justify-center mb-4">
                    <EmailIcon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Envío de Documentación</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Si necesitas enviar documentación pendiente o subsanar alguna incidencia, puedes hacerlo a través de nuestros buzones de correo. Te ayudamos a preparar el email con el asunto correcto.
                </p>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-caixa-blue text-white font-bold py-3 px-8 rounded-none hover:bg-caixa-blue-light transition-colors shadow-lg"
                >
                    Preparar Envío de Documentación
                </button>
             </div>
             {isModalOpen && <SendDocumentationModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default DocumentSubmission;
