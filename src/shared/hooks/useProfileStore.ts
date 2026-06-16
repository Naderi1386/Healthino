import { create } from 'zustand';

export interface OnboardingProfile {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose' | 'gain' | 'maintain';
}

interface ProfileState {
  profile: OnboardingProfile | null;
  isOnboarded: boolean;
  setProfile: (profile: OnboardingProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => {
  // Check localStorage initially
  const stored = localStorage.getItem('healthino_user_profile');
  let initialProfile: OnboardingProfile | null = null;
  if (stored) {
    try {
      initialProfile = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse user profile', e);
    }
  }

  return {
    profile: initialProfile,
    isOnboarded: !!initialProfile,
    setProfile: (profile) => {
      localStorage.setItem('healthino_user_profile', JSON.stringify(profile));
      set({ profile, isOnboarded: true });
    },
    clearProfile: () => {
      localStorage.removeItem('healthino_user_profile');
      set({ profile: null, isOnboarded: false });
    },
  };
});
