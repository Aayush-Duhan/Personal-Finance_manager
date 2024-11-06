import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWithRouter from './App';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const [localRedirectSignIn, productionRedirectSignIn] = awsconfig.oauth.redirectSignIn.split(',');
const [localRedirectSignOut, productionRedirectSignOut] = awsconfig.oauth.redirectSignOut.split(',');

const updatedAwsConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut
  }
};

Amplify.configure(updatedAwsConfig);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
