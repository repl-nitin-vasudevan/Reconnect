import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
// To permanently fix the network proxy issues causing "502 Bad Gateway" errors,
// we are now completely removing the Progressive Web App (PWA) functionality.
// The new '/sw.js' is a "suicide" worker that, once installed, will unregister
// itself and clear out any old, problematic versions from the user's browser.
// This registration code ensures every user gets the cleanup script.
// After one visit, the service worker will be gone permanently.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
            console.log('Cleanup Service Worker registered: ', registration);
        })
            .catch(registrationError => {
            console.log('Cleanup SW registration failed: ', registrationError);
        });
    });
}
