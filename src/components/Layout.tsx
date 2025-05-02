
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
