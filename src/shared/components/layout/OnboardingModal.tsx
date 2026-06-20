import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingForm } from '../../hooks/useOnboardingForm';

export const OnboardingModal: React.FC = () => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const {
    height, weight, age, gender, goal, errors,
    setHeight, setWeight, setAge, setGender, setGoal,
    handleSubmit, isSubmitting,
  } = useOnboardingForm();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-text-primary/30 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-card-bg w-full max-w-md p-5 sm:p-8 rounded-3xl shadow-xl border border-text-primary/10 z-10 mx-2 sm:mx-0"
      >
        <div className="text-center mb-6">
          <span className="text-3xl sm:text-4xl" role="img" aria-label="wave">👋</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary mt-2">Welcome to Healthino</h2>
          <p className="text-text-primary/60 text-[10px] sm:text-xs mt-1 leading-relaxed px-2">
            Let's customize your profile. Your information remains privately stored in this browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="flex flex-col">
              <label htmlFor="height" className="text-xs font-semibold text-text-primary/70 mb-1">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className={`w-full bg-background/60 border ${errors.height ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'} px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.height && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.height}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="weight" className="text-xs font-semibold text-text-primary/70 mb-1">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75.0"
                className={`w-full bg-background/60 border ${errors.weight ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'} px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.weight && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.weight}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="age" className="text-xs font-semibold text-text-primary/70 mb-1">Age (yrs)</label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className={`w-full bg-background/60 border ${errors.age ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'} px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.age && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.age}</span>}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender" className="text-xs font-semibold text-text-primary/70 mb-1">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              className="w-full bg-background/60 border border-text-primary/15 px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Non-binary</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary/70 mb-1">Your Primary Health Goal</label>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {(['lose', 'gain', 'maintain'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`py-2 px-1 border rounded-xl text-[10px] sm:text-xs font-semibold capitalize transition-transform active:scale-95 cursor-pointer whitespace-normal leading-tight flex items-center justify-center text-center min-h-[48px] ${
                    goal === g
                      ? 'border-accent-primary bg-accent-primary/5 text-accent-primary font-bold'
                      : 'border-text-primary/15 bg-transparent text-text-primary/65 hover:bg-background/45'
                  }`}
                >
                  {g === 'lose' ? 'Lose Weight' : g === 'gain' ? 'Gain Weight' : 'Maintain'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent-primary text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-accent-primary/95 transition-transform active:scale-95 duration-200 cursor-pointer disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Configuring Profile...' : 'Save & Start'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

