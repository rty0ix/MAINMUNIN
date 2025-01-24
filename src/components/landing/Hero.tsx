import React from 'react';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full blur-3xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2 + 1,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2 + 1,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{
              width: `${Math.random() * 500 + 200}px`,
              height: `${Math.random() * 500 + 200}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-8xl md:text-9xl font-bold mb-8 font-montserrat tracking-tighter"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/20">
            MUNiN
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="text-xl md:text-2xl mb-12 text-white/60 font-light max-w-3xl mx-auto"
        >
          Forging the future through advanced AI systems and seamless deployment architecture
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.1 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full text-lg transition-transform relative overflow-hidden group"
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="relative z-10">Explore the Vision</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={false}
              whileHover={{
                background: [
                  "rgba(255,255,255,1)",
                  "rgba(255,255,255,0.8)",
                  "rgba(255,255,255,1)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Animated scan line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
        initial={{ y: -1000 }}
        animate={{ y: 1000 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ height: "200%" }}
      />
    </div>
  );
};