import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWithRouter from './App';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';

// Basic Amplify configuration
Amplify.configure(config);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
