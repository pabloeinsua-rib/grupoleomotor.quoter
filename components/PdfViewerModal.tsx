
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, PrintIcon, DownloadIcon, ShareIcon, SpinnerIcon } from './Icons.tsx';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerModalProps {
  isOpen: boolean;
  src: string | null;
  filename: string;
  onClose: () => void;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, src, filename, onClose }) => {
  const [numPages, setNumPages] = useState<number>();
  const [canShare, setCanShare] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanShare(!!(navigator.share && navigator.canShare));
  }, []);

  useEffect(() => {
    const updateWidth = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (src && filename && canShare) {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const file = new File([blob], filename, { type: 'application/pdf' });

            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: filename,
                    text: 'Documento generado desde Quoter.',
                });
            }
        } catch (error) {
            console.error('Error sharing file:', error);
        }
    }
  };

  const handlePrint = () => {
    if (src) {
        const printWindow = window.open(src, '_blank');
        if (printWindow) {
            try {
                printWindow.addEventListener('load', () => {
                    setTimeout(() => {
                        try { printWindow.print(); } catch(e) { /* ignore */ }
                    }, 500);
                });
            } catch(e) { /* ignore */ }
        }
    }
  };

  const handleDownload = () => {
    if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] flex flex-col items-center justify-center p-4" aria-modal="true" role="dialog">
       <div className="w-full max-w-5xl h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200">
            
            {/* Header / Actions Bar */}
            <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-xs uppercase tracking-widest text-black truncate pr-4 hidden sm:block">{filename}</h3>
                
                <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <button 
                        onClick={handlePrint} 
                        className="bg-white text-black border border-slate-200 font-bold py-2 px-4 rounded-none hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                        title="Imprimir"
                    >
                        <PrintIcon className="w-4 h-4"/> <span className="hidden sm:inline">Imprimir</span>
                    </button>
                    
                    <button 
                        onClick={handleDownload} 
                        className="bg-white text-black border border-slate-200 font-bold py-2 px-4 rounded-none hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                        title="Descargar"
                    >
                        <DownloadIcon className="w-4 h-4"/> <span className="hidden sm:inline">Descargar</span>
                    </button>

                    {canShare && (
                        <button 
                            onClick={handleShare} 
                            className="bg-white text-black border border-slate-200 font-bold py-2 px-4 rounded-none hover:bg-slate-50 transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                            title="Compartir"
                        >
                            <ShareIcon className="w-4 h-4"/>
                        </button>
                    )}

                    <button 
                        onClick={onClose} 
                        className="bg-black text-white font-bold py-2 px-4 rounded-none hover:bg-slate-800 transition-colors flex items-center gap-2 ml-2 text-xs uppercase tracking-widest"
                        title="Cerrar"
                    >
                        <XIcon className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow bg-slate-100 relative overflow-y-auto" ref={containerRef}>
                {!src ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <SpinnerIcon className="w-12 h-12 text-black animate-spin mb-4" />
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Cargando documento...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center p-4 min-h-full">
                        <Document
                            file={src}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={<div className="flex flex-col items-center py-20"><SpinnerIcon className="w-12 h-12 text-blue-500 animate-spin mb-4" /><p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Cargando PDF...</p></div>}
                            error={<div className="p-8 text-center text-red-500 font-bold flex flex-col items-center justify-center h-full"><p className="mb-4">No se pudo cargar el PDF directamente en la vista previa debido a restricciones de seguridad (CORS o Sandbox).</p><button onClick={handleDownload} className="bg-black text-white uppercase tracking-widest py-2 px-6">Abrir Externamente</button></div>}
                        >
                            {Array.from(new Array(numPages || 0), (el, index) => (
                                <React.Fragment key={`page_${index + 1}`}>
                                    <Page 
                                        pageNumber={index + 1} 
                                        width={Math.min(containerWidth - 32, 800)} // Responsive width max 800px
                                        className="mb-4 shadow-lg border border-slate-200"
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                </React.Fragment>
                            ))}
                        </Document>
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};

export default PdfViewerModal;
