import { useState, useEffect, useCallback } from 'react';
import { safeGetAllDailyLogs } from '../../../core/db';
import type { DailyLog } from '../../../core/db/types';
import { useProfileStore } from '../../../shared/hooks/useProfileStore';
import { evaluateDailyLogs, type Insight } from '../utils/ruleEngine';
import { mockDailyLogs } from '../../dashboard/utils/mockDashboardData';

export interface UseInsightsResult {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useInsights = (): UseInsightsResult => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const profile = useProfileStore((state) => state.profile);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dbLogs = await safeGetAllDailyLogs();
      let activeLogs: DailyLog[] = [];

      if (dbLogs && dbLogs.length > 0) {
        activeLogs = dbLogs;
      } else {
        // Aligns with dashboard and tracker fallbacks
        activeLogs = mockDailyLogs;
      }

      // Check if we have fewer than 3 days of historical logs
      if (activeLogs.length < 3) {
        // Fallback UI State
        const welcomeCard: Insight = {
          id: 'welcome-card',
          type: 'success',
          title: 'Welcome to Healthino Insights!',
          message: 'Our offline rule-based insights engine analyzes your daily hydration levels and diet choices. Log at least 3 days in the Tracker to unlock full analysis.',
          iconName: 'Sparkles',
        };

        const goal = profile?.goal ?? 'maintain';
        let goalTitle = 'Weight Maintenance Focus';
        let goalMsg = 'Goal Strategy: Focus on energy balance. Keep your protein intake stable and balance whole foods with physical activity.';

        if (goal === 'lose') {
          goalTitle = 'Weight Loss Strategy';
          goalMsg = 'Goal Strategy: Prioritize high-volume, low-calorie foods. Focus on high protein and raw vegetables to maximize satiety while keeping hydration high.';
        } else if (goal === 'gain') {
          goalTitle = 'Weight Gain Strategy';
          goalMsg = 'Goal Strategy: Consume nutrient-dense, calorie-dense foods (healthy fats, complex carbohydrates). Ensure consistent post-workout protein intake.';
        }

        const baselineCard: Insight = {
          id: 'baseline-goal-card',
          type: 'warning',
          title: goalTitle,
          message: goalMsg,
          iconName: 'Target',
        };

        setInsights([welcomeCard, baselineCard]);
      } else {
        // We have at least 3 logs, run evaluations
        const evaluated = evaluateDailyLogs(activeLogs);

        if (evaluated.length === 0) {
          // Prevent a blank screen if logs are present but no conditions were triggered
          const stableCard: Insight = {
            id: 'stable-metrics-card',
            type: 'success',
            title: 'Metabolic Metrics Stable',
            message: 'Your hydration levels and food habits are currently within target ranges. Continue logging daily to discover long-term patterns.',
            iconName: 'Heart',
          };
          setInsights([stableCard]);
        } else {
          setInsights(evaluated);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Database error while aggregating insights';
      setError(message);
      // Fallback in case of DB failures
      setInsights([
        {
          id: 'db-fallback-card',
          type: 'danger',
          title: 'Insights Offline',
          message: `Unable to access database metrics: ${message}. Running in fallback welcome mode.`,
          iconName: 'AlertTriangle',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active) {
        fetchInsights();
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [fetchInsights]);

  return {
    insights,
    isLoading,
    error,
    refresh: fetchInsights,
  };
};
