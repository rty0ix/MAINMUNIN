import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, MessageSquare, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LLM = () => {
  const navigate = useNavigate();

  const codeExample = `model.generate({
  prompt: "Innovate with AI",
  temperature: 0.7,
  max_tokens: 150
});`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-indigo-900 text-white">
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
            <div className="flex items-center justify-center mb-6">
              <Brain className="w-16 h-16 text-blue-400 mr-4" />
              <h1 className="text-6xl font-bold font-montserrat">LLM</h1>
            </div>
            <p className="text-2xl text-blue-300 mb-12">Language Model Implementation Framework</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-lg"
              >
                <MessageSquare className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Natural Language Processing</h3>
                <p className="text-blue-200">
                  Advanced language understanding and generation capabilities powered by
                  state-of-the-art transformer architecture.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-lg"
              >
                <Code className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Simple Integration</h3>
                <pre className="bg-black/50 p-4 rounded-md text-sm overflow-x-auto">
                  <code className="text-blue-300">{codeExample}</code>
                </pre>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-lg text-blue-200 mb-6">
              Coming soon: Transform your applications with advanced language processing
            </p>
            <div className="flex justify-center gap-4">
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};