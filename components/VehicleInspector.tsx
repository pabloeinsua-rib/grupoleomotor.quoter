
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Schema, Type } from '@google/genai';
import { CameraIcon, UploadIcon, SpinnerIcon, CheckIcon, WarningIcon, XIcon, ArrowUturnLeftIcon } from './Icons.tsx';

interface InspectionResult {
    marca: string;
    modelo: string;
    color: string;
    tipoCarroceria: string;
    daniosVisibles: string[];
    valoracionEstado: 'Excelente' | 'Bueno' | 'Regular' | 'Malo';
    descripcionComercial: string;
}

const VehicleInspector: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<InspectionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            setIsCameraOpen(true);
        } catch (err) {
            setError("No se pudo acceder a la cámara.");
        }
    };

    // Ensure stream is attached when the video element mounts
    useEffect(() => {
        if (isCameraOpen && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [isCameraOpen]);

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            setImage(canvas.toDataURL('image/jpeg'));
            
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            setIsCameraOpen(false);
            setResult(null);
            setError(null);
        }
    };

    const analyzeVehicle = async () => {
        if (!image) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("No se ha configurado la clave API de Gemini.");
            }
            const ai = new GoogleGenAI({ apiKey: apiKey as string });
            // Remove data:image/jpeg;base64, prefix
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];

            const schema: Schema = {
                type: Type.OBJECT,
                properties: {
                    marca: { type: Type.STRING, description: "Marca del vehículo" },
                    modelo: { type: Type.STRING, description: "Modelo estimado" },
                    color: { type: Type.STRING, description: "Color principal" },
                    tipoCarroceria: { type: Type.STRING, description: "SUV, Sedán, Compacto, etc." },
                    daniosVisibles: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Lista de daños cosméticos visibles (rayones, bollos, etc.). Si no hay, array vacío."
                    },
                    valoracionEstado: { 
                        type: Type.STRING, 
                        enum: ['Excelente', 'Bueno', 'Regular', 'Malo'],
                        description: "Evaluación general basada en la apariencia visual."
                    },
                    descripcionComercial: { 
                        type: Type.STRING, 
                        description: "Un texto atractivo de venta para este coche (max 50 palabras)." 
                    }
                },
                required: ["marca", "modelo", "valoracionEstado", "descripcionComercial"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{
                    parts: [
                        { inlineData: { mimeType, data: base64Data } },
                        { text: "Actúa como un perito experto en automoción. Analiza esta imagen del vehículo para una tasación o venta. Identifica marca, modelo, estado y daños visibles." }
                    ]
                }],
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            });

            const json = JSON.parse(response.text || "{}");
            setResult(json);

        } catch (err) {
            console.error(err);
            setError("No se pudo analizar el vehículo. Inténtalo con una foto más clara.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-caixa-blue p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CameraIcon className="w-6 h-6" /> Foto-Perito AI
                </h2>
            </div>

            <div className="p-6">
                <p className="text-gray-600 mb-6 text-sm">
                    Sube o toma una foto del vehículo de entrada (VO). Gemini 3.0 analizará el modelo, detectará daños visibles y generará una ficha comercial.
                </p>

                {/* Image Input Area */}
                {!image && !isCameraOpen && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-colors"
                        >
                            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm font-semibold text-gray-600">Subir Foto</span>
                        </button>
                        <button 
                            onClick={openCamera}
                            className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-none hover:border-caixa-blue hover:bg-blue-50 transition-colors"
                        >
                            <CameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm font-semibold text-gray-600">Usar Cámara</span>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect} 
                        />
                    </div>
                )}

                {/* Camera View */}
                {isCameraOpen && (
                    <div className="relative mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                             <button onClick={() => setIsCameraOpen(false)} className="bg-white/20 text-white p-3 rounded-none backdrop-blur-md hover:bg-white/30">
                                <XIcon className="w-6 h-6" />
                            </button>
                            <button onClick={capturePhoto} className="bg-white w-16 h-16 rounded-none border-4 border-gray-300 ring-2 ring-white"></button>
                        </div>
                    </div>
                )}

                {/* Preview & Analysis */}
                {image && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200">
                            <div className="w-full h-64 bg-slate-100 flex items-center justify-center"><span className="text-slate-500 font-medium">Imagen capturada</span></div>
                            <button 
                                onClick={() => { setImage(null); setResult(null); }} 
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-none hover:bg-black/70"
                            >
                                <ArrowUturnLeftIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {!result && !isAnalyzing && (
                            <button 
                                onClick={analyzeVehicle}
                                className="w-full bg-caixa-blue text-white font-bold py-3 px-6 rounded-none hover:bg-caixa-blue-light transition-colors flex items-center justify-center gap-2"
                            >
                                ✨ Analizar Vehículo con Gemini
                            </button>
                        )}

                        {isAnalyzing && (
                            <div className="text-center py-8">
                                <SpinnerIcon className="w-10 h-10 text-caixa-blue mx-auto animate-spin" />
                                <p className="mt-4 text-gray-600 font-medium">Escaneando carrocería e identificando modelo...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">{result.marca} {result.modelo}</h3>
                                <p className="text-gray-500">{result.color} • {result.tipoCarroceria}</p>
                            </div>
                            <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                                result.valoracionEstado === 'Excelente' ? 'bg-green-100 text-green-800' :
                                result.valoracionEstado === 'Bueno' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                Estado: {result.valoracionEstado}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    {result.daniosVisibles && result.daniosVisibles.length > 0 ? <WarningIcon className="w-5 h-5 text-orange-500"/> : <CheckIcon className="w-5 h-5 text-green-500"/>}
                                    Inspección Visual
                                </h4>
                                {result.daniosVisibles && result.daniosVisibles.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 bg-white p-3 rounded-lg border">
                                        {result.daniosVisibles.map((d, i) => (
                                            <li key={i} className="capitalize">{d}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                                        No se aprecian daños visibles significativos en esta vista.
                                    </p>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-700 mb-2">Argumentario de Venta Generado</h4>
                                <div className="bg-white p-3 rounded-lg border text-sm text-gray-600 italic">
                                    "{result.descripcionComercial}"
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                        <WarningIcon className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleInspector;