import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export const AnimatedBackground = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data: { publicUrl }, error } = supabase
          .storage
          .from('assets')
          .getPublicUrl('munin-logo.png');
          
        if (error) throw error;
        setLogoUrl(publicUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {logoUrl && (
        <motion.img
          src={logoUrl}
          alt="MUNiN Background"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: [1.1, 1.15, 1.1],
            opacity: [0.25, 0.3, 0.25]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      <div className="absolute inset-0 bg-blue-900/25 mix-blend-overlay" />
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500/10 rounded-full blur-xl"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: Math.random() * 2 + 1,
            }}
            animate={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              scale: Math.random() * 2 + 1,
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
    </div>
  );
};