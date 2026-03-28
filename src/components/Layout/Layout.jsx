import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationToast from '../Dashboard/NotificationToast';

const Layout = () => {
  return (
    <div className="flex h-screen bg-lightPrimary dark:bg-darkPrimary overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-lightPrimary dark:bg-darkPrimary p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <NotificationToast />
    </div>
  );
};

export default Layout;
