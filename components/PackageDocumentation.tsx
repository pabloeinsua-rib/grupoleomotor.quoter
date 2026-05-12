
// ... existing imports ...
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Part, GenerateContentResponse } from '@google/genai';
import type { View, SavedOfferData, UserRole } from '../App.tsx';
import { UploadIcon, SpinnerIcon, XIcon, WarningIcon, ArrowRightIcon, CameraIcon, ShieldCheckIcon, DownloadIcon, InfoIcon, FileTextIcon, CheckIcon, RotateIcon } from './Icons.tsx';
import { licensePlateData } from '../data/licensePlates.ts';
import { dealerships } from '../data/dealerships.ts';

// --- Types ---
export interface PDD {
    datosConcesionario?: { codigo?: string; nombre?: string; vendedor?: string };
    operativaCaixa?: { esCliente: boolean; cuenta?: string; operativa?: string };
    datosTitulares?: any[];
    datosVehiculo?: any;
    datosOferta?: any;
}

// ... existing interfaces ...
export interface AnalysisResult {
    cit?: { issue: string; owner: 'Titular 1' | 'Titular 2' | 'Vehículo'; severity: 'Leve' | 'Medio' | 'Grave' | 'Crítico' }[]; 
    analisisFraude?: {
        nivelRiesgo: 'Ninguno' | 'Bajo' | 'Medio' | 'Alto' | 'Real' | 'Crítico';
        puntuacionFraude: number; 
        indicios: string[];
        conclusion: string;
        posibleFraude?: boolean;
        detallesForenses?: string;
    };
    documentacion?: {
        analizada: {
            docType: string;
            owner: 'Titular 1' | 'Titular 2' | 'Vehículo';
            status: 'Validado' | 'Rechazado' | 'Revisar';
            motivoRechazo?: string;
            sourceContainer?: string;
        }[];
        faltante: {
            docType: string;
            owner: 'Titular 1' | 'Titular 2' | 'Vehículo';
        }[];
    };
    pdd?: PDD;
    clarificationQuestions?: {
        id: string;
        question: string;
        options: string[];
    }[];
}

// ... PackageDocumentationProps ...
interface PackageDocumentationProps {
  savedOfferData: SavedOfferData | null;
  onNavigate: (view: View) => void;
  setFiles: (files: File[]) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  userRole: UserRole | null;
  onBack?: () => void;
  title?: string;
  onSkip?: () => void;
  onRestart?: () => void;
  onGlobalStepChange?: (step: number) => void;
  userEmail?: string | null;
}

const COUNTDOWN_SECONDS = 90;

// ... Helper functions ...
const SelectionButton: React.FC<{ t: any; onClick: () => void }> = ({ t, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all flex flex-col group">
        <span className="font-bold text-slate-800 group-hover:text-caixa-blue">{t.nombre} {t.primerApellido}</span>
        <span className="text-sm text-slate-500">{t.dni}</span>
    </button>
);

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

const arrayBufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
    let binary = '';
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const processFileForAnalysis = async (file: File): Promise<{ parts: Part[], extractedFiles: File[] }> => {
  const parts: Part[] = [];
  const extractedFiles: File[] = [];

  // --- EML PARSING ---
  if (file.name.endsWith('.eml') || file.type === 'message/rfc822') {
      try {
          const postalMimeModule = await import('postal-mime');
          const PostalMime = postalMimeModule.default || postalMimeModule;
          // @ts-ignore
          const parser = new (typeof PostalMime === 'function' ? PostalMime : PostalMime.default)();
          const emailContent = await parser.parse(file);
          
          const body = emailContent.text || emailContent.html || "Sin contenido de texto visible.";
          const subject = emailContent.subject || "Sin asunto";
          const from = emailContent.from?.address || "Desconocido";
          
          const emlTextContent = `[CORREO ELECTRÓNICO DETECTADO: ${file.name}]\nASUNTO: ${subject}\nREMITENTE: ${from}\nFECHA: ${emailContent.date}\n\n--- CUERPO DEL MENSAJE ---\n${body}\n--- FIN CUERPO ---\n\n[ANÁLISIS DE ADJUNTOS INTERNOS DEL CORREO]:`;

          parts.push({
              text: emlTextContent
          });

          // Add EML text to extracted files so it can be merged into the PDF
          const emlTextFile = new File([emlTextContent], `${file.name.replace(/\.[^/.]+$/, "")}_contenido.txt`, { type: 'text/plain' });
          extractedFiles.push(emlTextFile);

          if (emailContent.attachments && emailContent.attachments.length > 0) {
              for (const att of emailContent.attachments) {
                  const isImage = att.mimeType.startsWith('image/');
                  const isPdf = att.mimeType === 'application/pdf';
                  
                  if (isImage || isPdf) {
                      let buffer: ArrayBuffer;
                      if (typeof att.content === 'string') {
                          const encoder = new TextEncoder();
                          buffer = encoder.encode(att.content).buffer as ArrayBuffer;
                      } else {
                          buffer = att.content as ArrayBuffer;
                      }

                      // Ignorar imágenes pequeñas (probables logos de firma, < 25KB)
                      const isLikelySignatureLogo = isImage && buffer.byteLength < 25600;

                      if (buffer.byteLength > 100 && !isLikelySignatureLogo) { 
                          const base64Data = arrayBufferToBase64(buffer);
                          parts.push({ text: `[ADJUNTO EML ENCONTRADO: ${att.filename || 'archivo'} (${att.mimeType})]` });
                          parts.push({
                              inlineData: {
                                  data: base64Data,
                                  mimeType: att.mimeType
                              }
                          });
                          // Add to extracted files for PDF merging
                          const extractedFile = new File([buffer], att.filename || 'adjunto.dat', { type: att.mimeType });
                          extractedFiles.push(extractedFile);
                      }
                  } else {
                      if (att.mimeType.startsWith('text/')) {
                           let textContent = "";
                           if (typeof att.content === 'string') textContent = att.content;
                           else {
                               try {
                                   const dec = new TextDecoder("utf-8");
                                   textContent = dec.decode(att.content as ArrayBuffer | Uint8Array);
                               } catch (e) {
                                   textContent = "[Error decodificando texto EML]";
                               }
                           }
                           parts.push({ text: `[ADJUNTO DE TEXTO EML: ${att.filename}]:\n${textContent}` });
                      }
                  }
              }
          } else {
              parts.push({ text: "[SIN ADJUNTOS EN ESTE CORREO]" });
          }
          return { parts, extractedFiles };

      } catch (e) {
          console.error("Error parsing EML", e);
          const textContent = await readFileAsText(file).catch(() => "");
          return { parts: [{ text: `[ERROR PARSING EML - CONTENIDO RAW]:\n${textContent}` }], extractedFiles: [] };
      }
  }

  // --- MSG PARSING ---
  if (file.name.endsWith('.msg')) {
      try {
          const arrayBuffer = await file.arrayBuffer();
          const msgReaderModule = await import('@kenjiuno/msgreader');
          const MSGReaderProvider = msgReaderModule.default || msgReaderModule;
          // @ts-ignore
          const MSGReaderConstructor = typeof MSGReaderProvider === 'function' ? MSGReaderProvider : (typeof MSGReaderProvider.default === 'function' ? MSGReaderProvider.default : MSGReaderProvider.MsgReader || MSGReaderProvider.MSGReader);
          const reader = new MSGReaderConstructor(arrayBuffer);
          const fileData = reader.getFileData();
          
          if (!fileData.error) {
              const body = fileData.body || "Sin cuerpo";
              const subject = fileData.subject || "Sin asunto";
              const recipients = fileData.recipients ? JSON.stringify(fileData.recipients) : "Desconocidos";
              
              const msgTextContent = `[ARCHIVO MSG (OUTLOOK): ${file.name}]\nASUNTO: ${subject}\nPARTICIPANTES: ${recipients}\n\n--- CUERPO ---\n${body}\n--- FIN CUERPO ---`;

              parts.push({
                  text: msgTextContent
              });

              // Add MSG text to extracted files so it can be merged into the PDF
              const msgTextFile = new File([msgTextContent], `${file.name.replace(/\.[^/.]+$/, "")}_contenido.txt`, { type: 'text/plain' });
              extractedFiles.push(msgTextFile);

              if (fileData.attachments && fileData.attachments.length > 0) {
                  for (const att of fileData.attachments) {
                      // MSGReader attachments are slightly different
                      try {
                          const attData = reader.getAttachment(att);
                          if (attData && attData.content) {
                              const mimeType = (att as any).mimeTag || 'application/octet-stream';
                              const fileName = (att as any).fileName || (att as any).name || 'adjunto.dat';
                              
                              const isImage = mimeType.startsWith('image/') || fileName.toLowerCase().match(/\.(png|jpe?g|gif|webp)$/i);
                              const isPdf = mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
                              const isText = mimeType.startsWith('text/') || fileName.toLowerCase().endsWith('.txt');

                              // Ignorar imágenes pequeñas (probables logos de firma, < 25KB)
                              const isLikelySignatureLogo = isImage && attData.content.byteLength < 25600;

                              if ((isImage || isPdf) && !isLikelySignatureLogo) {
                                  let finalMimeType = mimeType;
                                  if (fileName.toLowerCase().endsWith('.pdf')) finalMimeType = 'application/pdf';
                                  else if (fileName.toLowerCase().endsWith('.png')) finalMimeType = 'image/png';
                                  else if (fileName.toLowerCase().endsWith('.jpg') || fileName.toLowerCase().endsWith('.jpeg')) finalMimeType = 'image/jpeg';
                                  
                                  const base64Data = arrayBufferToBase64(attData.content);
                                  parts.push({ text: `[ADJUNTO MSG ENCONTRADO: ${fileName} (${finalMimeType})]` });
                                  parts.push({
                                      inlineData: {
                                          data: base64Data,
                                          mimeType: finalMimeType
                                      }
                                  });
                                  const extractedFile = new File([attData.content], fileName, { type: finalMimeType });
                                  extractedFiles.push(extractedFile);
                              } else if (isText) {
                                  try {
                                      const dec = new TextDecoder("utf-8");
                                      const textContent = dec.decode(attData.content as ArrayBuffer | Uint8Array);
                                      parts.push({ text: `[ADJUNTO DE TEXTO MSG: ${fileName}]:\n${textContent}` });
                                  } catch (e) {
                                      // Ignore text parsing errors inside msg
                                  }
                              }
                          }
                      } catch (attErr) {
                          console.warn("Unable to extract MSG attachment", attErr);
                      }
                  }
              }
          }
          return { parts, extractedFiles };
      } catch (e) {
          console.warn("Error parseando MSG", e);
          const textContent = await readFileAsText(file).catch(() => "");
          return { parts: [{ text: `[ERROR PARSING MSG - RAW CONTENT]:\n${textContent}` }], extractedFiles: [] };
      }
  }

  // --- PLAIN TEXT ---
  if (file.name.endsWith('.txt') || file.type === 'text/plain') {
      const textContent = await readFileAsText(file);
      return {
          parts: [{ text: `[ARCHIVO DE TEXTO: ${file.name}]\n${textContent}\n[FIN TXT]` }],
          extractedFiles: []
      };
  }

  // --- STANDARD IMAGE/PDF ---
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
  
  let mimeType = file.type;
  if (!mimeType) {
      if (file.name.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
      else if (file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (file.name.toLowerCase().endsWith('.png')) mimeType = 'image/png';
      else mimeType = 'application/octet-stream';
  }
  
  // Normalize common mime types
  if (mimeType === 'application/x-pdf') mimeType = 'application/pdf';
  if (mimeType === 'image/jpg') mimeType = 'image/jpeg';

  // Check if mimeType is supported by Gemini
  const supportedMimeTypes = [
      'application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
      'text/plain', 'text/csv', 'text/html', 'application/rtf', 'text/rtf', 'text/xml', 'application/xml',
      'application/json', 'text/javascript', 'application/x-javascript', 'text/x-typescript', 'application/x-typescript',
      'text/css', 'text/md'
  ];

  if (!supportedMimeTypes.includes(mimeType)) {
      console.warn(`Mime type no soportado por Gemini: ${mimeType} para el archivo ${file.name}`);
      return {
          parts: [{ text: `[ARCHIVO NO SOPORTADO PARA ANÁLISIS DIRECTO: ${file.name} (${mimeType})]` }],
          extractedFiles: []
      };
  }

  return {
    parts: [{
      inlineData: {
        data: base64EncodedData,
        mimeType: mimeType,
      },
    }],
    extractedFiles: []
  };
};

// ... PackageDocumentation component ...
const PackageDocumentation: React.FC<PackageDocumentationProps> = ({ savedOfferData, onNavigate, setFiles: setParentFiles, setAnalysisResult: setParentAnalysisResult, onBack, onRestart, userRole, onGlobalStepChange, userEmail }) => {
  // ... State variables ...
  const [uploadMode, setUploadMode] = useState<'selection' | 'oneByOne' | 'package' | 'bulk'>('selection');
  const [multipleFiles, setMultipleFiles] = useState<Record<string, { file: File, preview: string } | null>>({});
  const [singleFiles, setSingleFiles] = useState<File[]>([]);
  const [extractedFiles, setExtractedFiles] = useState<File[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const countdownIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [view, setView] = useState<'upload' | 'loading' | 'clarification' | 'results'>('upload');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [currentSlot, setCurrentSlot] = useState<string | null>(null);
  const [intervenerStep, setIntervenerStep] = useState(0);
  const [intervenerAnswers, setIntervenerAnswers] = useState<Record<string, any>>({});
  const [availableTitulares, setAvailableTitulares] = useState<any[]>([]);
  const [rateCandidates, setRateCandidates] = useState<string[]>([]);
  
  // Propagate step globally
  useEffect(() => {
    if (isLoading || view === 'loading') {
       onGlobalStepChange?.(4); // Analizando Documentación
    } else {
       onGlobalStepChange?.(3); // Subida de Documentación
    }
  }, [isLoading, view, onGlobalStepChange]);

  // ... getRequiredDocs, useEffects ...
  const getRequiredDocs = (clientType: string | null, isVehicleUsed: boolean): string[] => {
    let docs: string[] = [];
    
    // TITULAR
    docs.push('DNI / NIE TITULAR');
    docs.push('JUSTIFICANTE DE INGRESOS TITULAR');
    
    if (clientType !== 'Autónomos' && (savedOfferData?.amountToFinance || 0) >= 30000) {
        docs.push('IRPF TITULAR');
    }
    
    docs.push('CUENTA TITULAR');
    docs.push('VIDA LABORAL TITULAR');
    
    if (clientType === 'Autónomos') {
        docs.push('MODELO 130 O 131 TITULAR');
    }

    if (clientType === 'Sociedades') {
        docs.push('IMPUESTO SOCIEDADES TITULAR (MOD 200)');
        docs.push('MODELO 390 / IVA ANUAL');
        docs.push('DNI REPRESENTANTES / APODERADOS');
        docs.push('ESCRITURAS DE CONSTITUCIÓN / PODERES');
    }

    // VEHICULO
    if (isVehicleUsed) {
        docs.push('FICHA TECNICA');
        docs.push('PERMISO DE CIRCULACION O INFORME DGT');
    }

    // COTITULAR
    docs.push('DNI / NIE COTITULAR');
    docs.push('JUSTIFICANTE DE INGRESOS COTITULAR');
    docs.push('IRPF COTITULAR');
    docs.push('MODELO 130 O 131 COTITULAR');
    docs.push('VIDA LABORAL COTITULAR');

    // AVALISTA 1
    docs.push('DNI / NIE AVALISTA 1');
    docs.push('JUSTIFICANTE DE INGRESOS AVALISTA 1');
    docs.push('IRPF AVALISTA 1');
    docs.push('MODELO 130 O 131 AVALISTA 1');
    docs.push('VIDA LABORAL AVALISTA 1');

    // AVALISTA 2
    docs.push('DNI / NIE AVALISTA 2');
    docs.push('JUSTIFICANTE DE INGRESOS AVALISTA 2');
    docs.push('IRPF AVALISTA 2');
    docs.push('MODELO 130 O 131 AVALISTA 2');
    docs.push('VIDA LABORAL AVALISTA 2');

    // FACTURA
    docs.push('FACTURA PROFORMA O DEFINITIVA');

    return docs;
  };

  useEffect(() => {
    const isVehicleUsed = savedOfferData?.vehicleCategory ? /matriculado|seminuevo|ocasión|refinanciacion/i.test(savedOfferData.vehicleCategory) : false;
    const docs = getRequiredDocs(savedOfferData?.clientType, isVehicleUsed);
    setRequiredDocs(docs);
    const initialDocs: Record<string, null> = {};
    docs.forEach(doc => initialDocs[doc] = null);
    setMultipleFiles(initialDocs);
  }, [savedOfferData?.clientType, savedOfferData?.vehicleCategory, savedOfferData?.amountToFinance]);

  // ... File handling functions ...
  const handleMultipleFileSelect = (files: FileList | null, docSlot: string) => {
    if (files && files[0]) {
      const file = files[0];
      let preview = 'pdf_icon';
      if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
      } else if (file.name.endsWith('.eml') || file.name.endsWith('.msg')) {
          preview = 'https://storage.googleapis.com/bucket_quoter_auto2/fortos/email_icon.png';
      }
      setMultipleFiles(prev => ({ ...prev, [docSlot]: { file, preview } }));
    }
  };

  const removeMultipleFile = (docSlot: string) => {
    const doc = multipleFiles[docSlot];
    if (doc && doc.preview.startsWith('blob:')) {
      URL.revokeObjectURL(doc.preview);
    }
    setMultipleFiles(prev => ({...prev, [docSlot]: null}));
  };

  const rotateImage = (docSlot: string) => {
      const doc = multipleFiles[docSlot];
      if (!doc || !doc.file.type.startsWith('image/')) return;

      const img = new Image();
      img.src = doc.preview;
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Rotate 90 degrees clockwise
          canvas.width = img.height;
          canvas.height = img.width;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(90 * Math.PI / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);

          canvas.toBlob((blob) => {
              if (blob) {
                  const newFile = new File([blob], doc.file.name, { type: doc.file.type });
                  const newPreview = URL.createObjectURL(newFile);
                  URL.revokeObjectURL(doc.preview);
                  setMultipleFiles(prev => ({ ...prev, [docSlot]: { file: newFile, preview: newPreview } }));
              }
          }, doc.file.type);
      };
  };

  const handleSingleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setError(null);
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
            try {
                const { default: JSZip } = await import('jszip');
                const zip = await JSZip.loadAsync(file);
                for (const filename in zip.files) {
                    if (!zip.files[filename].dir) {
                        const fileData: Blob = await zip.files[filename].async('blob');
                        let type = fileData.type;
                        if (filename.endsWith('.eml')) type = 'message/rfc822';
                        else if (filename.endsWith('.pdf')) type = 'application/pdf';
                        else if (filename.endsWith('.msg')) type = 'application/vnd.ms-outlook';
                        else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) type = 'image/jpeg';
                        else if (filename.endsWith('.png')) type = 'image/png';
                        else if (filename.endsWith('.txt')) type = 'text/plain';
                        const extractedFile = new File([fileData], filename, { type });
                        if (!filename.includes('__MACOSX') && !filename.startsWith('.')) {
                             newFiles.push(extractedFile);
                        }
                    }
                }
            } catch (err) {
                console.error("ZIP Error", err);
                setError('Error al descomprimir ZIP. Se analizará el archivo original.');
                newFiles.push(file);
            }
        } else if (file.name.endsWith('.rar')) {
             newFiles.push(file);
        } else {
            newFiles.push(file);
        }
    }
    setSingleFiles(prev => [...prev, ...newFiles]);
  };

  const removeSingleFile = (index: number) => {
    setSingleFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
    } catch (err) {
        setError("No se pudo acceder a la cámara.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob((blob) => {
                if (blob) {
                    const name = currentSlot ? `${currentSlot}.jpg` : `scan-${Date.now()}.jpg`;
                    const file = new File([blob], name, { type: 'image/jpeg' });
                    if (currentSlot && uploadMode === 'oneByOne') {
                        const preview = URL.createObjectURL(file);
                        setMultipleFiles(prev => ({ ...prev, [currentSlot]: { file, preview } }));
                    } else {
                        setSingleFiles(prev => [...prev, file]);
                    }
                    closeCamera();
                }
            }, 'image/jpeg', 0.85);
        }
    }
  };

  const startCountdown = () => {
    setCountdown(COUNTDOWN_SECONDS);
    countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
            if (prev <= 1) {
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      closeCamera();
    };
  }, []);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  // --- ANALYSIS LOGIC ---
  const handleAnalysis = async () => {
    const filesToAnalyze = uploadMode === 'oneByOne'
      ? Object.values(multipleFiles).filter((d): d is { file: File; preview: string; } => d !== null).map(d => d.file)
      : singleFiles;
      
    if (filesToAnalyze.length === 0) {
      setError("Por favor, sube al menos un documento.");
      return;
    }
    setIsLoading(true);
    setView('loading');
    startCountdown();
    setError(null);
    setAnalysisResult(null);
    abortControllerRef.current = new AbortController();

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
          throw new Error("No se ha configurado la clave API de Gemini.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const processed = await Promise.all(filesToAnalyze.map(processFileForAnalysis));
      const fileParts = processed.flatMap(p => p.parts);
      const allExtractedFiles = processed.flatMap(p => p.extractedFiles);
      
      setExtractedFiles(allExtractedFiles);

      // Update parent files and local files with original + extracted attachments
      const combinedFiles = [...filesToAnalyze, ...allExtractedFiles];
      setParentFiles(combinedFiles);
      if (uploadMode === 'bulk' || uploadMode === 'package') {
          setSingleFiles(combinedFiles);
      }

      const currentDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const systemInstruction = `
      ACTÚA COMO UN EXPERTO ANALISTA DE RIESGOS Y PERITO DOCUMENTAL (TRAMICAR).
      
      FECHA ACTUAL DEL SISTEMA: ${currentDate}. Utiliza esta fecha como referencia para validar la caducidad de los documentos y calcular antigüedades.
      
      TU MISIÓN ES:
      1. LEER DOCUMENTOS CON PRECISIÓN OCR EXTREMA.
      2. EXTRAER DATOS PDD Y DETECTAR FRAUDE/ERRORES CRÍTICOS.
      3. **ANÁLISIS PROFUNDO:** Revisa CADA documento, CADA página y CADA pequeño texto. No ignores nada. Analiza sellos, firmas, fechas y logotipos.
      4. **ANTIGÜEDAD LABORAL (MÁXIMA PRIORIDAD):** Extrae la FECHA REAL DE ANTIGÜEDAD que figura en la nómina o en la Vida Laboral. 
         * No uses "2020" como comodín. Si no está en la nómina, búscala en la Vida Laboral. 
         * Indica el mes y el año por separado en "antiguedadLaboralMes" y "antiguedadLaboralAnio".
      5. **TÓMATE TU TIEMPO:** El análisis debe ser exhaustivo. Si hay varios titulares, extrae los datos de TODOS.

      **REGLAS DE VALIDACIÓN DE DOCUMENTOS (ESTRICTAS):**
      - **DNI/NIE/PASAPORTE:** 
        - Tiene que ser SIEMPRE en COLOR. Si es B/N -> RECHAZADO.
        - Tiene que ser foto al ORIGINAL. Si es foto a fotocopia o pantalla -> RECHAZADO.
        - Roto, muy deteriorado o sin chip -> RECHAZADO.
        - **PAÍS DE NACIMIENTO:** Es CRUCIAL revisar el REVERSO del DNI. El país de nacimiento NO tiene por qué ser España. Indica el país exacto que figure en el reverso.
        - **SEXO:** Indica "Hombre" o "Mujer" según figure en el documento de identidad.
      - **NÓMINA (NORMATIVA GOLDEN RULE):**
        - **DÍAS TRABAJADOS:** Las nóminas TIENEN que tener al menos 20 DÍAS TRABAJADOS del mes de la nómina. Si tiene menos de 20 días, la nómina NO ES VÁLIDA. Si el titular no tiene otras nóminas válidas de meses anteriores con >20 días, es un STOPPER REAL. Hay que solicitar COTITULAR SOLVENTE.
        - **EMPRESAS DE TRABAJO TEMPORAL (ETT):** Las nóminas de ETT NO son válidas para financiar. Marca como STOPPER REAL: "Nómina de ETT no permitida".
        - **ANTIGÜEDAD LABORAL (CRÍTICO):** 
          - Busca la fecha de antigüedad o incorporación en la nómina o Vida Laboral.
          - **FUNCIONARIOS:** Si no hay fecha pero hay "TRIENIOS", calcula 3 años por cada trienio. Si hay trienios pero no indica cuántos, indica una antigüedad de al menos 3 años.
        - Máximo 2 meses de antigüedad sobre el mes en curso.
        - Si indica finiquito o extinción -> RECHAZADO.
        - **EMBARGOS (STOPPER REAL):** Revisa con lupa cualquier texto que diga "EMBARGO". Si existe, es un STOPPER. El titular no puede aportar ingresos. Marca como "Ama de casa/Sin ingresos" y NO incluyas sus documentos en la exportación final si hay otro titular solvente.
        - **Autonóminas (Nóminas sin retenciones):** IMPORTANTE: Las nóminas de asalariados que no tengan retenciones NO son de asalariado, son de Autónomo (autonóminas). Esto sucede cuando el trabajador es socio de la empresa o directivo. Estas autonóminas SOLO sirven para ver quién es el pagador y la antigüedad en la empresa. A la hora de tramitar se necesita el IRPF del trabajador (Modelo 100), y ver los ingresos de la casilla 435. Si no tienes la Renta, pídela como FALTANTE. Las autonóminas NO son válidas como justificante de ingresos por sí solas.
        - Nóminas extranjeras -> Solo válidas si se cobran por banco español y presenta IRPF en España.
        - Descontar dietas y pagas extras completas del líquido a percibir.
      - **CERTIFICADO DE PENSIÓN:**
        - Siempre del año en curso y con código CSV de validación (excepto Clases Pasivas). Si empezó a cobrar en el año en curso, vale la carta de concesión.
        - Revisa igualmente cualquier rastro de "EMBARGO". Si tiene embargo, es un STOPPER.
      - **IRPF (MODELO 100):**
        - Hasta 30 de junio: válido el del año anterior. Desde 1 de julio: válido el del año en curso.
      - **VIDA LABORAL:**
        - Máximo 1 mes de antigüedad.
        - **CONTRATO 300 (CRÍTICO):** Si el código de contrato en nómina o vida laboral es **300**, se trata de un **FIJO-DISCONTINUO**. En este caso, el IRPF y la Vida Laboral son DOCUMENTOS OBLIGATORIOS. Si no los tienes, márcalos como FALTANTES.
      - **JUSTIFICANTE DE CUENTA:**
        - Del año en curso (excepto si viene en IRPF o nómina sin números tapados).
        - **IMPORTANTE:** Si hay varios números de cuenta a nombre del titular, PRIORIZA SIEMPRE la cuenta aportada en el Certificado de Titularidad antes que la del IRPF, si son distintas.
      - **PERMISO DE CIRCULACIÓN / FICHA TÉCNICA:**
        - IMPORTANTE FRAUDE Y REFI: Es completamente NORMAL que el Permiso de Circulación NO esté a nombre del cliente titular ni de la concesión. NUNCA lo marques como fraude ni sospecha por este motivo.
        - REFINANCIACIÓN (REFI): Si el Permiso de Circulación SÍ está a nombre del cliente ("Titular 1") que estamos analizando, significa que es una operación "REFI" (Refinanciación del valor final). En este caso:
          1. Debes añadir OBLIGATORIAMENTE en la documentación "faltante": "JUSTIFICANTE DE CANCELACIÓN DE OPERACION ANTERIOR A LA FINANCIERA ANTERIOR".
          2. Debes marcar 'esRefinanciado' a true en el PDD y/o indicar "REFI" en el tipo de solicitud.
        - No puede tener tapado el nombre del titular.
        - Si no es de España -> Toma los datos pero pide FICHA TÉCNICA ESPAÑOLA.
      - **GENERAL:**
        - EXCLUIR IMÁGENES IRRELEVANTES: Si estás procesando correos electrónicos (.eml o .msg) y encuentras multitud de imágenes adjuntas, ignora todas aquellas que parezcan firmas de correo automático, logotipos diminutos, anuncios publicitarios o banners. SOLO PRESTA ATENCIÓN a documentos reales.
        - Todos los documentos deben ser legibles y no estar cortados. Si es válido pero está cortado -> RECHAZADO.

      **STOPPERS (MARCAR EN cit COMO CRÍTICO):**
      - Nómina con menos de 20 días trabajados y sin cotitular solvente (STOPPER REAL: "NÓMINA INCOMPLETA SIN COTITULAR").
      - Nómina de Empresa de Trabajo Temporal (ETT). Las nóminas de ETT NO son válidas para financiar. Marca como STOPPER REAL: "ETT NO FINANCIABLE" e indica que al no haber cotitular solvente, la operación no puede continuar hasta aportar uno.
      - Nómina con retención por embargo. Cualquier rastro de la palabra "EMBARGO" en nómina o pensión es motivo de rechazo inmediato de los ingresos de ese titular.
      - Autonóminas (nóminas sin retención de IRPF). No son válidas, se requiere IRPF.
      - Autónomos recientes (sin un IRPF completo que demuestre actividad). Requiere cotitular solvente.
      - DNI/NIE en B/N o de fotocopia.
      - Pensión con embargo (campo "OTRAS RETENCIONES" con importe y %, excepto si es 1% que es Montepío Minero).
      - Autónomos de alta reciente sin ingresos cotizados como autónomo en su última Renta (IRPF).
      - Edad del cliente: Mínima 18, máxima 77 al finalizar el préstamo.
      - Vehículo Matriculado con 97 meses o más desde la fecha de matriculación hasta la actualidad -> RECHAZADO (STOPPER REAL: "NO FINANCIABLE POR ANTIGÜEDAD").
      - Pensiones percibidas por cuidados de familiar no son válidas.
      - Nómina fraudulenta.
      - **EMPRESAS (SOCIEDADES):** 
           - **Modelo 200 (Impuesto de Sociedades):** Revisa la casilla de **Fondos Propios (FFPP)**. Si el importe es **INFERIOR al importe a financiar** de la solicitud o es **NEGATIVO**, la solicitud **NO ES VIABLE**. Indica como motivo de rechazo: "FONDOS PROPIOS INFERIORES AL RIESGO SOLICITADO".
           - **Escrituras de Constitución:** Revisa la fecha de constitución. Si la empresa se constituyó **hace menos de 24 meses** con respecto a la fecha actual del sistema (${currentDate}), indica que es una "Sociedad de nueva creación" y marca como motivo de rechazo: "SOCIEDAD DE NUEVA CREACIÓN (ANTIGÜEDAD < 24 MESES)".
      - Empresas de tipo C.B. (Comunidad de Bienes) o S.C. (Sociedad Civil) -> RECHAZADO (no son financiables por no tener personalidad jurídica).

      **GOLDEN RULES PDD (ESTRICTO):**
      - **COTITULAR:** Solo si hay 2 DNI/NIE o datos económicos de 2 personas. No asumas cotitular solo por el cónyuge en IRPF.
      - **TARIFA (%):** SIEMPRE debes buscar el porcentaje (%) de interés o tarifa aplicable. Búscalo en la oferta financiera, en la ficha Tramicar, en la hoja de pedido, en el cuerpo del correo o en el asunto del correo electrónico. El valor porcentual exacto encontrado (ej: "8.99%", "6.99%") DEBE ser el valor que pongas en el campo "tarifa" del PDD.
      - **PRODUCTO:** "AUTO" por defecto. "LEASING" solo si se indica explícitamente.
      - **OPERATIVA CAIXA:** "SI" si el IBAN empieza por ESXX 2100. "NO" en caso contrario.
      - **VEHÍCULO (ANTIGÜEDAD):**
        - IMPORTANTE: Si el vehículo tiene matrícula, NUNCA puede ser "Nuevo". Busca la fecha de matriculación en la base de datos de matrículas o en internet.
        - Nuevo (SIN matrícula): "[AUTOMOVIL NUEVO] TURISMO" (o FURGON).
        - 1-36 meses: "[AUTOMOVIL SEMINUEVO] TURISMO" (o FURGON).
        - 37-60 meses: "[OCASIÓN 36 - 60] TURISMO OCASION" (o FURGON).
        - 61-96 meses: "[OCASION + DE 60 MESES] TURISMO" (o FURGON).
        - > 96 meses: "NO FINANCIABLE".
      - **REFINANCIADO (REFI):** Si el titular coincide con el del permiso de circulación, indica explícitamente "REFI" o "[REFINANCIADO] VEHICULO MATRICULADO".
      - **MARCA/MODELO:** Marca es el fabricante (ej. Volkswagen), Modelo es el nombre (ej. Golf). Busca en internet si solo tienes el modelo.
      - **VERSIÓN:** Indica combustible (G/D, HEV, PHEV, EV) si no se especifica.
      - **SEGURO:** "VIDA + DESEMPLEO" por defecto. Si edad > 60, "VIDA SENIOR". Si hay incapacidad, "SIN SEGURO".
      - **DÍA PAGO:** Día 5 (Mes Siguiente) por defecto. Pensionistas: Fin de Mes (Actual).
      - **ESTADO CIVIL:** Prioriza lo que venga en el IRPF si lo tienes. Si no lo sabemos, indica siempre "PAREJA DE HECHO", excepto si el titular tiene una pensión de "Viudedad", en cuyo caso indica "Viuda" o "Viudo" según el sexo.
      - **PERSONAS DEPENDIENTES:** Revisa el IRPF si hay hijos a cargo. Si no lo sabemos, indica 0.
      - **TIPO VÍA:** Nombre completo (Calle, Avenida, etc.).
      - **C.P.:** Búscalo en internet si falta.
      - **VIVIENDA:** 
        - Deducción en IRPF -> "PROPIEDAD HIPOTECADA".
        - Sin deducción -> "PROPIEDAD SIN HIPOTECA".
        - Desconocido -> "FAMILIARES/PADRES".
        - Antigüedad: 15 años atrás si es desconocido.
      - **AUTÓNOMOS (INGRESOS):**
        - Ingresos reales = Casilla 435 del Modelo 100 (IRPF).
        - Indicar ese importe único en ingresosFijos, numeroPagas = 1. NO prorratear.

      **REGLAS ESPECÍFICAS DE PDD (DATOS LABORALES Y ECONÓMICOS):**
      - **SITUACIÓN LABORAL**: Si es asalariado, basándote en su contrato/vida laboral/nómina indica SOLO UNO de estos valores exactos: 'Asalariado fijo', 'Asalariado temporal', 'Autónomo', 'Becario/Prácticas', 'Funcionario', 'Parado', 'Pensionista', 'Pensionista (Jubilación)', 'Pensionista (Orfandad)', 'Pensionista (Temporal)', 'Pensionista (Viudedad)', 'Fijo discontinuo / Temporero', 'Ama de casa', 'Otros'.
      - **ORIGEN INGRESOS (TIPO CONTRATO)**: Obligatorio asignar: 'Nómina' (cuenta ajena), 'Pensión' (pensionistas) o 'Renta' (autónomos).
      - **PROFESIÓN**: Selecciona la más similar a: 'Abogado', 'Administrador empresa', 'Agricultor-Ganadero', 'Ama de casa', 'Arquitecto', 'Artista (Actor, cantante, músico...)', 'Autónomo', 'Camarero', 'Comercial', 'Conserje', 'Consultor', 'Contable', 'Delineante', 'Dentista', 'Dependiente', 'Diplomatico', 'Economista', 'Enfermero', 'Estudiante', 'Farmaceutico', 'Fontanero', 'Informático', 'Ingeniero', 'Investigación', 'Lampista', 'Limpieza', 'Marinero', 'Militar', 'Médico', 'Obrero', 'Otros', 'Periodista', 'Policia', 'Profesión liberal', 'Profesor', 'Religioso', 'Secretaria/Administrativo', 'Transportista', 'Veterinario'.
      - **CARGO**: Selecciona el más similar a: 'Administrativo', 'Directivo', 'Empleado', 'Gerente', 'Jefe-Responsable', 'Obrero', 'Oficial primera', 'Otros', 'Técnico', 'Titulado superior', 'Autónomo'.
      - **ACTIVIDAD EMPRESA**: Selecciona la más similar a: 'Administración pública', 'Agricultura-Ganaderia-Pes', 'Banca-Seguros', 'Comercio', 'Construcción', 'Diplomatica', 'Hosteleria', 'Industria', 'Internet', 'Mineria', 'Once', 'Otros', 'Servicios', 'Transporte', 'Venta ambulante', 'Sociedad Patrimonial', 'Prod./Dist. de armas', 'Casinos o ent. de apuestas', 'Ent. financieras no reguladas', 'Rent a car'.
      - **DIRECCIÓN EMPRESA**: Extrae Población, C.P., Dirección y Teléfono de las nóminas o IRPF. Si no están en la documentación principal, USA GOOGLE para buscar la información basándote en el Nombre o CIF de la empresa. NUNCA lo dejes en blanco.
      
      - **ANÁLISIS DE FRAUDE (NIVEL PERITO):**
      - Analiza metadatos: Inconsistencia entre fecha de creación digital y fecha del documento.
      - Coherencia matemática en nóminas (Bruto - Retenciones = Neto).
      - Tipografía: Si ves fuentes que no encajan o números con distinta alineación.
      - Si detectas fraude real, pon 'posibleFraude' a true y detalla el indicio técnico en 'detallesForenses'.

      **ESTRUCTURA JSON:**
      {
          "cit": [{"issue": "string", "owner": "Titular 1|Titular 2|Vehículo", "severity": "Leve|Medio|Grave|Crítico"}],
          "analisisFraude": { "nivelRiesgo": "Ninguno|Bajo|Medio|Alto|Real|Crítico", "puntuacionFraude": number, "indicios": ["string"], "conclusion": "string", "posibleFraude": boolean, "detallesForenses": "string" },
          "documentacion": {
              "analizada": [ { "docType": "string", "owner": "Titular 1|Titular 2|Vehículo", "status": "Validado|Rechazado|Revisar", "motivoRechazo": "string" } ],
              "faltante": [ { "docType": "string", "owner": "Titular 1|Titular 2|Vehículo" } ]
          },
          "pdd": {
            "datosConcesionario": { "nombre": "string", "vendedor": "string", "codigo": "string" },
            "datosOferta": { "precioVehiculo": number, "entrada": number, "plazo": number, "importeAFinanciar": number, "tarifa": "string", "posiblesTarifas": ["string"], "cuota": number },
            "operativaCaixa": { "esCliente": boolean, "cuenta": "string", "operativa": "string" },
            "datosVehiculo": { "marca": "string", "modelo": "string", "version": "string", "motorizacion": "string", "potenciaKW": number, "potenciaCV": number, "bastidor": "string", "matricula": "string", "fechaMatriculacion": "string", "fechaMatriculacionMes": "string", "fechaMatriculacionAnio": "string", "esFurgon": boolean, "esRefinanciado": boolean },
            "datosTitulares": [
                {
                    "dni": "string", "nombre": "string", "primerApellido": "string", "segundoApellido": "string",
                    "fechaNacimiento": "string", "fechaNacimientoDia": "string", "fechaNacimientoMes": "string", "fechaNacimientoAnio": "string",
                    "fechaCaducidad": "string", "nacionalidad": "string",
                    "sexo": "string", "estadoCivil": "string", "personasDependientes": "string",
                    "direccion": { "tipoVia": "string", "tipoViaCompleto": "string", "nombreVia": "string", "numero": "string", "piso": "string", "puerta": "string", "codigoPostal": "string", "poblacion": "string", "provincia": "string" },
                    "contacto": { "movil": "string", "email": "string" },
                    "datosBancarios": { "iban": "string", "entidad": "string", "antiguedad": "string" },
                    "datosLaborales": { 
                        "situacionLaboral": "string", "antiguedadLaboral": "string", "antiguedadLaboralMes": "string", "antiguedadLaboralAnio": "string", "origenIngresos": "string", 
                        "ingresosFijos": number, "numeroPagas": number, "ingresosVariables": number, 
                        "profesion": "string", "cargo": "string", "nombreEmpresa": "string", "cifEmpresa": "string", 
                        "actividadEmpresa": "string", "direccionEmpresa": "string", "codigoPostalEmpresa": "string", 
                        "poblacionEmpresa": "string", "telefonoEmpresa": "string" 
                    },
                    "datosVivienda": { 
                        "tipoPropiedad": "string", "antiguedadVivienda": "string", 
                        "importeAlquilerHipoteca": number, "deduccionViviendaEnRenta": boolean 
                    }
                }
            ]
          },
          "clarificationQuestions": [ { "id": "string", "question": "string", "options": ["string"] } ]
      }

      **REGLAS DE VALIDACIÓN ESTRICTAS:**
      
      1. **DNI/NIE:**
         - **COLOR (REQUISITO ESTRICTO):** Verifica ÚNICAMENTE si están en color. Si están en blanco y negro, indica como motivo de rechazo que deben enviarse en color. NO rechaces por caducidad.
         - **SEXO:** Mapea: 'F' -> "Mujer", 'M' -> "Hombre".
         - **FECHA NACIMIENTO:** Extrae día, mes y año por separado.

      2. **NÓMINA / INGRESOS:**
         - Usa el **Líquido a Percibir** neto. Resta dietas/gastos.
         - Detecta embargos.

      3. **NACIONALIDAD:** Escribe el nombre completo (ESPAÑA, no ESP).

      4. **VEHÍCULO:** Extrae marca, modelo, versión, motorización (P.3 en Permiso o Ficha), potenciaKW (P.2/P.2.1), bastidor (E) y matrícula (A).
        - **Cálculo de Potencia en CV**: Debes calcular SIEMPRE potenciaCV multiplicando potenciaKW por 1.36.
        - **Motorización**: Extraer tipo de combustible/motorización (ej. Gasolina, Diésel, Híbrido, Eléctrico).
        - **CRUCE DE DOCUMENTOS (CRÍTICO)**: Si se aporta tanto Permiso de Circulación como Ficha Técnica, DEBES comprobar que el número de bastidor (campo E) y la MATRÍCULA (campo A) sean EXACTAMENTE los mismos en ambos documentos. Si el bastidor o matrícula NO coinciden, DEBES generar un 'issue' ("cit") CRÍTICO indicando: "El número de bastidor o matrícula no coinciden entre la Ficha Técnica y el Permiso de Circulación. Pertenecen a coches diferentes." y rechazar los documentos.

      5. **DATOS LABORALES Y VIVIENDA (CRÍTICO):** 
         - Extrae TODOS los detalles de la empresa: Nombre, CIF, Dirección completa, Población, CP, Teléfono.
         - Para **SOCIEDADES**, extrae el nombre de los representantes/apoderados legales si aparecen en las escrituras o documentos adjuntos.
         - No omitas la antigüedad ni el cargo/profesión.
         - En vivienda, busca el importe mensual de hipoteca o alquiler si aparece en extractos o nóminas.

      ANALIZA TODO EXHAUSTIVAMENTE. NO INVENTES.
      `;

      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Timeout: El análisis ha tardado demasiado tiempo.")), 120000);
          abortControllerRef.current?.signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new DOMException("Aborted", "AbortError"));
          });
      });

      const response: GenerateContentResponse = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: { parts: [{ text: `CONTEXTO OFERTA: ${JSON.stringify(savedOfferData)}` }, ...fileParts] },
          config: { 
              systemInstruction: systemInstruction,
              responseMimeType: "application/json"
          },
        }).finally(() => clearTimeout(timeoutId)),
        timeoutPromise
      ]);
      
      let jsonString = response.text || "{}";
      
      // Robust JSON extraction
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          jsonString = jsonMatch[0];
      } else {
          console.warn("No JSON found in response, using raw text");
      }

      const result: AnalysisResult = JSON.parse(jsonString);
      
      // Post-procesado BB.DD (Concesionarios)
      if (result.pdd?.datosConcesionario?.nombre) {
          const detectedName = result.pdd.datosConcesionario.nombre.toLowerCase();
          const match = dealerships.find(d => d.name.toLowerCase().includes(detectedName) || detectedName.includes(d.name.toLowerCase()));
          if (match) {
              result.pdd.datosConcesionario.codigo = match.code;
              result.pdd.datosConcesionario.nombre = match.name;
              if (!result.pdd.datosConcesionario.vendedor) result.pdd.datosConcesionario.vendedor = match.manager;
          }
      }

      // Logic for vehicle Year
      if (result.pdd?.datosVehiculo?.matricula && !result.pdd.datosVehiculo.fechaMatriculacionAnio) {
          const letters = result.pdd.datosVehiculo.matricula.replace(/[^A-Z]/g, '').slice(-3);
          const found = licensePlateData.find(entry => entry.series >= letters);
          if (found) {
              const [year, month] = found.date.split('-');
              if (!result.pdd.datosVehiculo) result.pdd.datosVehiculo = {};
              result.pdd.datosVehiculo.fechaMatriculacionMes = month;
              result.pdd.datosVehiculo.fechaMatriculacionAnio = year;
              result.pdd.datosVehiculo.fechaMatriculacion = `01/${month}/${year}`;
          }
      }

      setAnalysisResult(result);

      // Silent Fraud Alert
      if (result.analisisFraude?.posibleFraude) {
          console.log("Fraud detected, sending silent alert...");
          const formData = new FormData();
          formData.append('to', 'peinsua@caixabankpc.com');
          formData.append('subject', `⚠️ ALERTA FRAUDE: ${userEmail || 'Desconocido'} - DNI ${result.pdd?.datosTitulares?.[0]?.dni || 'N/A'}`);
          formData.append('body', `Se ha detectado un posible fraude documental.\n\nDetalles del Peritaje:\n${result.analisisFraude.detallesForenses || 'Sin detalles'}\n\nUsuario: ${userEmail}\nFecha: ${new Date().toLocaleString()}`);
          
          fetch('/api/email/send-notification', {
              method: 'POST',
              body: formData
          }).catch(err => console.error("Error sending silent fraud alert", err));
      }

      // Clarification Logic (Rates/Titulares)
      const possibleRates = result.pdd?.datosOferta?.posiblesTarifas || [];
      const uniqueRates = [...new Set(possibleRates)];
      if (uniqueRates.length > 1) {
          setRateCandidates(uniqueRates as string[]);
          setIntervenerStep(-1);
          setView('clarification');
          return;
      }
      
      const allTitulares = result.pdd?.datosTitulares || [];
      if (allTitulares.length > 1) {
        setAvailableTitulares(allTitulares);
        setIntervenerAnswers({});
        setIntervenerStep(0);
        setView('clarification');
      } else {
        setView('results');
      }

    } catch (e: any) {
        if (e.name !== 'AbortError') {
            console.error(e);
            setError("Error en el análisis. Intenta de nuevo.");
        }
        setView('upload');
    } finally {
      setIsLoading(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
  };

  // ... rest of the file ...

  const handleIntervenerAnswer = (questionId: string, answer: any) => {
    // ... existing implementation
    const newAnswers = { ...intervenerAnswers, [questionId]: answer };
    setIntervenerAnswers(newAnswers);
    
    if (questionId === 'select_rate') {
        if (!analysisResult?.pdd?.datosOferta) return;
        const newPdd = JSON.parse(JSON.stringify(analysisResult.pdd));
        newPdd.datosOferta.tarifa = answer; 
        setAnalysisResult({ ...analysisResult, pdd: newPdd });
        const allTitulares = newPdd.datosTitulares || [];
        if (allTitulares.length > 1) {
            setAvailableTitulares(allTitulares);
            setIntervenerStep(0);
        } else {
            setView('results');
        }
        return;
    }

    const allTitulares = analysisResult?.pdd?.datosTitulares || [];
    const num = parseInt(newAnswers['numTitulares']?.split(' ')[0] || '0', 10);

    if (questionId === 'numTitulares') {
        setIntervenerStep(1); 
    } else if (questionId === 'select_titular_1') {
        if (num >= 2) {
             const remaining = allTitulares.filter(t => t.dni !== answer.dni);
             setAvailableTitulares(remaining);
             setIntervenerStep(2); 
        } else {
             finalizeAnalysis(newAnswers);
        }
    } else if (questionId === 'select_titular_2') {
         if (num >= 3) {
             const remaining = availableTitulares.filter(t => t.dni !== answer.dni);
             setAvailableTitulares(remaining);
             setIntervenerStep(3); 
        } else {
             finalizeAnalysis(newAnswers);
        }
    } else if (questionId === 'select_avalista_1') {
        if (num === 4) {
             const remaining = availableTitulares.filter(t => t.dni !== answer.dni);
             setAvailableTitulares(remaining);
             setIntervenerStep(4); 
        } else {
             finalizeAnalysis(newAnswers);
        }
    } else {
        finalizeAnalysis(newAnswers);
    }
  };

  const finalizeAnalysis = (finalAnswers: Record<string, any>) => {
    // ... existing implementation
    if (!analysisResult?.pdd?.datosTitulares) {
        setView('results');
        return;
    }
    const finalPdd = JSON.parse(JSON.stringify(analysisResult.pdd));
    const numSelected = parseInt(finalAnswers['numTitulares']?.split(' ')[0] || '1', 10);
    
    let finalTitulares: any[] = [];
    
    const t1 = finalAnswers['select_titular_1'];
    if (t1) finalTitulares.push({ ...t1, relacionConTitular: 'Titular' });
    
    const t2 = finalAnswers['select_titular_2'];
    if (t2 && numSelected >= 2) {
         finalTitulares.push({ ...t2, relacionConTitular: 'Cotitular' });
    }
    
    const a1 = finalAnswers['select_avalista_1'];
    if (a1 && numSelected >= 3) {
        finalTitulares.push({ ...a1, relacionConTitular: 'Avalista' });
    }
    
    const a2 = finalAnswers['select_avalista_2'];
    if (a2 && numSelected >= 4) {
        finalTitulares.push({ ...a2, relacionConTitular: 'Avalista' });
    }

    if (!a1 && numSelected === 3 && finalAnswers['confirm_avalista'] === 'Sí' && availableTitulares.length > 0) {
         const av = availableTitulares[0];
         finalTitulares.push({ ...av, relacionConTitular: 'Avalista' });
    }

    finalPdd.datosTitulares = finalTitulares;
    const cleanedResult = { ...analysisResult, pdd: finalPdd };
    
    if (numSelected === 1) {
        if (cleanedResult.documentacion) {
            cleanedResult.documentacion.analizada = cleanedResult.documentacion.analizada.filter(d => d.owner !== 'Titular 2');
            cleanedResult.documentacion.faltante = cleanedResult.documentacion.faltante.filter(d => d.owner !== 'Titular 2');
        }
        if (cleanedResult.cit) {
            cleanedResult.cit = cleanedResult.cit.filter(c => c.owner !== 'Titular 2');
        }
    }
    
    setAnalysisResult(cleanedResult);
    setView('results');
  };

  const compressImage = async (file: File): Promise<Uint8Array> => {
      // ... existing implementation
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 1500;
          const MAX_HEIGHT = 1500;
          let width = img.width;
          let height = img.height;
          if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
          else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
          canvas.width = width;
          canvas.height = height;
          if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              // Aggressive JPEG compression
              canvas.toBlob((blob) => {
                  if (blob) blob.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)));
                  else reject(new Error("Compression failed"));
              }, 'image/jpeg', 0.5); 
          } else { reject(new Error("Canvas context failed")); }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

    const handleDownloadAnalysedDocs = async () => {
    let filesToProcess: File[] = [];
    
    if (uploadMode === 'oneByOne') {
        const orderedKeys = [
            // TITULAR
            'DNI / NIE TITULAR',
            'JUSTIFICANTE DE INGRESOS TITULAR',
            'IRPF TITULAR',
            'CUENTA TITULAR',
            'VIDA LABORAL TITULAR',
            'MODELO 130 O 131 TITULAR',
            
            // VEHICULO
            'FICHA TECNICA',
            'PERMISO DE CIRCULACION O INFORME DGT',
            
            // COTITULAR
            'DNI / NIE COTITULAR',
            'JUSTIFICANTE DE INGRESOS COTITULAR',
            'IRPF COTITULAR',
            'MODELO 130 O 131 COTITULAR',
            'VIDA LABORAL COTITULAR',
            
            // AVALISTA 1
            'DNI / NIE AVALISTA 1',
            'JUSTIFICANTE DE INGRESOS AVALISTA 1',
            'IRPF AVALISTA 1',
            'MODELO 130 O 131 AVALISTA 1',
            'VIDA LABORAL AVALISTA 1',
            
            // AVALISTA 2
            'DNI / NIE AVALISTA 2',
            'JUSTIFICANTE DE INGRESOS AVALISTA 2',
            'IRPF AVALISTA 2',
            'MODELO 130 O 131 AVALISTA 2',
            'VIDA LABORAL AVALISTA 2',
            
            // FACTURA
            'FACTURA PROFORMA O DEFINITIVA'
        ];
        
        orderedKeys.forEach(key => {
            const entry = multipleFiles[key];
            if (entry) filesToProcess.push(entry.file);
        });
    } else {
        filesToProcess = [...singleFiles, ...extractedFiles];
    }

    // Remove duplicates
    filesToProcess = filesToProcess.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (filesToProcess.length === 0) { alert("No hay documentos válidos para descargar."); return; }
    
    setIsDownloading(true);
    try {
        const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
        const mergedPdf = await PDFDocument.create();
        const helveticaFont = await mergedPdf.embedFont(StandardFonts.Helvetica);
        
        for (const file of filesToProcess) {
            try {
                let fileBuffer = await file.arrayBuffer();
                if (file.type === 'application/pdf') {
                    const pdf = await PDFDocument.load(fileBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach(page => mergedPdf.addPage(page));
                } else if (file.type.startsWith('image/')) {
                    const compressedBytes = await compressImage(file);
                    fileBuffer = compressedBytes.buffer as ArrayBuffer;
                    const image = await mergedPdf.embedJpg(fileBuffer);
                    const imgDims = image.scale(1);
                    const isLandscape = imgDims.width > imgDims.height;
                    // Standard A4 dimensions: 595.28 x 841.89
                    const page = mergedPdf.addPage(isLandscape ? [841.89, 595.28] : [595.28, 841.89]); 
                    const { width: pageWidth, height: pageHeight } = page.getSize();
                    const { width: imgWidth, height: imgHeight } = image.scaleToFit(pageWidth - 50, pageHeight - 50);
                    page.drawImage(image, { x: (pageWidth - imgWidth) / 2, y: (pageHeight - imgHeight) / 2, width: imgWidth, height: imgHeight });
                } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                    // Render text file to PDF page
                    const text = await file.text();
                    const lines = text.split('\n');
                    let page = mergedPdf.addPage([595.28, 841.89]);
                    let { height } = page.getSize();
                    let y = height - 50;
                    const fontSize = 10;
                    const lineHeight = fontSize * 1.2;

                    for (const line of lines) {
                        if (y < 50) {
                            page = mergedPdf.addPage([595.28, 841.89]);
                            y = height - 50;
                        }
                        // Simple text wrapping (approximate)
                        const maxChars = 90;
                        for (let i = 0; i < line.length; i += maxChars) {
                            if (y < 50) {
                                page = mergedPdf.addPage([595.28, 841.89]);
                                y = height - 50;
                            }
                            page.drawText(line.substring(i, i + maxChars), {
                                x: 50,
                                y: y,
                                size: fontSize,
                                font: helveticaFont,
                                color: rgb(0, 0, 0),
                            });
                            y -= lineHeight;
                        }
                    }
                }
            } catch (fileErr) { console.warn(`Skipping file ${file.name}`, fileErr); }
        }
        
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        
        const titular = analysisResult?.pdd?.datosTitulares?.[0];
        const dni = titular?.dni ? titular.dni.replace(/\s/g, '').toUpperCase() : 'DESCONOCIDO';
        const date = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
        
        link.href = URL.createObjectURL(blob);
        link.download = `DOCUMENTACION_${dni}_${date}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error bundling documents:", error);
        alert("Hubo un error al empaquetar los documentos.");
    } finally {
        setIsDownloading(false);
    }
  };

  const handleContinue = () => {
    let finalFiles: File[] = [];
    
    if (uploadMode === 'oneByOne') {
        // Enforce STRICT order based on the new requirements
        const orderedKeys = [
            // TITULAR
            'DNI / NIE TITULAR',
            'JUSTIFICANTE DE INGRESOS TITULAR',
            'IRPF TITULAR',
            'CUENTA TITULAR',
            'VIDA LABORAL TITULAR',
            'MODELO 130 O 131 TITULAR',
            
            // VEHICULO
            'FICHA TECNICA',
            'PERMISO DE CIRCULACION O INFORME DGT',
            
            // COTITULAR
            'DNI / NIE COTITULAR',
            'JUSTIFICANTE DE INGRESOS COTITULAR',
            'IRPF COTITULAR',
            'MODELO 130 O 131 COTITULAR',
            'VIDA LABORAL COTITULAR',
            
            // AVALISTA 1
            'DNI / NIE AVALISTA 1',
            'JUSTIFICANTE DE INGRESOS AVALISTA 1',
            'IRPF AVALISTA 1',
            'MODELO 130 O 131 AVALISTA 1',
            'VIDA LABORAL AVALISTA 1',
            
            // AVALISTA 2
            'DNI / NIE AVALISTA 2',
            'JUSTIFICANTE DE INGRESOS AVALISTA 2',
            'IRPF AVALISTA 2',
            'MODELO 130 O 131 AVALISTA 2',
            'VIDA LABORAL AVALISTA 2',
            
            // FACTURA
            'FACTURA PROFORMA O DEFINITIVA'
        ];
        
        // Add files in order
        orderedKeys.forEach(key => {
            const entry = multipleFiles[key];
            if (entry) finalFiles.push(entry.file);
        });
    } else {
        // Bulk mode - Use as is
        finalFiles = [...singleFiles, ...extractedFiles];
    }

    // Remove duplicates just in case
    const uniqueFiles = finalFiles.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (setParentFiles) setParentFiles(uniqueFiles);
    if (setParentAnalysisResult) setParentAnalysisResult(analysisResult);
    onNavigate('requestProcessing');
  };

  const handleCancelAnalysis = () => {
      setIsLoading(false);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setView('upload');
  };

  const renderUploadStep = () => {
    if (uploadMode === 'selection') {
      return (
        <div className="bg-white p-8 rounded-none shadow-sm border border-slate-200 text-center animate-fade-in-up max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-black mb-8 uppercase tracking-tight">¿Cómo quieres subir la documentación?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => setUploadMode('oneByOne')} className="group flex flex-col items-center justify-center p-6 rounded-none border-2 border-slate-200 hover:border-black transition-all duration-300">
                <div className="w-16 h-16 bg-slate-100 text-black rounded-none flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><FileTextIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg text-black mb-2 uppercase tracking-tight">Documentación 1 a 1</h4>
                <p className="text-xs text-slate-500">Sube cada documento en su casilla.</p>
            </button>
            <button onClick={() => setUploadMode('package')} className="group flex flex-col items-center justify-center p-6 rounded-none border-2 border-slate-200 hover:border-black transition-all duration-300">
                <div className="w-16 h-16 bg-slate-100 text-black rounded-none flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><DownloadIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg text-black mb-2 uppercase tracking-tight">Empaquetada (ZIP/EML)</h4>
                <p className="text-xs text-slate-500">Analiza ZIPs, RARs o correos (EML/MSG).</p>
            </button>
            <button onClick={() => setUploadMode('bulk')} className="group flex flex-col items-center justify-center p-6 rounded-none border-2 border-slate-200 hover:border-black transition-all duration-300">
                <div className="w-16 h-16 bg-slate-100 text-black rounded-none flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><UploadIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg text-black mb-2 uppercase tracking-tight">Varios Archivos</h4>
                <p className="text-xs text-slate-500">Selecciona múltiples archivos sueltos.</p>
            </button>
          </div>
          <div className="mt-10">{onBack && <button onClick={onBack} className="text-slate-500 hover:text-black font-bold text-xs uppercase tracking-widest transition-colors">Volver atrás</button>}</div>
        </div>
      );
    }
    if (uploadMode === 'package' || uploadMode === 'bulk') {
        return (
            <div className="bg-white p-8 rounded-none shadow-sm border border-slate-200 max-w-3xl mx-auto">
                 <h3 className="text-2xl font-bold text-black mb-6 text-center uppercase tracking-tight">{uploadMode === 'package' ? 'Subir Paquete (ZIP, EML, MSG...)' : 'Subir Varios Archivos'}</h3>
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-none cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-black transition-all group" onClick={() => document.getElementById('single-file-upload')?.click()}>
                    <div className="w-20 h-20 bg-white rounded-none shadow-sm border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><UploadIcon className="w-10 h-10 text-black"/></div>
                    <p className="text-lg font-bold text-black uppercase tracking-tight">Haz clic o arrastra tus archivos aquí</p>
                    <p className="text-sm text-slate-500 mt-2">Soporta: PDF, JPG, ZIP, EML, MSG</p>
                </div>
                <input id="single-file-upload" type="file" className="hidden" multiple onChange={handleSingleFileChange} accept=".pdf,.png,.jpg,.jpeg,.zip,.rar,.txt,.eml,.msg" />
                {singleFiles.length > 0 && (<div className="mt-6 bg-slate-50 rounded-none p-4 border border-slate-200 max-h-60 overflow-y-auto custom-scrollbar"><h4 className="font-bold text-black mb-3 text-sm uppercase tracking-wide">Archivos Seleccionados ({singleFiles.length})</h4><ul className="space-y-2">{singleFiles.map((file, i) => (<li key={i} className="flex justify-between items-center bg-white p-3 rounded-none border border-slate-200 shadow-sm"><div className="flex items-center gap-3 overflow-hidden"><div className="w-8 h-8 bg-slate-100 text-black rounded-none flex items-center justify-center flex-shrink-0"><FileTextIcon className="w-4 h-4" /></div><span className="truncate text-sm font-medium text-black">{file.name}</span></div><button onClick={() => removeSingleFile(i)} className="text-slate-400 hover:text-red-500 transition-colors p-1"><XIcon className="w-5 h-5" /></button></li>))}</ul></div>)}
                 <div className="mt-10 flex justify-between items-center"><button onClick={() => setUploadMode('selection')} className="font-bold text-slate-500 hover:text-black text-xs uppercase tracking-widest transition-colors">Cambiar método</button><button onClick={handleAnalysis} disabled={isLoading || singleFiles.length === 0} className="bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">{isLoading ? 'Procesando...' : 'ANALIZAR DOCUMENTACIÓN'} <ArrowRightIcon className="w-4 h-4"/></button></div>
            </div>
        );
    }
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Carga Documento a Documento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {requiredDocs.map(docSlot => (
                    <div key={docSlot} className="relative group">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center h-48 hover:border-caixa-blue hover:bg-blue-50 transition-all bg-slate-50">
                            {multipleFiles[docSlot] ? (<><div className="relative w-full h-full flex items-center justify-center">{multipleFiles[docSlot]?.preview.startsWith('blob:') ? (<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><FileTextIcon className="w-8 h-8 text-black" /></div>) : (<FileTextIcon className="w-16 h-16 text-slate-400" />)}</div><p className="text-xs font-bold text-slate-700 truncate w-full mt-2 px-2">{multipleFiles[docSlot]?.file.name}</p><button onClick={() => removeMultipleFile(docSlot)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-none w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"><XIcon className="w-4 h-4"/></button>{multipleFiles[docSlot]?.file.type.startsWith('image/') && (<button onClick={() => rotateImage(docSlot)} className="absolute -top-3 right-6 bg-black text-white rounded-none w-7 h-7 flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors z-10" title="Rotar imagen"><RotateIcon className="w-4 h-4"/></button>)}</>) : (<><p className="font-bold text-sm text-slate-700 mb-4 px-2">{docSlot}</p><div className="flex gap-3"><button onClick={() => document.getElementById(`file-input-${docSlot}`)?.click()} className="p-3 bg-white border border-slate-200 rounded-none hover:border-black hover:text-black shadow-sm transition-all" title="Subir archivo"><UploadIcon className="w-5 h-5" /></button><button onClick={() => { setCurrentSlot(docSlot); openCamera(); }} className="p-3 bg-white border border-slate-200 rounded-none hover:border-black hover:text-black shadow-sm transition-all" title="Usar cámara"><CameraIcon className="w-5 h-5" /></button></div><input type="file" id={`file-input-${docSlot}`} className="hidden" onChange={(e) => handleMultipleFileSelect(e.target.files, docSlot)} accept=".pdf,.png,.jpg,.jpeg,.txt,.eml,.msg" /></>)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex justify-between items-center"><button onClick={() => setUploadMode('selection')} className="font-bold text-slate-500 hover:text-black text-xs uppercase tracking-widest transition-colors">Cambiar método</button><button onClick={handleAnalysis} disabled={isLoading || Object.values(multipleFiles).every(d => d === null)} className="bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">ANALIZAR DOCUMENTACIÓN <ArrowRightIcon className="w-4 h-4"/></button></div>
        </div>
      );
  };
  
  const renderLoadingStep = () => (
    <div className="flex flex-col items-center w-full">
        {/* Spinner Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm p-8 flex flex-col items-center justify-center text-center animate-fade-in-up z-10 relative mb-8">
            <div className="relative w-24 h-24 mb-6">
                <SpinnerIcon className="w-24 h-24 text-caixa-blue animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-caixa-blue">{countdown}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Analizando Documentación...</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">Tiempo estimado restante</p>
            <button onClick={handleCancelAnalysis} className="text-xs text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-wider">Cancelar Proceso</button>
        </div>
    </div>
  );

  const renderClarificationStep = () => {
    // ... existing implementation
    if (!analysisResult) return null;
    if (intervenerStep === -1) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-full text-caixa-blue"><InfoIcon className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-slate-800">Conflicto de Tarifa</h3>
                </div>
                <p className="text-slate-600 mb-6">He encontrado varios tipos de interés. Selecciona el correcto:</p>
                <div className="grid grid-cols-1 gap-3">
                    {rateCandidates.map((rate, i) => (
                        <button key={i} onClick={() => handleIntervenerAnswer('select_rate', rate)} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all flex justify-between items-center group"><span className="font-bold text-lg text-slate-800 group-hover:text-caixa-blue">{rate}</span><span className="text-xs font-bold text-slate-400 group-hover:text-caixa-blue uppercase tracking-wider">Seleccionar</span></button>
                    ))}
                </div>
            </div>
        );
    }
    const allTitulares = analysisResult.pdd?.datosTitulares || [];
    if (intervenerStep === 0) {
         return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up max-w-xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-full text-caixa-blue"><InfoIcon className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-slate-800">Validación de Intervinientes</h3>
                </div>
                <p className="text-slate-600 mb-6">He identificado a <strong>{allTitulares.length} personas</strong>. ¿Cuántos titulares tendrá la operación?</p>
                <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => handleIntervenerAnswer('numTitulares', '1 Titular')} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all font-bold text-slate-700">1 Titular</button>
                    {allTitulares.length >= 2 && <button onClick={() => handleIntervenerAnswer('numTitulares', '2 Titulares')} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all font-bold text-slate-700">2 Titulares</button>}
                    {allTitulares.length >= 3 && <button onClick={() => handleIntervenerAnswer('numTitulares', '3 Titulares (2 + Avalista)')} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all font-bold text-slate-700">3 Titulares (2 + Avalista)</button>}
                    {allTitulares.length >= 4 && <button onClick={() => handleIntervenerAnswer('numTitulares', '4 Titulares (2 + 2 Avalistas)')} className="w-full text-left p-4 border-2 border-slate-100 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-all font-bold text-slate-700">4 Titulares (2 + 2 Avalistas)</button>}
                </div>
            </div>
        );
    }
    if (intervenerStep >= 1) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in-up max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-slate-800 mb-4">¿Quién es el {intervenerStep === 1 ? 'Titular Principal' : intervenerStep === 2 ? 'Cotitular' : `Avalista ${intervenerStep - 2}`}?</h3>
                <div className="grid grid-cols-1 gap-3">
                    {availableTitulares.map((t, i) => (
                        <SelectionButton key={i} t={t} onClick={() => handleIntervenerAnswer(intervenerStep === 1 ? 'select_titular_1' : intervenerStep === 2 ? 'select_titular_2' : intervenerStep === 3 ? 'select_avalista_1' : 'select_avalista_2', t)} />
                    ))}
                </div>
            </div>
        );
    }
    return null;
  };

  const renderResultsStep = () => {
    // ... existing implementation
    const fraudAnalysis = analysisResult?.analisisFraude;
    const analyzedDocs = analysisResult?.documentacion?.analizada || [];
    const missingDocs = analysisResult?.documentacion?.faltante || [];
    
    const categorizeStructuredDocs = (docs: any[]) => {
        const t1: string[] = [], t2: string[] = [], veh: string[] = [];
        docs.forEach(doc => {
            const text = doc.docType + (doc.motivoRechazo ? ` (${doc.motivoRechazo})` : '');
            if (doc.owner === 'Titular 1') t1.push(text);
            else if (doc.owner === 'Titular 2') t2.push(text);
            else if (doc.owner === 'Vehículo') veh.push(text);
        });
        return { t1, t2, veh };
    };
    
    const analyzedCat = categorizeStructuredDocs(analyzedDocs);
    const validatedCat = categorizeStructuredDocs(analyzedDocs.filter(d => d.status === 'Validado'));
    const missingCat = categorizeStructuredDocs(missingDocs);

    const renderList = (items: string[], emptyText = "Ninguno") => (
        items.length > 0 ? <ul className="list-disc list-inside text-sm text-gray-700">{items.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p className="text-sm text-gray-400 italic">{emptyText}</p>
    );

    const ResultCard = ({ title, t1, t2, veh, note }: { title: string, t1: string[], t2: string[], veh: string[], note?: string }) => (
        <div className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col">
            <h4 className="font-bold text-lg mb-3 border-b border-slate-100 pb-2 text-slate-800">{title}</h4>
            <div className="space-y-3 flex-grow">
                <div><span className="font-semibold text-xs text-caixa-blue uppercase">Titular 1</span>{renderList(t1)}</div>
                {t2.length > 0 && <div><span className="font-semibold text-xs text-caixa-blue uppercase">Cotitular</span>{renderList(t2)}</div>}
                {veh.length > 0 && <div><span className="font-semibold text-xs text-caixa-blue uppercase">Vehículo</span>{renderList(veh)}</div>}
            </div>
            {note && <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-caixa-blue italic">{note}</div>}
        </div>
    );

    const isFraudulent = fraudAnalysis && (['Alto', 'Crítico', 'Real', 'Medio'].includes(fraudAnalysis.nivelRiesgo));

    const titular = analysisResult?.pdd?.datosTitulares?.[0];
    const iban = titular?.datosBancarios?.iban || '';
    const isEntity2100 = iban.replace(/\s/g, '').substring(4, 8) === '2100';
    const amount = savedOfferData?.amountToFinance || 0;
    const showCaixaBankNote = isEntity2100 && amount <= 30000;
    const pendingNote = showCaixaBankNote ? "*Nota: Al ser cliente CaixaBank y la solicitud no exceder 30.000€, si la solicitud resulta APROBADA y tiene nómina domiciliada, no será necesario enviar justificantes de ingresos ni cuenta." : undefined;

    const stp = analysisResult?.cit?.filter(c => c.severity === 'Crítico') || [];
    const hasETT = analyzedDocs.some(d => d.docType.toUpperCase().includes('ETT') || (d.motivoRechazo && d.motivoRechazo.toUpperCase().includes('ETT')));
    const isCritical = stp.length > 0 || hasETT;
    const hasCotitular = (analysisResult?.pdd?.datosTitulares?.length ?? 0) > 1;

    return (
        <div className="w-full animate-fade-in-up space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Resultados de Pre-validación</h2>
                <p className="text-sm text-gray-500 mt-2 w-full mx-auto italic bg-white p-2 rounded border border-slate-200">
                    Documentación revisada por Quoter IA, puede contener errores y/o omisiones. La documentación tendrá que ser revisada por nuestro Dpto. de Riesgos.
                </p>
            </div>

            {isCritical && !hasCotitular && (
                <div className="p-6 bg-red-600 text-white rounded-none shadow-xl border-l-8 border-red-900 animate-pulse">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-3"><WarningIcon className="w-8 h-8" /> STOPPER ENCONTRADO</h3>
                    <p className="font-bold text-lg">Se ha detectado documentación no válida (como Nóminas de ETT o menos de 20 días) y no hay un cotitular solvente en la operación.</p>
                    <p className="mt-2 text-sm opacity-90 italic">Es obligatorio aportar un Cotitular Solvente para poder continuar con la financiación.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultCard title="1. Documentación Analizada" t1={analyzedCat.t1} t2={analyzedCat.t2} veh={analyzedCat.veh} />
                <ResultCard title="2. Documentación Pre-validada" t1={validatedCat.t1} t2={validatedCat.t2} veh={validatedCat.veh} />
                <ResultCard title="3. Documentación Pendiente" t1={missingCat.t1} t2={missingCat.t2} veh={missingCat.veh} note={pendingNote} />
            </div>

            {isFraudulent && (
                <div className="p-5 rounded-xl border-l-4 border-red-500 bg-white shadow-sm border-t border-r border-b border-slate-200">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
                        <ShieldCheckIcon className="w-5 h-5 text-red-500"/> 5. Análisis de Fraude
                    </h4>
                    <p className="font-bold mb-2 text-slate-700">Nivel de Riesgo: <span className="uppercase text-red-600">{fraudAnalysis.nivelRiesgo}</span></p>
                    <p className="text-sm text-slate-600">{fraudAnalysis.conclusion}</p>
                    {fraudAnalysis.indicios.length > 0 && (
                        <div className="mt-3 bg-slate-50 p-3 rounded text-xs text-slate-700 border border-slate-200">
                            <strong>Indicios:</strong> {fraudAnalysis.indicios.join(", ")}
                        </div>
                    )}
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-6">
                 <button onClick={onBack} className="w-full sm:w-auto bg-black text-white font-bold py-3 px-8 uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors">Atrás</button>
                 <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button onClick={handleContinue} className="w-full sm:w-auto bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest hover:bg-slate-800 inline-flex items-center justify-center gap-2 transition-colors">
                        Continuar <ArrowRightIcon className="w-5 h-5"/>
                    </button>
                 </div>
            </div>
        </div>
    );
  };

  return (
    <>
        {isCameraOpen && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 flex justify-center items-center">
                    <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-none border-4 border-slate-300 ring-4 ring-white/30 transition-transform active:scale-95" aria-label="Capturar foto"></button>
                    <button onClick={closeCamera} className="absolute right-4 bottom-8 text-white bg-slate-700/50 p-3 rounded-none hover:bg-slate-700/80">Cancelar</button>
                </div>
            </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        <div className="max-w-7xl mx-auto space-y-6">
            {error && (<div className="bg-red-50 p-4 rounded-lg text-red-800 flex gap-3"><WarningIcon className="w-5 h-5" /><p>{error}</p></div>)}
            {view === 'loading' && renderLoadingStep()}
            {view === 'clarification' && renderClarificationStep()}
            {view === 'results' && renderResultsStep()}
            {view === 'upload' && renderUploadStep()}
        </div>
    </>
  );
};

export default PackageDocumentation;
