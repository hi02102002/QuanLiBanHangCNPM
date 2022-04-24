import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'renderer/hooks';
import { RootState } from 'renderer/store';

const RequireAuth: React.FC = ({ children }) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  if (!user?.accessToken) {
    return Navigate({ to: '/login', replace: true });
  }

  return <>{children}</>;
};

export default RequireAuth;
