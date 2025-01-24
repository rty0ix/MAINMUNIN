import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const BPOALogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const navigate = useNavigate();
  const { setUser, users } = useAuthStore();

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin credentials
    if (username === '1293' && password === 'Tyo1293!') {
      setUser({ username, isAdmin: true, approved: true });
      localStorage.setItem('bpoa_auth', 'true');
      navigate('/bpoa');
      return;
    }

    // Regular user login
    const user = users.find(u => u.username === username);
    if (user && user.approved) {
      setUser(user);
      localStorage.setItem('bpoa_auth', 'true');
      navigate('/bpoa');
    } else if (user && !user.approved) {
      setError('Your account is pending approval');
    } else {
      setError('Invalid credentials');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 2.5,
        staggerChildren: 0.5,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.3, 0.8],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <motion.button
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
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
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            {/* Animated glow effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-purple-500/20 rounded-lg blur-3xl"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
              animate={{ 
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative">
              {logoUrl && (
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{
                    duration: 2.2,
                    ease: "easeOut",
                    delay: 0.4
                  }}
                >
                  <img
                    src={logoUrl}
                    alt="BPOA Logo"
                    className="h-24 w-auto"
                  />
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm mb-6"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-700"
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
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-700"
                    required
                  />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition-all duration-700"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 30px rgba(255,255,255,0.3)"
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign in
                </motion.button>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-sm text-white/50"
                >
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/bpoa-register')}
                    className="text-white hover:text-white/80 transition-colors duration-300"
                  >
                    Register
                  </button>
                </motion.p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};