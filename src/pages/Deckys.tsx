import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const Deckys = () => {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('deckys-logo1.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </motion.button>

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-64 h-64 mb-8"
            >
              <img
                src={logoUrl}
                alt="Decky's Logo"
                className="w-full h-full object-contain"
              />
              <motion.div
                className="absolute inset-0"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Construction className="w-8 h-8 text-yellow-500" />
              <h1 className="text-4xl font-bold font-montserrat">Under Construction</h1>
              <Construction className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-roboto">
              We're working hard to bring you something amazing. Decky's is being built
              with cutting-edge technology and innovative features that will revolutionize
              deployment automation.
            </p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};