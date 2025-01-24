import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();
  const { users, addUser } = useAuthStore();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('63e768ddbc6a9a0a4f9c59a4_BPOA_logo.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (users.some(u => u.username === username)) {
      setError('Username already exists');
      return;
    }

    addUser({
      username,
      isAdmin: false,
      approved: false
    });

    alert('Registration successful! Please wait for administrator approval.');
    navigate('/bpoa-login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.5,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        onClick={() => navigate('/bpoa-login')}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Login</span>
      </motion.button>

      <div className="flex items-center justify-center min-h-screen p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div 
            className="bg-zinc-900 border border-white/10 rounded-lg p-8 relative overflow-hidden"
            variants={itemVariants}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative">
              {logoUrl && (
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  <img
                    src={logoUrl}
                    alt="BPOA Logo"
                    className="h-24 w-auto"
                  />
                </motion.div>
              )}

              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-center mb-6"
              >
                Create BPOA Account
              </motion.h2>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                    required
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};