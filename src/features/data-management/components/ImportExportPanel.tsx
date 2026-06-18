import React, { useRef } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '../../../shared/components/card';
import { Button } from '../../../shared/components/button';

export interface ImportExportPanelProps {
  isExporting: boolean;
  isImporting: boolean;
  error: string | null;
  success: string | null;
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
  onClearStatus: () => void;
}

export const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  isExporting,
  isImporting,
  error,
  success,
  onExport,
  onImport,
  onClearStatus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file).then(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
      });
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast / Notice panel */}
      {(error || success) && (
        <div
          className={`p-4 rounded-xl flex items-start space-x-3 transition-all duration-300 animate-slide-up ${
            error
              ? 'bg-alert/10 text-alert border border-alert/20'
              : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
          }`}
        >
          {error ? (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-semibold">
            {error || success}
          </div>
          <button
            onClick={onClearStatus}
            className="text-xs underline cursor-pointer hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid containing Export and Import Panel blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Panel */}
        <Card rounded="3xl" className="flex flex-col justify-between p-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">Data Autonomy</span>
            <h3 className="text-lg font-bold text-text-primary">Backup & Export JSON</h3>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Create a snapshot of your local database. All logs, tagged habits, and user onboarding parameters 
              are written into a structured JSON string. This runs entirely on this browser sandbox.
            </p>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              onClick={onExport}
              disabled={isExporting || isImporting}
              className="w-full flex items-center justify-center space-x-2 h-11"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Packaging DB...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Import Panel */}
        <Card rounded="3xl" className="flex flex-col justify-between p-6">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-primary/50">Data Portability</span>
            <h3 className="text-lg font-bold text-text-primary">Restore & Import JSON</h3>
            <p className="text-text-primary/70 text-xs leading-relaxed">
              Restore from a previously saved backup file. Selecting a valid file will strictly validate its schema 
              and transactionally overwrite the existing records in this client workspace.
            </p>
          </div>

          <div className="mt-8">
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={triggerFileSelect}
              disabled={isExporting || isImporting}
              className="w-full flex items-center justify-center space-x-2 h-11"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Validating & Overwriting...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Select Backup File</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
