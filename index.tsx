import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove the static splash screen after a 3 second delay to simulate loading
const splash = document.getElementById('splash-screen');
if (splash) {
    // Wait for the animation to finish (3s)
    setTimeout(() => {
        // Start fade out animation
        splash.classList.add('fade-out');
        // Remove from DOM after transition animation
        setTimeout(() => {
            splash.remove();
        }, 500); // Must match CSS transition duration
    }, 3000); 
}