import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import ClientLogin from './ClientLogin.jsx'
import ClientView from './ClientView.jsx'
import SeedPage from './SeedPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/cm" element={<App />} />
        <Route path="/seed" element={<SeedPage />} />
        <Route path="/cliente/:clientId" element={<ClientLogin />} />
        <Route path="/cliente/:clientId/ver" element={<ClientView />} />
        <Route path="*" element={<Navigate to="/cm" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
