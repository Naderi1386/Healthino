import React from 'react';
import { User, Activity, AlertCircle } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { ProgressRings } from '../components/ProgressRings';
import { PerformanceChart } from '../components/PerformanceChart';
import { ForecastCard } from '../components/ForecastCard';
import { Card } from '../../../shared/components/card';

export const DashboardPage: React.FC = () => {
  const { dailyLogs, userProfile, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 font-sans">
        <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-text-primary/60 text-sm font-medium">Aggregating health metrics...</p>
      </div>
    );
  }

  // Find today's log to supply to the daily activity rings
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find((log) => log.date === todayDateStr);

  // Calculate BMI for the stats card
  const heightInMeters = userProfile.height / 100;
  const bmi = heightInMeters > 0 ? (userProfile.weight / (heightInMeters * heightInMeters)).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-text-primary/70 text-sm mt-1">
            Track daily hydration, review emoji habit trends, and check goal forecasts.
          </p>
        </div>
        {error && (
          <div className="flex items-center space-x-2 bg-alert/10 text-alert px-3 py-1.5 rounded-lg text-xs font-semibold self-start md:self-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Running in mock-fallback mode</span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ring 1: Progress Rings */}
        <Card rounded="3xl" className="flex flex-col h-full justify-between">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">Daily Progress</span>
            <h2 className="text-lg font-bold text-text-primary mt-0.5">Activity Rings</h2>
          </div>
          <ProgressRings todayLog={todayLog} />
        </Card>

        {/* Ring 2: Forecast Card */}
        <Card rounded="3xl">
          <ForecastCard dailyLogs={dailyLogs} userProfile={userProfile} />
        </Card>

        {/* Ring 3: Quick Stats */}
        <Card rounded="3xl" className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">User Profile</span>
                <h2 className="text-lg font-bold text-text-primary mt-0.5">Quick Stats</h2>
              </div>
              <div className="p-2.5 bg-text-primary/5 rounded-xl text-text-primary/70">
                <User className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background/40 border border-text-primary/5 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/40">Weight</span>
                <p className="text-lg font-bold text-text-primary mt-0.5">{userProfile.weight} <span className="text-xs font-normal">kg</span></p>
              </div>
              <div className="bg-background/40 border border-text-primary/5 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/40">Height</span>
                <p className="text-lg font-bold text-text-primary mt-0.5">{userProfile.height} <span className="text-xs font-normal">cm</span></p>
              </div>
              <div className="bg-background/40 border border-text-primary/5 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/40">Age / Gender</span>
                <p className="text-sm font-bold text-text-primary mt-1.5 truncate">{userProfile.age} yrs / {userProfile.gender}</p>
              </div>
              <div className="bg-background/40 border border-text-primary/5 rounded-xl p-3.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/40">Calculated BMI</span>
                <p className="text-lg font-bold text-text-primary mt-0.5">{bmi}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-text-primary/5 pt-3.5 flex items-center space-x-2 text-xs text-text-primary/50">
            <Activity className="w-4 h-4 text-accent-primary" />
            <span>Profile metrics updated dynamically</span>
          </div>
        </Card>

        {/* Weekly Comparative Chart - full width on desktop */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card rounded="3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">Weekly Analysis</span>
                <h2 className="text-lg font-bold text-text-primary mt-0.5">Performance Trend</h2>
              </div>
              <span className="text-xs text-text-primary/60 font-medium bg-text-primary/5 px-2.5 py-1 rounded-md">
                Last 7 Days
              </span>
            </div>
            <PerformanceChart dailyLogs={dailyLogs} />
          </Card>
        </div>
      </div>
    </div>
  );
};
