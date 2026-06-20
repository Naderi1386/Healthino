import React from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { Card } from '../../../shared/components/card';
import { Button } from '../../../shared/components/button';

export interface PDFReportButtonProps {
  isGeneratingReport: boolean;
  onGenerateReport: () => Promise<void> | void;
}

export const PDFReportButton: React.FC<PDFReportButtonProps> = ({
  isGeneratingReport,
  onGenerateReport,
}) => {
  return (
    <Card rounded="3xl" className="border border-text-primary/5 bg-accent-primary/5 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-1 md:max-w-xl">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-primary" />
          <span>Monthly Health Review</span>
        </h3>
        <p className="text-text-primary/70 text-xs leading-relaxed">
          Compile your daily hydration totals, logged categories, and top habits into a clean, 
          structured visual progress review. The report compiles entirely in the background 
          and opens standard browser print triggers.
        </p>
      </div>

      <div className="shrink-0">
        <Button
          variant="secondary"
          onClick={onGenerateReport}
          disabled={isGeneratingReport}
          className="w-full md:w-auto h-11 flex items-center justify-center space-x-2 text-xs sm:text-base"
        >
          {isGeneratingReport ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Trends...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate Monthly Report</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
