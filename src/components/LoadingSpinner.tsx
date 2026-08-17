import React from 'react';
import { motion } from 'framer-motion';
import { Mark } from './brand/Logo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading…',
  className = '',
}) => {
  const sizePx = { sm: 28, md: 40, lg: 56 }[size];
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      >
        <Mark size={sizePx} />
      </motion.div>
      {text && (
        <p className="mt-4 text-sm font-medium text-ink-600 dark:text-cream-100/70">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
