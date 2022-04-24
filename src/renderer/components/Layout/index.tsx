import React from 'react';
import Sidebar from '../Sidebar';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
