
import React, { useState, useEffect, useRef } from 'react';
import type { View, SavedOfferData } from '../App.tsx';
import { AnalysisResult, PDD } from './PackageDocumentation.tsx';
import { SpinnerIcon, ExternalLinkIcon, InfoIcon, DownloadIcon, ArrowUturnLeftIcon, SparklesIcon, XIcon, WarningIcon, CheckIcon, DevicePhoneMobileIcon, DigitalSignatureIcon, CopyIcon, EmailIcon, ShieldCheckIcon, ManualsIcon } from './Icons.tsx';

// --- Bank Codes Data for Lookup ---
const bankCodesMap: { [key: string]: string } = {
  '0019': 'DEUTSCHE BANK S.A.E.', '0049': 'BANCO DE SANTANDER', '0030': 'BANESTO', '0072': 'BANCO PASTOR',
  '0061': 'BANCA MARCH S.A', '0073': 'OPENBANK S.A.', '0078': 'BANCA PUEYO S.A.', '0081': 'BANCO DE SABADELL S.A.',
  '0128': 'BANKINTER S.A.', '0131': 'NOVO BANCO S.A.', '0133': 'MICROBANK S.A.', '0182': 'BBVA',
  '0186': 'BANCO MEDIOLANUM S.A.', '0216': 'TARGOBANK S.A.', '0237': 'CAJASUR BANCO S.A.', '0239': 'EVO BANCO S.A.',
  '1465': 'ING BANK NV', '1491': 'TRIODOS BANK NV S.E', '2080': 'ABANCA', '2085': 'IBERCAJA BANCO, S.A.',
  '2095': 'KUTXABANK S.A.', '2100': 'CAIXABANK, S.A.', '2103': 'UNICAJA BANCO, S.A.', '3058': 'CAJAMAR CAJA RURAL, S.C.C.',
  '3059': 'CAJA RURAL DE ASTURIAS', '3081': 'EUROCAJA RURAL, S.C.C.'
};

const getBankName = (iban: string | null | undefined): string | null => {
    if (!iban) return null;
    const cleanIban = iban.replace(/\s/g, '');
    if (cleanIban.length < 8) return 'Entidad no encontrada';
    const entityCode = cleanIban.substring(4, 8);
    return bankCodesMap[entityCode] || 'Entidad no encontrada';
};

// --- Modal for User Copy ---
const UserCopyModal = ({ isOpen, onClose, onSend, email }: { isOpen: boolean, onClose: () => void, onSend: (email: string) => Promise<void>, email?: string }) => {
    const [userEmail, setUserEmail] = useState(email || '');
    const [isSending, setIsSending] = useState(false);
    
    if (!isOpen) return null;

    const handleSend = async () => {
        if (!userEmail) return;
        setIsSending(true);
        try {
            await onSend(userEmail);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-fade-in-up border border-slate-200">
                <button onClick={onClose} disabled={isSending} className="absolute top-4 right-4 text-slate-400 hover:text-black transition-colors disabled:opacity-50"><XIcon className="w-5 h-5" /></button>
                <h3 className="text-xl font-light text-black tracking-tight mb-3">¿Quieres una copia?</h3>
                <p className="text-slate-500 text-sm mb-6">Podemos enviarte el PDF con la documentación analizada a tu correo.</p>
                <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    placeholder="tu@email.com" 
                    disabled={isSending}
                    className="w-full border border-slate-200 rounded-lg p-3 mb-6 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm disabled:bg-slate-50"
                />
                <div className="flex gap-3">
                    <button onClick={onClose} disabled={isSending} className="flex-1 bg-white border border-slate-200 text-black font-bold py-3 rounded-none hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest disabled:opacity-50">No, gracias</button>
                    <button 
                        onClick={handleSend} 
                        disabled={isSending || !userEmail}
                        className="flex-1 bg-black text-white font-bold py-3 rounded-none hover:bg-slate-800 transition-colors text-xs uppercase tracking-widest disabled:bg-slate-600 flex items-center justify-center gap-2"
                    >
                        {isSending ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : null}
                        {isSending ? 'Enviando...' : 'Enviar Copia'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
interface RequestProcessingProps {
  savedOfferData: SavedOfferData | null;
  analysisResult: AnalysisResult | null;
  files: File[];
  onNavigate: (view: View) => void;
  onRestart: () => void;
  onBack: () => void;
  onGlobalStepChange?: (step: number) => void;
  userId?: string;
}

const RequestProcessing: React.FC<RequestProcessingProps> = ({ savedOfferData, analysisResult, files, onNavigate, onRestart, onBack, onGlobalStepChange, userId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showPostProcessing, setShowPostProcessing] = useState(false);
  const [showUserCopyModal, setShowUserCopyModal] = useState(false);
  const [isWaitingForPDD, setIsWaitingForPDD] = useState(false);
  const [showEmpresasStep, setShowEmpresasStep] = useState(false);
  const [empresasContact, setEmpresasContact] = useState({ mobile: '', email: '' });
  const [isSendingEmpresas, setIsSendingEmpresas] = useState(false);
  
  // State for the specific status view: 'selection' (buttons) -> 'details' (result)
  const [resultStatus, setResultStatus] = useState<'none' | 'approved' | 'study' | 'denied'>('none');
  const [showDeniedModal, setShowDeniedModal] = useState(false);

  useEffect(() => {
    if (resultStatus === 'denied') {
        setShowDeniedModal(true);
    }
  }, [resultStatus]);

  // Handle global step progression based on internal states
  useEffect(() => {
      if (emailStatus === 'success' || emailStatus === 'sending') {
          onGlobalStepChange?.(8); // ENVIAR DOCUMENTACIÓN A PLATAFORMA
      } else if (resultStatus !== 'none') {
          onGlobalStepChange?.(7); // DICTAMEN SOLICITUD
      } else if (showPostProcessing) {
          onGlobalStepChange?.(6); // ESTUDIO SOLICITUD
      } else {
          onGlobalStepChange?.(5); // TRAMITAR SOLICITUD
      }
  }, [emailStatus, resultStatus, showPostProcessing, isWaitingForPDD, onGlobalStepChange]);
  
  // Trigger opening the PDD and Operations web automatically
  // (Removed automatic opening to prevent popup blockers, requires user action)
  
  // --- PDF GENERATION HELPERS ---
  const compressImage = async (file: File, quality = 0.5, scale = 1.0): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 1500 * scale; // Allow scaling down
          const MAX_HEIGHT = 1500 * scale;
          let width = img.width;
          let height = img.height;
          if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
          else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                  if (blob) blob.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)));
                  else reject(new Error("Compression failed"));
              }, 'image/jpeg', quality); 
          } else { reject(new Error("Canvas context failed")); }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Logic to build filename: Documentacion_DNI_PuntoVenta_Fecha.pdf
  const getGeneratedFilename = () => {
      const pdd = analysisResult?.pdd || {};
      const titular = pdd.datosTitulares?.[0] || {};
      const dni = titular.dni ? titular.dni.replace(/\s/g, '').toUpperCase() : 'DNI_DESCONOCIDO';
      const dealer = pdd.datosConcesionario?.nombre 
        ? pdd.datosConcesionario.nombre.replace(/\s+/g, '_').substring(0, 15).toUpperCase() 
        : 'CONCESIONARIO';
      const date = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
      return `Documentacion_${dni}_${dealer}_${date}.pdf`;
  };

  const createMergedPdfData = async (): Promise<{ blob: Blob | null, unmergedFiles: File[], totalSize: number }> => {
      if (!files || files.length === 0) return { blob: null, unmergedFiles: [], totalSize: 0 };
      
      const MAX_TOTAL_SIZE = 4000000; // ~4MB Total Limit (Vercel has a hard 4.5MB limit for the whole request)
      const calculateTotalSize = (pdfBlob: Blob | null, files: File[]) => {
          let total = pdfBlob ? pdfBlob.size : 0;
          files.forEach(f => total += f.size);
          return total;
      };

      let quality = 0.6; // Start with decent quality
      let scale = 1.0;
      let finalBlob: Blob | null = null;
      let attempts = 0;
      let finalUnmerged: File[] = [];

      // Custom sort function logic
      const getFileWeight = (f: File) => {
          const fname = f.name.toLowerCase();
          
          let ownerWeight = 100; // Titular default
          if (fname.includes('vehiculo') || fname.includes('ficha') || fname.includes('permiso')) ownerWeight = 300;
          if (fname.includes('cotitular') || fname.includes('avalista')) ownerWeight = 200;

          let docWeight = 99;
          if (fname.includes('dni') || fname.includes('nie') || fname.includes('identidad')) docWeight = 1;
          else if (fname.includes('cuenta') || fname.includes('iban') || fname.includes('recibo_banco') || fname.includes('libreta') || fname.includes('titularidad')) docWeight = 2;
          else if (fname.includes('nomin') || fname.includes('pension')) docWeight = 3;
          else if (fname.includes('irpf') || fname.includes('renta') || fname.includes('100')) docWeight = 4;
          else if (fname.includes('vida_laboral') || fname.includes('laboral')) docWeight = 5;
          else if (fname.includes('130') || fname.includes('131') || fname.includes('trimestral')) docWeight = 6;
          else if (fname.includes('ficha_tecnica')) docWeight = 7;
          else if (fname.includes('permiso')) docWeight = 8;
          
          return ownerWeight + docWeight;
      };

      const validFiles = files.filter(f => {
          const n = f.name.toLowerCase();
          if (n.match(/image\d+\.(png|jpg|jpeg|gif)$/) && f.size < 50000) return false;
          if (n.includes('logo') || n.includes('firma') || n.includes('facebook') || n.includes('twitter') || n.includes('instagram') || n.includes('linkedin')) return false;
          return true;
      }).sort((a, b) => getFileWeight(a) - getFileWeight(b));

      // SMART UNLOCK: We collect DNIS to try as passwords for protected PDFs (e.g., Seg. Social / Public Payrolls)
      const dnisToTry: string[] = [];
      const titulares = analysisResult?.pdd?.datosTitulares || [];
      titulares.forEach((t: any) => {
          if (t.dni) {
              const d = t.dni.replace(/\s/g, '');
              dnisToTry.push(d);
              dnisToTry.push(d.toUpperCase());
              dnisToTry.push(d.toLowerCase());
              const numOnly = d.replace(/[^0-9]/g, '');
              if (numOnly) dnisToTry.push(numOnly);
          }
      });
      const uniquePasswordsToTry = [...new Set(dnisToTry)];

      // Try up to 4 times to compress if size is too big
      while (attempts < 4) {
          let currentUnmerged: File[] = [];
          try {
              const { PDFDocument } = await import('pdf-lib');
              const mergedPdf = await PDFDocument.create();

              for (const file of validFiles) {
                  try {
                    let fileBuffer = await file.arrayBuffer();
                    if (file.type === 'application/pdf') {
                        try {
                            const pdf = await PDFDocument.load(fileBuffer);
                            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                            copiedPages.forEach(page => mergedPdf.addPage(page));
                        } catch (loadErr: any) {
                            // Si falla por contraseña, intentamos con fuerza bruta usando los DNIs!
                            if (loadErr.message?.toLowerCase().includes('encrypt') || loadErr.message?.toLowerCase().includes('password')) {
                                let unlocked = false;
                                for (const pwd of uniquePasswordsToTry) {
                                    try {
                                        // @ts-ignore
                                        const pdf = await PDFDocument.load(fileBuffer, { password: pwd });
                                        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                                        copiedPages.forEach(page => mergedPdf.addPage(page));
                                        unlocked = true;
                                        break; 
                                    } catch (e) { }
                                }
                                if (!unlocked) currentUnmerged.push(file);
                            } else {
                                currentUnmerged.push(file);
                            }
                        }
                    } else if (file.type.startsWith('image/')) {
                        const compressedBytes = await compressImage(file, quality, scale);
                        fileBuffer = compressedBytes.buffer;
                        const image = await mergedPdf.embedJpg(fileBuffer);
                        const imgDims = image.scale(1);
                        const isLandscape = imgDims.width > imgDims.height;
                        const page = mergedPdf.addPage(isLandscape ? [841.89, 595.28] : [595.28, 841.89]);
                        const { width: pageWidth, height: pageHeight } = page.getSize();
                        const { width: imgWidth, height: imgHeight } = image.scaleToFit(pageWidth - 50, pageHeight - 50);
                        page.drawImage(image, { x: (pageWidth - imgWidth) / 2, y: (pageHeight - imgHeight) / 2, width: imgWidth, height: imgHeight });
                    }
                  } catch (e) { 
                      currentUnmerged.push(file);
                  }
              }
              
              if (mergedPdf.getPageCount() > 0) {
                  const pdfBytes = await mergedPdf.save();
                  finalBlob = new Blob([pdfBytes], { type: 'application/pdf' });
                  const totalRequestSize = calculateTotalSize(finalBlob, currentUnmerged);

                  if (totalRequestSize <= MAX_TOTAL_SIZE || attempts === 3) {
                      console.log(`Payload ready. Total size: ${(totalRequestSize / 1024 / 1024).toFixed(2)} MB`);
                      finalUnmerged = currentUnmerged;
                      return { blob: finalBlob, unmergedFiles: finalUnmerged, totalSize: totalRequestSize };
                  } else {
                      console.warn(`Total payload too large (${(totalRequestSize / 1024 / 1024).toFixed(2)} MB). More compression... Attempt ${attempts + 1}`);
                      quality -= 0.15; // Reduce quality more aggressively
                      scale -= 0.1;
                      attempts++;
                  }
              } else {
                  const size = calculateTotalSize(null, currentUnmerged);
                  return { blob: null, unmergedFiles: currentUnmerged, totalSize: size };
              }
          } catch (e) {
              const size = calculateTotalSize(null, validFiles);
              return { blob: null, unmergedFiles: validFiles, totalSize: size };
          }
      }
      
      const finalTotal = calculateTotalSize(finalBlob, finalUnmerged);
      return { blob: finalBlob, unmergedFiles: finalUnmerged, totalSize: finalTotal };
  };

  const handleDownloadPdf = async () => {
      setIsDownloading(true);
      const { blob, unmergedFiles } = await createMergedPdfData();
      
      if (blob) {
          const link = document.createElement('a');
          const filename = getGeneratedFilename();
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else if (unmergedFiles.length === 0) {
          alert("Error al generar el PDF.");
      }

      if (unmergedFiles && unmergedFiles.length > 0) {
          unmergedFiles.forEach((file, index) => {
              setTimeout(() => {
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(file);
                  link.download = `Separado_${file.name}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              }, (index + 1) * 700);
          });
      }
      setIsDownloading(false);
  };

  const handleSendAutomaticEmail = async (target: 'approved' | 'study') => {
      setEmailStatus('sending');
      
      const emailAddress = target === 'approved' 
        ? 'documentacion.auto@caixabankpc.com' 
        : 'documentacion.admision@caixabankpc.com';
      
      const titular = analysisResult?.pdd?.datosTitulares?.[0];
      const dni = titular?.dni ? titular.dni.toUpperCase() : 'DNI TITULAR';
      const subject = `${dni} Envío de Documentación`;
      const filename = getGeneratedFilename();

      const docsList = analysisResult?.documentacion?.analizada?.map((d: any) => d.docType).join(', ') || 'Documentación adjunta';
      let bodyText = `Adjunto documentación digitalizada para la solicitud correspondiente al DNI ${dni}.\n\nDocumentación enviada:\n${docsList}\n\n(Envío automático desde Quoter).`;

      const { blob, unmergedFiles, totalSize } = await createMergedPdfData();

      // Vercel hard limit is 4.5MB. We aim for 4MB project-wide to be safe with base64 overhead.
      const VERCEL_LIMIT = 4000000; 

      const sendSingleEmail = async (filesToSend: {blob?: Blob | null, unmerged?: File[]}, partLabel = "") => {
          const formData = new FormData();
          let currentBody = bodyText;
          if (partLabel) currentBody = `(PARTE ${partLabel}) ` + currentBody;
          
          if (filesToSend.blob) {
              formData.append('files', filesToSend.blob, partLabel ? `Parte_${partLabel.replace(/\s+/g, '_')}_${filename}` : filename);
          }
          if (filesToSend.unmerged && filesToSend.unmerged.length > 0) {
              filesToSend.unmerged.forEach(file => {
                  formData.append('files', file, `Separado_${file.name}`);
              });
          }

          formData.append('to', emailAddress);
          formData.append('subject', partLabel ? `${subject} [PARTE ${partLabel}]` : subject);
          formData.append('body', currentBody);

          const response = await fetch('/api/email/send-documentation', {
              method: 'POST',
              body: formData
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error en el envío (${response.status}): ${errorText}`);
          }
          return true;
      };

      try {
          if (totalSize > VERCEL_LIMIT) {
              console.log("Payload too large, splitting into emails...");
              
              if (blob && unmergedFiles.length > 0) {
                  // Send Blob in email 1, Unmerged in email 2
                  await sendSingleEmail({ blob }, "1 de 2");
                  await sendSingleEmail({ unmerged: unmergedFiles }, "2 de 2");
              } else if (unmergedFiles.length > 1) {
                  // Split unmerged files into 2 groups
                  const mid = Math.ceil(unmergedFiles.length / 2);
                  await sendSingleEmail({ unmerged: unmergedFiles.slice(0, mid) }, "1 de 2");
                  await sendSingleEmail({ unmerged: unmergedFiles.slice(mid) }, "2 de 2");
              } else if (blob && blob.size > VERCEL_LIMIT) {
                  // If just one massive blob, we try splitting it (very simplified, just sending it as 1 for now but showing alert)
                  // In a real scenario we'd split PDF pages, but that's complex here.
                  await sendSingleEmail({ blob }, "UNICO (GRANDE)");
              } else {
                  await sendSingleEmail({ blob, unmerged: unmergedFiles });
              }
          } else {
              if (blob || unmergedFiles.length > 0) {
                  await sendSingleEmail({ blob, unmerged: unmergedFiles });
              } else {
                  throw new Error("No hay archivos para enviar.");
              }
          }
          
          setEmailStatus('success');
          setShowUserCopyModal(true);
      } catch (error: any) {
          console.error("Error sending email:", error);
          setEmailStatus('error');
      }
  };
  
  const handleSendUserCopy = async (userEmail: string) => {
      if (!userEmail) return;
      
      const { blob, unmergedFiles, totalSize } = await createMergedPdfData();
      const filename = getGeneratedFilename();

      if (totalSize > 4400000) {
          alert(`El PDF es demasiado grande (${(totalSize / 1024 / 1024).toFixed(2)} MB) para enviarlo por este sistema. Intenta descargarlo directamente.`);
          return;
      }

      if (blob || unmergedFiles.length > 0) {
          try {
              const formData = new FormData();
              if (blob) {
                  formData.append('files', blob, filename);
              }
              
              // Generate lists for plain text email
              let missing = analysisResult?.documentacion?.faltante || [];
              let allAnalyzed = analysisResult?.documentacion?.analizada || [];
              let rejected = allAnalyzed.filter((d: any) => d.status === 'Rechazado');
              let accepted = allAnalyzed.filter((d: any) => d.status !== 'Rechazado');

              const titular = analysisResult?.pdd?.datosTitulares?.[0];
              const iban = titular?.datosBancarios?.iban || '';
              const isEntity2100 = iban.replace(/\s/g, '').substring(4, 8) === '2100';
              const amount = savedOfferData?.amountToFinance || 0;

              if (resultStatus === 'approved' && isEntity2100 && amount <= 30000) {
                  const docsToIgnore = ['JUSTIFICANTE DE INGRESOS', 'IRPF', 'CUENTA', 'VIDA LABORAL', 'MODELO 130 O 131'];
                  missing = missing.filter((doc: any) => !(doc.owner === 'Titular 1' && docsToIgnore.some(ignore => doc.docType.toUpperCase().includes(ignore))));
                  rejected = rejected.filter((doc: any) => !(doc.owner === 'Titular 1' && docsToIgnore.some(ignore => doc.docType.toUpperCase().includes(ignore))));
              }

              let acceptedListStr = accepted.length > 0 
                  ? accepted.map((d: any) => `- ${d.docType} (${d.owner})`).join('\n')
                  : 'Ninguna';
                  
              let missingListStr = '';
              if (missing.length > 0 || rejected.length > 0) {
                  const m = missing.map((d: any) => `- ${d.docType} (${d.owner}) - FALTANTE`).join('\n');
                  const r = rejected.map((d: any) => `- ${d.docType} (${d.owner}) - RECHAZADO: ${d.motivoRechazo}`).join('\n');
                  missingListStr = [m, r].filter(Boolean).join('\n');
              }

              // Additional specific documentation checks as requested
              let checkVehicleDocs = '';
              const hasCirculacion = allAnalyzed.some((d: any) => d.docType.toLowerCase().includes('permiso de circulación'));
              const hasFichaTecnica = allAnalyzed.some((d: any) => d.docType.toLowerCase().includes('ficha técnica'));
              const hasInformeDGT = allAnalyzed.some((d: any) => d.docType.toLowerCase().includes('informe dgt'));
              const isUsedVehicle = savedOfferData?.esNuevo === 'usado' || savedOfferData?.esNuevo === 'KM0';
              const isAutonomo = titular?.datosLaborales?.situacionLaboral?.toLowerCase().includes('autonomo') || titular?.datosLaborales?.situacionLaboral?.toLowerCase().includes('autónomo');
              const hasModelo100 = allAnalyzed.some((d: any) => d.docType.toLowerCase().includes('irpf') || d.docType.toLowerCase().includes('100'));

              if (isUsedVehicle) {
                  if (!hasCirculacion) checkVehicleDocs += `- FALTANTE: Permiso de Circulación (necesario al ser vehículo matriculado)\n`;
                  if (!hasFichaTecnica && !hasInformeDGT) {
                      checkVehicleDocs += `- FALTANTE: Ficha Técnica del Vehículo o Informe DGT (necesario al ser vehículo matriculado)\n`;
                  }
              }
              
              if (isAutonomo && amount > 25000 && !hasModelo100) {
                  checkVehicleDocs += `- FALTANTE: IRPF Modelo 100 (necesario para autónomos con importe superior a 25.000€)\n`;
              }
              
              if (checkVehicleDocs) {
                  missingListStr += (missingListStr ? '\n' : '') + checkVehicleDocs;
              }

              if (!missingListStr) {
                  missingListStr = 'No hay documentación pendiente. Todo está correcto.';
              }

              const targetEmailAddr = resultStatus === 'approved' 
                  ? 'documentacion.auto@caixabankpc.com' 
                  : 'documentacion.admision@caixabankpc.com';

              let warningMsg = '';
              if (resultStatus === 'approved') {
                  if (amount >= 40000) {
                      warningMsg = "ESTADO: SOLICITUD PRE-AUTORIZADA, PENDIENTE DE CIRBE TITULAR/ES. SI CIRBE NEGATIVO, SE PUEDE DENEGAR. SOLICITUD CON INTERVENCIÓN NOTARIAL.\n\n";
                  } else if (amount >= 30000) {
                      warningMsg = "ESTADO: SOLICITUD PRE-AUTORIZADA, PENDIENTE DE CIRBE TITULAR/ES. SI CIRBE NEGATIVO, SE PUEDE DENEGAR. ESPERAR AL PROXIMO CORREO DE CONFIRMACION O DENEGACION PASADAS UNAS HORAS.\n\n";
                  }
              }

              let bodyText = `Aquí tienes una copia de la documentación procesada de la oferta.\n\n`;
              if (warningMsg) bodyText += warningMsg;
              bodyText += `=== DOCUMENTACIÓN ENVIADA ===\n${acceptedListStr}\n=============================\n\n`;
              bodyText += `=== DOCUMENTACIÓN PENDIENTE ===\n${missingListStr}\n===============================\n\n`;
              
              if (missing.length > 0 || rejected.length > 0) {
                  bodyText += `INSTRUCCIONES IMPORTANTES:\n`;
                  bodyText += `Tienes que conseguir la documentación listada como "DOCUMENTACIÓN PENDIENTE" y enviarla a este correo electrónico: ${targetEmailAddr}\n\n`;
                  bodyText += `Si no envías esta documentación pendiente, no se podrá terminar el estudio de la operación (si estaba en estudio) o no se podrá abonar la solicitud (si estaba aprobada).\n`;
              }

              if (unmergedFiles && unmergedFiles.length > 0) {
                  bodyText += `\n*Nota: Algunos archivos originales estaban protegidos/encriptados y se han adjuntado por separado.*`;
                  unmergedFiles.forEach(file => {
                      formData.append('files', file, `Separado_${file.name}`);
                  });
              }

              formData.append('to', userEmail);
              formData.append('subject', `Copia Documentación y Pendientes Quoter - ${filename}`);
              formData.append('body', bodyText);

              const response = await fetch('/api/email/send-documentation', { method: 'POST', body: formData });
              if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`(${response.status}): ${errorText}`);
              }
              alert("Copia e instrucciones enviadas correctamente.");
          } catch (e: any) {
              console.error(e);
              alert(`Error al enviar la copia: ${e.message}`);
          }
      }
      setShowUserCopyModal(false);
  };

  // --- HTML GENERATOR ---
  const generatePddHtml = () => {
      const pdd = analysisResult?.pdd || {};
      const finalData = { ...savedOfferData, ...pdd }; 
      const titular = finalData.datosTitulares?.[0] || {};
      const coTitular = finalData.datosTitulares?.[1]; 
      const avalista1 = finalData.datosTitulares?.[2];
      const avalista2 = finalData.datosTitulares?.[3];
      
      const iban = titular.datosBancarios?.iban || '';
      const isEntity2100 = iban.replace(/\s/g, '').substring(4, 8) === '2100';
      const isCaixaClient = pdd?.operativaCaixa?.esCliente || isEntity2100;
      
      const salePriceValue = savedOfferData?.salePrice ?? pdd.datosOferta?.precioVehiculo;
      const downPaymentValue = savedOfferData?.downPayment ?? pdd.datosOferta?.entrada ?? 0;
      const amountToFinanceValue = savedOfferData?.amountToFinance ?? pdd.datosOferta?.importeAFinanciar;
      const termValue = savedOfferData?.term ?? pdd.datosOferta?.plazo;
      const tariffValue = savedOfferData?.interestRate ? `${savedOfferData.interestRate} %` : (pdd.datosOferta?.tarifa || '...');
      
      // Monthly Payment Logic
      const monthlyPaymentValue = savedOfferData?.monthlyPayment ?? pdd.datosOferta?.cuota;
      const displayMonthlyPayment = monthlyPaymentValue 
        ? new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(monthlyPaymentValue) + ' €' 
        : '...';

      let paymentDay = "Día 5 (Mes Siguiente)";
      if (titular.datosLaborales?.situacionLaboral?.toLowerCase().includes("pension") || titular.datosLaborales?.situacionLaboral?.toLowerCase().includes("jubilad")) {
          paymentDay = "Día 25";
      }

      let insuranceLabel = finalData.insuranceType || 'Vida + Desempleo';
      if(insuranceLabel === 'Sin Protección') insuranceLabel = 'Sin Seguro';
      
      if (titular.fechaNacimientoAnio) {
          const birthYear = parseInt(titular.fechaNacimientoAnio);
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;
          if (age > 60) insuranceLabel = "Vida Senior";
      }
      
      if (titular.datosLaborales?.situacionLaboral?.toLowerCase().match(/incapacidad|invalidez/)) {
          insuranceLabel = "SIN SEGURO (Incapacidad/Invalidez)";
      }

      const matriculaDisplay = pdd.datosVehiculo?.matricula ? pdd.datosVehiculo.matricula.replace(/\s+/g, '').toUpperCase() : '';

      const getVehicleDescription = () => {
          const isFurgon = pdd.datosVehiculo?.esFurgon;
          const typeLabel = isFurgon ? "FURGON" : "TURISMO";

          if (!pdd.datosVehiculo?.fechaMatriculacionAnio) return `[AUTOMOVIL NUEVO] ${typeLabel}`; 
          
          const regMonth = parseInt(pdd.datosVehiculo.fechaMatriculacionMes) || 1;
          const regYear = parseInt(pdd.datosVehiculo.fechaMatriculacionAnio);
          const today = new Date();
          const regDate = new Date(regYear, regMonth - 1);
          
          let monthsDiff = (today.getFullYear() - regDate.getFullYear()) * 12;
          monthsDiff -= regDate.getMonth();
          monthsDiff += today.getMonth();

          if (monthsDiff <= 0) return `[AUTOMOVIL NUEVO] ${typeLabel}`;
          if (monthsDiff <= 36) return `[AUTOMOVIL SEMINUEVO] ${typeLabel}`;
          if (monthsDiff <= 60) return `[OCASIÓN 36 - 60] ${typeLabel} OCASION`;
          if (monthsDiff <= 96) return `[OCASION + DE 60 MESES] ${typeLabel}`;
          return `[REVISAR ANTIGÜEDAD] ${typeLabel} (¿Nuevo o > 96 Meses?)`;
      };

      const renderHtmlRow = (label: string, value: any, isDoubtful = false, indent = false) => {
          const val = value === null || value === undefined || value === '' ? '...' : value;
          const labelStyle = indent ? 'padding-left: 15px; font-size: 10px;' : '';
          const rowStyle = isDoubtful ? 'background-color: #fef08a;' : '';
          return `
            <div class="row" style="${rowStyle}">
                <span class="label" style="${labelStyle}">${label}</span>
                <div class="value-group">
                    <span class="value">${val}</span>
                     ${isDoubtful ? '<span style="font-size: 10px; color: #b45309; margin-right: 5px;">⚠️ REVISAR</span>' : ''}
                    <button class="copy-btn" data-value="${val}">Copiar</button>
                </div>
            </div>
          `;
      };

      const renderHtmlRowNoCopy = (label: string, value: any, isDoubtful = false, indent = false) => {
          const val = value === null || value === undefined || value === '' ? '...' : value;
          const labelStyle = indent ? 'padding-left: 15px; font-size: 10px;' : '';
          const rowStyle = isDoubtful ? 'background-color: #fef08a;' : '';
          return `
            <div class="row" style="${rowStyle}">
                <span class="label" style="${labelStyle}">${label}</span>
                <div class="value-group">
                    <span class="value">${val}</span>
                    ${isDoubtful ? '<span style="font-size: 10px; color: #b45309; margin-left: 5px;">⚠️ REVISAR</span>' : ''}
                </div>
            </div>
          `;
      };

      const renderSectionHeader = (title: string) => `
        <div class="header">${title}</div>
      `;

      const renderSubHeader = (title: string) => `
        <div class="subheader">${title}</div>
      `;

      const renderSplitDate = (label: string, day: string, month: string, year: string) => `
        <div class="row">
            <span class="label">${label}</span>
            <div class="value-group" style="gap:4px;">
                <button class="copy-btn small" data-value="${day || ''}">${day || 'DD'}</button> /
                <button class="copy-btn small" data-value="${month || ''}">${month || 'MM'}</button> /
                <button class="copy-btn small" data-value="${year || ''}">${year || 'YYYY'}</button>
            </div>
        </div>
      `;

      const renderSplitIban = (label: string, iban: string) => {
          const cleanIban = (iban || '').replace(/\s/g, '');
          if (cleanIban.length >= 24) {
              const pais = cleanIban.substring(0, 4);
              const banco = cleanIban.substring(4, 8);
              const sucursal = cleanIban.substring(8, 12);
              const dc = cleanIban.substring(12, 14);
              const cuenta = cleanIban.substring(14, 24);
              
              return `
              <div class="row">
                  <span class="label">${label}</span>
                  <div class="value-group" style="gap:4px; flex-wrap: wrap; justify-content: flex-end;">
                      <button class="copy-btn small" data-value="${pais}">${pais}</button>
                      <button class="copy-btn small" data-value="${banco}">${banco}</button>
                      <button class="copy-btn small" data-value="${sucursal}">${sucursal}</button>
                      <button class="copy-btn small" data-value="${dc}">${dc}</button>
                      <button class="copy-btn small" data-value="${cuenta}">${cuenta}</button>
                  </div>
              </div>
              `;
          }
          return renderHtmlRow(label, iban);
      };

      const renderSplitDateMonthYear = (label: string, month: string, year: string) => `
        <div class="row">
            <span class="label">${label}</span>
            <div class="value-group" style="gap:4px;">
                <button class="copy-btn small" data-value="${month || ''}">${month || 'MM'}</button> /
                <button class="copy-btn small" data-value="${year || ''}">${year || 'YYYY'}</button>
            </div>
        </div>
      `;

      const renderSplitDateTextMonth = (label: string, month: string, year: string) => {
          const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
          const monthNum = parseInt(month, 10);
          const monthName = (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) ? monthNames[monthNum - 1] : month;

          return `
          <div class="row">
              <span class="label">${label}</span>
              <div class="value-group" style="gap:4px;">
                  <button class="copy-btn small" data-value="${monthName || ''}">${monthName || 'MM'}</button> /
                  <button class="copy-btn small" data-value="${year || ''}">${year || 'YYYY'}</button>
              </div>
          </div>
          `;
      };

      const isDoubtfulField = (fieldName: string) => {
          return pdd?.camposDudosos?.includes(fieldName) || false;
      };

      const renderLaboralData = (laboral: any) => {
          if (!laboral) return renderHtmlRow('Situación Laboral', 'No detectada');
          
          let ingresos = laboral.ingresosFijos;
          let numPagas = laboral.numeroPagas || (laboral.origenIngresos === 'Renta' ? '1' : '14');
          
          let ingresosFormatted = '...';
          if (ingresos) {
              const num = parseFloat(ingresos.toString().replace(',', '.'));
              if (!isNaN(num)) {
                  ingresosFormatted = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
              } else {
                  ingresosFormatted = ingresos;
              }
          }

          const antMes = laboral.antiguedadLaboralMes || '';
          const antAnio = laboral.antiguedadLaboralAnio || '';

          return `
            ${renderHtmlRow('Situación Laboral', laboral.situacionLaboral, isDoubtfulField('situacionLaboral'))}
            ${renderSplitDateTextMonth('Antigüedad Laboral', antMes, antAnio)}
            ${renderHtmlRow('Origen de Ingresos', laboral.origenIngresos, isDoubtfulField('origenIngresos'))}
            ${renderHtmlRow('Ingresos Fijos', ingresosFormatted, isDoubtfulField('ingresosFijos'))}
            ${renderHtmlRow('Número de Pagas', numPagas, isDoubtfulField('numeroPagas'))}
            ${renderHtmlRow('Profesión', laboral.profesion, isDoubtfulField('profesion'))}
            ${renderHtmlRow('Cargo', laboral.cargo, isDoubtfulField('cargo'))}
            ${renderHtmlRow('Nombre Empresa', laboral.nombreEmpresa, isDoubtfulField('nombreEmpresa'))}
            ${renderHtmlRow('CIF Empresa', laboral.cifEmpresa, isDoubtfulField('cifEmpresa'))}
            ${renderHtmlRow('Actividad Empresa', laboral.actividadEmpresa, isDoubtfulField('actividadEmpresa'))}
            ${renderHtmlRow('Dirección Empresa', laboral.direccionEmpresa, isDoubtfulField('direccionEmpresa'))}
            ${renderHtmlRow('C.P. Empresa', laboral.codigoPostalEmpresa, isDoubtfulField('codigoPostalEmpresa'))}
            ${renderHtmlRow('Población Empresa', laboral.poblacionEmpresa, isDoubtfulField('poblacionEmpresa'))}
            ${renderHtmlRow('Teléfono Empresa', laboral.telefonoEmpresa, isDoubtfulField('telefonoEmpresa'))}
          `;
      };

      const renderHousingData = (housing: any) => {
          let tipo = "Familiares/Padres"; 
          if (housing?.porcentajePropiedad && (String(housing.porcentajePropiedad).includes('100') || String(housing.porcentajePropiedad).includes('50') || String(housing.porcentajePropiedad).includes('25'))) {
              tipo = housing.tipoPropiedad || "Propiedad";
          } else if (housing?.deduccionViviendaEnRenta === true) {
              tipo = "Propiedad Hipotecada";
          } else if (housing?.tipoPropiedad && !housing.tipoPropiedad.toLowerCase().includes('propiedad')) {
              tipo = housing.tipoPropiedad;
          }
          
          const antiguedad = housing?.antiguedadVivienda || 'Al menos 15 años';

          return `
            ${renderHtmlRow('Tipo Propiedad', tipo, isDoubtfulField('tipoPropiedad'))}
            ${renderHtmlRow('Antigüedad Vivienda', antiguedad, isDoubtfulField('antiguedadVivienda'))}
          `;
      };

      const renderIbanRow = (person: any, isCotitular: boolean) => {
          if (isCotitular) return ''; 
          const ibanValue = person.datosBancarios?.iban || '';
          
          let antDia = person.datosBancarios?.antiguedadDia || '15';
          let antMes = person.datosBancarios?.antiguedadMes || '10';
          let antAnio = person.datosBancarios?.antiguedadAnio || '2015';

          return `
            ${renderSplitIban('IBAN', ibanValue)}
            ${renderSplitDate('Antigüedad Cuenta', antDia, antMes, antAnio)}
            ${renderHtmlRow('Entidad Bancaria', person.datosBancarios?.entidad || '...', isDoubtfulField('entidad'))}
          `;
      };

      const renderFullTitularData = (person: any, title: string, isCotitular = false) => {
          if (!person) return '';
          
          let day, month, year;
          if (person.fechaNacimientoDia && person.fechaNacimientoMes && person.fechaNacimientoAnio) {
              day = person.fechaNacimientoDia;
              month = person.fechaNacimientoMes;
              year = person.fechaNacimientoAnio;
          } else if (person.fechaNacimiento) {
             const parts = person.fechaNacimiento.split(/[\/\-]/);
             if (parts.length === 3) {
                 if (parts[0].length === 4) { year=parts[0]; month=parts[1]; day=parts[2]; }
                 else { day=parts[0]; month=parts[1]; year=parts[2]; }
             }
          }

          const isNie = person.dni?.toUpperCase().match(/^[XYZ]/);
          const docType = isNie ? 'NIE' : 'NIF';
          const estadoCivil = person.estadoCivil || 'Pareja de hecho';
          const dependientes = person.personasDependientes || '0';
          
          const tipoVia = person.direccion?.tipoViaCompleto || (person.direccion?.tipoVia === 'C' ? 'Calle' : person.direccion?.tipoVia);
          const nombreVia = person.direccion?.nombreVia;
          const restoDireccion = person.direccion?.restoDireccion || person.direccion?.puerta || person.direccion?.piso || person.direccion?.escalera ? `${person.direccion?.piso || ''} ${person.direccion?.puerta || ''} ${person.direccion?.escalera || ''}`.trim() : '...';

          return `
            <div class="person-container">
                <div class="person-title">${title}</div>
                ${renderSubHeader('Datos Personales (OBLIGATORIOS)')}
                ${renderHtmlRow('Nombre', person.nombre, isDoubtfulField('nombre'))}
                ${renderHtmlRow('Primer Apellido', person.primerApellido, isDoubtfulField('primerApellido'))}
                ${renderHtmlRow('Segundo Apellido', person.segundoApellido, isDoubtfulField('segundoApellido'))}
                ${renderSplitDate('Fecha Nacimiento', day, month, year)}
                ${renderHtmlRow('País de Nacimiento', person.paisNacimiento || '...', isDoubtfulField('paisNacimiento'))}
                ${renderHtmlRow('Sexo', person.sexo || '...', isDoubtfulField('sexo'))}
                ${renderHtmlRow('Estado Civil', estadoCivil, isDoubtfulField('estadoCivil'))}
                ${renderHtmlRow('Personas Dependientes', dependientes, isDoubtfulField('personasDependientes'))}
                
                ${isCotitular ? `
                    ${renderHtmlRow('Tipo Identificador', docType)}
                    ${renderHtmlRow('Documento Cliente', person.dni, isDoubtfulField('dni'))}
                    ${renderHtmlRow('Fecha Caducidad DNI/NIE', person.fechaCaducidad, isDoubtfulField('fechaCaducidad'))}
                ` : ''}
                
                ${renderHtmlRow('Nacionalidad', person.nacionalidad || 'ESPAÑA', isDoubtfulField('nacionalidad'))}
                
                ${renderSubHeader('Dirección Particular')}
                ${renderHtmlRow('Tipo Vía', tipoVia, isDoubtfulField('tipoVia'))}
                ${renderHtmlRow('Nombre Vía', nombreVia, isDoubtfulField('nombreVia'))}
                ${renderHtmlRow('Número', person.direccion?.numero, isDoubtfulField('numero'))}
                ${renderHtmlRow('Resto Dirección', restoDireccion, isDoubtfulField('restoDireccion'))}
                ${renderHtmlRow('Código Postal', person.direccion?.codigoPostal, isDoubtfulField('codigoPostal'))}
                ${renderHtmlRow('Población', person.direccion?.poblacion, isDoubtfulField('poblacion'))}
                ${renderSubHeader('Datos de Contacto')}
                ${renderHtmlRow('Teléfono Móvil', person.contacto?.movil, isDoubtfulField('movil'))}
                ${renderHtmlRow('Correo Electrónico', person.contacto?.email, isDoubtfulField('email'))}
                <p style="font-size: 10px; color: #ef4444; margin-top: -5px; margin-bottom: 10px; padding: 0 10px;">IMPRESCINDIBLES PARA EVALUAR LA SOLICITUD. ${isCotitular ? 'NO PUEDEN SER LOS MISMOS QUE LOS DEL TITULAR.' : ''}</p>
                ${!isCotitular ? renderSubHeader('Datos Bancarios') : ''}
                ${renderIbanRow(person, isCotitular)}
                ${renderSubHeader('Vivienda')}
                ${renderHousingData(person.datosVivienda)}
                ${renderSubHeader('Datos Laborales')}
                ${renderLaboralData(person.datosLaborales)}
            </div>
          `;
      };

      const isNieTitular = titular.dni?.toUpperCase().match(/^[XYZ]/);
      const docTypeTitular = isNieTitular ? 'NIE' : 'NIF';
      
      let cadDia, cadMes, cadAnio;
      if (titular.fechaCaducidad) {
          const parts = titular.fechaCaducidad.split(/[\/\-]/);
          if (parts.length === 3) {
              if (parts[0].length === 4) { cadAnio=parts[0]; cadMes=parts[1]; cadDia=parts[2]; }
              else { cadDia=parts[0]; cadMes=parts[1]; cadAnio=parts[2]; }
          }
      }

      return `
            <!DOCTYPE html>
            <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>PDD - Datos Solicitud</title>
                    <style>
                        body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 0; margin: 0; background-color: #ffffff; font-size: 13px; height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; color: #000000; }
                        #data-container { flex: 1; overflow-y: auto; padding: 20px; box-sizing: border-box; }
                        .main-title { text-align: center; color: #000000; font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; border-bottom: 2px solid #000000; padding-bottom: 10px; }
                        .header { background: #f8fafc; color: #000000; padding: 10px 0; font-weight: bold; margin-top: 25px; text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #000000; }
                        .person-title { background: #000000; color: white; padding: 12px; font-weight: 800; font-size: 16px; text-align: center; border-radius: 0; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px; }
                        .subheader { color: #000000; padding: 6px 0; font-weight: bold; margin-top: 20px; font-size: 13px; border-bottom: 1px solid #000000; width: fit-content; margin-bottom: 10px; text-transform: uppercase; }
                        .row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                        .row:last-child { border-bottom: none; }
                        .label { color: #000000; font-weight: 600; font-size: 13px; flex: 1; text-transform: uppercase; }
                        .value-group { display: flex; gap: 8px; align-items: center; justify-content: flex-end; flex: 2; }
                        .value { font-weight: bold; color: #000000; font-size: 13px; text-align: right; word-break: break-word; }
                        .copy-btn { background: white; border: 1px solid #000000; color: #000000; padding: 4px 12px; border-radius: 0; cursor: pointer; font-size: 11px; font-weight: bold; transition: all 0.2s; text-transform: uppercase; }
                        .copy-btn:hover { background: #000000; color: white; }
                        .copy-btn.copied { background: #000000; color: white; border-color: #000000; }
                        .section-container { background: white; padding: 20px; border-radius: 0; margin-bottom: 20px; border: 1px solid #000000; }
                        .person-container { background: white; border-radius: 0; margin-bottom: 30px; padding: 20px; border: 1px solid #000000; }
                    </style>
                </head>
                <body>
                    <div id="data-container">
                        <h1 class="main-title">INSTRUCCIONES Y DATOS PARA TRAMITAR NUEVA SOLICITUD</h1>
                        
                        <div class="section-container">
                            <div class="header">ACCESO A LA WEB DE OPERACIONES</div>
                            ${renderHtmlRowNoCopy('Número de Identificador', 'TU DNI/NIE CON LETRA MAYÚSCULA')}
                            ${renderHtmlRowNoCopy('Clave de Acceso', 'Clave de 6 Dígitos')}
                            <p style="font-size: 10px; color: #64748b; margin-top: 5px; padding: 0 10px;">
                                Si no la recuerdas, pulsa en Recuperar Código Secreto. Te llegará un SMS con una clave temporal de 6 dígitos para cambiarla por una definitiva de al menos 6 dígitos.
                            </p>
                        </div>

                        <div class="section-container">
                            <div class="header">Introducir datos de inicio de solicitud</div>
                            ${renderHtmlRow('Centro', `${pdd.datosConcesionario?.codigo || ''} - ${pdd.datosConcesionario?.nombre?.toUpperCase() || ''}`)}
                            ${renderHtmlRow('Vendedor', pdd.datosConcesionario?.vendedor)}
                            ${renderHtmlRow(`Documento del cliente (${docTypeTitular})`, titular.dni)}
                            ${isNieTitular 
                                ? renderSplitDate('Finalización de la Tarjeta de Residencia', cadDia, cadMes, cadAnio) 
                                : renderSplitDate('Fecha caducidad del documento', cadDia, cadMes, cadAnio)
                            }
                            ${isNieTitular ? renderHtmlRow('Nacionalidad', titular.nacionalidad || 'ESPAÑA') : ''}
                            ${renderHtmlRow('Producto', savedOfferData?.productType === 'Leasing' ? 'Leasing' : 'Auto')}
                            ${renderHtmlRow('Operativa Caixa', isCaixaClient ? 'Sí' : 'No')}
                            ${isCaixaClient ? renderSplitIban('Cuenta Cliente', iban) : ''}
                            ${renderHtmlRow('Operativa', isCaixaClient ? 'Operativa Caixa' : 'Estándar')}
                        </div>

                        <div class="section-container">
                            <div class="header">1 - Introducir datos financiación</div>
                            <div class="subheader">Datos Vehículo</div>
                            ${renderHtmlRow('Tipo Vehículo', getVehicleDescription())}
                            ${pdd.datosVehiculo?.esRefinanciado ? renderHtmlRow('Operación', '[REFINANCIADO] VEHICULO MATRICULADO') : ''}
                            ${renderHtmlRow('Marca', pdd.datosVehiculo?.marca)}
                            ${renderHtmlRow('Modelo', pdd.datosVehiculo?.modelo)}
                            ${renderHtmlRow('Versión', pdd.datosVehiculo?.version || pdd.datosVehiculo?.motorizacion)}
                            ${renderHtmlRow('Potencia', `${pdd.datosVehiculo?.potencia || ''}`)}
                            ${renderHtmlRow('Número de Bastidor', pdd.datosVehiculo?.bastidor)}
                            ${renderHtmlRow('Matrícula', matriculaDisplay || '... (PONER UN GUION - SI ES IMPORTADO)')}
                            ${!pdd.datosVehiculo?.fechaMatriculacionAnio || !pdd.datosVehiculo?.fechaMatriculacionMes ? renderHtmlRow('Antigüedad Vehículo', 'NUEVO') : renderSplitDateTextMonth('Antigüedad Vehículo', pdd.datosVehiculo?.fechaMatriculacionMes, pdd.datosVehiculo?.fechaMatriculacionAnio)}
                            <p style="font-size: 10px; color: #ef4444; margin-top: -5px; margin-bottom: 10px; padding: 0 10px;">NO SE PODRÁ FIRMAR LA SOLICITUD SI MATRÍCULA O BASTIDOR ESTÁN EN BLANCO.</p>
                            
                            <div class="subheader">Datos Financiación</div>
                            ${renderHtmlRow('Importe del Vehículo', salePriceValue)}
                            ${renderHtmlRow('Entrada', downPaymentValue)}
                            ${renderHtmlRow('Importe a Financiar', amountToFinanceValue)}
                            ${renderHtmlRow('Tarifa', tariffValue)}
                            ${renderHtmlRow('Plazos', termValue)}
                            ${renderHtmlRow('Seguro', insuranceLabel)}
                            ${renderHtmlRow('Día Pago de Cuotas', paymentDay)}
                            ${renderHtmlRow('Cuota Mensual', displayMonthlyPayment)}
                        </div>

                        ${renderFullTitularData(titular, '2 - COMPLETAR DATOS SOLICITUD (TITULAR)')}
                        ${coTitular ? renderFullTitularData(coTitular, '3 - COMPLETAR DATOS SOLICITUD (COTITULAR)', true) : ''}
                        ${avalista1 ? renderFullTitularData(avalista1, '4 - COMPLETAR DATOS SOLICITUD (AVALISTA 1)', true) : ''}
                        ${avalista2 ? renderFullTitularData(avalista2, '5 - COMPLETAR DATOS SOLICITUD (AVALISTA 2)', true) : ''}
                        
                        <div style="margin-top: 30px; padding: 20px; border: 2px solid #000000; background-color: #f8fafc; text-align: center; border-radius: 0;">
                            <h3 style="margin-top: 0; margin-bottom: 15px; color: #000000; text-transform: uppercase; font-weight: 800;">EVALUAR SOLICITUD</h3>
                            <p style="font-weight: 600; font-size: 14px; margin-bottom: 15px;">PULSA EL BOTON EVALUAR EN LA WEB DE OPERACIONES.</p>
                            <p style="font-size: 13px; color: #475569;">UNA VEZ TENGAS EL RESULTADO, INDICAMELO AL CERRAR ESTA VENTANA, PULSANDO EL BOTON CORRESPONDIENTE, PARA PODER ENVIAR LA DOCUMENTACION AL DEPARTAMENTO CORRESPONDIENTE.</p>
                        </div>
                    </div>
                    
                    <script>
                        function showFeedback(btn) {
                            const originalText = btn.textContent;
                            btn.classList.add('copied');
                            btn.textContent = 'OK';
                            setTimeout(()=>{ btn.classList.remove('copied'); btn.textContent = originalText; }, 1000);
                        }

                        function fallbackCopyTextToClipboard(text, btn) {
                            var textArea = document.createElement("textarea");
                            textArea.value = text;
                            textArea.style.top = "0";
                            textArea.style.left = "0";
                            textArea.style.position = "fixed";
                            textArea.style.opacity = "0";
                            textArea.style.pointerEvents = "none";
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            try {
                                var successful = document.execCommand('copy');
                                if (successful) { showFeedback(btn); } 
                                else { window.prompt("Copia este texto: Ctrl+C, Enter", text); }
                            } catch (err) {
                                window.prompt("Copia este texto: Ctrl+C, Enter", text);
                            }
                            document.body.removeChild(textArea);
                        }

                        document.querySelectorAll('.copy-btn').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                const val = btn.getAttribute('data-value');
                                if(val && val !== '...') {
                                    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
                                        navigator.clipboard.writeText(val).then(() => { showFeedback(btn); })
                                        .catch(() => { fallbackCopyTextToClipboard(val, btn); });
                                    } else {
                                        fallbackCopyTextToClipboard(val, btn);
                                    }
                                }
                            });
                        });
                    </script>
                </body>
            </html>
      `;
  };

  const createMergedPdfUrl = async (): Promise<string | null> => {
      const { blob } = await createMergedPdfData();
      return blob ? URL.createObjectURL(blob) : null;
  };

  const isEmpresaOrLeasing = 
    savedOfferData?.clientType === 'Sociedades' || 
    (savedOfferData?.productType === 'Leasing' && (savedOfferData?.clientType === 'Autónomos' || savedOfferData?.clientType === 'Sociedades'));

  const isDocumentationComplete = () => {
    if (!analysisResult?.documentacion) return false;
    const hasFaltante = analysisResult.documentacion.faltante.length > 0;
    const hasRechazado = analysisResult.documentacion.analizada.some(d => d.status === 'Rechazado');
    return !hasFaltante && !hasRechazado;
  };

  const hasCorporateViabilityIssue = () => {
    if (!isEmpresaOrLeasing || !analysisResult?.documentacion) return false;
    return analysisResult.documentacion.analizada.some(d => 
      d.status === 'Rechazado' && 
      (d.motivoRechazo?.includes('FONDOS PROPIOS INFERIORES') || d.motivoRechazo?.includes('SOCIEDAD DE NUEVA CREACIÓN'))
    );
  };

  const handleSendToEmpresas = async () => {
      if (!empresasContact.mobile || !empresasContact.email) {
          alert("Por favor, introduce un móvil y un email de contacto.");
          return;
      }

      setIsSendingEmpresas(true);
      
      const pdd = analysisResult?.pdd || {};
      const titular = pdd.datosTitulares?.[0] || {};
      const cif = titular.dni ? titular.dni.toUpperCase() : 'CIF DESCONOCIDO';
      const dealerCode = pdd.datosConcesionario?.codigo || 'SIN CODIGO';
      const sellerName = pdd.datosConcesionario?.vendedor || 'VENDEDOR';
      
      let typeLabel = "SOLICITUD EMPRESA";
      if (savedOfferData?.productType === 'Leasing') {
          typeLabel = savedOfferData?.clientType === 'Autónomos' ? "SOLICITUD LEASING AUTONOMOS" : "SOLICITUD LEASING EMPRESAS";
      }

      const subject = `${typeLabel} - ${cif} / ${dealerCode} / ${sellerName}`;
      const emailAddress = 'empresasdoc@caixabankpc.com';

      const docsList = analysisResult?.documentacion?.analizada?.map((d: any) => `- ${d.docType} (${d.owner})`).join('\n') || 'Documentación adjunta';
      
      const bodyText = `Se remite documentación completa para la tramitación de la siguiente solicitud:

TIPO: ${typeLabel}
CIF/DNI: ${cif}
CONCESIONARIO: ${dealerCode}
VENDEDOR: ${sellerName}
CONTACTO: ${empresasContact.mobile} / ${empresasContact.email}

DOCUMENTACIÓN ADJUNTA:
${docsList}
- Ficha TramiCar (PDF Adjunto)

(Envío automático desde el sistema de tramitación especializado)`;

      const { blob, unmergedFiles } = await createMergedPdfData();
      const filename = `Ficha_TramiCar_${cif}_${dealerCode}.pdf`;

      try {
          const formData = new FormData();
          if (blob) {
              formData.append('files', blob, filename);
          }
          if (unmergedFiles && unmergedFiles.length > 0) {
              unmergedFiles.forEach(file => {
                  formData.append('files', file, `Separado_${file.name}`);
              });
          }

          formData.append('to', emailAddress);
          formData.append('subject', subject);
          formData.append('body', bodyText);

          const response = await fetch('/api/email/send-documentation', {
              method: 'POST',
              body: formData
          });

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error en el envío (${response.status}): ${errorText}`);
          }
          
          alert("Solicitud enviada correctamente al equipo de Empresas.");
          setEmailStatus('success');
          setShowPostProcessing(true);
          setResultStatus('study'); // Consider it in study as it's being handled by a team
      } catch (error: any) {
          console.error("Error sending to empresas:", error);
          alert(`Error al enviar: ${error.message}`);
      } finally {
          setIsSendingEmpresas(false);
      }
  };

  const handleOpenTramitacion = async () => {
    setIsWaitingForPDD(true);
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const isMobile = width < 768; // Simple mobile check

    // 1. Generate PDD HTML content (including mobile buttons logic)
    const pddHtml = generatePddHtml();

    if (isMobile) {
        // --- Mobile Logic: Single Window (PDD) ---
        const pddWindow = window.open('', 'pdd_data_popup');
        
        if (pddWindow) {
            pddWindow.document.write('<html><body style="font-family:sans-serif; text-align:center; padding-top:20px;"><h3>Generando Vista PDD...</h3></body></html>');
            pddWindow.document.open();
            pddWindow.document.write(pddHtml);
            pddWindow.document.close();
            
            // On mobile, we might not need to monitor closure as strictly or reopen stuff immediately
            // But we keep the loop to detect when user returns
            const pddCheck = setInterval(() => {
                if (pddWindow.closed) {
                    clearInterval(pddCheck);
                    setIsWaitingForPDD(false);
                    setShowPostProcessing(true);
                }
            }, 1000);
        } else {
            setIsWaitingForPDD(false);
            alert("Por favor, permite los pop-ups para ver los datos de la solicitud.");
        }

    } else {
        // --- Desktop Logic: Split Screen (3 Windows) ---
        
        // 1. Open CaixaBank Web App (Right Half)
        const webW = Math.floor(width / 2);
        const webLeft = Math.floor(width / 2);
        const webUrl = 'https://autos.caixabankpc.com/apw5/fncWebAutenticacion/Prescriptores.do?prestamo=auto';
        const webFeatures = `width=${webW},height=${height},left=${webLeft},top=0,resizable,scrollbars,status`;
        window.open(webUrl, 'caixabankpc_webapp', webFeatures);

        // 2. Open PDD Window (Left Top - 3/4 Height)
        const pddW = Math.floor(width / 2);
        const pddH = Math.floor(height * 0.75);
        const pddFeatures = `width=${pddW},height=${pddH},left=0,top=0,resizable,scrollbars,status`;
        
        const pddWindow = window.open('', 'pdd_data_popup', pddFeatures);
        if(pddWindow) {
            pddWindow.document.write('<html><body style="font-family:sans-serif; text-align:center; padding-top:20px;"><h3>Generando Vista PDD...</h3></body></html>');
            pddWindow.document.open();
            pddWindow.document.write(pddHtml);
            pddWindow.document.close();

            // Monitor PDD window closure
            const pddCheck = setInterval(() => {
                if (pddWindow.closed) {
                    clearInterval(pddCheck);
                    setIsWaitingForPDD(false);
                    setShowPostProcessing(true);
                }
            }, 1000);
        } else {
            setIsWaitingForPDD(false);
        }

        // 3. Open PDF Documentation Window (Left Bottom - 1/4 Height)
        const pdfH = height - pddH; // Remaining 1/4 height
        const pdfTop = pddH; // Starts where PDD ends
        const pdfFeatures = `width=${pddW},height=${pdfH},left=0,top=${pdfTop},resizable,scrollbars,status`;
        
        const pdfWindow = window.open('', 'pdf_docs_popup', pdfFeatures);
        if (pdfWindow) {
            pdfWindow.document.write('<html><body style="font-family:sans-serif; text-align:center; padding-top:20px;"><h3>Generando PDF...</h3></body></html>');
        }

        const pdfUrl = await createMergedPdfUrl();
        if (pdfUrl && pdfWindow) {
            pdfWindow.location.href = pdfUrl;
        } else if (pdfWindow) {
            pdfWindow.document.write('<html><body style="font-family:sans-serif; text-align:center; padding-top:20px;"><h3>Error al generar PDF</h3></body></html>');
            pdfWindow.document.close();
        }
    }
  };

  const handleStatusAction = async (status: 'approved' | 'study') => {
      setResultStatus(status);
      await handleSendAutomaticEmail(status);
  };

  const renderSelection = () => (
      <div className="bg-white p-8 rounded-none shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto">
          <h2 className="text-2xl font-light text-black tracking-tight mb-8">¿Cómo ha quedado la Solicitud?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button 
                onClick={() => handleStatusAction('approved')} 
                className="bg-white border border-slate-200 text-black font-bold py-6 rounded-none shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 hover:border-green-500 group"
              >
                  <CheckIcon className="w-8 h-8 text-slate-400 group-hover:text-green-500 transition-colors"/>
                  <span className="text-xs uppercase tracking-widest">APROBADA</span>
              </button>
              <button 
                onClick={() => handleStatusAction('study')} 
                className="bg-white border border-slate-200 text-black font-bold py-6 rounded-none shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 hover:border-yellow-500 group"
              >
                  <WarningIcon className="w-8 h-8 text-slate-400 group-hover:text-yellow-500 transition-colors"/>
                  <span className="text-xs uppercase tracking-widest">EN ESTUDIO</span>
              </button>
              <button 
                onClick={() => setResultStatus('denied')} 
                className="bg-white border border-slate-200 text-black font-bold py-6 rounded-none shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 hover:border-red-500 group"
              >
                  <XIcon className="w-8 h-8 text-slate-400 group-hover:text-red-500 transition-colors"/>
                  <span className="text-xs uppercase tracking-widest">DENEGADA</span>
              </button>
          </div>
          <button onClick={handleOpenTramitacion} className="bg-slate-100 text-slate-700 font-bold py-3 px-8 rounded-none hover:bg-slate-200 transition-colors shadow-sm text-xs uppercase tracking-widest">
              <ArrowUturnLeftIcon className="w-4 h-4 inline mr-2"/> Volver a abrir ventanas
          </button>
      </div>
  );

  const DocsSummaryCards = () => {
      let missing = analysisResult?.documentacion?.faltante || [];
      let allAnalyzed = analysisResult?.documentacion?.analizada || [];
      
      let rejected = allAnalyzed.filter(d => d.status === 'Rechazado');
      let accepted = allAnalyzed.filter(d => d.status !== 'Rechazado');

      // Apply CaixaBank client rule
      const titular = analysisResult?.pdd?.datosTitulares?.[0];
      const iban = titular?.datosBancarios?.iban || '';
      const isEntity2100 = iban.replace(/\s/g, '').substring(4, 8) === '2100';
      const amount = savedOfferData?.amountToFinance || 0;

      if (resultStatus === 'approved' && isEntity2100 && amount <= 30000) {
          const docsToIgnore = [
              'JUSTIFICANTE DE INGRESOS',
              'IRPF',
              'CUENTA',
              'VIDA LABORAL',
              'MODELO 130 O 131'
          ];
          
          missing = missing.filter(doc => {
              if (doc.owner === 'Titular 1') {
                  return !docsToIgnore.some(ignore => doc.docType.toUpperCase().includes(ignore));
              }
              return true;
          });
          
          rejected = rejected.filter(doc => {
              if (doc.owner === 'Titular 1') {
                  return !docsToIgnore.some(ignore => doc.docType.toUpperCase().includes(ignore));
              }
              return true;
          });
      }

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h4 className="font-bold text-green-700 mb-4 uppercase text-xs tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                       Documentación Enviada
                  </h4>
                  {accepted.length > 0 ? (
                      <ul className="space-y-2 text-sm text-slate-600">
                          {accepted.map((doc, idx) => (
                              <li key={`acc-${idx}`} className="flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  <span><strong>{doc.docType}</strong> <span className="text-xs text-slate-400">({doc.owner})</span></span>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-sm text-slate-400 italic">No se ha enviado documentación</p>
                  )}
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h4 className="font-bold text-red-600 mb-4 uppercase text-xs tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                       Documentación Pendiente
                  </h4>
                  {(missing.length > 0 || rejected.length > 0) ? (
                      <ul className="space-y-2 text-sm text-slate-600">
                          {missing.map((doc, idx) => (
                              <li key={`miss-${idx}`} className="flex items-start">
                                  <span className="text-red-500 mr-2">•</span>
                                  <span><strong>{doc.docType}</strong> <span className="text-xs text-slate-400">({doc.owner})</span> - <span className="text-red-500 font-medium text-xs">Faltante</span></span>
                              </li>
                          ))}
                          {rejected.map((doc, idx) => (
                              <li key={`rej-${idx}`} className="flex items-start">
                                  <span className="text-red-500 mr-2">✗</span>
                                  <span>
                                      <strong>{doc.docType}</strong> <span className="text-xs text-slate-400">({doc.owner})</span> - <span className="text-red-500 font-bold text-xs">{doc.motivoRechazo || 'Rechazado'}</span>
                                      {doc.motivoRechazo?.toLowerCase().includes('color') && <span className="block text-xs text-red-500 italic mt-0.5">⚠️ Subir nuevamente en COLOR.</span>}
                                  </span>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className="text-sm text-slate-400 italic">Toda la documentación está correcta</p>
                  )}
              </div>
          </div>
      );
  };

  const EmailStatusBanner = ({ email, manualAction }: { email: string, manualAction: () => void }) => {
      if (emailStatus === 'sending') {
          return (
              <div className="bg-white border border-slate-200 p-4 mb-6 flex items-center gap-3 rounded-xl shadow-sm">
                  <SpinnerIcon className="w-5 h-5 text-black animate-spin" />
                  <p className="text-black font-medium text-sm">Enviando documentación automáticamente...</p>
              </div>
          );
      }
      if (emailStatus === 'success') {
          return (
              <div className="bg-white border border-green-200 p-4 mb-6 flex items-center gap-3 rounded-xl shadow-sm">
                  <CheckIcon className="w-6 h-6 text-green-500" />
                  <p className="text-green-700 font-medium text-sm">Documentación Enviada Correctamente</p>
              </div>
          );
      }
      
      if (emailStatus === 'error' || emailStatus === 'idle') {
          return (
              <div className="bg-white border border-slate-200 p-6 mb-6 text-left rounded-xl shadow-sm">
                  <p className="text-xs text-black font-bold mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Instrucciones de Envío</p>
                  <p className="text-slate-500 text-sm mb-4">Descarga el PDF con toda la documentación y envíalo manualmente a:</p>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between mb-4">
                      <span className="font-mono font-medium text-black text-sm">{email}</span>
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(email);
                            alert("Email copiado al portapapeles");
                        }}
                        className="text-xs bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-none font-bold text-black uppercase tracking-widest transition-colors"
                      >
                        Copiar
                      </button>
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6">
                      <p className="text-blue-800 text-xs font-bold uppercase tracking-tight mb-1">⚠️ IMPORTANTE: ASUNTO DEL CORREO</p>
                      <p className="text-blue-700 text-[11px]">Si realizas el envío manual, recuerda poner el **DNI DEL TITULAR** en el asunto del correo para que podamos identificar al cliente correctamente.</p>
                  </div>

                  {emailStatus === 'error' && (
                      <div className="mt-2 mb-6 text-red-500 text-xs font-medium bg-red-50/50 p-3 border border-red-100 rounded-lg">
                          <p>Hubo un error en el envío automático (posiblemente por el peso de los archivos).</p>
                      </div>
                  )}

                  <div className="flex gap-3 pt-2">
                       <button onClick={onRestart} className="flex-1 bg-black text-white font-bold py-3 px-4 text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors">
                           Nueva Solicitud
                       </button>
                       <button onClick={onBack} className="flex-1 bg-slate-200 text-slate-600 font-bold py-3 px-4 text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-300 transition-colors">
                           Atrás
                       </button>
                  </div>
              </div>
          );
      }
      
      return null;
  };

  const renderApproved = () => {
      const amount = savedOfferData?.amountToFinance || 0;
      let warningMessage = "";
      if (amount >= 40000) {
          warningMessage = "SOLICITUD PRE-AUTORIZADA, PENDIENTE DE CIRBE TITULAR/ES. SI CIRBE NEGATIVO, SE PUEDE DENEGAR. SOLICITUD CON INTERVENCIÓN NOTARIAL. UNA VEZ TENGAS LA APROBACION DEFINITIVA, ENVÍA UN CORREO A TU GESTOR COMERCIAL CON LOS DATOS DE LA NOTARÍA.";
      } else if (amount >= 30000) {
          warningMessage = "SOLICITUD PRE-AUTORIZADA, PENDIENTE DE CIRBE TITULAR/ES. SI CIRBE NEGATIVO, SE PUEDE DENEGAR. ESPERAR AL PROXIMO CORREO DE CONFIRMACION O DENEGACION PASADAS UNAS HORAS.";
      }

      return (
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                  <div className="bg-green-50 p-4 rounded-full border border-green-100"><CheckIcon className="w-10 h-10 text-green-600" /></div>
              </div>
              <h2 className="text-2xl font-light text-black tracking-tight mb-2">
                  {amount >= 30000 ? 'SOLICITUD PRE-AUTORIZADA' : 'SOLICITUD APROBADA'}
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                  {amount >= 30000 ? 'La solicitud ha sido pre-autorizada temporalmente.' : 'La solicitud ha sido aprobada correctamente.'}
              </p>

              <EmailStatusBanner 
                  email="documentacion.auto@caixabankpc.com" 
                  manualAction={handleDownloadPdf} 
              />

              {warningMessage && (
                  <div className="bg-white border border-yellow-200 p-4 mb-6 text-left text-xs text-yellow-800 font-medium rounded-xl">
                      <WarningIcon className="w-4 h-4 inline mr-2 -mt-0.5 text-yellow-500"/> {warningMessage}
                  </div>
              )}

              <DocsSummaryCards />

              {(emailStatus === 'error' || emailStatus === 'idle') && (
                  <div className="mb-8">
                      <button 
                        onClick={handleDownloadPdf} 
                        disabled={isDownloading} 
                        className="w-full bg-black text-white font-bold py-4 rounded-none flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all transform hover:scale-[1.02] text-xs uppercase tracking-widest"
                      >
                          {isDownloading ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <DownloadIcon className="w-5 h-5"/>} 
                          DESCARGAR DOCUMENTACIÓN COMPLETA (PDF)
                      </button>
                  </div>
              )}

              <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-8 mt-4">
                  <button 
                    onClick={onBack} 
                    className="flex-1 bg-slate-200 text-slate-600 font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-300 transition-colors"
                  >
                      Cerrar Sesión
                  </button>
                  <button 
                    onClick={onRestart} 
                    className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
                  >
                      Nueva Solicitud
                  </button>
              </div>
          </div>
      );
  };

  const renderStudy = () => (
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
              <div className="bg-yellow-50 p-4 rounded-full border border-yellow-100"><WarningIcon className="w-10 h-10 text-yellow-600" /></div>
          </div>
          <h2 className="text-2xl font-light text-black tracking-tight mb-2 uppercase">SOLICITUD EN ESTUDIO</h2>
          <p className="text-slate-500 text-sm mb-1 font-medium">Se requiere análisis manual por parte de admisión.</p>
          <p className="text-slate-400 text-xs mb-8">Se requiere análisis manual por el Departamento de Admisión de solicitudes.</p>

          <EmailStatusBanner 
              email="documentacion.admision@caixabankpc.com" 
              manualAction={handleDownloadPdf} 
          />

          <DocsSummaryCards />

          {(emailStatus === 'error' || emailStatus === 'idle') && (
              <div className="mb-8">
                  <button 
                    onClick={handleDownloadPdf} 
                    disabled={isDownloading} 
                    className="w-full bg-black text-white font-bold py-4 rounded-none flex items-center justify-center gap-2 shadow-lg hover:bg-slate-800 transition-all transform hover:scale-[1.02] text-xs uppercase tracking-widest"
                  >
                      {isDownloading ? <SpinnerIcon className="w-5 h-5 animate-spin"/> : <DownloadIcon className="w-5 h-5"/>} 
                      DESCARGAR DOCUMENTACIÓN COMPLETA (PDF)
                  </button>
              </div>
          )}

          <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-8 mt-4">
              <button 
                onClick={onBack} 
                className="flex-1 bg-slate-200 text-slate-600 font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-300 transition-colors"
              >
                  Cerrar Sesión
              </button>
              <button 
                onClick={onRestart} 
                className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
              >
                  Nueva Solicitud
              </button>
          </div>
      </div>
  );

  const renderDenied = () => (
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-xl mx-auto">
          <div className="flex justify-center mb-6">
              <div className="bg-red-50 p-4 rounded-full border border-red-100"><XIcon className="w-10 h-10 text-red-600" /></div>
          </div>
          <h2 className="text-2xl font-light text-black tracking-tight mb-8">SOLICITUD DENEGADA</h2>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-left space-y-2 mb-8">
              <p className="font-bold text-black text-xs uppercase tracking-widest">ESTADO: DENEGADA EN AUTOMÁTICO</p>
              <p className="text-sm text-slate-500">
                  La operación no cumple con los criterios mínimos de riesgo para su aprobación.
              </p>
          </div>

          <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-8 mt-4">
              <button 
                onClick={onBack} 
                className="flex-1 bg-slate-200 text-slate-600 font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-300 transition-colors"
              >
                  Cerrar Sesión
              </button>
              <button 
                onClick={onRestart} 
                className="flex-1 bg-black text-white font-bold py-4 px-6 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 transition-colors"
              >
                  Nueva Solicitud
              </button>
          </div>

          {showDeniedModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in border border-slate-200">
                      <div className="bg-black p-8 text-white text-center">
                          <XIcon className="w-12 h-12 mx-auto mb-6 text-slate-300" />
                          <h3 className="text-2xl font-light tracking-tight">NO SE PUEDE RECONSIDERAR</h3>
                      </div>
                      <div className="p-8 text-center">
                          <p className="text-slate-500 text-sm leading-relaxed mb-8">
                              No contactes con tu gestor comercial ni con asistencia a solicitudes, ya que no se puede realizar ninguna gestión sobre una solicitud denegada en automático.
                          </p>
                          <button 
                            onClick={() => setShowDeniedModal(false)}
                            className="w-full bg-black text-white font-bold py-4 rounded-none hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
                          >
                              ENTENDIDO
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderInitialStep = () => {
      if (isEmpresaOrLeasing) {
          const viabilityIssue = hasCorporateViabilityIssue();
          const complete = isDocumentationComplete();

          if (viabilityIssue) {
              return (
                  <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto flex flex-col items-center">
                      <div className="bg-red-50 p-6 rounded-full inline-block mb-8 border border-red-100">
                          <XIcon className="w-12 h-12 text-red-600" />
                      </div>
                      <h2 className="text-3xl font-light text-black tracking-tight mb-4 uppercase">Solicitud No Viable</h2>
                      <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed text-sm">
                          Tras analizar la documentación de la sociedad, se ha determinado que la solicitud **no es viable** por el siguiente motivo:
                      </p>
                      
                      <div className="w-full text-left bg-red-50 p-6 rounded-xl border border-red-200 mb-10">
                          <ul className="space-y-3">
                              {analysisResult?.documentacion?.analizada
                                  .filter(d => d.status === 'Rechazado' && (d.motivoRechazo?.includes('FONDOS PROPIOS INFERIORES') || d.motivoRechazo?.includes('SOCIEDAD DE NUEVA CREACIÓN')))
                                  .map((d, i) => (
                                      <li key={`v-${i}`} className="flex items-start gap-3">
                                          <WarningIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                          <span className="text-red-900 font-bold text-sm">{d.motivoRechazo}</span>
                                      </li>
                                  ))
                              }
                          </ul>
                      </div>

                      <p className="text-slate-400 text-xs mb-10 italic">
                          Esta solicitud no se enviará al equipo de empresas al no cumplir los criterios mínimos de FFPP o antigüedad de constitución.
                      </p>

                      <button 
                          onClick={onRestart} 
                          className="w-full max-w-sm bg-black text-white font-bold py-5 rounded-none shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
                      >
                          CERRAR Y VOLVER AL INICIO
                      </button>
                  </div>
              );
          }

          if (!complete) {
              return (
                  <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto flex flex-col items-center">
                      <div className="bg-red-50 p-6 rounded-full inline-block mb-8 border border-red-100">
                          <WarningIcon className="w-12 h-12 text-red-600" />
                      </div>
                      <h2 className="text-3xl font-light text-black tracking-tight mb-4">Documentación Incompleta</h2>
                      <p className="text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
                          Para solicitudes de <strong>Empresa o Leasing</strong>, es obligatorio disponer de toda la documentación analizada y validada antes de continuar.
                      </p>
                      
                      <div className="w-full text-left bg-slate-50 p-6 rounded-xl border border-slate-200 mb-10">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Pendientes de resolver:</h4>
                          <ul className="space-y-3">
                              {analysisResult?.documentacion?.faltante.map((d, i) => (
                                  <li key={`f-${i}`} className="flex items-start gap-2 text-sm">
                                      <span className="text-red-500">•</span>
                                      <span><strong>{d.docType}</strong> ({d.owner}) - <span className="text-red-600 font-bold">FALTANTE</span></span>
                                  </li>
                              ))}
                              {analysisResult?.documentacion?.analizada.filter(d => d.status === 'Rechazado').map((d, i) => (
                                  <li key={`r-${i}`} className="flex items-start gap-2 text-sm">
                                      <span className="text-red-500">✗</span>
                                      <span><strong>{d.docType}</strong> ({d.owner}) - <span className="text-red-600 font-bold">RECHAZADO: {d.motivoRechazo}</span></span>
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <button 
                          onClick={onRestart} 
                          className="w-full max-w-sm bg-black text-white font-bold py-5 rounded-none shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
                      >
                          VOLVER Y ADJUNTAR DOCUMENTACIÓN
                      </button>
                  </div>
              );
          }

          if (showEmpresasStep) {
              return (
                  <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto flex flex-col items-center">
                      <div className="bg-slate-50 p-6 rounded-full inline-block mb-8 border border-slate-100">
                          <EmailIcon className="w-12 h-12 text-black" />
                      </div>
                      <h2 className="text-3xl font-light text-black tracking-tight mb-4">Envío a Empresas</h2>
                      <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
                          La documentación está completa. Estas solicitudes son tramitadas directamente por el <strong>Equipo de Empresas</strong>. Confirma los datos de contacto del vendedor.
                      </p>

                      <div className="w-full space-y-4 mb-10 max-w-sm">
                          <div className="text-left">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Móvil de Contacto</label>
                              <div className="relative">
                                  <DevicePhoneMobileIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                      type="tel" 
                                      value={empresasContact.mobile}
                                      onChange={(e) => setEmpresasContact(prev => ({ ...prev, mobile: e.target.value }))}
                                      placeholder="Móvil del vendedor"
                                      className="w-full border border-slate-200 p-3 pl-10 rounded-lg outline-none focus:ring-1 focus:ring-black"
                                  />
                              </div>
                          </div>
                          <div className="text-left">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Email de Contacto</label>
                              <div className="relative">
                                  <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                      type="email" 
                                      value={empresasContact.email}
                                      onChange={(e) => setEmpresasContact(prev => ({ ...prev, email: e.target.value }))}
                                      placeholder="Email del vendedor"
                                      className="w-full border border-slate-200 p-3 pl-10 rounded-lg outline-none focus:ring-1 focus:ring-black"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-4 w-full max-w-sm">
                          <button 
                              onClick={() => setShowEmpresasStep(false)}
                              disabled={isSendingEmpresas}
                              className="flex-1 bg-slate-100 text-slate-600 font-bold py-5 rounded-none hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                          >
                              VOLVER
                          </button>
                          <button 
                              onClick={handleSendToEmpresas} 
                              disabled={isSendingEmpresas || !empresasContact.mobile || !empresasContact.email}
                              className="flex-[2] bg-black text-white font-bold py-5 rounded-none shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                          >
                              {isSendingEmpresas ? <SpinnerIcon className="w-4 h-4 animate-spin"/> : <EmailIcon className="w-4 h-4"/>}
                              {isSendingEmpresas ? 'ENVIANDO...' : 'ENVIAR A EMPRESAS'}
                          </button>
                      </div>
                  </div>
              );
          }

          return (
              <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto flex flex-col items-center">
                  <div className="bg-slate-50 p-6 rounded-full inline-block mb-8 border border-slate-100">
                      <ShieldCheckIcon className="w-12 h-12 text-black" />
                  </div>
                  <h2 className="text-3xl font-light text-black tracking-tight mb-4">Tramitación Directa</h2>
                  <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
                      Al tratarse de una solicitud de <strong>{savedOfferData?.clientType === 'Sociedades' ? 'Empresa' : 'Leasing'}</strong>, el proceso de tramitación lo realiza el equipo especializado.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-start gap-4 text-left mb-10">
                      <CheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                          <p className="text-green-800 font-bold text-sm uppercase tracking-tight">Documentación Completa</p>
                          <p className="text-green-700 text-xs">Se han validado todos los documentos necesarios para el envío.</p>
                      </div>
                  </div>

                  <button 
                      onClick={() => setShowEmpresasStep(true)} 
                      className="w-full max-w-sm bg-black text-white font-bold py-5 rounded-none shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mx-auto"
                  >
                      CONTINUAR ENVÍO A EMPRESAS
                  </button>
              </div>
          );
      }

      return (
          <div className="bg-white p-12 rounded-2xl shadow-2xl text-center animate-fade-in-up border border-slate-200 max-w-3xl mx-auto flex flex-col items-center">
              <div className="bg-slate-50 p-6 rounded-full inline-block mb-8 border border-slate-100">
                  <ExternalLinkIcon className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-3xl font-light text-black tracking-tight mb-4">Iniciar Tramitación</h2>
              <p className="text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
                  Haz clic en el botón inferior para abrir el <strong>Asistente PDD</strong> y los documentos pertinentes en nuevas ventanas. Así podrás tramitar la solicitud con comodidad.
              </p>
              <button 
                  onClick={() => {
                      handleOpenTramitacion();
                      setShowPostProcessing(true);
                  }} 
                  className="w-full max-w-sm bg-black text-white font-bold py-5 rounded-none shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mx-auto"
              >
                  <ExternalLinkIcon className="w-5 h-5"/>
                  ABRIR VENTANAS DE TRABAJO
              </button>
          </div>
      );
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[60vh] pb-10">
        <div className="max-w-4xl w-full space-y-6">
            {isWaitingForPDD ? (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 animate-fade-in-up border border-slate-200">
                        <div className="mx-auto w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                            <SpinnerIcon className="w-12 h-12 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Tramitación en curso</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Cierra la ventana del <strong>Asistente PDD</strong> cuando hayas terminado para continuar y decirnos cómo ha quedado la solicitud.
                        </p>
                    </div>
                </div>
            ) : showPostProcessing ? (
                <>
                    {resultStatus === 'none' && renderSelection()}
                    {resultStatus === 'approved' && renderApproved()}
                    {resultStatus === 'study' && renderStudy()}
                    {resultStatus === 'denied' && renderDenied()}
                </>
            ) : (
                renderInitialStep()
            )}
        </div>
        <UserCopyModal isOpen={showUserCopyModal} onClose={() => setShowUserCopyModal(false)} onSend={handleSendUserCopy} email={userId} />
    </div>
  );
};

export default RequestProcessing;
