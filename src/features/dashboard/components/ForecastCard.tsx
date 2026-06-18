import React from 'react';
import { Sparkles, TrendingUp, Target } from 'lucide-react';
import type { DailyLog, UserProfile } from '../../../core/db/types';

export interface ForecastCardProps {
  dailyLogs: DailyLog[];
  userProfile: UserProfile;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ dailyLogs, userProfile }) => {
  if (dailyLogs.length === 0) {
    return (
      <div className="flex flex-col h-full justify-between font-sans">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">
              Rule-Based Forecast
            </span>
            <h3 className="text-lg font-bold text-text-primary mt-0.5">Awaiting Data</h3>
          </div>
        </div>

        <div className="mt-4 bg-background/50 border border-text-primary/5 rounded-xl p-4">
          <p className="text-xs text-text-primary/65 leading-relaxed">
            Log at least one day in the Tracker to compile your personalized health trajectory and rule-based goal projection.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-text-primary/50 border-t border-text-primary/5 pt-3">
          <span>Goal: <strong className="text-text-primary/70 font-semibold">{userProfile.goal || 'Maintain'}</strong></span>
          <span>Ratio: <strong className="text-text-primary/70 font-semibold">--</strong></span>
        </div>
      </div>
    );
  }

  const goalStr = userProfile.goal || 'Lose weight';
  const goalClean = goalStr.toLowerCase();

  // Aggregate green and red tags across the week
  const greenCount = dailyLogs.reduce(
    (acc, log) => acc + log.tags.filter((t) => t.includes('🟢')).length,
    0
  );
  const redCount = dailyLogs.reduce(
    (acc, log) => acc + log.tags.filter((t) => t.includes('🔴')).length,
    0
  );

  const totalTags = greenCount + redCount;
  const greenRatio = totalTags > 0 ? greenCount / totalTags : 0.5;

  // Projection logic helper
  const getForecast = () => {
    const percentage = Math.round(greenRatio * 100);

    if (goalClean.includes('lose')) {
      if (greenRatio >= 0.65) {
        const value = (greenRatio * 1.6).toFixed(1);
        return {
          title: 'Optimal Trajectory',
          text: `Based on your high green tag ratio (${percentage}%) this week, you are structurally on track to get ${value}kg closer to your goal weight by next month.`,
          status: 'success',
        };
      } else if (greenRatio >= 0.4) {
        const value = (greenRatio * 0.9).toFixed(1);
        return {
          title: 'Steady Progress',
          text: `Your green tag ratio is moderate (${percentage}%). You are on track to get ${value}kg closer to your target weight. Swapping 2-3 red tags for green tags next week can speed up your progress.`,
          status: 'warning',
        };
      } else {
        return {
          title: 'Adjustment Needed',
          text: `Your red tags were higher this week (${100 - percentage}%). To remain on track for weight loss, try focused adjustments, like keeping water logs optimal and reducing late night snacks.`,
          status: 'danger',
        };
      }
    } else if (goalClean.includes('gain')) {
      if (greenRatio >= 0.65) {
        const value = (greenRatio * 1.4).toFixed(1);
        return {
          title: 'Optimal Trajectory',
          text: `With a strong green tag ratio of ${percentage}% this week, you are on track to gain ${value}kg of lean mass by next month in a highly structured and healthy way.`,
          status: 'success',
        };
      } else if (greenRatio >= 0.4) {
        const value = (greenRatio * 0.7).toFixed(1);
        return {
          title: 'Moderate Build',
          text: `Your habit mix is balanced (${percentage}% green). You are on track to gain ${value}kg next month. Focus on adding high-calorie green nutrition tags to support active muscle recovery.`,
          status: 'warning',
        };
      } else {
        return {
          title: 'Recovery Focus',
          text: `With red tags dominating this week, you might see stagnant muscle growth or recovery delay. Prioritize restorative sleep and nutrient-dense foods to boost energy.`,
          status: 'danger',
        };
      }
    } else {
      // Maintain weight / other goals
      if (greenRatio >= 0.65) {
        return {
          title: 'Excellent Maintenance',
          text: `You have an exceptional green tag ratio of ${percentage}%. Your metabolism is highly stable and optimized, and you are perfectly positioned to maintain your target weight long-term.`,
          status: 'success',
        };
      } else if (greenRatio >= 0.4) {
        return {
          title: 'Stable Balance',
          text: `Your habits are balanced. You are successfully maintaining your current weight. Continue choosing green habits to support daily physical and mental vitality.`,
          status: 'warning',
        };
      } else {
        return {
          title: 'Fluctuation Risk',
          text: `Your red tag ratio is slightly elevated. You may experience minor energy dips or weight fluctuations. Consider shifting 2-3 routines back to green tags.`,
          status: 'danger',
        };
      }
    }
  };

  const forecast = getForecast();

  // Styles based on status
  const iconBg = {
    success: 'bg-accent-primary/10 text-accent-primary',
    warning: 'bg-accent-secondary/10 text-accent-secondary',
    danger: 'bg-alert/10 text-alert',
  }[forecast.status];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${iconBg} transition-colors duration-200 shrink-0`}>
          {forecast.status === 'success' ? (
            <Sparkles className="w-6 h-6" />
          ) : forecast.status === 'warning' ? (
            <TrendingUp className="w-6 h-6" />
          ) : (
            <Target className="w-6 h-6" />
          )}
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">
            Rule-Based Forecast
          </span>
          <h3 className="text-lg font-bold text-text-primary mt-0.5">{forecast.title}</h3>
        </div>
      </div>

      <div className="mt-4 bg-background/50 border border-text-primary/5 rounded-xl p-4">
        <p className="text-sm text-text-primary/80 leading-relaxed font-sans">{forecast.text}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-text-primary/50 border-t border-text-primary/5 pt-3">
        <span>Goal: <strong className="text-text-primary/70 font-semibold">{goalStr}</strong></span>
        <span>Ratio: <strong className="text-text-primary/70 font-semibold">{Math.round(greenRatio * 100)}% Green</strong></span>
      </div>
    </div>
  );
};
