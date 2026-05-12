import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FontProvider } from './context/FontContext';
import { NotesProvider } from './context/NotesContext';
import App from './App';
import './styles/variables.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FontProvider>
          <NotesProvider>
            <App />
          </NotesProvider>
        </FontProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
