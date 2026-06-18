import { useState, useCallback } from 'react';
import { db, safeGetAllDailyLogs, safeGetUserProfile } from '../../../core/db';
import type { DailyLog, UserProfile } from '../../../core/db/types';
import { useProfileStore } from '../../../shared/hooks/useProfileStore';

interface LogImportSchema {
  date: string;
  waterGlasses: number;
  tags: string[];
}

interface ProfileImportSchema {
  id: string;
  height: number;
  weight: number;
  age: number;
  gender: string;
  goal: string;
  updatedAt: string | Date;
}

interface BackupImportSchema {
  dailyLogs?: LogImportSchema[];
  userProfile?: ProfileImportSchema;
}

function isLogImportSchema(obj: unknown): obj is LogImportSchema {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(o.date) &&
    typeof o.waterGlasses === 'number' &&
    Array.isArray(o.tags) &&
    o.tags.every((t) => typeof t === 'string')
  );
}

function isProfileImportSchema(obj: unknown): obj is ProfileImportSchema {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.height === 'number' &&
    typeof o.weight === 'number' &&
    typeof o.age === 'number' &&
    typeof o.gender === 'string' &&
    typeof o.goal === 'string'
  );
}

export const useDataManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setStoreProfile = useProfileStore((state) => state.setProfile);

  // Clear notices helper
  const clearStatus = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // 1. ASYNC EXPORT METHOD
  const exportData = useCallback(async () => {
    setIsExporting(true);
    setError(null);
    setSuccess(null);
    try {
      const dailyLogs = await safeGetAllDailyLogs();
      const userProfile = await safeGetUserProfile('current');

      const backup: BackupImportSchema = {
        dailyLogs,
        userProfile,
      };

      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `healthino_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('Database backup generated and downloaded successfully.');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Database export failed';
      setError(errMsg);
    } finally {
      setIsExporting(false);
    }
  }, []);

  // 2. TRANSACTIONAL IMPORT METHOD WITH STRICT SCHEMAS
  const importData = useCallback(async (file: File) => {
    setIsImporting(true);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    
    const readPromise = new Promise<string>((resolve, reject) => {
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read backup file contents.'));
        }
      };
      reader.onerror = () => reject(new Error('File reader encountered an error.'));
      reader.readAsText(file);
    });

    try {
      const fileText = await readPromise;
      const parsedData = JSON.parse(fileText) as unknown;

      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid JSON format: Backup must be a JSON object.');
      }

      const backupObj = parsedData as BackupImportSchema;

      // Validate Daily Logs schema
      if (backupObj.dailyLogs) {
        if (!Array.isArray(backupObj.dailyLogs) || !backupObj.dailyLogs.every(isLogImportSchema)) {
          throw new Error('Validation failed: dailyLogs contains structurally invalid rows.');
        }
      }

      // Validate User Profile schema
      if (backupObj.userProfile) {
        if (!isProfileImportSchema(backupObj.userProfile)) {
          throw new Error('Validation failed: userProfile does not match schema criteria.');
        }
      }

      // Overwrite database tables transactionally
      await db.transaction('rw', [db.dailyLogs, db.userProfile], async () => {
        await db.dailyLogs.clear();
        await db.userProfile.clear();

        if (backupObj.dailyLogs) {
          const logsToSave: DailyLog[] = backupObj.dailyLogs.map((l) => ({
            date: l.date,
            waterGlasses: l.waterGlasses,
            tags: l.tags,
          }));
          for (const log of logsToSave) {
            await db.dailyLogs.put(log);
          }
        }

        if (backupObj.userProfile) {
          const profileToSave: UserProfile = {
            id: backupObj.userProfile.id,
            height: backupObj.userProfile.height,
            weight: backupObj.userProfile.weight,
            age: backupObj.userProfile.age,
            gender: backupObj.userProfile.gender,
            goal: backupObj.userProfile.goal,
            updatedAt: new Date(backupObj.userProfile.updatedAt),
          };
          await db.userProfile.put(profileToSave);

          // Update Zustand store
          setStoreProfile({
            height: profileToSave.height,
            weight: profileToSave.weight,
            age: profileToSave.age,
            gender: profileToSave.gender.toLowerCase().includes('female')
              ? 'female'
              : profileToSave.gender.toLowerCase().includes('male')
              ? 'male'
              : 'other',
            goal: profileToSave.goal.toLowerCase().includes('lose')
              ? 'lose'
              : profileToSave.goal.toLowerCase().includes('gain')
              ? 'gain'
              : 'maintain',
          });
        }
      });

      setSuccess('Backup imported successfully. Reloading UI context...');
      
      // Auto-reload window to securely refresh active routers, charts, and dashboards
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to import backup data';
      setError(errMsg);
    } finally {
      setIsImporting(false);
    }
  }, [setStoreProfile]);

  // 3. GENERATE MONTHLY PDF REPORT VIA BACKGROUND WEB WORKER
  const generateReport = useCallback(async () => {
    setIsGeneratingReport(true);
    setError(null);
    setSuccess(null);
    try {
      const dailyLogs = await safeGetAllDailyLogs();
      const userProfileFromDb = await safeGetUserProfile('current');
      
      // Fallback details if DB profile doesn't exist yet
      const storeState = useProfileStore.getState();
      const userProfile: UserProfile = userProfileFromDb || {
        id: 'current',
        height: storeState.profile?.height || 170,
        weight: storeState.profile?.weight || 70,
        age: storeState.profile?.age || 30,
        gender: storeState.profile?.gender || 'Other',
        goal: storeState.profile?.goal || 'Maintain',
        updatedAt: new Date(),
      };

      // Construct Vite-compliant Web Worker dynamically
      const worker = new Worker(
        new URL('../workers/dataProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.postMessage({ dailyLogs, userProfile });

      worker.onmessage = (e: MessageEvent<{ htmlReport: string }>) => {
        const { htmlReport } = e.data;
        
        // Render into hidden print iframe to keep main thread completely unblocked
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const blob = new Blob([htmlReport], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;

        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (printErr) {
            console.error('Print trigger failed:', printErr);
          } finally {
            // Cleanup iframe
            setTimeout(() => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(url);
            }, 1000);
          }
        };

        setSuccess('Monthly health review compiled and print layout dispatched.');
        setIsGeneratingReport(false);
        worker.terminate();
      };

      worker.onerror = (errEvent) => {
        console.error('Web worker compilation error:', errEvent);
        throw new Error('Background metrics compilation failed.');
      };

    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Could not compile monthly review report';
      setError(errMsg);
      setIsGeneratingReport(false);
    }
  }, []);

  return {
    isExporting,
    isImporting,
    isGeneratingReport,
    error,
    success,
    clearStatus,
    exportData,
    importData,
    generateReport,
  };
};
