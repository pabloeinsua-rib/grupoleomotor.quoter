import React, { useEffect, useRef } from 'react';
import type { IconProps } from './Icons.tsx';

interface NavigationCardProps {
  title: React.ReactNode | string;
  description: React.ReactNode | string;
  imageUrl?: string;
  videoUrl?: string;
  icon?: React.ReactElement<IconProps>;
  onClick?: () => void;
  imageClassName?: string;
  videoAutoPlay?: boolean;
  videoPlaybackRate?: number;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
    title, 
    description, 
    imageUrl, 
    videoUrl, 
    icon, 
    onClick, 
    imageClassName, 
    videoAutoPlay, 
    videoPlaybackRate, 
    containerClassName,
    titleClassName,
    descriptionClassName
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && videoPlaybackRate) {
      videoRef.current.playbackRate = videoPlaybackRate;
    }
  }, [videoPlaybackRate]);

  const Tag = onClick ? 'button' : 'div';

  // Minimalist light theme defaults
  const finalTitleClass = titleClassName || "text-lg font-bold text-slate-800 tracking-tight leading-tight";
  const finalDescClass = descriptionClassName || "text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1";

  return (
    <Tag
      onClick={onClick}
      className={`
        group relative w-full overflow-hidden text-left bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md
        transition-all duration-300 ease-out grayscale hover:grayscale-0
        focus:outline-none focus:ring-0
        ${containerClassName || 'h-64'}
      `}
      aria-label={title}
    >
      <div className="flex flex-col h-full z-10 relative">
          <div className="p-6 min-h-[6rem] flex flex-col justify-center">
            {icon && (
               <div className="mb-3 text-slate-700 bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center">
                  {React.cloneElement(icon, { className: 'w-5 h-5' })}
               </div>
            )}
            <h4 className={finalTitleClass}>{title}</h4>
            <div className={finalDescClass}>
              {description.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </div>
          </div>
          
          <div className="flex-grow relative bg-slate-50 border-t border-slate-100 flex items-center justify-center overflow-hidden">
            {videoUrl ? (
                <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 ${imageClassName || ''}`}
                autoPlay={videoAutoPlay}
                loop={videoAutoPlay}
                muted
                playsInline
                preload="metadata"
                />
            ) : imageUrl ? (
                 <img
                    src={imageUrl}
                    alt={title as string}
                    className={`w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 ${imageClassName || ''}`}
                />
            ) : (
                <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center relative">
                   {icon ? (
                      <div className="opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 scale-[4] sm:scale-[5]">
                         {React.cloneElement(icon, { strokeWidth: 1 })}
                      </div>
                   ) : (
                      <div className="w-full h-full bg-slate-100/50 flex flex-col items-center justify-center">
                      </div>
                   )}
                </div>
            )}
          </div>
      </div>
    </Tag>
  );
};

export default NavigationCard;