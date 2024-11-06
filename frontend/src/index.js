import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWithRouter from './App';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure({
  ...awsconfig,
  Auth: {
    region: awsconfig.aws_project_region,
    userPoolId: awsconfig.aws_user_pools_id,
    userPoolWebClientId: awsconfig.aws_user_pools_web_client_id,
    identityPoolId: awsconfig.aws_cognito_identity_pool_id,
    mandatorySignIn: true,
    oauth: awsconfig.oauth
  }
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
