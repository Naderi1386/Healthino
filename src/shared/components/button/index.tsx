import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'alert' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyle =
    'font-sans font-semibold inline-flex items-center justify-center rounded-2xl cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';

  const variantStyles = {
    primary: 'bg-accent-primary text-background hover:bg-accent-primary/95 focus:ring-accent-primary',
    secondary: 'bg-accent-secondary text-text-primary hover:bg-accent-secondary/95 focus:ring-accent-secondary',
    alert: 'bg-alert text-background hover:bg-alert/95 focus:ring-alert',
    outline: 'border-2 border-accent-primary text-accent-primary bg-transparent hover:bg-accent-primary/5 focus:ring-accent-primary',
    ghost: 'bg-transparent text-text-primary hover:bg-text-primary/5 shadow-none focus:ring-text-primary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  const classes = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={classes}
      {...props}
    >
      {children}
    </motion.button>
  );
};
