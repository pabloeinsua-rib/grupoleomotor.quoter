import React from 'react';

interface FloatingMessageProps {
  isVisible: boolean;
  icon?: React.ReactElement;
  title: string;
  message: string;
  primaryActionText: string;
  onPrimaryAction: () => void;
  secondaryActionText: string;
  onSecondaryAction: () => void;
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({
  isVisible,
  icon,
  title,
  message,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl p-6 z-50 animate-fade-in-up print-hide">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
      `}</style>
      
      <div className="flex items-start gap-4">
        {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onSecondaryAction}
          className="text-sm font-bold bg-slate-200 text-slate-800 py-2 px-4 rounded-none hover:bg-slate-300 transition-colors"
        >
          {secondaryActionText}
        </button>
        <button
          onClick={onPrimaryAction}
          className="text-sm font-bold text-white bg-caixa-blue py-2 px-4 rounded-none hover:bg-caixa-blue-light transition-colors"
        >
          {primaryActionText}
        </button>
      </div>
    </div>
  );
};

export default FloatingMessage;