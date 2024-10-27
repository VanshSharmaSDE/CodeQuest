import React from 'react';
import './App.css';
import Home from './components/Pages/HomePage/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Pages/LoginPage/Login';
import T_D2 from './components/Dashboards/Teacher/T_D2';
import A_D1 from './components/Dashboards/Admin/A_D1';
import S_D3 from './components/Dashboards/Student/S_D3'
import PrivateRoute from './utilities/Private/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'remixicon/fonts/remixicon.css'



function App() {
  return (
    <>
      <ToastContainer></ToastContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<PrivateRoute requiredRole="admin" />}>
            <Route path="" element={<A_D1 />} />
          </Route>
          <Route path="/teacher-dashboard" element={<PrivateRoute requiredRole="teacher" />}>
            <Route path="" element={<T_D2 />} /> {/* Default component for /teacher-dashboard */}
          </Route>
          <Route path="/student-dashboard" element={<PrivateRoute requiredRole="student" />}>
            <Route path="" element={<S_D3 />} />
          </Route>
        </Routes>
      </Router>

    </>
  )
}

export default App