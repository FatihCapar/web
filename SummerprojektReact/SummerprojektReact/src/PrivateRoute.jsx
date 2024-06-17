import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from './UserContext';

const PrivateRoute = () => {
  const { currentUser } = useCurrentUser();
  
  return currentUser ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
