import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Snackbar } from '@mui/material';

// We just handle the redirect logic here.
// The "Friendly message" could be handled by passing state to the redirect, 
// and the AuthPage displaying it.
// OR we can flash a snackbar here before redirecting? No, that's messy.
// We'll pass state.

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace state={{ from: location, message: "Please log in to access this feature." }} />;
    }

    return children;
};

export default ProtectedRoute;
