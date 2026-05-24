import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// function isValidUrl(url: string) {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// }
