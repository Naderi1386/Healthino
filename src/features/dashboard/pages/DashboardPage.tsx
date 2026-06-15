import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Dashboard</h1>
      <p className="text-text-primary/70">Welcome to Healthino dashboard. Your emoji-based habit logs and progress summaries will appear here.</p>
    </div>
  );
};
