export interface UserProfile {
  id: string; // Primary key, e.g., 'current' for local-first single-user flow
  height: number;
  weight: number;
  age: number;
  gender: string;
  goal: string;
  updatedAt: Date;
}

export interface DailyLog {
  date: string; // Primary key, formatted as 'YYYY-MM-DD'
  waterGlasses: number;
  tags: string[]; // Emoji/tag array, e.g. ["🟢 Healthy", "🟡 Neutral"]
}
