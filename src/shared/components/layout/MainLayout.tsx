import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { AsideMenu } from './AsideMenu';
import { MobileHeader } from './MobileHeader';
import { motion, AnimatePresence } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:grid lg:grid-cols-[30%_70%]">
      {/* Mobile Top Navigation */}
      <MobileHeader isOpen={isMenuOpen} onToggle={toggleMenu} />

      {/* Desktop Sticky Sidebar (Left 30%) */}
      <div className="hidden lg:block h-screen sticky top-0 overflow-y-auto z-30">
        <AsideMenu />
      </div>

      {/* Mobile Navigation Drawer Overlay (Visible < lg) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Translucent Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-black/20 backdrop-blur-xs"
              onClick={closeMenu}
            />

            {/* Slide-out Sidebar Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-0 bottom-0 left-0 w-[280px] max-w-[80vw] h-full shadow-2xl"
            >
              <AsideMenu onLinkClick={closeMenu} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dynamic Content Area (Right 70%) */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto lg:h-screen">
        <div className="bg-card-bg rounded-3xl shadow-xs p-6 lg:p-10 min-h-[calc(100vh-120px)] lg:min-h-full border border-text-primary/5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
