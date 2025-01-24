import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { About } from '../components/landing/About';
import { Footer } from '../components/landing/Footer';
import { AnimatedBackground } from '../components/landing/AnimatedBackground';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-black">
      <AnimatedBackground />
      <Header />
      <Hero />
      <About />
      <Footer />
    </div>
  );
};