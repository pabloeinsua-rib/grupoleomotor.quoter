import React from 'react';

interface LogoProps {
  className?: string;
  color?: 'solid-blue' | 'white' | 'black'; // Added 'black'
}

const Logo: React.FC<LogoProps> = ({ className, color = 'solid-blue' }) => {
  if (color === 'white') {
    // Stroked white logo for use on dark backgrounds
    return (
      <svg
        className={className}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Quoter Logo"
      >
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="16" cy="16" r="14" />
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="4" />
        </g>
      </svg>
    );
  }

  if (color === 'black') {
    // Stroked black logo
    return (
      <svg
        className={className}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Quoter Logo"
      >
        <g fill="none" stroke="#000000" strokeWidth="2.5">
          <circle cx="16" cy="16" r="14" />
          <circle cx="16" cy="16" r="9" />
          <circle cx="16" cy="16" r="4" />
        </g>
      </svg>
    );
  }

  // Default: solid blue background with white target
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Quoter Logo"
    >
      <circle cx="16" cy="16" r="16" fill="#00a1e0" />
      <g fill="none" stroke="white" strokeWidth="2">
        <circle cx="16" cy="16" r="13" />
        <circle cx="16" cy="16" r="8" />
        <circle cx="16" cy="16" r="3" />
      </g>
    </svg>
  );
};

export default Logo;