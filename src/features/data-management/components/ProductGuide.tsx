import React from 'react';
import { ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { Card } from '../../../shared/components/card';

export const ProductGuide: React.FC = () => {
  return (
    <div className="space-y-8 font-sans pb-4">
      {/* Introduction Card */}
      <Card rounded="3xl" className="bg-accent-primary/5 border border-accent-primary/10 p-6 lg:p-8">
        <div className="flex items-center space-x-3 text-accent-primary">
          <ShieldCheck className="w-8 h-8" />
          <h2 className="text-xl font-bold">The Healthino Philosophy</h2>
        </div>
        <p className="text-text-primary/80 text-sm mt-3 leading-relaxed">
          Healthino is built upon the foundational belief that your health metrics are sacred. 
          We operate a completely client-side, local-first architecture. There are no remote cloud servers, 
          no tracking scripts, and no surveillance mechanisms. Your files and habit data reside strictly 
          in your browser's sandboxed IndexedDB storage.
        </p>
      </Card>

      {/* Philosophy Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core pillar 1 */}
        <Card rounded="2xl" className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="p-2 bg-accent-secondary/10 text-accent-secondary rounded-xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Frictionless 3-Second Logging</h3>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Habit tracking shouldn't feel like a chore. Our rapid logger allows you to log daily hydration 
              volumes and category tags with single-tap controls. Simply open the logger, tap your consumed foods 
              or activity cards, and instantly persist your status.
            </p>
          </div>
        </Card>

        {/* Core pillar 2 */}
        <Card rounded="2xl" className="flex flex-col justify-between p-6">
          <div className="space-y-2">
            <div className="p-2 bg-accent-primary/10 text-accent-primary rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">Absolute Data Portability</h3>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Because your database is local-first, you own your backups. You can instantly dump your entire history 
              into an encrypted-style raw JSON file, transfer it to another browser, or completely purge local records 
              at any moment.
            </p>
          </div>
        </Card>
      </div>

      {/* Habit tag definitions */}
      <Card rounded="3xl" className="p-6">
        <div className="flex items-center space-x-2 text-text-primary mb-4">
          <HelpCircle className="w-5 h-5 text-accent-primary" />
          <h3 className="text-base font-bold">Understanding Food Classification Tags</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Green Category */}
          <div className="bg-accent-primary/5 rounded-2xl p-4 border border-accent-primary/10 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟢</span>
              <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Useful / Healthy</span>
            </div>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Promotes vitality, muscle repair, clean hydration, and high nutrient density. 
              Examples include fresh vegetables, proteins, pure mineral water, and unrefined whole ingredients.
            </p>
          </div>

          {/* Yellow Category */}
          <div className="bg-accent-secondary/5 rounded-2xl p-4 border border-accent-secondary/10 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟡</span>
              <span className="text-xs font-bold text-accent-secondary uppercase tracking-wider">Neutral Foods</span>
            </div>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Provides balanced macro energies, essential carbohydrates, and basic calorie requirements. 
              Examples include moderate starches, grain breads, and standard daily foods.
            </p>
          </div>

          {/* Red Category */}
          <div className="bg-alert/5 rounded-2xl p-4 border border-alert/10 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔴</span>
              <span className="text-xs font-bold text-alert uppercase tracking-wider">Harmful / Unhealthy</span>
            </div>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Contains high-glycemic sugars, processed hydrogenated fats, chemical preservatives, or carbonated compounds. 
              Examples include fast food, sodas, and heavy desserts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
