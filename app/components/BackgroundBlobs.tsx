'use client';

import { motion } from 'framer-motion';

import { useTheme } from './ThemeProvider';

export function BackgroundBlobs() {

  const { theme } = useTheme();

  const blobClass = theme === 'light' 

    ? 'bg-gradient-to-br from-primary/30 to-accent/30' 

    : 'bg-primary/20';

  const blobClass2 = theme === 'light' 

    ? 'bg-gradient-to-br from-accent/30 to-primary/30' 

    : 'bg-accent/20';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -10 }}>
      <motion.div
        className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-blob ${blobClass}`}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`absolute top-3/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-blob ${blobClass2}`}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -60, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ animationDelay: '5s' }}
      />
      <motion.div
        className={`absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full blur-3xl animate-blob ${blobClass}`}
        animate={{
          x: [0, 120, -80, 0],
          y: [0, -40, 80, 0],
          scale: [1, 1.3, 0.7, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ animationDelay: '10s' }}
      />
    </div>
  );
}