import React from 'react';
import { motion } from 'framer-motion';
import { useOnboardingForm } from '../../hooks/useOnboardingForm';

export const OnboardingModal: React.FC = () => {
  const {
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
  } = useOnboardingForm();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened Backdrop (blocking dismissal) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 bg-[#1C2421]/45 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative bg-card-bg w-full max-w-md p-8 rounded-3xl shadow-xl border border-text-primary/10 z-10"
      >
        <div className="text-center mb-6">
          <span className="text-3xl" role="img" aria-label="wave">
            👋
          </span>
          <h2 className="text-2xl font-extrabold text-text-primary mt-2">Welcome to Healthino</h2>
          <p className="text-text-primary/60 text-xs mt-1 leading-relaxed">
            Let's customize your profile. Your information remains privately stored in this browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {/* Inputs Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label htmlFor="height" className="text-xs font-semibold text-text-primary/70 mb-1">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className={`w-full bg-background/60 border ${
                  errors.height ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'
                } px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.height && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.height}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="weight" className="text-xs font-semibold text-text-primary/70 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75.0"
                className={`w-full bg-background/60 border ${
                  errors.weight ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'
                } px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.weight && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.weight}</span>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="age" className="text-xs font-semibold text-text-primary/70 mb-1">
                Age (yrs)
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className={`w-full bg-background/60 border ${
                  errors.age ? 'border-alert focus:ring-alert/20' : 'border-text-primary/15 focus:ring-accent-primary/20'
                } px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all`}
                required
              />
              {errors.age && <span className="text-[10px] text-alert mt-1 leading-tight">{errors.age}</span>}
            </div>
          </div>

          {/* Gender Select */}
          <div className="flex flex-col">
            <label htmlFor="gender" className="text-xs font-semibold text-text-primary/70 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
              className="w-full bg-background/60 border border-text-primary/15 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Non-binary</option>
            </select>
          </div>

          {/* Goal Select */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary/70 mb-1">Your Primary Health Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {(['lose', 'gain', 'maintain'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`py-2 px-1 border rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent-primary text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-accent-primary/95 transition-all duration-200 cursor-pointer disabled:opacity-50 mt-6"
          >
            {isSubmitting ? 'Configuring Profile...' : 'Save & Start'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
