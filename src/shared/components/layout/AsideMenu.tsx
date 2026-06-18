import React from 'react';
import { NavLink, useLocation } from 'react-router';
import { LayoutDashboard, Activity, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AsideMenuProps {
  onLinkClick?: () => void;
}

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tracker', label: 'Tracker', icon: Activity },
  { path: '/insights', label: 'Insights', icon: Sparkles },
  { path: '/guide', label: 'Guide & Export', icon: BookOpen },
] as const;

export const AsideMenu: React.FC<AsideMenuProps> = ({ onLinkClick }) => {
  const location = useLocation();

  return (
    <aside className="w-full h-full bg-card-bg border-r border-text-primary/5 flex flex-col justify-between p-6">
      <div className="space-y-8">
        {/* Brand/Logo header */}
        <div className="flex items-center gap-3 px-2 py-4">
          <img
            src="/healthino-logo.png"
            alt="Healthino Logo"
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />
          <div>
            <span className="text-xl font-bold font-sans text-text-primary tracking-tight">Healthino</span>
            <span className="block text-xs font-medium font-sans text-accent-primary">Local-First Wellness</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                className="relative block"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-accent-primary/10 rounded-xl"
                    transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                  />
                )}
                <motion.div
                  className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-sans font-semibold text-sm transition-colors duration-200 z-10 ${
                    isActive ? 'text-accent-primary' : 'text-text-primary/60 hover:text-text-primary hover:bg-text-primary/5'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent-primary' : 'text-text-primary/50'}`} />
                  <span>{item.label}</span>
                </motion.div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Privacy note */}
      <div className="border-t border-text-primary/5 pt-4 px-2">
        <p className="text-[10px] text-text-primary/40 font-sans leading-relaxed">
          100% Client-Side Encryption
          <br />
          No Servers. No Privacy Leaks.
        </p>
      </div>
    </aside>
  );
};
