# Final Production Polish & Fixes

- [ ] **Fix:** Correct the Insights feature welcome/empty state logic to properly render personalized cards based on the localStorage onboarding goal when data is less than 3 days.
- [ ] **Cleanup:** Completely purge the mock data hydration layer (`mockDashboardData.ts`) and ensure the app relies 100% on real user data from day one.
- [ ] **Optimization:** Meticulously audit all `framer-motion` page transitions, layout shifts, and responsive drawer animations to eliminate any visual jitter, lag, or stuttering (Ensure strict 60fps).