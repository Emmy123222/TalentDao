import React from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: string;
}

export default function GradientCard({ 
  children, 
  className = '', 
  hover = true,
  gradient = 'from-purple-500/10 via-blue-500/10 to-cyan-500/10'
}: GradientCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative overflow-hidden rounded-2xl border border-white/10 
        bg-gradient-to-br ${gradient} backdrop-blur-xl
        before:absolute before:inset-0 before:bg-white/5 before:opacity-0 
        hover:before:opacity-100 before:transition-opacity before:duration-300
        ${hover ? 'hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/20' : ''}
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}