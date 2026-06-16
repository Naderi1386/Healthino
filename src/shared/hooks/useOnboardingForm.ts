import { useState } from 'react';
import { useProfileStore } from './useProfileStore';
import type { OnboardingProfile } from './useProfileStore';

export interface FormErrors {
  height?: string;
  weight?: string;
  age?: string;
}

export interface UseOnboardingFormResult {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  goal: 'lose' | 'gain' | 'maintain';
  errors: FormErrors;
  setHeight: (val: string) => void;
  setWeight: (val: string) => void;
  setAge: (val: string) => void;
  setGender: (val: 'male' | 'female' | 'other') => void;
  setGoal: (val: 'lose' | 'gain' | 'maintain') => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const useOnboardingForm = (): UseOnboardingFormResult => {
  const [height, setHeightState] = useState<string>('');
  const [weight, setWeightState] = useState<string>('');
  const [age, setAgeState] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [goal, setGoal] = useState<'lose' | 'gain' | 'maintain'>('lose');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const setProfile = useProfileStore((state) => state.setProfile);

  const setHeight = (val: string) => {
    setHeightState(val);
    if (errors.height) setErrors((prev) => ({ ...prev, height: undefined }));
  };

  const setWeight = (val: string) => {
    setWeightState(val);
    if (errors.weight) setErrors((prev) => ({ ...prev, weight: undefined }));
  };

  const setAge = (val: string) => {
    setAgeState(val);
    if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const h = parseFloat(height);
    if (isNaN(h) || h < 100 || h > 250) {
      newErrors.height = 'Height must be 100 to 250 cm.';
    }

    const w = parseFloat(weight);
    if (isNaN(w) || w < 30 || w > 300) {
      newErrors.weight = 'Weight must be 30 to 300 kg.';
    }

    const a = parseInt(age, 10);
    if (isNaN(a) || a < 12 || a > 110) {
      newErrors.age = 'Age must be 12 to 110 years.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const profileData: OnboardingProfile = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        age: parseInt(age, 10),
        gender,
        goal,
      };
      // Save user profile state
      setProfile(profileData);
      setIsSubmitting(false);
    }
  };

  return {
    height,
    weight,
    age,
    gender,
    goal,
    errors,
    setHeight,
    setWeight,
    setAge,
    setGender,
    setGoal,
    handleSubmit,
    isSubmitting,
  };
};
