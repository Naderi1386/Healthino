import type { UserProfile, DailyLog } from '../../../core/db/types';

// Helper to get relative date string formatted as YYYY-MM-DD
export const getPastDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const mockUserProfile: UserProfile = {
  id: 'current',
  height: 178, // in cm
  weight: 85.4, // in kg
  age: 30,
  gender: 'Non-binary',
  goal: 'Lose weight',
  updatedAt: new Date(),
};

// Generates a dynamic 7-day chronological dataset representing different health scenarios
export const mockDailyLogs: DailyLog[] = [
  // Day 1: 6 days ago - Excellent habits
  {
    date: getPastDateString(6),
    waterGlasses: 8,
    tags: ['🟢 Healthy Eating', '🟢 Workout', '🟢 Good Sleep', '🟢 Active Day'],
  },
  // Day 2: 5 days ago - Excellent habits
  {
    date: getPastDateString(5),
    waterGlasses: 9,
    tags: ['🟢 Healthy Eating', '🟢 Active Day', '🟢 Good Sleep', '🟡 Snack'],
  },
  // Day 3: 4 days ago - Suboptimal habits (low water, high red tags)
  {
    date: getPastDateString(4),
    waterGlasses: 2,
    tags: ['🔴 Processed Food', '🔴 Low Activity', '🔴 Late Night Snack', '🔴 High Stress'],
  },
  // Day 4: 3 days ago - Suboptimal habits (low water, high red tags)
  {
    date: getPastDateString(3),
    waterGlasses: 1,
    tags: ['🔴 Processed Food', '🔴 Dehydrated', '🔴 Late Night Snack', '🟡 Rest Day'],
  },
  // Day 5: 2 days ago - Balanced metrics
  {
    date: getPastDateString(2),
    waterGlasses: 6,
    tags: ['🟢 Healthy Eating', '🟡 Snack', '🔴 High Stress', '🟢 Active Day'],
  },
  // Day 6: 1 day ago - Balanced metrics
  {
    date: getPastDateString(1),
    waterGlasses: 7,
    tags: ['🟢 Healthy Eating', '🟡 Rest Day', '🟢 Hydrated', '🔴 Processed Food'],
  },
  // Day 7: Today - Balanced metrics
  {
    date: getPastDateString(0),
    waterGlasses: 5,
    tags: ['🟢 Healthy Eating', '🟡 Snack', '🟢 Workout', '🔴 Late Night Snack'],
  },
];
