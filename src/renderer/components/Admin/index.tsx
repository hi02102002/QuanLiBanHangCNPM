import React from 'react';
import { Navigate } from 'react-router-dom';
import { authSelector } from 'renderer/features/auth/selector';
import { useAppSelector } from 'renderer/hooks';
import { Role } from 'renderer/shared/types';

const Admin: React.FC = ({ children }) => {
  const { user } = useAppSelector(authSelector);

  if (!(user?.roles[0].name === Role.ADMIN)) {
    return Navigate({ to: '/payment', replace: true });
  }

  return <>{children}</>;
};

export default Admin;
