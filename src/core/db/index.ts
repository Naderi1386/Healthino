import Dexie, { type Table } from 'dexie';
import type { UserProfile, DailyLog } from './types';

export class HealthinoDatabase extends Dexie {
  userProfile!: Table<UserProfile, string>;
  dailyLogs!: Table<DailyLog, string>;

  constructor() {
    super('HealthinoDatabase');
    try {
      this.version(1).stores({
        userProfile: 'id',
        dailyLogs: 'date',
      });
    } catch (error) {
      console.error('Failed to initialize Dexie schemas:', error);
      throw new Error('Database schema declaration failed.');
    }
  }
}

export const db = new HealthinoDatabase();

/**
 * Requests persistence of browser IndexedDB storage.
 */
export async function initStoragePersistence(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        return await navigator.storage.persist();
      }
      return isPersisted;
    } catch (err) {
      console.warn('Could not determine or request storage persistence status:', err);
      return false;
    }
  }
  return false;
}

/**
 * Type-safe, try-catch encapsulated queries and mutations.
 */
export async function safeSaveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await db.userProfile.put(profile);
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('Failed writing user profile:', errorDetails);
    throw new Error(`Failed to save user profile: ${errorDetails}`);
  }
}

export async function safeGetUserProfile(id: string = 'current'): Promise<UserProfile | undefined> {
  try {
    return await db.userProfile.get(id);
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('Failed reading user profile:', errorDetails);
    throw new Error(`Failed to load user profile: ${errorDetails}`);
  }
}

export async function safeSaveDailyLog(log: DailyLog): Promise<void> {
  try {
    await db.dailyLogs.put(log);
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('Failed writing daily log:', errorDetails);
    throw new Error(`Failed to save daily log: ${errorDetails}`);
  }
}

export async function safeGetDailyLog(date: string): Promise<DailyLog | undefined> {
  try {
    return await db.dailyLogs.get(date);
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('Failed reading daily log:', errorDetails);
    throw new Error(`Failed to load daily log: ${errorDetails}`);
  }
}

export async function safeGetAllDailyLogs(): Promise<DailyLog[]> {
  try {
    return await db.dailyLogs.toArray();
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('Failed loading daily logs:', errorDetails);
    throw new Error(`Failed to load all daily logs: ${errorDetails}`);
  }
}
