import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { App } from './App';

// Import CSS Styles
import './styles/index.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/quiz.css';
import './styles/review.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
