import React from 'react';
import Header from '../Header';

const Layout = ({ children }) => {
  return (
    <div className="app-shell" data-easytag="id1-src/components/Layout/index.jsx">
      <Header />
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
