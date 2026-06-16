import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface TagSelectorProps {
  activeTags: string[];
  onAddTag: (tag: string) => Promise<void> | void;
  onRemoveTag: (tag: string) => Promise<void> | void;
}

const CATEGORIES = [
  {
    title: 'Healthy / Useful 🟢',
    tags: ['🟢 High Protein', '🟢 Vegetables', '🟢 Pure Water', '🟢 Whole Foods'],
    activeStyle: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
  },
  {
    title: 'Neutral 🟡',
    tags: ['🟡 Balanced Carbs', '🟡 Bread', '🟡 Moderate Foods'],
    activeStyle: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
  },
  {
    title: 'Unhealthy / Harmful 🔴',
    tags: ['🔴 Heavy Fats', '🔴 Fast Food', '🔴 Sugars', '🔴 Carbonated Drinks'],
    activeStyle: 'bg-alert/10 text-alert border-alert/20',
  },
];

export const TagSelector: React.FC<TagSelectorProps> = ({
  activeTags,
  onAddTag,
  onRemoveTag,
}) => {
  // Determine style of tag depending on its prefix emoji
  const getTagStyle = (tag: string) => {
    if (tag.includes('🟢')) {
      return 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 hover:border-alert/30 hover:bg-alert/10 hover:text-alert';
    }
    if (tag.includes('🟡')) {
      return 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20 hover:border-alert/30 hover:bg-alert/10 hover:text-alert';
    }
    return 'bg-alert/10 text-alert border-alert/20 hover:border-alert/30 hover:bg-alert/15 hover:text-alert';
  };

  return (
    <div className="space-y-6 font-sans select-none">
      <div>
        <h3 className="text-lg font-bold text-text-primary">Habit Logger</h3>
        <p className="text-text-primary/60 text-xs">Rapid click tags to log meals and wellness activities.</p>
      </div>

      {/* Grid of Rapid Click Categories */}
      <div className="space-y-4">
        {CATEGORIES.map((cat) => (
          <div key={cat.title} className="space-y-2">
            <span className="text-xs font-bold text-text-primary/50 uppercase tracking-wider block">
              {cat.title}
            </span>
            <div className="flex flex-wrap gap-2">
              {cat.tags.map((tag) => {
                const isLogged = activeTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    onClick={() => onAddTag(tag)}
                    disabled={isLogged}
                    className={`h-11 px-4 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isLogged
                        ? cat.activeStyle + ' border-dashed opacity-50'
                        : 'bg-card-bg border-text-primary/5 text-text-primary/80 hover:bg-text-primary/5 hover:text-text-primary'
                    }`}
                  >
                    <span>{tag}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active Logged Tags Section */}
      <div className="border-t border-text-primary/5 pt-4 space-y-3">
        <span className="text-xs font-bold text-text-primary/50 uppercase tracking-wider block">
          Logged Today ({activeTags.length})
        </span>

        {activeTags.length === 0 ? (
          <div className="bg-background/30 border border-dashed border-text-primary/10 rounded-2xl p-6 text-center">
            <p className="text-text-primary/40 text-sm font-medium">No habits logged for this date. Tap tags above to add.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeTags.map((tag) => (
              <motion.button
                key={`logged-${tag}`}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => onRemoveTag(tag)}
                className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-full border flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${getTagStyle(
                  tag
                )}`}
                title="Tap to remove tag"
              >
                <span>{tag}</span>
                <X className="w-3.5 h-3.5 shrink-0 opacity-70" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
