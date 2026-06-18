import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ isOpen, onToggle }) => {
  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-card-bg border-b border-text-primary/5 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img
          src="/healthino-logo.png"
          alt="Healthino Logo"
          className="w-8 h-8 rounded-lg object-cover shrink-0"
        />
        <span className="text-lg font-bold font-sans text-text-primary tracking-tight">Healthino</span>
      </div>

      <motion.button
        type="button"
        onClick={onToggle}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-text-primary/5 text-text-primary focus:outline-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>
    </header>
  );
};
