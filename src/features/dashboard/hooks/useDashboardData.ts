import { useState, useEffect, useCallback } from 'react';
import { safeGetAllDailyLogs } from '../../../core/db';
import type { DailyLog, UserProfile } from '../../../core/db/types';
import { useProfileStore } from '../../../shared/hooks/useProfileStore';

export interface UseDashboardDataResult {
  dailyLogs: DailyLog[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataResult => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const storeProfile = useProfileStore((state) => state.profile);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dbLogs = await safeGetAllDailyLogs();

      if (dbLogs && dbLogs.length > 0) {
        const sortedLogs = [...dbLogs].sort((a, b) => a.date.localeCompare(b.date));
        setDailyLogs(sortedLogs);
      } else {
        setDailyLogs([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown database error occurred';
      setError(message);
      setDailyLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active) {
        fetchData();
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [fetchData]);

  // Construct the UserProfile domain object using localStorage data or safe baseline
  const userProfile: UserProfile = storeProfile
    ? {
        id: 'current',
        height: storeProfile.height,
        weight: storeProfile.weight,
        age: storeProfile.age,
        gender: storeProfile.gender === 'male' ? 'Male' : storeProfile.gender === 'female' ? 'Female' : 'Other',
        goal: storeProfile.goal === 'lose' ? 'Lose weight' : storeProfile.goal === 'gain' ? 'Gain weight' : 'Maintain weight',
        updatedAt: new Date(),
      }
    : {
        id: 'current',
        height: 170,
        weight: 70,
        age: 30,
        gender: 'Other',
        goal: 'Maintain weight',
        updatedAt: new Date(),
      };

  return {
    dailyLogs,
    userProfile,
    isLoading,
    error,
    refreshData: fetchData,
  };
};
