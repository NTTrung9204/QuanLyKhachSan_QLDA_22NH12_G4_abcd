import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './App.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider style={{ width: '100vw', height: '100vh' }}>
      <Router style={{ width: '100vw', height: '100vh' }}>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
