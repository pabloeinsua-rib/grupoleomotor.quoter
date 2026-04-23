
import React from 'react';
// FIX: Added missing props (unreadCount, currentView, handleGoBack, onLogout) to the component signature and passed them down to the TopBar and Footer components as required, resolving several compilation errors.
import type { View } from '../App.tsx';
import Logo from './Logo.tsx';
// FIX: Added missing props (unreadCount, currentView, handleGoBack, onLogout) to the component signature and passed them down to the TopBar and Footer components as required, resolving several compilation errors.
import { ArrowLeftIcon } from './Icons.tsx';
import TopBar from './TopBar.tsx';
import PageHeader from './PageHeader.tsx';


interface ContractSigningProps {
  onNavigate: (view: View) => void;
  onOpenChat: () => void;
  // FIX: Added unreadCount to props to be passed to Footer.
  unreadCount: number;
  // FIX: Added missing props for TopBar.
  currentView: View;
  handleGoBack: () => void;
  onLogout: () => void;
}

const ContractSigning: React.FC<ContractSigningProps> = ({ onNavigate, onOpenChat, unreadCount, currentView, handleGoBack, onLogout }) => {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col">
      {/* FIX: Passed required props to TopBar component. */}
      <TopBar 
        onNavigate={onNavigate}
        unreadCount={unreadCount}
        currentView={currentView}
        handleGoBack={handleGoBack}
        onLogout={onLogout}
        onMobileMenuClick={() => {}}
        onOpenChat={onOpenChat}
      />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-100/80 backdrop-blur-sm border-b border-slate-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <PageHeader title="Firma de Contratos" showBackButton={false} onGoBack={() => {}} />
            </div>
        </header>
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
            <div className="flex flex-col gap-8">
                {/* Primera Fila: 2 Tarjetas Principales */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tarjeta 1: Firma OTP */}
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col hover:border-black hover:shadow-2xl transition-all duration-300">
                        <h3 className="font-bold text-xl text-black uppercase tracking-widest mb-6">FIRMA OTP</h3>
                        <div className="flex-grow space-y-4">
                            <p className="text-sm text-slate-500 leading-relaxed">Firma digital mediante código OTP enviado al teléfono móvil del cliente.</p>
                            <p className="text-sm text-slate-500 leading-relaxed">El cliente recibirá un SMS con un código de un solo uso para firmar el contrato de forma rápida y segura.</p>
                            <p className="text-xs font-bold text-black uppercase tracking-wider mt-4">No requiere instalación adicional.</p>
                        </div>
                    </div>

                    {/* Tarjeta 2: App Móvil */}
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col hover:border-black hover:shadow-2xl transition-all duration-300">
                        <h3 className="font-bold text-xl text-black uppercase tracking-widest mb-6">APP MÓVIL DIGITAL</h3>
                        <div className="flex-grow space-y-4">
                            <p className="text-sm text-slate-500 leading-relaxed">A través de la App FIRMA DIGITAL de operaciones. 1 sola firma en tu móvil.</p>
                            <p className="text-sm text-slate-500 leading-relaxed">Durante el proceso de firma a través de la APP, el cliente recibirá una copia del contrato por correo.</p>
                            <p className="text-xs font-bold text-black uppercase tracking-wider mt-4">Importes &gt; 30.000€ requieren inicio con 24h de antelación.</p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Descargar App</span>
                            <div className="flex gap-4">
                                <a href="https://apps.apple.com/es/app/app-captación-caixabank-pc/id6747573960" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-black hover:text-slate-500 transition-colors uppercase tracking-widest">Apple</a>
                                <a href="https://play.google.com/store/apps/details?id=com.caixabankpc.captacion.generica&hl=es" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-black hover:text-slate-500 transition-colors uppercase tracking-widest">Android</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segunda Fila: 3 Tarjetas Secundarias */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Tarjeta 3: Papel */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 flex flex-col hover:border-black hover:shadow-lg transition-all duration-300">
                        <h3 className="font-bold text-sm text-black uppercase tracking-widest mb-4">CONTRATOS EN PAPEL</h3>
                        <div className="flex-grow space-y-3">
                            <p className="text-xs text-slate-500 leading-relaxed">En el caso de Sociedades, o si tu cliente no dispone de correo electrónico, tendrás que firmar el contrato en papel.</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Puedes descargarte el contrato desde la web de operaciones o desde la APP "Mi Gestor". Imprimir 1 sola vez, a 1 sola cara.</p>
                            <p className="text-xs font-bold text-black mt-4">ENVIAR A: documentos.auto@caixabankpc.com</p>
                        </div>
                    </div>

                    {/* Tarjeta 4: Gestoría */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 flex flex-col hover:border-black hover:shadow-lg transition-all duration-300">
                        <h3 className="font-bold text-sm text-black uppercase tracking-widest mb-4">FIRMA A DISTANCIA</h3>
                        <div className="flex-grow space-y-3">
                            <p className="text-xs text-slate-500 leading-relaxed">Si tu cliente reside o trabaja en otra provincia, o a más de 55 Kms. de tu concesión, solicita firma en gestoría (gratuito).</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Comunícalo por email. Una gestoría contactará al cliente para agendar firma digital en tablet.</p>
                        </div>
                    </div>

                    {/* Tarjeta 5: Notaría */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 flex flex-col hover:border-black hover:shadow-lg transition-all duration-300">
                        <h3 className="font-bold text-sm text-black uppercase tracking-widest mb-4">FIRMA NOTARÍA</h3>
                        <div className="flex-grow space-y-3">
                            <p className="text-xs text-slate-500 leading-relaxed">Para solicitudes de particulares &ge; 40.000€ y de empresas &ge; 30.000€, firma ante Fedatario Público.</p>
                            <p className="text-xs text-slate-500 leading-relaxed">Comunica a tu gestor nombre, localidad del Notario, día y hora. El titular asume la minuta.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <button onClick={() => onNavigate('dashboard')} className="text-xs font-bold text-slate-400 hover:text-black uppercase tracking-widest transition-colors">
                    &larr; Volver al panel
                </button>
            </div>
        </div>
      </main>

    </div>
  );
};

export default ContractSigning;
