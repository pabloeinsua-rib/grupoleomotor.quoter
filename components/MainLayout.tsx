import React, { useState, useEffect } from 'react';
import type { View, UserRole } from '../App.tsx';
import Logo from './Logo.tsx';
import LeomotorLogo from './LeomotorLogo.tsx';
import DealerCodesModal from './DealerCodesModal.tsx';
import { 
    BellIcon, ListIcon, XIcon, PhoneIcon, ArrowLeftIcon, ChevronDownIcon,
    ArrowRightOnRectangleIcon, ChatbotIcon, ShieldCheckIcon, CogIcon, DownloadIcon
} from './Icons.tsx';
import TopBar from './TopBar.tsx';
import PageHeader from './PageHeader.tsx';


interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  currentView: View;
  handleGoBack: () => void;
  onOpenChat: () => void;
  title: string;
  subtitle?: string;
  unreadCount: number;
  userId: string | null;
  userRole: UserRole | null;
  onLogout: () => void;
  onInstallApp?: () => void;
  isInstallable?: boolean;
}

// Define structure for Navigation
type NavItem = 
  | { type: 'link'; view: View; label: string }
  | { type: 'separator' }
  | { type: 'group'; label: string; subItems: { view: View; label: string }[]; mainView?: View };

const MainLayout: React.FC<MainLayoutProps> = ({
  children, onNavigate, currentView, handleGoBack, onOpenChat, title, subtitle, unreadCount, userId, userRole, onLogout, onInstallApp, isInstallable
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isDealerModalOpen, setIsDealerModalOpen] = useState(false);

  // Define new menu structure
  const menuStructure: NavItem[] = [
    { type: 'link', view: 'dashboard', label: 'Inicio' },
    { type: 'separator' },
    { type: 'link', view: 'simulator', label: 'Nueva Oferta Financiera' },
    { type: 'separator' },
    { type: 'link', view: 'newRequestWorkflow', label: 'Tramitar Nueva Solicitud' },
    { type: 'separator' },
    { 
        type: 'group', 
        label: 'Gestionar Solicitudes',
        subItems: [
            { view: 'modificacionSolicitudes', label: 'Modificar Solicitud' },
            { view: 'pendingDocumentation', label: 'Documentación Pendiente' },
            { view: 'digitalSignature', label: 'Firma de Contratos' },
            { view: 'abonoSolicitudes', label: 'Abono de Solicitudes' },
            { view: 'operationsManager', label: 'Situación de la Solicitud' },
            { view: 'commercialSupport', label: 'Otras Gestiones' }
        ]
    },
    { type: 'separator' },
    { type: 'link', view: 'trainingGroup', label: 'Formación' }
  ];

  // Tramicar specific menu
  const tramicarMenu: NavItem[] = [
      { type: 'link', view: 'newRequestWorkflow', label: 'Tramitar Solicitud' }
  ];

  // Add Admin Panel link if role is admin
  if (userRole === 'admin') {
      menuStructure.push({ type: 'separator' });
      menuStructure.push({ type: 'link', view: 'adminPanel', label: 'Panel de Administración' });
  }

  const navigationItems = userRole === 'tramicar' ? tramicarMenu : menuStructure;

  // --- Minimalist Premium Button Style ---
  const sidebarBtnClass = (isActive: boolean) => `
    w-full flex items-center justify-between px-6 py-3
    text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 text-left group
    ${isActive 
        ? 'bg-slate-100 text-black border-l-2 border-caixa-blue shadow-[inset_0_0_12px_rgba(0,161,224,0.15)] ring-1 ring-caixa-blue/20 relative z-10' 
        : 'text-slate-500 hover:text-caixa-blue hover:bg-slate-50 border-l-2 border-transparent hover:shadow-[inset_0_0_8px_rgba(0,161,224,0.1)] hover:border-caixa-blue/50'
    }
  `;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-caixa-blue/20 shadow-[4px_0_12px_rgba(0,161,224,0.1)]">
        <div className="flex-grow overflow-y-auto pb-4 pt-6 custom-scrollbar space-y-1">
            {navigationItems.map((item, idx) => {
                if (item.type === 'separator') {
                    return <div key={`sep-${idx}`} className="my-3 border-t border-slate-100/50 mx-6"></div>;
                }

                if (item.type === 'link') {
                    const isActive = item.view === currentView;
                    return (
                        <button
                            key={item.label}
                            onClick={() => { onNavigate(item.view); setIsMobileMenuOpen(false); }}
                            className={sidebarBtnClass(isActive)}
                        >
                            <span>{item.label}</span>
                        </button>
                    );
                }

                if (item.type === 'group') {
                    const isChildActive = item.subItems.some(sub => sub.view === currentView);
                    const isOpen = openAccordion === item.label || isChildActive;
                    
                    useEffect(() => {
                        if (isChildActive) setOpenAccordion(item.label);
                    }, []);

                    return (
                        <div key={item.label}>
                            <button
                                onClick={() => {
                                    if (item.mainView) {
                                        setOpenAccordion(item.label);
                                        onNavigate(item.mainView);
                                        setIsMobileMenuOpen(false);
                                    } else {
                                        setOpenAccordion(isOpen ? null : item.label);
                                    }
                                }}
                                className={sidebarBtnClass(false)} 
                            >
                                <span>{item.label}</span>
                                <ChevronDownIcon className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="ml-[26px] border-l border-slate-200 mt-1 mb-2 space-y-1">
                                    {item.subItems.map(sub => (
                                        <button
                                            key={sub.label}
                                            onClick={() => { onNavigate(sub.view); setIsMobileMenuOpen(false); }}
                                            className={`w-full text-left pl-5 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] font-medium transition-colors border-l-2 ${currentView === sub.view ? 'text-black font-bold border-caixa-blue/50' : 'text-slate-400 hover:text-black border-transparent hover:border-caixa-blue/30'}`}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-slate-100/50 space-y-2">
            {/* Install App Button */}
            {isInstallable && onInstallApp && (
                <button
                    onClick={() => { onInstallApp(); setIsMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-4 bg-black text-white font-medium text-[10px] uppercase tracking-[0.15em] rounded-none transition-all flex items-center justify-center gap-2 hover:bg-slate-800 shadow-md"
                >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    INSTALAR APP
                </button>
            )}

            {/* Test Email Button (Only for pabloeinsua@gmail.com) */}
            {userId === 'pabloeinsua@gmail.com' && (
                <button
                    onClick={async () => {
                        try {
                            const res = await fetch('/api/email/test', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ to: userId })
                            });
                            if (res.ok) alert('Correo de prueba enviado correctamente a ' + userId);
                            else alert('Error al enviar el correo de prueba');
                        } catch (e) {
                            alert('Error de conexión al enviar correo');
                        }
                    }}
                    className="w-full py-2.5 px-4 border border-blue-200 text-blue-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                    PROBAR EMAIL
                </button>
            )}

            {/* Admin Panel Button specifically for Admin Role (Double check) */}
            {userRole === 'admin' && (
                <button
                    onClick={() => { onNavigate('adminPanel'); setIsMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center gap-2"
                >
                    <CogIcon className="w-3.5 h-3.5" />
                    ADMINISTRACIÓN
                </button>
            )}

            <button
                onClick={() => { onNavigate('fraudPrevention'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center gap-2"
            >
                <ShieldCheckIcon className="w-3.5 h-3.5 opacity-0" /> {/* Spacer icon */}
                <span className="flex-1 text-center -ml-5 leading-tight">PREVENCIÓN DEL FRAUDE</span>
            </button>

            <button
                onClick={() => { onNavigate('annualTraining'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center gap-2"
            >
                <ShieldCheckIcon className="w-3.5 h-3.5 opacity-0" /> {/* Spacer icon */}
                <span className="flex-1 text-center -ml-5 leading-tight">FORM. SEGUROS ASNEF {new Date().getFullYear()}</span>
            </button>

            <button
                onClick={() => { onNavigate('premiumProgram'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center gap-2"
            >
                <ShieldCheckIcon className="w-3.5 h-3.5 opacity-0" /> {/* Spacer icon */}
                <span className="flex-1 text-center -ml-5">PREMIUM PROGRAM</span>
            </button>

            <button
                onClick={() => { onNavigate('customerSupport'); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-600 font-medium text-[10px] uppercase tracking-[0.15em] rounded-none hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center gap-2"
            >
                <span className="text-center leading-tight">CONSULTAS DE CLIENTE FINAL</span>
            </button>

            <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em] rounded-none hover:text-white hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
            >
                CERRAR SESIÓN
            </button>
        </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden font-segoe">
      <TopBar 
        onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        unreadCount={unreadCount}
        onNavigate={onNavigate}
        currentView={currentView}
        handleGoBack={handleGoBack}
        onLogout={onLogout}
        onOpenChat={onOpenChat}
        userRole={userRole}
        onDealerModalOpen={() => setIsDealerModalOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <aside className="hidden md:block w-80 flex-shrink-0 z-30 h-full relative">
            <SidebarContent />
        </aside>

        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col">
                    <SidebarContent />
                </div>
            </div>
        )}

        <main id="main-scroll-container" className="flex-1 overflow-y-auto relative scroll-smooth bg-white flex flex-col">
             <div className="relative z-10 flex-1 flex flex-col">
                  {currentView !== 'dashboard' && (
                    <div className="px-6 pt-6 animate-fade-in-up">
                        <PageHeader title={title} subtitle={subtitle} showBackButton={true} onGoBack={handleGoBack} />
                    </div>
                  )}
                  <div className="flex-grow">
                    {children}
                  </div>

                  {/* Footer with Commercial Support data - only for non-sidebar part */}
                  <footer className="bg-white border-t border-caixa-blue/20 py-2 px-6 md:px-8 shadow-[0_-4px_12px_rgba(0,161,224,0.05)]">
                      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                          {/* Logo and Title */}
                          <div className="flex items-center gap-3">
                              <div className="bg-slate-50 p-1.5 rounded-full ring-1 ring-slate-100 hidden sm:block">
                                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                  </svg>
                              </div>
                              <div className="flex flex-col">
                                  <h2 className="text-[8px] font-bold tracking-[0.15em] uppercase text-[#86868b] leading-none mb-0.5">Asistencia Comercial</h2>
                                  <a href="tel:933203365" className="text-base font-bold tracking-tight text-[#1d1d1f] hover:text-caixa-blue transition-colors leading-none">933 203 365</a>
                              </div>
                          </div>

                          {/* Options */}
                          <div className="flex items-center gap-4 text-[9px]">
                              <div className="flex items-center gap-2">
                                  <span className="font-bold border border-black/10 px-1.5 py-0.5 bg-slate-50 uppercase text-[7px]">Pulsa 1</span>
                                  <span className="font-medium text-[#1d1d1f] uppercase tracking-wide">Solicitudes en estudio</span>
                              </div>
                              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                                  <span className="font-bold border border-black/10 px-1.5 py-0.5 bg-slate-50 uppercase text-[7px]">Pulsa 2</span>
                                  <span className="font-medium text-[#1d1d1f] uppercase tracking-wide">Aprobadas o nuevas</span>
                              </div>
                          </div>

                          {/* Schedule */}
                          <div className="text-right border-l border-slate-200 pl-4 hidden xl:block">
                              <div className="text-[8px] font-bold text-[#1d1d1f] uppercase tracking-wider">Lunes a Sábado · 9:00 a 21:00</div>
                              <div className="text-[7px] text-[#86868b] uppercase tracking-widest font-medium">Ininterrumpidamente · Excepto festivos NAC.</div>
                          </div>
                      </div>
                  </footer>
             </div>
        </main>
      </div>

      {isDealerModalOpen && <DealerCodesModal onClose={() => setIsDealerModalOpen(false)} />}
    </div>
  );
};

export default MainLayout;