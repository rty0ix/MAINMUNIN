import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/common/Header';
import { Terminal, Code2, Binary } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Matrix-like background animation */}
      <div className="fixed inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 text-opacity-50 font-mono text-sm"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-[8vw] font-bold mb-8 relative font-montserrat tracking-tight whitespace-nowrap">
              <span className="absolute inset-0 text-black" style={{ WebkitTextStroke: '2px white' }}>
                DIGITAL REVOLUTION
              </span>
              <span className="relative text-black" style={{ WebkitTextStroke: '2px white' }}>
                DIGITAL REVOLUTION
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Terminal,
                title: "Advanced Systems",
                description: "Cutting-edge solutions for modern challenges"
              },
              {
                icon: Binary,
                title: "AI Integration",
                description: "Intelligent automation and deployment"
              },
              {
                icon: Code2,
                title: "Custom Development",
                description: "Tailored solutions for unique requirements"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-black p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="relative mb-6">
                  <item.icon className="w-12 h-12 text-black relative z-10" style={{ WebkitTextStroke: '1px white' }} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-black font-montserrat" style={{ WebkitTextStroke: '1px white' }}>
                  {item.title}
                </h3>
                <p className="text-white/80">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};