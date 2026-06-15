import React from 'react';
import { Routes, Route } from 'react-router';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { DashboardPage } from '../../features/dashboard';
import { TrackerPage } from '../../features/tracker';
import { InsightsPage } from '../../features/insights';
import { GuidePage } from '../../features/data-management';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Route>
    </Routes>
  );
};
export default AppRoutes;
