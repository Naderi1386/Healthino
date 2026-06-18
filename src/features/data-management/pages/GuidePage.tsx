import React from 'react';
import { useDataManagement } from '../hooks/useDataManagement';
import { ProductGuide } from '../components/ProductGuide';
import { ImportExportPanel } from '../components/ImportExportPanel';
import { PDFReportButton } from '../components/PDFReportButton';

export const GuidePage: React.FC = () => {
  const {
    isExporting,
    isImporting,
    isGeneratingReport,
    error,
    success,
    clearStatus,
    exportData,
    importData,
    generateReport,
  } = useDataManagement();

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Guide & Data Portability</h1>
        <p className="text-text-primary/70 text-sm mt-1">
          Access the product documentation, download a JSON database backup, or compile your monthly health reviews.
        </p>
      </div>

      {/* PDF Report Generation Button Row */}
      <PDFReportButton
        isGeneratingReport={isGeneratingReport}
        onGenerateReport={generateReport}
      />

      {/* Database JSON Import/Export Operations */}
      <ImportExportPanel
        isExporting={isExporting}
        isImporting={isImporting}
        error={error}
        success={success}
        onExport={exportData}
        onImport={importData}
        onClearStatus={clearStatus}
      />

      {/* Divider */}
      <div className="border-t border-text-primary/5 pt-4" />

      {/* Product Guide Cards */}
      <ProductGuide />
    </div>
  );
};
