import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy'}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" toastOptions={{
            className: 'bg-bg-surface text-text-base border border-border-base',
            style: {
              background: 'var(--bg-surface)',
              color: 'var(--text-base)',
              border: '1px solid var(--border-base)'
            }
          }} />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
