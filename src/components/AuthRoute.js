import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthRoute = ({ element, ...rest }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return element;
};

export default AuthRoute;
