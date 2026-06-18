import { useState, useEffect, useCallback } from 'react';
import { safeGetAllDailyLogs } from '../../../core/db';
import type { DailyLog } from '../../../core/db/types';
import { useProfileStore } from '../../../shared/hooks/useProfileStore';
import { evaluateDailyLogs, type Insight } from '../utils/ruleEngine';

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
      const activeLogs: DailyLog[] = dbLogs && dbLogs.length > 0 ? dbLogs : [];

      // Check if we have fewer than 3 days of historical logs
      if (activeLogs.length < 3) {
        // Retrieve onboarding goal directly from localStorage
        const stored = localStorage.getItem('healthino_user_profile');
        let onboardingGoal = profile?.goal;
        if (!onboardingGoal && stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed.goal === 'string') {
              onboardingGoal = parsed.goal;
            }
          } catch (e) {
            console.error('Failed to parse onboarding goal from localStorage:', e);
          }
        }

        const goal = onboardingGoal || 'maintain';
        let welcomeCard: Insight;
        let strategyCard: Insight;

        if (goal === 'lose') {
          welcomeCard = {
            id: 'welcome-card-lose',
            type: 'success',
            title: 'Your Journey to Lean Health',
            message: 'Welcome to Healthino! To optimize your weight loss, log at least 3 days in the Tracker so our local rules engine can pinpoint habits affecting your metabolic efficiency.',
            iconName: 'Sparkles',
          };
          strategyCard = {
            id: 'strategy-card-lose',
            type: 'warning',
            title: 'Precision Deficit Strategy',
            message: 'Goal Strategy: Prioritize lean proteins (🟢 High Protein) and fresh greens (🟢 Vegetables) to increase metabolic thermogenesis and prolong satiety. Keep daily hydration above 8 glasses to flush sodium and optimize lipolysis.',
            iconName: 'Target',
          };
        } else if (goal === 'gain') {
          welcomeCard = {
            id: 'welcome-card-gain',
            type: 'success',
            title: 'Your Journey to Strength & Mass',
            message: 'Welcome to Healthino! To maximize muscle hypertrophy and structural gains, log at least 3 days in the Tracker to unlock full analysis of your anabolic nutrition choices.',
            iconName: 'Sparkles',
          };
          strategyCard = {
            id: 'strategy-card-gain',
            type: 'warning',
            title: 'Anabolic Recovery Strategy',
            message: 'Goal Strategy: Target clean carbohydrate fuel (🟢 Whole Foods) and premium protein sources. Ensure hydration is maintained above 8 glasses daily to optimize cellular volume and creatine transport.',
            iconName: 'Target',
          };
        } else {
          welcomeCard = {
            id: 'welcome-card-maintain',
            type: 'success',
            title: 'Your Journey to Metabolic Balance',
            message: 'Welcome to Healthino! To lock in your weight and maximize daily cellular energy, log at least 3 days in the Tracker to allow our engine to map your stable habit patterns.',
            iconName: 'Sparkles',
          };
          strategyCard = {
            id: 'strategy-card-maintain',
            type: 'warning',
            title: 'Homeostasis & Vitality Focus',
            message: 'Goal Strategy: Focus on energy equilibrium. Balance clean hydration levels (🟢 Pure Water) with balanced meal distributions (🟡 Balanced Carbs). Keep activity indicators consistent.',
            iconName: 'Target',
          };
        }

        setInsights([welcomeCard, strategyCard]);
      } else {
        // We have at least 3 logs, run evaluations
        const evaluated = evaluateDailyLogs(activeLogs);

        if (evaluated.length === 0) {
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
