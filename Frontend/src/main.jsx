import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './variables.css'
import CompetitionContextProvider from './context/T_D2_CompetitionContext.jsx'
import { ToastContainer } from 'react-toastify'
import StudentCompetitionContextProvider from './context/S_D3_CompetitionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
        <CompetitionContextProvider>
            <StudentCompetitionContextProvider>
                <App />
                <ToastContainer position="top-center"></ToastContainer>
            </StudentCompetitionContextProvider>
        </CompetitionContextProvider>
)
