import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Users, Radio, Map, Bell, Lock, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GuardianNetwork = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Community Engagement",
      description: "Connect with local law enforcement and community members in real-time"
    },
    {
      icon: Map,
      title: "Interactive Mapping",
      description: "Visualize and respond to community safety concerns with precision"
    },
    {
      icon: Radio,
      title: "Secure Communications",
      description: "Encrypted channels for coordinated community response"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "AI-powered incident detection and notification system"
    },
    {
      icon: Lock,
      title: "Verified Access",
      description: "Role-based authentication for community stakeholders"
    },
    {
      icon: Database,
      title: "Data Analytics",
      description: "Advanced insights for proactive community safety"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Navigation */}
      <div className="fixed top-6 left-6 z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </motion.button>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="p-4 bg-white/10 rounded-full"
              >
                <Shield className="w-16 h-16 text-blue-400" />
              </motion.div>
            </div>
            <h1 className="text-6xl font-bold mb-6 font-montserrat">Guardian Network</h1>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Empowering communities through advanced technology and collaborative safety initiatives.
              Coming Q3 2024.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-200">In Development</span>
            </div>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-lg p-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};