import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (num: number) => string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  target, 
  duration = 1500, 
  prefix = '', 
  suffix = '', 
  className,
  formatter
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Default formatter
  const defaultFormatter = (num: number): string => {
    if (Number.isInteger(target)) {
        return Math.round(num).toLocaleString('es-ES');
    }
    // Handle currency formatting specifically if needed
    if (prefix.includes('€') || suffix.includes('€')) {
        return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return parseFloat(num.toFixed(1)).toString().replace('.', ',');
  };
  
  const formatNumber = formatter || defaultFormatter;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = target;
    if (start === end) {
        setCurrentValue(end);
        return;
    };
    
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Ease-out function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + easedProgress * (end - start);
      
      setCurrentValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);
  
  // This effect resets the animation when the target number changes.
  useEffect(() => {
      setCurrentValue(0);
      setIsVisible(true); // Trigger animation immediately on change
  }, [target]);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(currentValue)}{suffix}
    </span>
  );
};

export default AnimatedNumber;
