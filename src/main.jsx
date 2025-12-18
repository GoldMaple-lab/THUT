// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx' // <--- Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary> {/* <--- ครอบไว้ตรงนี้ */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)