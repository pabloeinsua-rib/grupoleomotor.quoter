
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Part, GenerateContentResponse, Type, Schema } from '@google/genai';
import { SavedOfferData } from '../App.tsx';
import { UploadIcon, SpinnerIcon, CheckIcon, XIcon, WarningIcon, ArrowRightIcon, CameraIcon, ShieldCheckIcon, DownloadIcon, InfoIcon, FileTextIcon, PhoneIcon, RotateIcon } from './Icons.tsx';
import type { AnalysisResult } from './PackageDocumentation.tsx';
import { licensePlateData } from '../data/licensePlates.ts';

interface WorkflowMagicDataProps {
  savedOfferData: SavedOfferData | null;
  onAnalysisComplete: (files: File[], result: AnalysisResult) => void;
  onBack: () => void;
}

const arrayBufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
    let binary = '';
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const readFileAsText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
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
                          const extractedFile = new File([buffer], att.filename || 'adjunto.dat', { type: att.mimeType });
                          extractedFiles.push(extractedFile);
                      }
                  } else {
                      if (att.mimeType.startsWith('text/')) {
                           let textContent = "";
                           if (typeof att.content === 'string') textContent = att.content;
                           else {
                               const dec = new TextDecoder("utf-8");
                               textContent = dec.decode(att.content);
                           }
                           parts.push({ text: `[ADJUNTO DE TEXTO: ${att.filename}]:\n${textContent}` });
                      }
                  }
              }
          } else {
              parts.push({ text: "[SIN ADJUNTOS EN ESTE CORREO]" });
          }
          return { parts, extractedFiles };

      } catch (e) {
          console.error("Error parsing EML", e);
          const textContent = await readFileAsText(file);
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

              const msgTextFile = new File([msgTextContent], `${file.name.replace(/\.[^/.]+$/, "")}_contenido.txt`, { type: 'text/plain' });
              extractedFiles.push(msgTextFile);

              if (fileData.attachments && fileData.attachments.length > 0) {
                  for (const att of fileData.attachments) {
                      const attData = reader.getAttachment(att);
                      if (attData && attData.content) {
                          const mimeType = (att as any).mimeTag || 'application/octet-stream';
                          const isImage = mimeType.startsWith('image/');
                          const isPdf = mimeType === 'application/pdf';

                          // Ignorar imágenes pequeñas (probables logos de firma, < 25KB)
                          const isLikelySignatureLogo = isImage && attData.content.byteLength < 25600;

                          if ((isImage || isPdf) && !isLikelySignatureLogo) {
                              const base64Data = arrayBufferToBase64(attData.content);
                              parts.push({ text: `[ADJUNTO MSG ENCONTRADO: ${att.fileName || 'archivo'} (${mimeType})]` });
                              parts.push({
                                  inlineData: {
                                      data: base64Data,
                                      mimeType: mimeType
                                  }
                              });
                              const extractedFile = new File([attData.content], att.fileName || 'adjunto.dat', { type: mimeType });
                              extractedFiles.push(extractedFile);
                          }
                      }
                  }
              }
          }
          return { parts, extractedFiles };
      } catch (e) {
          console.warn("Error parseando MSG", e);
          return { parts: [], extractedFiles: [] };
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
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  
  let mimeType = file.type;
  if (!mimeType) {
      if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (file.name.endsWith('.png')) mimeType = 'image/png';
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

const COUNTDOWN_SECONDS = 60;

const WorkflowMagicData: React.FC<WorkflowMagicDataProps> = ({ savedOfferData, onAnalysisComplete, onBack }) => {
  const [uploadMode, setUploadMode] = useState<'initial' | 'single' | 'multiple'>('initial');
  
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
  
  const getRequiredDocs = (clientType: string | null, isVehicleUsed: boolean): string[] => {
    let docs: string[] = [];
    switch(clientType) {
        case 'Asalariados': 
            docs = ['DNI/NIE', 'Justificante Bancario', 'Nómina/Pensión'];
            if ((savedOfferData?.amountToFinance || 0) > 25000) {
                docs.push('IRPF');
            }
            break;
        case 'Autónomos': 
            docs = ['DNI/NIE', 'Justificante Bancario', 'IRPF', 'Trimestral'];
            break;
        case 'Sociedades': 
            docs = ['DNI/NIE Admin', 'CIF Empresa', 'Impuesto Sociedades', 'Resumen IVA'];
            break;
        default: 
            docs = ['DNI/NIE', 'Justificante Bancario', 'Justificante Ingresos'];
    }
    if (isVehicleUsed) {
        docs.push('Ficha Técnica', 'Permiso de Circulación');
    }
    docs.push('Otro 1', 'Otro 2');
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
    if (doc && doc.preview !== 'pdf_icon') {
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
                  if (doc.preview !== 'pdf_icon') URL.revokeObjectURL(doc.preview);
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
        console.error("Error accessing camera:", err);
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
                    const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    if (currentSlot) {
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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      closeCamera();
    };
  }, []);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  const handleAnalysis = async () => {
    const filesToAnalyze = uploadMode === 'multiple'
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
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
          throw new Error("No se ha configurado la clave API de Gemini.");
      }
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const processed = await Promise.all(filesToAnalyze.map(processFileForAnalysis));
      const fileParts = processed.flatMap(p => p.parts);
      const allExtractedFiles = processed.flatMap(p => p.extractedFiles);
      
      setExtractedFiles(allExtractedFiles);

      const jsonStructure = `
      {
          "cit": [{"issue": "string", "owner": "Titular 1|Titular 2|Vehículo", "severity": "Leve|Medio|Grave|Crítico"}],
          "analisisFraude": {
              "nivelRiesgo": "Ninguno|Bajo|Medio|Alto|Real|Crítico",
              "puntuacionFraude": 0-100,
              "indicios": ["string"],
              "conclusion": "string"
          },
          "documentacion": {
              "analizada": [
                  {
                      "docType": "string", 
                      "owner": "Titular 1|Titular 2|Vehículo",
                      "status": "Validado|Rechazado",
                      "motivoRechazo": "string (opcional)",
                      "sourceContainer": "string (opcional)"
                  }
              ],
              "faltante": [
                  {
                      "docType": "string",
                      "owner": "Titular 1|Titular 2|Vehículo"
                  }
              ]
          },
          "pdd": {
            "camposDudosos": ["string"],
            "datosOferta": {
                "precioVehiculo": number,
                "entrada": number,
                "plazo": number,
                "importeAFinanciar": number,
                "tarifa": "string",
                "posiblesTarifas": ["string"],
                "cuota": number,
                "seguro": "string"
            },
            "operativaCaixa": { "esCliente": boolean, "cuenta": "string" },
            "datosVehiculo": {
                "marca": "string", "modelo": "string", "version": "string", "bastidor": "string", "matricula": "string", "fechaMatriculacion": "string", "potenciaKW": number
            },
            "datosTitulares": [
                {
                    "dni": "string", "fechaCaducidad": "string", "nacionalidad": "string", "nombre": "string", "primerApellido": "string", "segundoApellido": "string",
                    "fechaNacimiento": "string", "paisNacimiento": "string", "sexo": "string", "estadoCivil": "string", "personasDependientes": number,
                    "direccion": {
                        "tipoVia": "string", "nombreVia": "string", "numero": "string", "piso": "string", "puerta": "string", "codigoPostal": "string", "poblacion": "string", "provincia": "string"
                    },
                    "contacto": { "telefonoFijo": "string", "movil": "string", "email": "string" },
                    "datosBancarios": {
                        "iban": "string", "entidad": "string", "oficina": "string", "direccionOficina": "string", "telefonoOficina": "string", "antiguedad": "string"
                    },
                    "datosVivienda": { "tipoPropiedad": "string", "antiguedad": "string", "otrosCreditos": "string" },
                    "datosLaborales": {
                        "situacionLaboral": "string", "antiguedadLaboral": "string", "ingresosFijos": number, "numeroPagas": number, "profesion": "string", "cargo": "string",
                        "nombreEmpresa": "string", "cifEmpresa": "string", "actividadEmpresa": "string", "direccionEmpresa": "string", "codigoPostalEmpresa": "string", "poblacionEmpresa": "string", "telefonoEmpresa": "string"
                    }
                }
            ]
          }
      }
      `;

      const currentDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const systemInstruction = `Eres "TramiCar", el asistente experto en análisis documental y forense.
Tu misión es doble: Extraer datos para el PDD y realizar un ANÁLISIS FORENSE de seguridad.

FECHA ACTUAL DEL SISTEMA: ${currentDate}. Utiliza esta fecha como referencia para validar la caducidad de los documentos y calcular antigüedades.

**1. EXTRACCIÓN DE DATOS PDD Y TITULARES (Prioridad Alta):**
Tu objetivo principal es CUMPLIMENTAR EL PDD al 100%. 
   - **Titular Principal:** Extrae TODOS los datos (DNI, Nombre, Dirección, Laboral, Banco, Contacto).
   - **COTITULAR / SEGUNDO INTERVINIENTE (OBLIGATORIO SI EXISTE):** Si detectas documentación de una segunda persona (otro DNI, nómina con otro nombre, declaración conjunta), **TIENES QUE** crear un SEGUNDO OBJETO en el array "datosTitulares" (index 1).
   - **Vehículo:** Extrae todos los datos técnicos y administrativos.

**2. ANÁLISIS FORENSE Y ANTIFRAUDE (CRÍTICO):**
Debes actuar como un perito documental experto. Analiza VISUALMENTE y MATEMÁTICAMENTE cada documento buscando indicios de manipulación digital:

   **A) NÓMINAS:**
   - **Coherencia Matemática:** Verifica explícitamente: ¿Total Devengado - Total Deducciones = Líquido a Percibir? Si la resta no es exacta, repórtalo como fraude.
   - **Tipografía:** Busca números con fuentes distintas, tamaños irregulares, negritas forzadas o alineación "flotante" (señal de edición de PDF).
   - **Fechas:** Verifica que la antigüedad en la empresa sea coherente con la fecha de alta.
   - **IRPF:** ¿El porcentaje de IRPF es coherente con el salario bruto anual estimado?

   **B) DNI/NIE:**
   - **COLOR (REQUISITO ESTRICTO):** Verifica ÚNICAMENTE si están en color. Si están en blanco y negro, indica como motivo de rechazo que deben enviarse en color. NO rechaces por caducidad.
   - **ORIGINALIDAD:** Tiene que ser foto al ORIGINAL. Si es foto a fotocopia o pantalla -> RECHAZADO.
   - **ESTADO:** Roto, muy deteriorado o sin chip -> RECHAZADO.
   - **Manipulación Visual:** Busca bordes pixelados alrededor de la foto o textos, diferencias de fondo, o tipografías inconsistentes en los datos variables.
   - **Algoritmo:** Si es posible, verifica la letra del DNI.

   **C) RECIBOS BANCARIOS / MOVIMIENTOS:**
   - **Saldo:** En extractos, verifica si Saldo Inicial + Entradas - Salidas = Saldo Final.
   - **Manipulación:** Busca líneas de texto que no sigan la rejilla o alineación del documento original.
   - **Antigüedad:** Del año en curso (excepto si viene en IRPF o nómina sin números tapados).

**REGLAS DE VALIDACIÓN DE DOCUMENTOS (ESTRICTAS):**
- **NÓMINA:**
  - Máximo 2 meses de antigüedad sobre el mes en curso.
  - Al menos 20 días del mes trabajados.
  - Si indica finiquito o extinción -> RECHAZADO.
  - Si hay embargo salarial -> RECHAZADO.
  - **Autonóminas (Nóminas sin retenciones):** IMPORTANTE: Las nóminas de asalariados que no tengan retenciones NO son de asalariado, son de Autónomo (autonóminas). Esto sucede cuando el trabajador es socio de la empresa o directivo. Estas autonóminas SOLO sirven para ver quién es el pagador y la antigüedad en la empresa. A la hora de tramitar se necesita el IRPF del trabajador, y ver los ingresos de la casilla 435. Esos ingresos son los que tienes que indicar en el PDD, indicando en pagas: 1. En estos casos, al tener autonómina y ser socio/trabajador, NO se le pide el modelo 130 ni el 131 ya que no lo presenta. Si aportan vida laboral, figurará como autónomo. De esta forma, NO ES FRAUDE que en la vida laboral venga como autónomo y en la renta y en la nómina venga como asalariado. Todo está en la nómina: si no tiene retenciones, es autónomo, esto es completamente legal, NUNCA lo marques como fraude.
  - Nóminas extranjeras -> Solo válidas si se cobran por banco español y presenta IRPF en España.
  - Descontar dietas y pagas extras completas del líquido a percibir.
- **CERTIFICADO DE PENSIÓN:**
  - Siempre del año en curso y con código CSV de validación (excepto Clases Pasivas). Si empezó a cobrar en el año en curso, vale la carta de concesión.
- **IRPF (MODELO 100):**
  - Hasta 30 de junio: válido el del año anterior. Desde 1 de julio: válido el del año en curso.
- **VIDA LABORAL:**
  - Máximo 1 mes de antigüedad.
- **JUSTIFICANTE DE CUENTA:**
  - Del año en curso (excepto si viene en IRPF o nómina sin números tapados).
  - **IMPORTANTE:** Si hay varios números de cuenta a nombre del titular, PRIORIZA SIEMPRE la cuenta aportada en el Certificado de Titularidad antes que la del IRPF, si son distintas.
- **PERMISO DE CIRCULACIÓN / FICHA TÉCNICA:**
  - IMPORTANTE FRAUDE Y REFI: Es completamente NORMAL que el Permiso de Circulación NO esté a nombre del cliente titular ni de la concesión. NUNCA lo marques como fraude ni sospecha por este motivo.
  - REFINANCIACIÓN (REFI): Si el Permiso de Circulación SÍ está a nombre del cliente ("Titular 1") que estamos analizando, significa que es una operación "REFI" (Refinanciación del valor final). En este caso:
    1. Debes añadir OBLIGATORIAMENTE en la documentación "faltante": "JUSTIFICANTE DE CANCELACIÓN DE OPERACION ANTERIOR A LA FINANCIERA ANTERIOR".
    2. Debes indicarlo explícitamente en el PDD marcando 'esRefinanciado' a true.
  - No puede tener tapado el nombre del titular.
  - Si no es de España -> Toma los datos pero pide FICHA TÉCNICA ESPAÑOLA.
- **GENERAL:**
  - EXCLUIR IMÁGENES IRRELEVANTES: Si estás procesando correos electrónicos (.eml o .msg) y encuentras multitud de imágenes adjuntas, ignora todas aquellas que parezcan firmas de correo automático, logotipos diminutos, anuncios publicitarios o banners. SOLO PRESTA ATENCIÓN a documentos reales.
  - Todos los documentos deben ser legibles y no estar cortados. Si es válido pero está cortado -> RECHAZADO.

**STOPPERS (MARCAR EN cit COMO CRÍTICO):**
- Nómina con retención por embargo.
- Pensión con embargo (campo "OTRAS RETENCIONES" con importe y %, excepto si es 1% que es Montepío Minero).
- Autónomos de alta reciente sin ingresos cotizados como autónomo en su última Renta (IRPF).
- Edad del cliente: Mínima 18, máxima 77 al finalizar el préstamo.
- Vehículo Matriculado con 97 meses o más desde la fecha de matriculación hasta la actualidad -> RECHAZADO (STOPPER REAL: "NO FINANCIABLE POR ANTIGÜEDAD").
- Pensiones percibidas por cuidados de familiar no son válidas.
- Nómina fraudulenta.
- Empresas de tipo C.B. (Comunidad de Bienes) o S.C. (Sociedad Civil) -> RECHAZADO (no son financiables por no tener personalidad jurídica).

**GOLDEN RULES PDD (ESTRICTO):**
- **COTITULAR:** Solo si hay 2 DNI/NIE o datos económicos de 2 personas. No asumas cotitular solo por el cónyuge en IRPF.
- **TARIFA (%):** SIEMPRE debes buscar el porcentaje (%) de interés o tarifa aplicable. Búscalo en la oferta financiera, en la ficha Tramicar, en la hoja de pedido, en el cuerpo del correo o en el asunto del correo electrónico. El valor porcentual exacto encontrado (ej: "8.99%", "6.99%") DEBE ser el valor que pongas en el campo "tarifa" del PDD.
- **PRODUCTO:** "AUTO" por defecto. "LEASING" solo si se indica explícitamente.

**REGLAS ESPECÍFICAS DE PDD (DATOS LABORALES Y ECONÓMICOS):**
- **SITUACIÓN LABORAL**: Si es asalariado, basándote en su contrato/vida laboral/nómina indica SOLO UNO de estos valores exactos: 'Asalariado fijo', 'Asalariado temporal', 'Autónomo', 'Becario/Prácticas', 'Funcionario', 'Parado', 'Pensionista', 'Pensionista (Jubilación)', 'Pensionista (Orfandad)', 'Pensionista (Temporal)', 'Pensionista (Viudedad)', 'Fijo discontinuo / Temporero', 'Ama de casa', 'Otros'.
- **ORIGEN INGRESOS (TIPO CONTRATO)**: Obligatorio asignar: 'Nómina' (cuenta ajena), 'Pensión' (pensionistas) o 'Renta' (autónomos).
- **PROFESIÓN**: Selecciona la más similar a: 'Abogado', 'Administrador empresa', 'Agricultor-Ganadero', 'Ama de casa', 'Arquitecto', 'Artista (Actor, cantante, músico...)', 'Autónomo', 'Camarero', 'Comercial', 'Conserje', 'Consultor', 'Contable', 'Delineante', 'Dentista', 'Dependiente', 'Diplomatico', 'Economista', 'Enfermero', 'Estudiante', 'Farmaceutico', 'Fontanero', 'Informático', 'Ingeniero', 'Investigación', 'Lampista', 'Limpieza', 'Marinero', 'Militar', 'Médico', 'Obrero', 'Otros', 'Periodista', 'Policia', 'Profesión liberal', 'Profesor', 'Religioso', 'Secretaria/Administrativo', 'Transportista', 'Veterinario'.
- **CARGO**: Selecciona el más similar a: 'Administrativo', 'Directivo', 'Empleado', 'Gerente', 'Jefe-Responsable', 'Obrero', 'Oficial primera', 'Otros', 'Técnico', 'Titulado superior', 'Autónomo'.
- **ACTIVIDAD EMPRESA**: Selecciona la más similar a: 'Administración pública', 'Agricultura-Ganaderia-Pes', 'Banca-Seguros', 'Comercio', 'Construcción', 'Diplomatica', 'Hosteleria', 'Industria', 'Internet', 'Mineria', 'Once', 'Otros', 'Servicios', 'Transporte', 'Venta ambulante', 'Sociedad Patrimonial', 'Prod./Dist. de armas', 'Casinos o ent. de apuestas', 'Ent. financieras no reguladas', 'Rent a car'.
- **DIRECCIÓN EMPRESA**: Extrae Población, C.P., Dirección y Teléfono de las nóminas o IRPF. Si no están en la documentación, USA GOOGLE para buscar la información.

**IMPORTANTE: SOPORTE DE CORREOS (EML/MSG)**
Se te suministrarán transcripciones de correos electrónicos. Analiza CUERPO y ASUNTO.

**IMPORTANTE: BÚSQUEDA EN INTERNET ACTIVADA**
Debes usar la herramienta **googleSearch** para encontrar información faltante obligatoria (Códigos Postales, CIF de Empresas, Direcciones de Oficinas Bancarias).
ESPECIALMENTE: Si en los documentos laborales aparece el nombre de la empresa pero NO aparece su Código Postal o su Teléfono, DEBES buscar en Google el nombre de la empresa y rellenar los campos "codigoPostalEmpresa" y "telefonoEmpresa" con los resultados reales de la búsqueda. NO pongas textos como "Búscalo en Google" o "No especificado", usa la herramienta de búsqueda para obtener el dato real.

**REGLAS DE SALIDA DE TEXTO (IMPORTANTE):**
1.  **NOMBRES DE DOCUMENTOS:** En "docType", usa nombres estándar: "DNI/NIE", "Nómina", "Recibo Bancario", "IRPF", "Ficha Técnica", "Permiso Circulación", "Vida Laboral".
2.  **CLASIFICACIÓN POR PROPIETARIO:** Asigna cada documento a "Titular 1", "Titular 2" o "Vehículo".
3.  **VEHÍCULO NUEVO:** Revisa el contexto JSON ("vehicleCategory" o "vehicleType").
    *   Si el vehículo es "Nuevo" (New): **NO** solicites "Ficha Técnica" ni "Permiso de Circulación" en "faltante".
    *   Si es "Matriculado/Ocasión/VO": SÍ son obligatorios.
4.  **DATOS DE CONTACTO:** Es CRÍTICO extraer móvil y email del titular y cotitular si aparecen en cualquier documento (CV, encabezado nómina, pie de firma email, formulario).
5.  **AUTÓNOMOS E IRPF / AUTONÓMINAS:** Si la situación laboral es "Autónomo" y se aporta la Declaración de la Renta (IRPF), DEBES extraer el importe de la **casilla 435** (o 485 en algunos modelos, prioriza 435) y ponerlo en el campo "ingresosFijos" (Líquido a Percibir). El número de pagas para autónomos debe ser siempre 1. Si tienen Autonómina (Sin retención), es la misma regla: NO pedir trimestrales ni asustarse si pone asalariado en alquiler, en la vida laboral será autónomo y está permitido.

**SALIDA JSON:**
- Debes incluir en la matriz "camposDudosos" el NOMBRE EXACTO de cualquier campo (ej. "codigoPostal", "ingresosFijos", "cifEmpresa") cuyo valor hayas extraído pero no estés 100% seguro de su veracidad porque el documento original estaba borroso, tapado, cortado o la letra era ilegible. Si estás seguro de todos los datos extraídos, déjalo vacío [].
Responde ÚNICAMENTE con un objeto JSON válido que siga estrictamente la estructura definida abajo.
No añadas texto antes ni después.

${jsonStructure}
`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: `Analiza estos documentos. Contexto: ${JSON.stringify(savedOfferData)}` }, ...fileParts] }],
        config: { 
            systemInstruction: systemInstruction,
            tools: [{ googleSearch: {} }]
        },
      });
      
      let jsonString = response.text || "{}";
      jsonString = jsonString.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonString);
      
      if (result.pdd?.datosVehiculo?.matricula && !result.pdd.datosVehiculo.fechaMatriculacion) {
          const letters = result.pdd.datosVehiculo.matricula.replace(/[^A-Z]/g, '').slice(-3);
          const found = licensePlateData.find(entry => entry.series >= letters);
          if (found) {
              const [year, month] = found.date.split('-');
              result.pdd.datosVehiculo.fechaMatriculacion = `01/${month}/${year}`;
          }
      }

      setAnalysisResult(result);

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
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }
  };

  const handleIntervenerAnswer = (questionId: string, answer: any) => {
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
        if (num === 2) {
            const remaining = allTitulares.find(t => t.dni !== answer.dni);
            if (remaining) finalizeAnalysis({ ...newAnswers, select_titular_2: remaining });
            else finalizeAnalysis(newAnswers);
        } else if (num > 2) {
            const remaining = allTitulares.filter(t => t.dni !== answer.dni);
            setAvailableTitulares(remaining);
            setIntervenerStep(2);
        } else {
            finalizeAnalysis(newAnswers);
        }
    } else if (questionId === 'select_titular_2') {
         if (num > 2) {
             const remaining = availableTitulares.filter(t => t.dni !== answer.dni);
             setAvailableTitulares(remaining);
             setIntervenerStep(3);
        } else {
             finalizeAnalysis(newAnswers);
        }
    } else {
        finalizeAnalysis(newAnswers);
    }
  };

  const finalizeAnalysis = (finalAnswers: Record<string, any>) => {
    if (!analysisResult?.pdd?.datosTitulares) {
        setView('results');
        return;
    }
    
    const finalPdd = JSON.parse(JSON.stringify(analysisResult.pdd));
    const numSelected = parseInt(finalAnswers['numTitulares']?.split(' ')[0] || '1', 10);
    let finalTitulares: any[] = [];

    const t1 = finalAnswers['select_titular_1'];
    const t2 = finalAnswers['select_titular_2'];

    if (t1) finalTitulares.push(t1);
    if (t2 && numSelected >= 2) {
         t2.relacionConTitular = "Cotitular";
         finalTitulares.push(t2);
    }
    if (numSelected === 3 && finalAnswers['confirm_avalista'] === 'Sí' && availableTitulares.length > 0) {
        const avalista = availableTitulares[0]; 
        if (avalista) {
             avalista.relacionConTitular = "Avalista";
             finalTitulares.push(avalista);
        }
    }

    finalPdd.datosTitulares = finalTitulares;
    setAnalysisResult({ ...analysisResult, pdd: finalPdd });
    setView('results');
  };

  const compressImage = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 2000;
          const MAX_HEIGHT = 2000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((blob) => {
                  if (blob) {
                      blob.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)));
                  } else {
                      reject(new Error("Compression failed"));
                  }
              }, 'image/jpeg', 0.85);
          } else {
               reject(new Error("Canvas context failed"));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleDownloadAnalysedDocs = async () => {
    let filesToProcess: File[] = [];
    if (uploadMode === 'multiple') {
        filesToProcess = Object.values(multipleFiles).filter((f): f is { file: File; preview: string; } => f !== null).map(f => f.file);
    } else {
        filesToProcess = singleFiles;
    }

    filesToProcess = [...filesToProcess, ...extractedFiles];

    filesToProcess = filesToProcess.filter(f => {
        const name = f.name.toLowerCase();
        // Allow text files now since we want to include EML content
        const isUnwanted = name.includes('pedido') || name.includes('ficha tramicar') || name.includes('oferta') || name.includes('presupuesto');
        return !isUnwanted;
    });

    const clientType = savedOfferData?.clientType || '';
    const isCompany = clientType.toLowerCase().includes('sociedad') || clientType.toLowerCase().includes('empresa');
    
    filesToProcess = filesToProcess.filter(f => {
        const name = f.name.toLowerCase();
        if (!isCompany && (name.includes('303') || name.includes('390'))) {
            return false;
        }
        return true;
    });

    // Remove duplicates
    filesToProcess = filesToProcess.filter((file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    if (filesToProcess.length === 0) {
        alert("No hay documentos válidos para descargar.");
        return;
    }
    
    setIsDownloading(true);

    try {
        const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
        
        const mergedPdf = await PDFDocument.create();
        const helveticaFont = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
        const helveticaRegular = await mergedPdf.embedFont(StandardFonts.Helvetica);
        
        const fraudDetected = analysisResult?.analisisFraude?.nivelRiesgo === 'Alto' || 
                              analysisResult?.analisisFraude?.nivelRiesgo === 'Crítico' ||
                              (analysisResult?.cit && analysisResult.cit.length > 0);
        
        if (fraudDetected) {
            const warningPage = mergedPdf.addPage();
            const { width, height } = warningPage.getSize();
            
            const fraudIssues = analysisResult?.analisisFraude?.indicios || [];
            const allIssues = [...new Set([...fraudIssues])];

            warningPage.drawText('ENCONTRADAS EVIDENCIAS DE FRAUDE', {
                x: 50, y: height - 100, size: 24, font: helveticaFont, color: rgb(1, 0, 0)
            });
             warningPage.drawText('EN DOCUMENTACIÓN', {
                x: 50, y: height - 130, size: 24, font: helveticaFont, color: rgb(1, 0, 0)
            });
            
            warningPage.drawText('POR FAVOR, REVISAR ESTE DOCUMENTO:', {
                x: 50, y: height - 180, size: 14, font: helveticaFont, color: rgb(0, 0, 0)
            });
            
             allIssues.forEach((issue: string, idx: number) => {
                const cleanIssue = issue.length > 90 ? issue.substring(0, 90) + '...' : issue;
                warningPage.drawText(`- ${cleanIssue}`, {
                    x: 50, y: height - 210 - (idx * 20), size: 10, color: rgb(1, 0, 0)
                });
            });
        }
        
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
                    const margin = 50;
                    const availWidth = pageWidth - (margin * 2);
                    const availHeight = pageHeight - (margin * 2);
                    const { width: imgWidth, height: imgHeight } = image.scaleToFit(availWidth, availHeight);
                    page.drawImage(image, { x: (pageWidth - imgWidth) / 2, y: (pageHeight - imgHeight) / 2, width: imgWidth, height: imgHeight });
                } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
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
                                font: helveticaRegular,
                                color: rgb(0, 0, 0),
                            });
                            y -= lineHeight;
                        }
                    }
                }
            } catch (fileErr) {
                console.warn(`Skipping file ${file.name}`, fileErr);
            }
        }
        
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        
        const pdd = analysisResult?.pdd;
        const titular = pdd?.datosTitulares?.[0];
        const dni = titular?.dni ? titular.dni.replace(/\s/g, '') : 'Desconocido';
        const nombre = titular?.nombre && titular?.primerApellido ? `${titular.nombre}_${titular.primerApellido}`.replace(/\s/g, '_') : 'Cliente';
        
        link.href = URL.createObjectURL(blob);
        link.download = `Documentacion_${dni}_${nombre}.pdf`;
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
    onAnalysisComplete(singleFiles, analysisResult!);
  };

  const handleCancelAnalysis = () => {
      setIsLoading(false);
      if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setView('upload');
  };

  const renderUploadStep = () => {
    if (uploadMode === 'initial') {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center animate-fade-in-up">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Carga de Documentación</h3>
          <p className="text-gray-600 mb-6">¿Cómo prefieres subir los archivos?</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setUploadMode('single')} className={`flex-1 font-bold py-4 px-4 text-xs uppercase tracking-widest rounded-none transition-colors border ${uploadMode === 'single' ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}`}>Uno por uno</button>
            <button onClick={() => setUploadMode('multiple')} className={`flex-1 font-bold py-4 px-4 text-xs uppercase tracking-widest rounded-none transition-colors border ${uploadMode === 'multiple' ? 'bg-black text-white border-black' : 'bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black'}`}>Empaquetado (ZIP, PDF...)</button>
          </div>
          <div className="mt-8 flex justify-between">
              {onBack && <button onClick={onBack} className="font-bold text-slate-600 py-3 px-8 rounded-none hover:bg-slate-100 transition-colors">Atrás</button>}
          </div>
        </div>
      );
    }
    if (uploadMode === 'single') {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Carga de Documentación (Empaquetado)</h3>
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-blue-50 transition-colors" onClick={() => document.getElementById('single-file-upload')?.click()}>
                    <UploadIcon className="w-10 h-10 mb-3 text-slate-400"/>
                    <p className="mb-2 text-sm text-slate-500 font-semibold">Arrastra o selecciona tus archivos</p>
                </div>
                <input id="single-file-upload" type="file" className="hidden" multiple onChange={handleSingleFileChange} accept=".pdf,.png,.jpg,.jpeg,.zip,.rar,.txt,.eml,.msg" />
                {singleFiles.length > 0 && (
                    <ul className="mt-2 space-y-2">{singleFiles.map((file, i) => (<li key={i} className="flex justify-between items-center bg-slate-100 p-2 rounded-md text-sm"><span className="truncate">{file.name}</span><button onClick={() => removeSingleFile(i)} className="text-red-500 p-1"><XIcon className="w-4 h-4" /></button></li>))}</ul>
                )}
                 <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                    <button onClick={() => setUploadMode('initial')} className="font-bold text-slate-600 py-3 px-8 rounded-none hover:bg-slate-100 transition-colors">Atrás</button>
                    <button onClick={handleAnalysis} disabled={isLoading || singleFiles.length === 0} className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 transition-colors">Analizar</button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Carga de Documentación (Uno a Uno)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {requiredDocs.map(docSlot => (
                    <div key={docSlot} className="relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-48">
                        {multipleFiles[docSlot] ? (
                            <><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><FileTextIcon className="w-8 h-8 text-black" /></div><p className="text-xs font-semibold truncate w-full mt-2">{multipleFiles[docSlot]?.file.name}</p><button onClick={() => removeMultipleFile(docSlot)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-none w-6 h-6 flex items-center justify-center">&times;</button>{multipleFiles[docSlot]?.file.type.startsWith('image/') && (<button onClick={() => rotateImage(docSlot)} className="absolute -top-2 right-6 bg-black text-white rounded-none w-6 h-6 flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors z-10" title="Rotar imagen"><RotateIcon className="w-3 h-3"/></button>)}</>
                        ) : (
                            <><p className="font-semibold text-sm mb-2">{docSlot}</p><div className="flex gap-2"><button onClick={() => document.getElementById(`file-input-${docSlot}`)?.click()} className="p-2 bg-slate-200 rounded-none"><UploadIcon className="w-5 h-5" /></button><button onClick={() => { setCurrentSlot(docSlot); openCamera(); }} className="p-2 bg-slate-200 rounded-none"><CameraIcon className="w-5 h-5" /></button></div><input type="file" id={`file-input-${docSlot}`} className="hidden" onChange={(e) => handleMultipleFileSelect(e.target.files, docSlot)} accept=".pdf,.png,.jpg,.jpeg,.txt,.eml,.msg" /></>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <button onClick={() => setUploadMode('initial')} className="font-bold text-slate-600 py-3 px-8 rounded-none hover:bg-slate-100 transition-colors">Atrás</button>
                <button onClick={handleAnalysis} disabled={isLoading || Object.values(multipleFiles).every(d => d === null)} className="w-full sm:w-auto inline-flex items-center justify-center bg-black text-white font-bold py-4 px-8 text-xs uppercase tracking-widest rounded-none hover:bg-slate-800 disabled:opacity-50 transition-colors">Analizar</button>
            </div>
        </div>
      );
  };
  
  const renderLoadingStep = () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center text-center animate-fade-in-up">
        <div className="relative w-24 h-24 mb-6">
            <SpinnerIcon className="w-24 h-24 text-caixa-blue animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-caixa-blue">{countdown}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Analizando...</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">Tiempo restante estimado: {countdown}s</p>
        <button onClick={handleCancelAnalysis} className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-none hover:bg-slate-300 transition-colors">Cancelar</button>
    </div>
  );

  const renderClarificationStep = () => {
    if (!analysisResult) return null;
    
    if (intervenerStep === -1) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                    <InfoIcon className="w-6 h-6 text-caixa-blue" />
                    <h3 className="text-xl font-bold text-gray-800">Conflicto de Tarifa (TIN)</h3>
                </div>
                <p className="text-gray-600 mb-4">He encontrado varios porcentajes. ¿Cuál aplicar?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rateCandidates.map((rate, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleIntervenerAnswer('select_rate', rate)} 
                            className="w-full text-left p-4 border rounded-none hover:bg-blue-50 hover:border-caixa-blue transition-colors flex justify-between items-center"
                        >
                            <span className="font-bold text-lg">{rate}</span>
                            <span className="text-xs text-gray-500">Seleccionar</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const allTitulares = analysisResult.pdd?.datosTitulares || [];
    const numTitularesOptions = ["1 Titular"];
    if (allTitulares.length >= 2) numTitularesOptions.push("2 Titulares");
    if (allTitulares.length >= 3) numTitularesOptions.push("3 Titulares (2 + Avalista)");
    const titularOptions = (titularList: any[]) => titularList.map((t: any) => ({
        label: `${t.nombre || ''} ${t.primerApellido || ''} (${t.dni || 'Sin DNI'})`.trim(),
        value: t
    }));
    const questions = [
        { id: 'numTitulares', text: `He identificado a ${allTitulares.length} personas. ¿Cuántos titulares tendrá la operación?`, options: numTitularesOptions.map(opt => ({ label: opt, value: opt })) },
        { id: 'select_titular_1', text: '¿Quién será el titular principal?', options: titularOptions(allTitulares) },
        { id: 'select_titular_2', text: '¿Quién será el cotitular?', options: titularOptions(availableTitulares) },
        { id: 'confirm_avalista', text: `¿Confirmas que ${availableTitulares[0]?.nombre || 'la persona restante'} es el avalista?`, options: [{label: 'Sí', value: 'Sí'}, {label: 'No', value: 'No'}] },
    ];
    const question = questions[intervenerStep];
    
    if (!question) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 my-4">{question.text}</h3>
            {question.options && (
                <div className="space-y-3">
                    {question.options.map((option, i) => (
                        <button key={i} onClick={() => handleIntervenerAnswer(question.id, option.value)} className="w-full text-left p-4 border rounded-none hover:bg-slate-100">{option.label}</button>
                    ))}
                </div>
            )}
        </div>
    );
  };

  const renderResultsStep = () => {
    const fraudAnalysis = analysisResult?.analisisFraude;
    
    // Extract info from new structure
    const analyzedDocs = analysisResult?.documentacion?.analizada || [];
    const missingDocs = analysisResult?.documentacion?.faltante || [];

    // Helper to categorize for UI (t1, t2, veh)
    const categorizeStructuredDocs = (docs: any[]) => {
        const t1: string[] = [], t2: string[] = [], veh: string[] = [];
        docs.forEach(doc => {
            // doc matches { docType, owner, ... }
            const text = doc.docType + (doc.motivoRechazo ? ` (${doc.motivoRechazo})` : '');
            if (doc.owner === 'Titular 1') t1.push(text);
            else if (doc.owner === 'Titular 2') t2.push(text);
            else if (doc.owner === 'Vehículo') veh.push(text);
        });
        return { t1, t2, veh };
    };

    // 1. Analyzed (All)
    const analyzedCat = categorizeStructuredDocs(analyzedDocs);

    // 2. Validated
    const validDocs = analyzedDocs.filter(d => d.status === 'Validado');
    const validatedCat = categorizeStructuredDocs(validDocs);

    // 3. Missing
    const missingCat = categorizeStructuredDocs(missingDocs);

    const renderList = (items: string[], emptyText = "Ninguno") => (
        items.length > 0 
        ? <ul className="list-disc list-inside text-sm text-gray-700">{items.map((item, i) => <li key={i}>{item}</li>)}</ul>
        : <p className="text-sm text-gray-400 italic">{emptyText}</p>
    );

    const ResultCard = ({ title, t1, t2, veh, colorClass = "bg-white" }: { title: string, t1: string[], t2: string[], veh: string[], colorClass?: string }) => (
        <div className={`p-5 rounded-none shadow-md border border-gray-100 ${colorClass}`}>
            <h4 className="font-bold text-lg mb-3 border-b pb-2">{title}</h4>
            <div className="space-y-3">
                <div><span className="font-semibold text-xs text-gray-500 uppercase">Titular 1</span>{renderList(t1)}</div>
                {t2.length > 0 && <div><span className="font-semibold text-xs text-gray-500 uppercase">Cotitular</span>{renderList(t2)}</div>}
                {veh.length > 0 && <div><span className="font-semibold text-xs text-gray-500 uppercase">Vehículo</span>{renderList(veh)}</div>}
            </div>
        </div>
    );

    return (
        <div className="w-full animate-fade-in-up space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Resultados de Pre-validación</h2>
                <p className="text-sm text-gray-500 mt-2 w-full mx-auto italic bg-white p-2 rounded border border-slate-200">
                    Documentación revisada por Quoter IA, puede contener errores y/o omisiones. La documentación tendrá que ser revisada por nuestro Dpto. de Riesgos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultCard title="1. Documentación Analizada" t1={analyzedCat.t1} t2={analyzedCat.t2} veh={analyzedCat.veh} />
                <ResultCard title="2. Documentación Pre-validada" t1={validatedCat.t1} t2={validatedCat.t2} veh={validatedCat.veh} />
                <ResultCard title="3. Documentación Pendiente" t1={missingCat.t1} t2={missingCat.t2} veh={missingCat.veh} />
            </div>

            {fraudAnalysis && (
                <div className={`p-5 rounded-xl border-l-4 bg-white shadow-sm border-t border-r border-b border-slate-200 ${fraudAnalysis.nivelRiesgo === 'Bajo' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
                        <ShieldCheckIcon className={`w-5 h-5 ${fraudAnalysis.nivelRiesgo === 'Bajo' ? 'text-green-500' : 'text-red-500'}`}/> 5. Análisis de Fraude
                    </h4>
                    <p className="font-bold mb-2 text-slate-700">Nivel de Riesgo: <span className={`uppercase ${fraudAnalysis.nivelRiesgo === 'Bajo' ? 'text-green-600' : 'text-red-600'}`}>{fraudAnalysis.nivelRiesgo}</span></p>
                    <p className="text-sm text-slate-600">{fraudAnalysis.conclusion}</p>
                    {fraudAnalysis.indicios.length > 0 && (
                        <div className="mt-3 bg-slate-50 p-3 rounded text-xs text-slate-700 border border-slate-200">
                            <strong>Indicios:</strong> {fraudAnalysis.indicios.join(", ")}
                        </div>
                    )}
                </div>
            )}
            
            {/* Action Buttons */}
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

export default WorkflowMagicData;
