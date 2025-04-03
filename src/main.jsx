
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create root outside of render call
const root = createRoot(document.getElementById("root"));

// Render without StrictMode to avoid double-mounting effects
root.render(<App />);
