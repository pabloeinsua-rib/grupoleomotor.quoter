
import React, { useState, useEffect, useCallback, useRef } from 'react';

import Login from './components/Login.tsx';
import MainLayout from './components/MainLayout.tsx';
import Dashboard from './components/Dashboard.tsx';
import Simulator from './components/Simulator.tsx';
import CustomerSupport from './components/CustomerSupport.tsx';
import FraudPrevention from './components/FraudPrevention.tsx';
import DigitalSignature from './components/DigitalSignature.tsx';
import InsuranceCoverage from './components/InsuranceCoverage.tsx';
import AnnualTraining from './components/AnnualTraining.tsx';
import CommercialSupport from './components/CommercialSupport.tsx';
import RequestProcessing from './components/RequestProcessing.tsx';
import Facilitea from './components/Facilitea.tsx';
import Sustainability from './components/Sustainability.tsx';
import AboutUs from './components/AboutUs.tsx';
import ManageRequests from './components/ManageRequests.tsx';
import TrainingGroup from './components/TrainingGroup.tsx';
import PremiumProgram from './components/PremiumProgram.tsx';
import CaixabankPCInfo from './components/CaixabankPCInfo.tsx';
import Messages from './components/Messages.tsx';
import PackageDocumentation, { type AnalysisResult } from './components/PackageDocumentation.tsx';
import { NotificationProvider, useNotification } from './components/NotificationContext.tsx';
import ApplicationStatus from './components/ApplicationStatus.tsx';
import DocumentSubmission from './components/DocumentSubmission.tsx';
import OperationsManager from './components/OperationsManager.tsx';
import { XIcon, CheckIcon, SimulatorIcon, EditIcon, FileTextIcon, InfoIcon, ArrowRightIcon } from './components/Icons.tsx';
import PwaInstallPrompt from './components/PwaInstallPrompt.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import ModificacionSolicitudes from './components/WebProcessingTraining.tsx';
import AbonoSolicitudes from './components/FinancingConditions.tsx';
import FirmaGestoria from './components/SplashScreen.tsx';
import FirmaNotaria from './components/StickyHeader.tsx';
import Utilidades from './components/Breadcrumbs.tsx';
import CaixabankClientOperations from './components/CaixabankClientOperations.tsx';
import FirmaOTP from './components/FirmaOTP.tsx';
import NewRequestWorkflow, { type Step as WorkflowStep } from './components/NewRequestWorkflow.tsx';
import BankCodes from './components/BankCodes.tsx';
import PendingDocumentation from './components/PendingDocumentation.tsx';
import ClientDocumentation from './components/ClientDocumentation.tsx';
import Chatbot from './components/Chatbot.tsx';
import ExternalServiceViewer from './components/ExternalServiceViewer.tsx';
import { FichaTramicar } from './components/FichaTramicar.tsx';
import InPersonDigitalSignature from './components/InPersonDigitalSignature.tsx';

export type View =
  | 'login'
  | 'dashboard'
  | 'simulator'
  | 'customerSupport'
  | 'fraudPrevention'
  | 'digitalSignature'
  | 'insuranceCoverage'
  | 'annualTraining'
  | 'commercialSupport'
  | 'requestProcessing'
  | 'facilitea'
  | 'sustainability'
  | 'aboutUs'
  | 'manageRequests'
  | 'trainingGroup'
  | 'premiumProgram'
  | 'messages'
  | 'packageDocumentation'
  | 'applicationStatus'
  | 'documentSubmission'
  | 'operationsManager'
  | 'adminPanel'
  | 'modificacionSolicitudes'
  | 'abonoSolicitudes'
  | 'firmaGestoria'
  | 'firmaNotaria'
  | 'utilidades'
  | 'operativaClienteCaixabank'
  | 'appFirmaDigital'
  | 'newRequestWorkflow'
  | 'bankCodes'
  | 'pendingDocumentation'
  | 'clientDocumentation'
  | 'externalViewer'
  | 'fichaTramicar'
  | 'firmaAppMovilPresencial';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface Toast {
  id: number;
  title: string;
  description: string;
}

export interface CookiePreferences {
  accepted: boolean;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

export interface ViewTitle {
    title: React.ReactNode | string;
    subtitle?: React.ReactNode | string;
}

export interface SavedOfferData {
    productType: string | null;
    clientType: string | null;
    vehicleCategory: string; // "Nuevo Turismo", "Seminuevo Turismo", etc.
    vehicleUse: string | null;
    registrationDate?: string; // "MM/YYYY"
    salePrice: number;
    downPayment: number;
    amountToFinance: number;
    term: number;
    interestRate: number;
    insuranceType: string;
    monthlyPayment: number;
    tae: number | null;
    openingFeeValue: number | null;
    openingFeeType: string;
    extendedWarranty?: number; // New field for Extended Warranty
}

export type UserRole = 'normal' | 'admin' | 'tramicar';


const viewTitles: Record<View, ViewTitle> = {
  dashboard: { title: 'Inicio' },
  simulator: { title: 'Oferta Financiera Cliente', subtitle: 'Ofertas Financieras y Cuadros de Amortización para tus Clientes' },
  customerSupport: { title: 'Consultas de Tus Clientes', subtitle: 'Contacto Cliente con CaixaBank P&C' },
  fraudPrevention: { title: 'Prevención del Fraude', subtitle: 'Consejos para una venta segura.' },
  digitalSignature: { title: 'Firma de Contratos', subtitle: 'Guías Rápidas de Firma de Contratos Auto.' },
  insuranceCoverage: { title: 'Protección de Pagos', subtitle: 'Coberturas de los Seguros de Crédito Auto' },
  annualTraining: { title: 'Formación Anual de Seguros', subtitle: 'Formación Anual Obligatoria para Distribución de Seguros de Crédito' },
  commercialSupport: { title: 'Mis Gestiones' },
  requestProcessing: { title: '9. Datos de Solicitud', subtitle: 'Copia los datos de la solicitud y pégalos en la web de operaciones.' },
  facilitea: { title: <span className="notranslate">Facilitea</span>, subtitle: <><span className="notranslate">Facilitea</span> te acerca los mejores productos y servicios de manera sencilla para que tu vida sea más fácil.</> },
  sustainability: { title: 'Sostenibilidad', subtitle: 'Un Pilar Estratégico.' },
  aboutUs: { title: '¿Quiénes Somos?', subtitle: 'Nuestra visión disruptiva nos permite ofrecer nuevas metodologías de pago y soluciones financieras innovadoras, convirtiéndonos así en líderes del sector bancario.' },
  manageRequests: { title: 'Tramitar Nueva Solicitud', subtitle: 'Sube y analiza la documentación para tus solicitudes' },
  trainingGroup: { title: 'Formación' },
  clientDocumentation: { title: 'Documentación Cliente', subtitle: 'Documentación necesaria a aportar según el tipo de cliente.' },
  premiumProgram: { title: 'Premium Program', subtitle: 'Programa de incentivos al vendedor' },

  messages: { title: 'Mensajes', subtitle: 'Tus últimas notificaciones y avisos.' },
  packageDocumentation: {
      title: 'TramiCar',
      subtitle: 'El Asistente TramiCar, revisa la documentación aportada y pone a tu disposición los datos necesarios para la Tramitación de la Solicitud.'
  },
  applicationStatus: { title: 'Solicitudes en Estudio' },
  login: { title: 'Login' },
  documentSubmission: { title: 'Documentación Titular/es' },
  operationsManager: { title: 'Mi Gestor de Operaciones', subtitle: 'Gestiona la información de las solicitudes de tus clientes directamente desde tu smartphone.' },
  adminPanel: { title: 'Cuadro de Mandos', subtitle: 'Métricas y gestión de la aplicación' },
  modificacionSolicitudes: { title: 'Modificación de Solicitudes', subtitle: 'Tengo que Modificar una Solicitud' },
  abonoSolicitudes: { title: 'Abono de Solicitudes', subtitle: 'Pago de las Solicitudes Formalizadas.' },
  firmaGestoria: { title: 'Petición de Firma Gestoría' },
  firmaNotaria: { title: 'Petición de Firma Notaría' },
  utilidades: { title: 'Utilidades' },
  operativaClienteCaixabank: { title: 'Operativa Cliente CaixaBank', subtitle: 'Cuando tu cliente ya es cliente de CaixaBank.' },
  appFirmaDigital: { title: 'Firma OTP Auto (A Distancia)', subtitle: 'Proceso Web auto con firma digital por SMS' },
  newRequestWorkflow: { title: 'Tramitar Nueva Solicitud', subtitle: 'Sigue los pasos para completar una nueva operación' },
  bankCodes: { title: 'Códigos Bancarios', subtitle: 'Listado de entidades bancarias en España' },
  pendingDocumentation: { title: 'Documentación Pendiente', subtitle: 'Enviar Documentación Pendiente de Aportar' },
  externalViewer: { title: 'Visor Externo', subtitle: 'Visualizando plataforma externa' },
  fichaTramicar: { title: 'Ficha Tramicar', subtitle: 'Operaciones de Empresa y Leasing' },
  firmaAppMovilPresencial: { title: 'Firma APP Móvil Presencial', subtitle: 'Firma biométrica para operaciones presenciales' },
};

const ExitConfirmationModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in-up">
        <div className="bg-white rounded-none shadow-2xl w-full max-w-sm p-8 text-center relative border border-slate-200">
            <h2 className="text-xl font-bold text-black mb-4 uppercase tracking-widest">Cerrar Sesión</h2>
            <p className="text-slate-600 mb-8 font-medium">Se cerrará tu sesión actual.</p>
            <div className="flex gap-4">
                <button onClick={onCancel} className="flex-1 bg-black text-white font-bold py-3 px-6 rounded-none hover:bg-slate-800 transition-colors uppercase tracking-wider text-xs">No</button>
                <button onClick={onConfirm} className="flex-1 bg-slate-200 text-black font-bold py-3 px-6 rounded-none hover:bg-slate-300 transition-colors uppercase tracking-wider text-xs">Sí</button>
            </div>
        </div>
    </div>
);




const Toast: React.FC<{ toast: Toast; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm border animate-fade-in-right">
      <style>{`
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right { animation: fade-in-right 0.5s ease-out forwards; }
      `}</style>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 bg-caixa-blue text-white rounded-full flex items-center justify-center mt-1">
            <CheckIcon className="w-4 h-4" />
        </div>
        <div className="flex-grow">
            <p className="font-bold text-slate-800">{toast.title}</p>
            <p className="text-sm text-slate-600 mt-1">{toast.description}</p>
        </div>
        <button onClick={() => onDismiss(toast.id)} className="p-1 text-slate-400 hover:text-slate-600 rounded-none">
            <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-24 right-4 z-[60] space-y-3 md:bottom-6 print-hide">
    {toasts.map(toast => (
      <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
  </div>
);

const AppContent: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('userId');
        }
        return null;
    });
    
    const [userRole, setUserRole] = useState<UserRole | null>(() => {
        if (typeof window !== 'undefined') {
            return (sessionStorage.getItem('userRole') as UserRole) || null;
        }
        return null;
    });

    const [viewHistory, setViewHistory] = useState<View[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = sessionStorage.getItem('viewHistory');
            try {
                return saved ? JSON.parse(saved) : ['login'];
            } catch (e) {
                return ['login'];
            }
        }
        return ['login'];
    });
    
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // Auth and View Persistence hooks
    useEffect(() => {
        if (userId) sessionStorage.setItem('userId', userId);
        else sessionStorage.removeItem('userId');
    }, [userId]);

    useEffect(() => {
        if (userRole) sessionStorage.setItem('userRole', userRole);
        else sessionStorage.removeItem('userRole');
    }, [userRole]);

    useEffect(() => {
        sessionStorage.setItem('viewHistory', JSON.stringify(viewHistory));
    }, [viewHistory]);

    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

    // State for direct access to documentation components (e.g., for Tramicar role)
    const [simulatorState, setSimulatorState] = useState<any | null>(null);

    const [toasts, setToasts] = useState<Toast[]>([]);
    
    // Centralized state for the NewRequestWorkflow
    const [currentOfferData, setCurrentOfferData] = useState<SavedOfferData | null>(null);
    const [currentAnalysisFiles, setCurrentAnalysisFiles] = useState<File[]>([]);
    const [currentAnalysisResult, setCurrentAnalysisResult] = useState<AnalysisResult | null>(null);
    const [workflowStartStep, setWorkflowStartStep] = useState<WorkflowStep | undefined>(undefined);
    
    const [externalViewerData, setExternalViewerData] = useState<{ url: string, title: string } | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const { showNotification } = useNotification();
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const currentView = viewHistory[viewHistory.length - 1];
    const currentTitleData = viewTitles[currentView] || { title: 'Quoter' };
    const currentTitle = currentView === 'externalViewer' && externalViewerData ? externalViewerData.title : currentTitleData.title;
    const currentSubtitle = currentView === 'externalViewer' && externalViewerData ? 'Plataforma externa' : currentTitleData.subtitle;
    
    // Load simulator state from session storage on initial mount
    useEffect(() => {
        try {
            const savedState = sessionStorage.getItem('simulatorState');
            if (savedState) {
                setSimulatorState(JSON.parse(savedState));
            }
        } catch (e) {
            console.error("Could not load simulator state from sessionStorage", e);
        }
    }, []);

    // Save simulator state to session storage whenever it changes
    useEffect(() => {
        try {
            if (simulatorState) {
                sessionStorage.setItem('simulatorState', JSON.stringify(simulatorState));
            } else {
                sessionStorage.removeItem('simulatorState');
            }
        } catch (e) {
            console.error("Could not save simulator state to sessionStorage", e);
        }
    }, [simulatorState]);

    const resetSimulator = () => {
        setSimulatorState(null);
    };

    // Capture PWA install prompt event
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            console.log('beforeinstallprompt event fired');
            setInstallPrompt(e);
            
            // Auto-fallback: If logged in, show UI after short delay
            if (userId && !sessionStorage.getItem('installPromptDismissed')) {
                setTimeout(() => setShowInstallModal(true), 2500);
            }
        };
        
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        // Service Worker Update Detection
        if ('serviceWorker' in navigator) {
            // Check for updates on load
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available
                                    setIsUpdateAvailable(true);
                                    showToast('Nueva versión disponible', 'La aplicación se actualizará automáticamente.');
                                    setTimeout(() => window.location.reload(), 2000);
                                }
                            });
                        }
                    });
                }
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });

            // Check for updates periodically
            const interval = setInterval(() => {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) reg.update();
                });
            }, 1000 * 60 * 15);

            return () => {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
                clearInterval(interval);
            };
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [userId]);

    // Additional periodic check / forced check for iOS and standalone detection
    useEffect(() => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        const installPromptDismissed = sessionStorage.getItem('installPromptDismissed');
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

        if (userId && !installPromptDismissed) {
            const timer = setTimeout(() => {
                // For iOS Safari, or if we successfully caught the event (like Chrome PC/Android)
                if (installPrompt || (isIOS && isSafari)) {
                    setShowInstallModal(true);
                // Fallback for Chrome PC if event was missed but not dismissed
                } else if (!installPrompt && isChrome) {
                    // Try to show modal natively if we can
                    setShowInstallModal(true);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [userId, installPrompt]);

    const handleInstallApp = async () => {
        setShowInstallModal(false);
        sessionStorage.setItem('installPromptDismissed', 'true');
        if (!installPrompt) {
            console.warn('No native install prompt stored');
            return;
        }
        try {
            (installPrompt as any).prompt();
            const { outcome } = await (installPrompt as any).userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            if (outcome === 'accepted') {
                setInstallPrompt(null);
            }
        } catch (e) {
            console.error('Prompt failed', e);
        }
    };

    const handleCancelInstall = () => {
        setShowInstallModal(false);
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    // Auto-logout on inactivity
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const lastActivityTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!userId) return; // Only track if logged in

        const resetTimer = () => {
            lastActivityTimeRef.current = Date.now();
        };

        resetTimer(); // Call immediately on login to refresh the timer

        // Listen to various user interactions
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        const checkInactivity = setInterval(() => {
            if (Date.now() - lastActivityTimeRef.current > INACTIVITY_TIMEOUT_MS) {
                console.log('User inactive for 15 minutes, logging out.');
                handleLogout(); // Log out
                showToast('Sesión Inactiva', 'Has superado el tiempo máximo de inactividad, por tu seguridad vuelve a introducir tu código CA');
            }
        }, 60000); // Check every minute

        const handleVisibilityChange = () => {
            // When user returns to tab, if more than 15 mins passed, they will still get logged out by the interval or we can check immediately
            if (document.visibilityState === 'visible') {
                if (Date.now() - lastActivityTimeRef.current > INACTIVITY_TIMEOUT_MS) {
                     handleLogout();
                     showToast('Sesión Inactiva', 'Has superado el tiempo máximo de inactividad, por tu seguridad vuelve a introducir tu código CA');
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimer));
            clearInterval(checkInactivity);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [userId]);

    // Auto-login effect
    useEffect(() => {
        // const rememberedUserId = localStorage.getItem('remembered_user');
        // const rememberedUserRole = localStorage.getItem('remembered_user_role') as UserRole | null;
        // if (rememberedUserId && rememberedUserRole) {
        //     setUserId(rememberedUserId);
        //     setUserRole(rememberedUserRole);
        //     const initialView: View = rememberedUserRole === 'tramicar' ? 'newRequestWorkflow' : 'dashboard';
        //     setViewHistory([initialView]);
        // }
    }, []);


    // For persistent notifications that increment the bell counter (admin only)
    const addNotification = useCallback((title: string, description: string) => {
        const newNotification: Notification = {
            id: new Date().toISOString(),
            title,
            description,
            timestamp: new Date().toLocaleString('es-ES'),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    // For temporary on-screen toasts (desktop)
    const showToast = useCallback((title: string, description: string) => {
        const newToast: Toast = {
            id: Date.now(),
            title,
            description,
        };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const dismissToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };


    useEffect(() => {
        if (userRole === 'admin') {
            addNotification('Bienvenido, Pablo', 'Tu panel de administrador está listo.');
        } else if (userId) {
            let welcomeTitle = 'Bienvenida';
            showNotification(welcomeTitle, { body: 'Quoter Assistant está a tu disposición para ayudarte.' });
        }
    }, [addNotification, showNotification, userId, userRole]);


    const handleLogin = (id: string, rememberMe: boolean) => {
        setToasts([]); // Wipe toasts from potential previous logout
        
        let role: UserRole = 'normal';
        let initialView: View = 'dashboard';

        if (id.toLowerCase() === 'quoter.cpc@gmail.com') {
            role = 'admin';
        } else if (id.toLowerCase() === 'tramicar') {
            role = 'tramicar';
            initialView = 'newRequestWorkflow';
        }

        setUserId(id);
        setUserRole(role);
        setViewHistory([initialView]);

        if (rememberMe) {
            localStorage.setItem('remembered_user', id);
            localStorage.setItem('remembered_user_role', role);
        } else {
            localStorage.removeItem('remembered_user');
            localStorage.removeItem('remembered_user_role');
        }
    };
    
    
    const handleContinueToWorkflow = (data: SavedOfferData) => {
        setCurrentOfferData(data);
        // Directly navigate to workflow's documentation guide step
        setWorkflowStartStep('documentation_guide');
        setViewHistory(prev => [...prev, 'newRequestWorkflow']);
    };

    const handleLogout = () => {
        setUserId(null);
        setUserRole(null);
        setViewHistory(['login']);
        // Clear session-specific and persistent data
        sessionStorage.removeItem('simulatorState');
        setSimulatorState(null);
        localStorage.removeItem('remembered_user');
        localStorage.removeItem('remembered_user_role');
        
        // Clear workflow state on logout
        setCurrentOfferData(null);
        setCurrentAnalysisFiles([]);
        setCurrentAnalysisResult(null);
    };

    const requestLogout = () => {
        setShowExitConfirm(true);
    };

    const handleNavigate = (view: View, data?: any) => {
        const mainEl = document.getElementById('main-scroll-container');
        if (mainEl) mainEl.scrollTop = 0;
        
        if (view === 'externalViewer' && data) {
            setExternalViewerData(data);
        }

        // 1. Reset Simulator Logic
        if (view === 'simulator') {
            setSimulatorState(null);
            sessionStorage.removeItem('simulatorState');
        }

        // 2. Reset Workflow Logic (Dashboard Click)
        if (view === 'newRequestWorkflow') {
            // Force reset of all workflow data to ensure "Start from 0"
            setCurrentOfferData(null);
            setCurrentAnalysisFiles([]);
            setCurrentAnalysisResult(null);
            setWorkflowStartStep('offer');
        }

        // 3. Cleanup logic when LEAVING workflow
        if (view !== 'newRequestWorkflow') {
            setCurrentOfferData(null);
            setCurrentAnalysisFiles([]);
            setCurrentAnalysisResult(null);
            setWorkflowStartStep(undefined);
        }

        setViewHistory(prev => [...prev, view]);
    };
    
    const handleGoBack = () => {
        if (viewHistory.length > 1) {
            setViewHistory(prev => prev.slice(0, -1));
        }
    };

    // Pull-to-refresh handler for PWA
    useEffect(() => {
        if (!userId || !('ontouchstart' in window)) return;

        const mainEl = document.getElementById('main-scroll-container');
        if (!mainEl) return;

        let startY = 0;
        let isPulling = false;

        const handleTouchStart = (e: TouchEvent) => {
            if (mainEl.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            } else {
                isPulling = false;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling) return;
            const currentY = e.touches[0].clientY;
            const diffY = currentY - startY;

            if (diffY > 100) { // Trigger threshold
                e.preventDefault();
                requestLogout();
                isPulling = false;
            }
        };

        mainEl.addEventListener('touchstart', handleTouchStart);
        mainEl.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            mainEl.removeEventListener('touchstart', handleTouchStart);
            mainEl.removeEventListener('touchmove', handleTouchMove);
        };
    }, [userId]);

    const handleConfirmExit = () => {
        setShowExitConfirm(false);
        handleLogout();
    };
    
    const handleCancelExit = () => {
        setShowExitConfirm(false);
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onNavigate={handleNavigate} userId={userId} />;
            case 'simulator':
                return <Simulator 
                    key={`simulator-${viewHistory.length}`} // Force remount on navigation
                    mode="offer" 
                    onNavigate={handleNavigate} 
                    onSaveOffer={() => {}} 
                    onContinueToWorkflow={handleContinueToWorkflow} 
                    currentState={simulatorState} 
                    onStateChange={setSimulatorState} 
                    onReset={resetSimulator} 
                    onShowSystemMessage={showNotification} 
                    onShowToast={showToast} 
                    userEmail={userId}
                />;
            case 'customerSupport':
                return <CustomerSupport />;
            case 'fraudPrevention':
                return <FraudPrevention />;
            case 'digitalSignature':
                return <DigitalSignature onNavigate={handleNavigate} />;
            case 'insuranceCoverage':
                return <InsuranceCoverage />;
            case 'annualTraining':
                return <AnnualTraining onNavigate={handleNavigate} />;
            case 'commercialSupport':
                return <CommercialSupport onNavigate={handleNavigate} userId={userId} />;
            case 'requestProcessing':
                return <RequestProcessing savedOfferData={currentOfferData} analysisResult={currentAnalysisResult} files={currentAnalysisFiles} onNavigate={handleNavigate} onRestart={() => handleNavigate('newRequestWorkflow')} onBack={() => {}} />;
            case 'facilitea':
                return <Facilitea />;
            case 'sustainability':
                return <Sustainability />;
            case 'aboutUs':
                return <AboutUs />;
            case 'manageRequests':
                return <ManageRequests onNavigate={handleNavigate} />;
            case 'trainingGroup':
                return <TrainingGroup onNavigate={handleNavigate} />;
            case 'premiumProgram':
                return <PremiumProgram />;

            case 'messages':
                return <Messages notifications={notifications} />;
            case 'packageDocumentation':
                return <PackageDocumentation savedOfferData={currentOfferData} onNavigate={handleNavigate} setFiles={setCurrentAnalysisFiles} setAnalysisResult={setCurrentAnalysisResult} userRole={userRole} />;
            case 'applicationStatus':
                return <ApplicationStatus onNavigate={handleNavigate} />;
            case 'documentSubmission':
                return <DocumentSubmission />;
            case 'operationsManager':
                return <OperationsManager />;
            case 'adminPanel':
                return <AdminPanel onSendAdminNotification={addNotification} />;
            case 'modificacionSolicitudes':
                return <ModificacionSolicitudes onNavigate={handleNavigate} />;
            case 'abonoSolicitudes':
                return <AbonoSolicitudes onNavigate={handleNavigate} />;
            case 'firmaGestoria':
                return <FirmaGestoria onNavigate={handleNavigate} />;
            case 'firmaNotaria':
                return <FirmaNotaria onNavigate={handleNavigate} />;
            case 'utilidades':
                return <Utilidades onNavigate={handleNavigate} />;
            case 'operativaClienteCaixabank':
                return <CaixabankClientOperations onNavigate={handleNavigate} />;
            case 'appFirmaDigital':
                return <FirmaOTP />;
            case 'firmaAppMovilPresencial':
                return <InPersonDigitalSignature />;
            case 'newRequestWorkflow':
                const determinedStartStep = userRole === 'tramicar' ? 'documents' : workflowStartStep;
                return <NewRequestWorkflow 
                            key={`workflow-${viewHistory.length}`} // Force remount on navigation
                            onNavigate={handleNavigate} 
                            startStep={determinedStartStep}
                            offerData={currentOfferData}
                            setOfferData={setCurrentOfferData}
                            analysisFiles={currentAnalysisFiles}
                            setAnalysisFiles={setCurrentAnalysisFiles}
                            analysisResult={currentAnalysisResult}
                            setAnalysisResult={setCurrentAnalysisResult}
                            userId={userId}
                        />;
            case 'bankCodes':
                return <BankCodes />;
            case 'pendingDocumentation':
                return <PendingDocumentation />;
            case 'clientDocumentation':
                return <ClientDocumentation />;
            case 'externalViewer':
                return externalViewerData ? (
                    <ExternalServiceViewer url={externalViewerData.url} />
                ) : (
                    <Dashboard onNavigate={handleNavigate} userId={userId} />
                );
            case 'fichaTramicar':
                return <FichaTramicar />;
            default:
                return <Dashboard onNavigate={handleNavigate} userId={userId} />;
        }
    };
    
    if (!userId) {
        return <Login onLogin={handleLogin} />;
    }

    const isIosSafari = (() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return isIOS && isSafari;
    })();

    return (
        <>
            <MainLayout
                title={currentTitle}
                subtitle={currentSubtitle}
                onNavigate={handleNavigate}
                currentView={currentView}
                handleGoBack={handleGoBack}
                unreadCount={unreadCount}
                userId={userId}
                userRole={userRole}
                onLogout={requestLogout}
                onOpenChat={() => setIsChatOpen(true)}
                onInstallApp={() => setShowInstallModal(true)}
                isInstallable={!!installPrompt || isIosSafari}
            >
                {renderView()}
            </MainLayout>
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            {showExitConfirm && <ExitConfirmationModal onConfirm={handleConfirmExit} onCancel={handleCancelExit} />}
            
            {showInstallModal && (
                <PwaInstallPrompt
                    onInstall={handleInstallApp}
                    onCancel={handleCancelInstall}
                    isIos={isIosSafari}
                />
            )}

            {isChatOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white w-full max-w-lg h-[80vh] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
                   <button onClick={() => setIsChatOpen(false)} className="absolute top-4 right-4 z-10 p-2 bg-slate-100 rounded-none hover:bg-slate-200"><XIcon className="w-5 h-5"/></button>
                   <Chatbot onNavigate={(view) => { setIsChatOpen(false); handleNavigate(view); }} />
                </div>
              </div>
            )}
        </>
    );
}

class ErrorBoundary extends React.Component<any, any> {
    state = { hasError: false, error: null as Error | null };

    constructor(props: any) {
        super(props);
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h1 style={{ color: 'red' }}>Algo ha fallado (Rate Exceeded / Crash)</h1>
                    <pre style={{ background: '#eee', padding: '10px' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px', marginTop: '10px' }}>
                        Recargar
                    </button>
                </div>
            );
        }
        return (this as any).props.children;
    }
}

const App: React.FC = () => (
    <ErrorBoundary>
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    </ErrorBoundary>
);

export default App;
