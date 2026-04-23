
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import type { View } from '../App.tsx';
import { SendIcon, SpinnerIcon, CheckIcon } from './Icons.tsx';
import { offlineKnowledge, KnowledgeItem } from '../data/offlineKnowledge.ts';

// --- Local Icons ---
const DatabaseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
        <path d="M12 12.75c2.685 0 5.19-.504 7.071-1.387.234-.11.487-.04.66.155.19.214.269.49.269.757v4.5c0 2.692-4.03 4.875-9 4.875S3 19.442 3 16.75v-4.5c0-.267.079-.543.27-.757.172-.196.425-.265.659-.155C5.81 12.246 8.315 12.75 12 12.75Z" />
    </svg>
);

const DoubleCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M11.1 0.5L4.6 7L2.4 4.8L0.9 6.3L4.6 10L12.6 2L11.1 0.5Z" fill="currentColor"/>
        <path d="M16 2L14.5 0.5L10.9 4.1L12.4 5.6L16 2Z" fill="currentColor"/>
        <path d="M7.8 5.6L6.3 4.1L5.5 4.9L7 6.4L7.8 5.6Z" fill="currentColor"/>
    </svg>
);

const SingleCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M11.1 0.5L4.6 7L2.4 4.8L0.9 6.3L4.6 10L12.6 2L11.1 0.5Z" fill="currentColor"/>
    </svg>
);

interface MessagePart {
  text?: string;
  image?: {
    url: string;
    alt: string;
  };
}

interface Message {
  role: 'user' | 'model';
  parts: MessagePart[];
  timestamp: string;
  status?: 'sent' | 'read';
}

interface ChatbotProps {
  onNavigate: (view: View) => void;
  offerContext?: any;
  onConfigureOffer?: (config: any) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onNavigate, offerContext, onConfigureOffer }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- SEARCH LOGIC ---
  const findBestOfflineMatch = (query: string): string => {
      const lowerQuery = query.toLowerCase();
      let bestMatch: KnowledgeItem | null = null;
      let maxScore = 0;

      // 1. Check for Navigation keywords
      if (lowerQuery.includes('simulador') || lowerQuery.includes('oferta') || lowerQuery.includes('calcular')) {
          return "Te llevo al Simulador Financiero."; // Trigger navigation in handleResponse
      }
      if (lowerQuery.includes('tramitar') || lowerQuery.includes('solicitud') || lowerQuery.includes('nueva operación')) {
          return "Vamos a tramitar una nueva solicitud.";
      }

      // 2. Search in Knowledge Base
      offlineKnowledge.forEach(item => {
          let score = 0;
          item.keywords.forEach(keyword => {
              if (lowerQuery.includes(keyword)) score++;
          });
          // Bonus for exact category match if mentioned
          if (lowerQuery.includes(item.category.toLowerCase())) score += 0.5;
          
          if (score > maxScore) {
              maxScore = score;
              bestMatch = item;
          }
      });

      if (bestMatch && maxScore > 0) {
          return (bestMatch as KnowledgeItem).answer;
      }
      
      return "No he encontrado esa información específica. Prueba con términos como: 'documentación autónomo', 'estado solicitud', 'firma digital' o 'seguros'.";
  };

  // Initial Greeting
  useEffect(() => {
      if (messages.length === 0) {
          setMessages([{ 
            role: 'model', 
            parts: [{ text: 'Hola. Soy **Quoter Assistant 2.0**. Conozco todos los procedimientos, documentaciones y operativas. ¿En qué puedo ayudarte hoy?' }],
            timestamp: getCurrentTime()
        }]);
      }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // 1. Add User Message
    const userMessage: Message = { 
        role: 'user', 
        parts: [{ text: currentInput }], 
        timestamp: getCurrentTime(),
        status: 'sent'
    };
    setMessages(prev => [...prev, userMessage]);

    // 2. Process Response (Simulate slight delay for natural feel)
    setTimeout(() => {
        let responseText = findBestOfflineMatch(currentInput);
        let navigateAction: View | null = null;

        // Simple Navigation Logic based on text response
        if (responseText.includes("Te llevo al Simulador")) {
            navigateAction = 'simulator';
        } else if (responseText.includes("Vamos a tramitar")) {
            navigateAction = 'newRequestWorkflow';
        }

        const modelMessage: Message = {
            role: 'model',
            parts: [{ text: responseText }],
            timestamp: getCurrentTime()
        };

        setMessages(prev => {
            const updated = prev.map(m => m.role === 'user' ? { ...m, status: 'read' as const } : m);
            return [...updated, modelMessage];
        });
        
        setIsLoading(false);

        if (navigateAction) {
            setTimeout(() => onNavigate(navigateAction!), 1000);
        }

    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 relative">
        
        {/* Status Header */}
        <div className="w-full py-3 px-4 text-[10px] font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2 bg-black text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Asistente Quoter</span>
        </div>

        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 relative shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-black text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'
              }`}>
                {msg.parts.map((part, i) => (
                    <React.Fragment key={i}>
                        {part.text && <p className="text-sm whitespace-pre-wrap leading-relaxed">{part.text}</p>}
                    </React.Fragment>
                ))}
                <div className="flex justify-end items-center gap-1 mt-2 select-none">
                    <span className={`text-[10px] ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                        Procesando
                    </span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="w-full px-6 py-4 border-none bg-slate-50 text-slate-900 rounded-full focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-black text-white p-4 rounded-none hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex-shrink-0">
              <SendIcon className="w-5 h-5 -ml-1" />
            </button>
          </form>
        </footer>
      </div>
  );
};

export default Chatbot;
