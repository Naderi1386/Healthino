import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { useDailyLogger } from '../hooks/useDailyLogger';
import { CalendarGrid } from '../components/CalendarGrid';
import { WaterCounter } from '../components/WaterCounter';
import { TagSelector } from '../components/TagSelector';
import { Card } from '../../../shared/components';

export const TrackerPage: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    currentLog,
    allLogs,
    isLoading,
    error,
    updateWater,
    addTag,
    removeTag,
  } = useDailyLogger();

  const getFriendlyDate = (dateStr: string): string => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading && allLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 font-sans">
        <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-text-primary/60 text-sm font-medium">Accessing local database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Performance Tracker</h1>
          <p className="text-text-primary/70 text-sm mt-1">
            Analyze your wellness trends, manage hydration levels, and review food logging categories.
          </p>
        </div>
        {error && (
          <div className="flex items-center space-x-2 bg-alert/10 text-alert px-3 py-1.5 rounded-lg text-xs font-semibold self-start md:self-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Database alert: {error}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Calendar on Left, Logging Panels on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Column */}
        <div className="lg:col-span-5">
          <Card rounded="3xl" className="border border-text-primary/5">
            <CalendarGrid
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              allLogs={allLogs}
            />
          </Card>
        </div>

        {/* Action Logger Panels Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Date Panel Badge */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-accent-primary/5 border border-accent-primary/10 rounded-2xl">
            <Calendar className="w-4 h-4 text-accent-primary" />
            <span className="text-xs font-semibold text-text-primary/50 uppercase tracking-wider">Logging for:</span>
            <span className="text-sm font-bold text-accent-primary">{getFriendlyDate(selectedDate)}</span>
          </div>

          {/* Water Hydration Counter */}
          <Card rounded="3xl" className="border border-text-primary/5">
            <WaterCounter
              waterGlasses={currentLog.waterGlasses}
              onWaterChange={updateWater}
            />
          </Card>

          {/* Habit Tag Selection */}
          <Card rounded="3xl" className="border border-text-primary/5">
            <TagSelector
              activeTags={currentLog.tags}
              onAddTag={addTag}
              onRemoveTag={removeTag}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
