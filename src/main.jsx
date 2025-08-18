import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ClienteProvider } from './context/ClienteContext'; // Asegúrate de que la ruta sea correcta

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClienteProvider>
        <App />
      </ClienteProvider>
    </BrowserRouter>
  </React.StrictMode>
);
