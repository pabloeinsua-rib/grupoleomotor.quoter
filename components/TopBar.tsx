import React, { useState } from 'react';
import { PhoneIcon, ListIcon, BellIcon, ArrowLeftIcon, SunIcon, MoonIcon, ArrowRightOnRectangleIcon, ChatbotIcon } from './Icons.tsx';
import LeomotorLogo from './LeomotorLogo.tsx';
import type { View, UserRole } from '../App.tsx';

interface TopBarProps {
  onMobileMenuClick?: () => void;
  unreadCount: number;
  onNavigate: (view: View) => void;
  currentView: View;
  handleGoBack: () => void;
  onLogout: () => void;
  onOpenChat?: () => void;
  userRole?: UserRole | null;
  onDealerModalOpen?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuClick, unreadCount, onNavigate, currentView, handleGoBack, onLogout, onOpenChat, userRole, onDealerModalOpen }) => {
  const availableLanguages = [
    { code: 'ESP', tCode: 'es', flagUrl: 'https://flagcdn.com/es.svg', label: 'Español' },
    { code: 'CAT', tCode: 'ca', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Flag_of_Catalonia.svg', label: 'Català' },
    { code: 'EUK', tCode: 'eu', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Flag_of_the_Basque_Country.svg', label: 'Euskera' },
    { code: 'GAL', tCode: 'gl', flagUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Flag_of_Galicia.svg', label: 'Galego' },
    { code: 'ENG', tCode: 'en', flagUrl: 'https://flagcdn.com/gb.svg', label: 'English' },
    { code: 'FRC', tCode: 'fr', flagUrl: 'https://flagcdn.com/fr.svg', label: 'Français' },
    { code: 'GER', tCode: 'de', flagUrl: 'https://flagcdn.com/de.svg', label: 'Deutsch' },
    { code: 'ITA', tCode: 'it', flagUrl: 'https://flagcdn.com/it.svg', label: 'Italiano' },
    { code: 'PTG', tCode: 'pt', flagUrl: 'https://flagcdn.com/pt.svg', label: 'Português' },
  ];

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quoter_app_lang');
      if (saved) {
        const found = availableLanguages.find(l => l.code === saved);
        if (found) return found;
      }
    }
    return availableLanguages[0]; // Default ESP
  });

  React.useEffect(() => {
    if (language && language.tCode !== 'es') {
      const intervalId = setInterval(() => {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (combo) {
          combo.value = language.tCode;
          combo.dispatchEvent(new Event('change'));
          clearInterval(intervalId);
        }
      }, 300);
      setTimeout(() => clearInterval(intervalId), 3000); // Give up search after 3s
      return () => clearInterval(intervalId);
    }
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check initial state from localStorage safely
    if (typeof window !== 'undefined') {
      try {
        const savedMode = localStorage.getItem('theme');
        if (savedMode === 'dark') return true;
      } catch (e) {
        console.warn('localStorage is disabled');
      }
    }
    return false;
  });

  React.useEffect(() => {
      // Toggle dark mode reliably by finding the root html element
      const htmlElement = document.documentElement;
      if (isDarkMode) {
          htmlElement.classList.add('dark');
          htmlElement.setAttribute('data-theme', 'dark');
          try { localStorage.setItem('theme', 'dark'); } catch (e) {}
      } else {
          htmlElement.classList.remove('dark');
          htmlElement.setAttribute('data-theme', 'light');
          try { localStorage.setItem('theme', 'light'); } catch (e) {}
      }
  }, [isDarkMode]);

  return (
    <header className="relative flex-shrink-0 bg-slate-100 border-b border-caixa-blue/20 shadow-[0_4px_12px_0_rgba(0,161,224,0.15)] h-16 w-full flex items-stretch justify-between z-40 transition-colors duration-500">
      <style>{`
        /* Hide Default Google translate widget and toolbar completely */
        .goog-te-banner-frame.skiptranslate, 
        .goog-te-gadget-icon, 
        .goog-tooltip, 
        .goog-tooltip:hover { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget-simple { background-color: transparent !important; border: none !important; }
        font { background: transparent !important; color: inherit !important; box-shadow: none !important; }
      `}</style>

      {/* Left side: Mobile menu toggle + Logo + Admin Button (centered above sidebar on desktop) */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 md:w-80 bg-black z-20 relative px-6 md:px-0">
        <div className="flex items-center justify-center w-full">
            <button onClick={onMobileMenuClick} className="md:hidden text-white p-2 -ml-2 hover:bg-white/10 rounded-none transition-colors mr-2">
              <ListIcon className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center justify-center">
                <LeomotorLogo userRole={userRole} className="w-full max-w-[130px] sm:max-w-[150px] scale-95" />
            </div>
        </div>
        {/* Added Dealer Codes Button in Header */}
        <button 
           onClick={() => {
               if(onDealerModalOpen) {
                   onDealerModalOpen();
               }
           }}
           className="hidden md:flex mt-0.5 px-2 py-0.5 bg-black text-white text-[7.5px] uppercase tracking-[0.15em] font-bold rounded-none hover:text-caixa-blue transition-all border border-white/5 active:scale-95"
           title="Códigos de Concesionarios"
        >
            CÓDIGO DE CONCESIONARIOS
        </button>
      </div>
      
      {/* Center: QUOTER Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 pointer-events-none md:pointer-events-auto px-2 select-none notranslate" translate="no">
        <span className="font-montserrat font-light text-[22px] sm:text-[26px] text-black leading-none tracking-normal">QUOTER</span>
        <span className="font-montserrat font-medium text-[8px] sm:text-[9px] tracking-[0.45em] text-[#8ea7c5] uppercase leading-none mt-1 ml-[0.45em]">AUTOMOTIVE</span>
      </div>
      
      {/* Right side: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 justify-end pr-6 sm:pr-8">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2 h-8 rounded-none text-[10px] sm:text-xs font-bold tracking-wider text-slate-500 hover:bg-slate-100 hover:text-black transition-colors"
              title="Cambiar idioma"
          >
              <span>{language.code}</span>
              <img src={language.flagUrl} alt={language.code} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
          </button>
          
          {isLangMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsLangMenuOpen(false)}
              ></div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setIsLangMenuOpen(false);
                      
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('quoter_app_lang', lang.code);
                        
                        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                        // Try SPA dynamic translation without reloading the page first
                        if (combo) {
                            combo.value = lang.tCode === 'es' ? '' : lang.tCode;
                            combo.dispatchEvent(new Event('change'));
                        }
                        
                        // Clear broken domain cookies that Vercel blocks
                        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        
                        // Set basic host-only cookie to be safe
                        if (lang.tCode !== 'es') {
                            document.cookie = `googtrans=/es/${lang.tCode}; path=/;`;
                        } else if (!combo) {
                             // Only force reload if combo is dead and trying to get back to ES
                             window.location.reload();
                        }
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors dark:hover:bg-slate-700 ${language.code === lang.code ? 'font-bold text-caixa-blue bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-9 font-mono text-[10px] sm:text-xs tracking-wider">{lang.code}</span>
                      <img src={lang.flagUrl} alt={lang.code} className="w-5 h-3.5 object-cover rounded-sm shadow-sm opacity-90 group-hover:opacity-100" />
                      <span className="ml-1 text-xs">{lang.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-8 h-8 flex items-center justify-center rounded-none text-slate-500 hover:bg-slate-100 hover:text-black transition-colors"
            aria-label="Alternar Tema"
        >
            {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
            onClick={() => onNavigate('messages')}
            className="relative w-8 h-8 flex items-center justify-center rounded-none text-slate-500 hover:bg-slate-100 hover:text-black transition-colors"
            aria-label="Ver mensajes"
        >
            <BellIcon className="w-4 h-4" />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
        </button>

        {/* Chatbot Icon */}
        {onOpenChat && (
            <button
                onClick={onOpenChat}
                className="w-8 h-8 flex items-center justify-center rounded-none bg-black text-white hover:bg-slate-800 transition-colors shadow-sm ml-1"
                aria-label="Asistente Quoter"
            >
                <ChatbotIcon className="w-4 h-4" />
            </button>
        )}

        {currentView !== 'dashboard' && (
            <button
                onClick={handleGoBack}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-none text-slate-500 hover:bg-slate-100 hover:text-black transition-colors"
                aria-label="Volver"
            >
                <ArrowLeftIcon className="w-4 h-4" />
            </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;