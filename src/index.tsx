import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
