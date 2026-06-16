import type { DailyLog } from '../../../core/db/types';

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  iconName: string;
}

/**
 * Deterministically processes the daily logs against health rules.
 * Accepts the array of logs (unsorted or sorted), sorts them chronologically,
 * and runs dehydration, habit balance, and metabolic achievement thresholds.
 */
export const evaluateDailyLogs = (logs: DailyLog[]): Insight[] => {
  const insights: Insight[] = [];
  if (!logs || logs.length === 0) {
    return insights;
  }

  // Sort logs chronologically (oldest to newest) to analyze sequential days correctly
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  // 1. Dehydration Rule (Checks last 3 logged days)
  const last3Logs = sortedLogs.slice(-3);
  if (last3Logs.length >= 3) {
    const totalWater = last3Logs.reduce((sum, log) => sum + log.waterGlasses, 0);
    const avgWater = totalWater / 3;
    if (avgWater < 5) {
      insights.push({
        id: 'dehydration-warning',
        type: 'warning',
        title: 'Hydration Target Missed',
        message: `Your water intake over the last 3 logged days averaged ${avgWater.toFixed(1)} glasses, which is below the minimum target of 5. Rehydrate immediately to restore energy levels.`,
        iconName: 'GlassWater',
      });
    }
  }

  // 2. Habit Balance Rule (Checks last 7 logged days)
  const last7Logs = sortedLogs.slice(-7);
  const redTagsCount = last7Logs.reduce(
    (count, log) => count + log.tags.filter((t) => t.includes('🔴')).length,
    0
  );
  if (redTagsCount > 3) {
    insights.push({
      id: 'habit-balance-danger',
      type: 'danger',
      title: 'Suboptimal Habit Pattern',
      message: `You logged ${redTagsCount} unhealthy (🔴) food/drink choices this week. Frequent fast food, sugar, or carbonated beverages can impact metabolism. Try replacing them with lean proteins.`,
      iconName: 'AlertTriangle',
    });
  }

  // 3. Achievement Rule (Checks last 7 logged days)
  const greenTagsCount = last7Logs.reduce(
    (count, log) => count + log.tags.filter((t) => t.includes('🟢')).length,
    0
  );
  const totalTagsCount = last7Logs.reduce((count, log) => count + log.tags.length, 0);

  if (totalTagsCount > 0) {
    const greenRatio = greenTagsCount / totalTagsCount;
    if (greenRatio > 0.75) {
      insights.push({
        id: 'metabolic-achievement-success',
        type: 'success',
        title: 'Metabolic Achievement!',
        message: `Fantastic! Healthy (🟢) choices represent ${Math.round(
          greenRatio * 100
        )}% of your weekly logged tags. Your commitment to vegetables, high protein, and whole foods is superb.`,
        iconName: 'TrendingUp',
      });
    }
  }

  return insights;
};
