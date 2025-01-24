import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Network, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Cerbo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-black to-emerald-900 text-white">
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-700/20 blur-3xl" />
            <div className="relative bg-black/40 backdrop-blur-sm p-12 rounded-2xl max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold font-montserrat mb-6 text-center">Cerbo</h1>
              <p className="text-2xl text-emerald-300 mb-12 text-center">AI-Powered Process Optimization</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { icon: Cpu, title: "Neural Processing", desc: "Advanced AI algorithms" },
                  { icon: Network, title: "Smart Integration", desc: "Seamless system connectivity" },
                  { icon: Zap, title: "Real-time Analysis", desc: "Instant data processing" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index }}
                    className="text-center p-6 bg-emerald-900/20 rounded-xl"
                  >
                    <item.icon className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-emerald-200/80">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-emerald-200 text-lg">
                  Coming soon: Experience the future of process optimization
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};