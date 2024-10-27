import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Named import

const PrivateRoute = ({ requiredRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // console.log("token Not get")
        return <Navigate to="/login" />;
    }

    try {
        
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken.role)
        const userRole = decodedToken.role;

        if (userRole !== requiredRole) {
            // console.log('You do not have permission to access this page.');
            return <Navigate to="/login" />;
        }

        return <Outlet />; // Render the nested route

    } catch (error) {
        // console.log('Invalid token.');
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;




