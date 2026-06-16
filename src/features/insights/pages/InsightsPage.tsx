import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useInsights } from '../hooks/useInsights';
import { RecommendationFeed } from '../components/RecommendationFeed';

export const InsightsPage: React.FC = () => {
  const { insights, isLoading, error, refresh } = useInsights();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 font-sans">
        <div className="w-8 h-8 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin" />
        <p className="text-text-primary/60 text-sm font-medium">Analyzing logs and target rules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Insights Engine</h1>
          <p className="text-text-primary/70 text-sm mt-1">
            Personalized habits analysis and health recommendations computed 100% locally on your device.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {error && (
            <div className="flex items-center space-x-2 bg-alert/10 text-alert px-3 py-1.5 rounded-lg text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Offline: {error}</span>
            </div>
          )}
          <button
            type="button"
            onClick={refresh}
            className="h-11 px-4 text-xs font-semibold rounded-xl border border-text-primary/5 bg-card-bg text-text-primary/80 hover:bg-text-primary/5 cursor-pointer flex items-center gap-2 transition-all duration-200"
            title="Refresh recommendations"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* Recommendations Feed Container */}
      <div className="max-w-3xl">
        <RecommendationFeed insights={insights} />
      </div>
    </div>
  );
};
