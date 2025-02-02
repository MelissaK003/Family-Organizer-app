import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow mx-auto p-8 w-full items-center justify-center mt-10">
        <Outlet />
        <ToastContainer />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
