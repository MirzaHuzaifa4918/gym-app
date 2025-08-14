import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Construct a full, absolute URL for the service worker script.
    // This is necessary to prevent cross-origin errors in sandboxed environments where
    // relative paths can be resolved against the wrong domain.
    const href = window.location.href;
    if (href && href.startsWith('http')) {
        const baseUrl = href.substring(0, href.lastIndexOf('/') + 1);
        const swUrl = `${baseUrl}sw.js`;
        
        navigator.serviceWorker.register(swUrl)
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
    } else {
         console.error('Service Worker registration failed: window.location.href is not a valid URL.');
    }
  });
}


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