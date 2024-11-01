import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // Import Tailwind CSS
import AppWithRouter from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
