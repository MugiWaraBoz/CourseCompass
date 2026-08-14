// This is the starting point of the React frontend.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'

// React places the complete App component inside the root element in index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* One provider keeps authentication state consistent across every route. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
