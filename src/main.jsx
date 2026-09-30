import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Self-hosted type: Marcellus display + Outfit UI (no Google Fonts links).
import '@fontsource/marcellus';
import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
