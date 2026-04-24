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

  // Default: solid blue version (now using the new high-res icon)
  return (
    <img 
      src="https://tdggghoxqrsekjqjhqit.supabase.co/storage/v1/object/sign/QUOTER%20CPC/ICON%20FOLDER%20COCHE/icon-512x512.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MDg0MDVhOS03NTAyLTRmODEtYWNiMS1lYzIxNWViZDBlNmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJRVU9URVIgQ1BDL0lDT05gRk9MREVSIENPQ0hFL2ljb24tNTEyeDUxMi5wbmciLCJpYXQiOjE3NzcwNTE4ODgsImV4cCI6MjY0MDk2NTQ4OH0.TgtTeCi7eLg44Q_nP2b-10RmTJbafPpz8xCtsd-44vc" 
      alt="Quoter Logo" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default Logo;