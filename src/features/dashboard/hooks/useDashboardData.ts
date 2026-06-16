import { useState, useEffect, useCallback } from 'react';
import { safeGetAllDailyLogs, safeGetUserProfile } from '../../../core/db';
import type { DailyLog, UserProfile } from '../../../core/db/types';
import { mockDailyLogs, mockUserProfile } from '../utils/mockDashboardData';

export interface UseDashboardDataResult {
  dailyLogs: DailyLog[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataResult => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dbLogs, dbProfile] = await Promise.all([
        safeGetAllDailyLogs(),
        safeGetUserProfile('current'),
      ]);

      // Handle daily logs fallback if empty
      if (dbLogs && dbLogs.length > 0) {
        // Sort chronologically by date ascending
        const sortedLogs = [...dbLogs].sort((a, b) => a.date.localeCompare(b.date));
        setDailyLogs(sortedLogs);
      } else {
        setDailyLogs(mockDailyLogs);
      }

      // Handle user profile fallback if not exists
      if (dbProfile) {
        setUserProfile(dbProfile);
      } else {
        setUserProfile(mockUserProfile);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown database error occurred';
      setError(message);
      // Fallback on error to ensure a graceful fail-safe UI
      setDailyLogs(mockDailyLogs);
      setUserProfile(mockUserProfile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dailyLogs,
    userProfile,
    isLoading,
    error,
    refreshData: fetchData,
  };
};
