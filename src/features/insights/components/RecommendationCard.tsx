import React from 'react';
import {
  Sparkles,
  Target,
  GlassWater,
  AlertTriangle,
  TrendingUp,
  Heart,
  Activity,
} from 'lucide-react';
import type { Insight } from '../utils/ruleEngine';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Target,
  GlassWater,
  AlertTriangle,
  TrendingUp,
  Heart,
  Activity,
};

export interface RecommendationCardProps {
  insight: Insight;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ insight }) => {
  const IconComponent = ICON_MAP[insight.iconName] || Activity;

  // Semantic styles for each card type
  const typeStyles = {
    success: {
      border: 'border-l-4 border-accent-primary',
      bg: 'bg-accent-primary/[0.03]',
      iconClass: 'text-accent-primary bg-accent-primary/10',
    },
    warning: {
      border: 'border-l-4 border-accent-secondary',
      bg: 'bg-accent-secondary/[0.03]',
      iconClass: 'text-accent-secondary bg-accent-secondary/10',
    },
    danger: {
      border: 'border-l-4 border-alert',
      bg: 'bg-alert/[0.03]',
      iconClass: 'text-alert bg-alert/10',
    },
  };

  const styles = typeStyles[insight.type];

  return (
    <div
      className={`flex gap-5 p-6 bg-card-bg rounded-3xl shadow-[0_4px_20px_-4px_rgba(28,36,33,0.06)] border border-text-primary/5 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(28,36,33,0.08)] hover:-translate-y-0.5 ${styles.border} ${styles.bg}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconClass}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="space-y-1.5 font-sans">
        <h4 className="text-base font-extrabold text-text-primary tracking-tight">
          {insight.title}
        </h4>
        <p className="text-text-primary/70 text-sm leading-relaxed">
          {insight.message}
        </p>
      </div>
    </div>
  );
};
export default RecommendationCard;
