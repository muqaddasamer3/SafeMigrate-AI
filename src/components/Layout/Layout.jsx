import React from 'react';
import LanguageToggle from '../UI/LanguageToggle';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Fixed Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      {children}
    </div>
  );
};

export default Layout;