import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Box, Brain, Beaker, Globe, Layout, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const projects = [
  {
    title: "Decky's",
    description: "Advanced deployment automation system",
    icon: Box,
    path: '/deckys'
  },
  {
    title: 'TTM',
    description: 'Time tracking and management solution',
    icon: Globe,
    path: '/ttm'
  },
  {
    title: 'Test Deployment',
    description: 'Streamlined testing infrastructure',
    icon: Beaker,
    path: '/test-deployment'
  },
  {
    title: 'Cerbo',
    description: 'AI-powered process optimization',
    icon: Brain,
    path: '/cerbo'
  },
  {
    title: 'LLM',
    description: 'Language model implementation framework',
    icon: Layout,
    path: '/llm'
  },
  {
    title: 'KCDA SCI',
    description: 'Secure check-in system',
    icon: Shield,
    path: '/login'
  },
];

export const Projects = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleProjectClick = (path: string) => {
    navigate(path, { replace: true });
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Our Innovations
        </motion.h2>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.button
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 p-6 rounded-lg shadow-lg cursor-pointer text-left w-full"
              onClick={() => handleProjectClick(project.path)}
            >
              <project.icon className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-400">{project.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};