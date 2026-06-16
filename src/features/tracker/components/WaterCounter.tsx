import React from 'react';
import { GlassWater, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface WaterCounterProps {
  waterGlasses: number;
  onWaterChange: (change: number) => Promise<void> | void;
}

export const WaterCounter: React.FC<WaterCounterProps> = ({
  waterGlasses,
  onWaterChange,
}) => {
  const dailyGoal = 8;

  const handleGlassClick = (index: number) => {
    if (waterGlasses === index) {
      // Tapping the current top glass decrements by 1
      onWaterChange(-1);
    } else {
      // Tapping a different glass sets the hydration level to that glass's index
      const diff = index - waterGlasses;
      onWaterChange(diff);
    }
  };

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Hydration Intake</h3>
          <p className="text-text-primary/60 text-xs">Target: 8 glasses daily (250ml each)</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-accent-primary">{waterGlasses}</span>
          <span className="text-text-primary/50 text-sm font-semibold"> / {dailyGoal} gls</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-background/50 border border-text-primary/5 rounded-2xl p-4">
        {/* Rapid tap glass row */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 justify-center sm:justify-start">
          {Array.from({ length: dailyGoal }).map((_, i) => {
            const glassIndex = i + 1;
            const isFilled = glassIndex <= waterGlasses;

            return (
              <motion.button
                key={`glass-${glassIndex}`}
                type="button"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={() => handleGlassClick(glassIndex)}
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                  isFilled
                    ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                    : 'bg-card-bg text-text-primary/25 border border-text-primary/5 hover:text-text-primary/50'
                }`}
                title={`Log ${glassIndex} glass(es)`}
              >
                <GlassWater
                  className={`w-6 h-6 transition-all duration-200 ${
                    isFilled ? 'fill-accent-primary/20' : 'fill-none'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Fine-tuning controls (Increments beyond daily goal) */}
        <div className="flex items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l border-text-primary/5 pt-3 sm:pt-0 sm:pl-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => onWaterChange(-1)}
            disabled={waterGlasses === 0}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-card-bg border border-text-primary/5 text-text-primary/60 hover:text-text-primary hover:bg-text-primary/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            aria-label="Decrement water"
          >
            <Minus className="w-4 h-4" />
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={() => onWaterChange(1)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent-primary text-background hover:bg-accent-primary/90 cursor-pointer transition-all"
            aria-label="Increment water"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
