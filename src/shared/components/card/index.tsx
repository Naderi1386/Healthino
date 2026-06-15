import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  rounded?: '2xl' | '3xl';
  shadow?: 'sm' | 'md' | 'none';
  bordered?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  rounded = '2xl',
  shadow = 'sm',
  bordered = false,
  interactive = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';

  const shadowStyles = {
    sm: 'shadow-[0_4px_20px_-4px_rgba(28,36,33,0.06)]',
    md: 'shadow-[0_10px_30px_-10px_rgba(28,36,33,0.08)]',
    none: '',
  };

  const shadowClass = shadowStyles[shadow];
  const borderClass = bordered ? 'border border-text-primary/10' : '';
  const bgClass = 'bg-card-bg text-text-primary';
  const baseClass = `font-sans ${roundedClass} ${shadowClass} ${borderClass} ${bgClass} p-6 transition-all duration-200`;

  if (onClick || interactive) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${baseClass} cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
