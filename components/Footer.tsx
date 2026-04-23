import React from 'react';
import { PhoneIcon, ChatbotIcon } from './Icons.tsx';
import type { View } from '../App.tsx';

interface FooterProps {
  onNavigate: (view: View) => void;
  unreadCount: number;
  onOpenChat?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, unreadCount, onOpenChat }) => {
  const logoUrl = "https://storage.googleapis.com/bucket_quoter_auto2/fortos/logo_footer.png";

  return (
    <footer className="relative flex-shrink-0 bg-cold-grey-1 dark:bg-slate-900 text-white h-16 w-full flex items-center justify-between px-4 sm:px-6 border-t border-slate-700 dark:border-slate-800 print-hide z-40">
      {/* Left Side: Phone (Mobile only) */}
      <div className="flex items-center gap-4">
        <a
          href="tel:933203365"
          className="p-2 bg-caixa-blue rounded-none text-white hover:bg-caixa-blue-light transition-colors shadow-lg z-10 md:hidden"
          aria-label="Llamar a soporte comercial"
        >
          <PhoneIcon className="w-6 h-6" />
        </a>
      </div>
      
      {/* Center: Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="font-bold text-white text-lg tracking-tight">CaixaBank Payments & Consumer</span>
      </div>

      {/* Right Side: Chatbot (Quoterin) */}
      <div className="flex items-center gap-4 min-w-[2.5rem] justify-end">
        {onOpenChat && (
            <button
            onClick={onOpenChat}
            className="p-2 bg-caixa-blue rounded-none text-white hover:bg-caixa-blue-light transition-colors shadow-lg z-10"
            aria-label="Abrir Asistente"
            >
            <ChatbotIcon className="w-6 h-6" />
            </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;