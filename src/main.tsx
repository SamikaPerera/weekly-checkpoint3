/**
 * @file main.tsx
 * @description Entry point. Mounts the App component into #root.
 * @author Samika Perera
 * @date 3 November 2026
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
