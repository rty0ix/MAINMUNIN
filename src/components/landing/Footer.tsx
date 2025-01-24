import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold">
              MUNiN
            </Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} MUNiN. All rights reserved.
        </div>
      </div>
    </footer>
  );
};