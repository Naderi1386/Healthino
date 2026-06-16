import React from 'react';
import type { DailyLog } from '../../../core/db/types';

export interface ProgressRingsProps {
  todayLog?: DailyLog;
}

export const ProgressRings: React.FC<ProgressRingsProps> = ({ todayLog }) => {
  const waterGlasses = todayLog?.waterGlasses ?? 0;
  const waterGoal = 8;
  const waterProgress = Math.min((waterGlasses / waterGoal) * 100, 100);

  const tags = todayLog?.tags ?? [];
  const greenTagsCount = tags.filter(t => t.includes('🟢')).length;
  const totalTagsCount = tags.length;
  const habitProgress = totalTagsCount > 0 ? (greenTagsCount / totalTagsCount) * 100 : 0;

  // SVG parameters
  const center = 80;
  const outerRadius = 60;
  const innerRadius = 42;
  const strokeWidth = 10;

  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const outerStrokeDashoffset = outerCircumference - (waterProgress / 100) * outerCircumference;
  const innerStrokeDashoffset = innerCircumference - (habitProgress / 100) * innerCircumference;

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          {/* Water Intake - Outer Ring Background */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeOpacity={0.12}
            strokeWidth={strokeWidth}
          />
          {/* Water Intake - Outer Ring Fill */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth={strokeWidth}
            strokeDasharray={outerCircumference}
            strokeDashoffset={outerStrokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Healthy Eating Habits - Inner Ring Background */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="var(--color-accent-secondary)"
            strokeOpacity={0.12}
            strokeWidth={strokeWidth}
          />
          {/* Healthy Eating Habits - Inner Ring Fill */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="var(--color-accent-secondary)"
            strokeWidth={strokeWidth}
            strokeDasharray={innerCircumference}
            strokeDashoffset={innerStrokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Emoji / Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl" role="img" aria-label="health-icon">
            🌱
          </span>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="w-full grid grid-cols-2 gap-4 text-sm font-sans pt-2 border-t border-text-primary/5">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-primary" />
            <span className="text-text-primary/70 text-xs font-semibold uppercase tracking-wider">Water Intake</span>
          </div>
          <span className="text-lg font-bold text-text-primary mt-1">
            {waterGlasses} <span className="text-sm font-normal text-text-primary/60">/ {waterGoal} gls</span>
          </span>
          <span className="text-xs text-text-primary/50 mt-0.5">{Math.round(waterProgress)}% reached</span>
        </div>

        <div className="flex flex-col border-l border-text-primary/5 pl-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-secondary" />
            <span className="text-text-primary/70 text-xs font-semibold uppercase tracking-wider">Habit Score</span>
          </div>
          <span className="text-lg font-bold text-text-primary mt-1">
            {Math.round(habitProgress)}<span className="text-sm font-normal text-text-primary/60">%</span>
          </span>
          <span className="text-xs text-text-primary/50 mt-0.5">
            {greenTagsCount} of {totalTagsCount} tags green
          </span>
        </div>
      </div>
    </div>
  );
};
