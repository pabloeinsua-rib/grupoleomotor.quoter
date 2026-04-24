import React from 'react';
import { ArrowLeftIcon } from './Icons.tsx';

interface PageHeaderProps {
  title: React.ReactNode | string | string[];
  subtitle?: React.ReactNode | string;
  descriptiveText?: string;
  showBackButton: boolean;
  onGoBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, descriptiveText, showBackButton, onGoBack }) => {
  
  const mainTitle = (Array.isArray(title) ? title.join(' ') : title) || '';

  return (
    <div className="py-2 flex flex-col items-center justify-center text-center relative w-full mb-4 md:mb-6">
      {showBackButton && (
        <button
          onClick={onGoBack}
          className="absolute left-0 top-0 flex-shrink-0 bg-white border border-slate-200 rounded-none w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-slate-50 transition-colors mt-1"
          aria-label="Volver"
        >
          <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-black" />
        </button>
      )}
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-10 md:px-0">
        <h1 className="text-lg md:text-4xl font-montserrat font-light text-black tracking-[0.1em] md:tracking-[0.2em] uppercase leading-tight">
          {mainTitle}
        </h1>
        {subtitle && <h2 className="text-[10px] md:text-base font-montserrat font-light tracking-widest text-slate-500 mt-2 md:mt-4 animate-fade-in-up uppercase leading-relaxed">{subtitle}</h2>}
        {descriptiveText && <p className="text-[10px] md:text-sm font-normal text-slate-500 mt-1 md:mt-2 max-w-2xl animate-fade-in-up">{descriptiveText}</p>}
      </div>
    </div>
  );
};

export default PageHeader;