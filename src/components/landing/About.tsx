import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-32 bg-black relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent"
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div className="text-white">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-5xl font-bold mb-8 leading-tight"
            >
              Pioneering the Future of AI Integration
            </motion.h2>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.6 }}
              className="text-xl leading-relaxed text-white/70 mb-8"
            >
              At MUNiN, we're redefining the boundaries between human potential and
              artificial intelligence. Our systems seamlessly bridge the gap between
              cutting-edge AI technology and practical implementation.
            </motion.p>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="text-xl leading-relaxed text-white/70"
            >
              Through innovative deployment strategies and advanced AI systems,
              we're shaping the technological landscape of tomorrow.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="relative h-[600px] group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
              alt="AI Visualization"
              className="rounded-lg object-cover w-full h-full filter grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};