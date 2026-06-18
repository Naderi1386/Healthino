import { useState, useEffect, useCallback } from 'react';
import { safeGetDailyLog, safeSaveDailyLog, safeGetAllDailyLogs } from '../../../core/db';
import type { DailyLog } from '../../../core/db/types';

export interface UseDailyLoggerResult {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentLog: DailyLog;
  allLogs: DailyLog[];
  isLoading: boolean;
  error: string | null;
  updateWater: (change: number) => Promise<void>;
  addTag: (tag: string) => Promise<void>;
  removeTag: (tag: string) => Promise<void>;
}

const getDefaultLog = (dateStr: string): DailyLog => ({
  date: dateStr,
  waterGlasses: 0,
  tags: [],
});

export const useDailyLogger = (): UseDailyLoggerResult => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentLog, setCurrentLog] = useState<DailyLog>(getDefaultLog(todayStr));
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all logs from the database
  const loadAllLogs = useCallback(async () => {
    try {
      const dbLogs = await safeGetAllDailyLogs();
      if (dbLogs && dbLogs.length > 0) {
        setAllLogs(dbLogs);
      } else {
        setAllLogs([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve logs from IndexedDB';
      setError(message);
      setAllLogs([]);
    }
  }, []);

  // Fetch log for the currently selected date
  const loadSelectedLog = useCallback(async (dateStr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const log = await safeGetDailyLog(dateStr);
      if (log) {
        setCurrentLog(log);
      } else {
        // Check if the date exists in our local allLogs (e.g. mock data fallback)
        const localLog = allLogs.find((l) => l.date === dateStr);
        if (localLog) {
          setCurrentLog(localLog);
        } else {
          setCurrentLog(getDefaultLog(dateStr));
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve selected daily log';
      setError(message);
      setCurrentLog(getDefaultLog(dateStr));
    } finally {
      setIsLoading(false);
    }
  }, [allLogs]);

  // Initial load
  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active) {
        loadAllLogs();
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [loadAllLogs]);

  // Reload the current log when selected date changes or when allLogs updates
  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active) {
        loadSelectedLog(selectedDate);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [selectedDate, loadSelectedLog]);

  // Common helper for saving a log change transactionally and updating state synchronously
  const saveLogMutation = async (updatedLog: DailyLog) => {
    // 1. Update UI state synchronously (optimistic update)
    setCurrentLog(updatedLog);
    setAllLogs((prev) => {
      const exists = prev.some((l) => l.date === updatedLog.date);
      if (exists) {
        return prev.map((l) => (l.date === updatedLog.date ? updatedLog : l));
      } else {
        return [...prev, updatedLog];
      }
    });

    // 2. Perform DB write transactionally inside a try/catch
    try {
      await safeSaveDailyLog(updatedLog);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to persist daily log mutation';
      setError(message);
      // Let the exception bubble or be handled by fail-safe UI boundaries
      throw new Error(message, { cause: err });
    }
  };

  const updateWater = async (change: number) => {
    const nextGlasses = Math.max(0, currentLog.waterGlasses + change);
    const updated: DailyLog = {
      ...currentLog,
      waterGlasses: nextGlasses,
    };
    await saveLogMutation(updated);
  };

  const addTag = async (tag: string) => {
    // We only add the tag if it's not already logged for this date to keep entries clean
    if (currentLog.tags.includes(tag)) {
      return;
    }
    const updated: DailyLog = {
      ...currentLog,
      tags: [...currentLog.tags, tag],
    };
    await saveLogMutation(updated);
  };

  const removeTag = async (tagToRemove: string) => {
    const updated: DailyLog = {
      ...currentLog,
      tags: currentLog.tags.filter((t) => t !== tagToRemove),
    };
    await saveLogMutation(updated);
  };

  return {
    selectedDate,
    setSelectedDate,
    currentLog,
    allLogs,
    isLoading,
    error,
    updateWater,
    addTag,
    removeTag,
  };
};
