import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TTM = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Eye, text: "Advanced Optical Processing" },
    { icon: Cpu, text: "Neural Enhancement" },
    { icon: Zap, text: "Quantum Integration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold font-montserrat mb-6">TTM</h1>
            <p className="text-2xl text-purple-300 mb-8">Tactical Targeting Matrix</p>
            <div className="bg-purple-900/30 p-6 rounded-lg backdrop-blur-sm max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="flex flex-col items-center p-4 bg-purple-800/20 rounded-lg"
                  >
                    <feature.icon className="w-8 h-8 mb-2 text-purple-400" />
                    <span className="text-purple-200">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-purple-300 text-lg font-light">
              Project Status: Advanced Development Phase
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-purple-900/50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-purple-200">Prototype Testing in Progress</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};