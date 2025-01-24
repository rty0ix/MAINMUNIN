import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'RTYO', path: '/' },
    { name: 'Test Deployment', path: '/test-deployment', className: 'text-red-500' },
    { name: 'MUNiN', path: '/munin' },
    { name: 'Guardian Network', path: '/guardian-network' },
    { name: "Decky's", path: '/deckys' },
    { name: 'TTM', path: '/ttm' },
    { name: 'Cerbo', path: '/cerbo' },
    { name: 'LLM', path: '/llm' },
    { name: 'KCDA SCI', path: '/login' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-black/90 backdrop-blur-sm z-50"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white font-proxima">
            RTYO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.slice(1).map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`transition-colors duration-200 font-proxima ${
                  item.className || 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pt-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`transition-colors duration-200 text-left font-proxima ${
                    item.className || 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};