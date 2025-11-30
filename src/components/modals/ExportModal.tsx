import React, { useState, useMemo } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import type { Page } from '@/types';
import { exportAsPNG, exportAsWEBP, exportAsPDF } from '@/utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
}

type ExportFormat = 'png' | 'pdf' | 'webp';

export function ExportModal({ isOpen, onClose, pages }: ExportModalProps): React.ReactElement | null {
  const { t } = useLocalization();
  
  const pagesWithImages = useMemo(() => 
    pages.filter(p => p.generatedImage !== null),
    [pages]
  );

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(
    new Set(pagesWithImages.map(p => p.id))
  );
  const [singlePDF, setSinglePDF] = useState(true);
  const [useZip, setUseZip] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAll = () => {
    setSelectedPageIds(new Set(pagesWithImages.map(p => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedPageIds(new Set());
  };

  const handleTogglePage = (pageId: string) => {
    const newSet = new Set(selectedPageIds);
    if (newSet.has(pageId)) {
      newSet.delete(pageId);
    } else {
      newSet.add(pageId);
    }
    setSelectedPageIds(newSet);
  };

  const handleExport = async () => {
    if (selectedPageIds.size === 0) return;
    
    setIsExporting(true);
    setError(null);

    try {
      const selectedPages = pagesWithImages.filter(p => selectedPageIds.has(p.id));

      if (selectedFormat === 'png') {
        await exportAsPNG(selectedPages, useZip);
      } else if (selectedFormat === 'webp') {
        await exportAsWEBP(selectedPages, useZip);
      } else if (selectedFormat === 'pdf') {
        await exportAsPDF(selectedPages, singlePDF);
      }

      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--bg-elevated)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text)' }}>
          {t('exportModal')}
        </h2>

        {pagesWithImages.length === 0 ? (
          <div className="mb-6">
            <p className="text-sm text-gray-600">{t('noGeneratedPages')}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectFormat')}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="png"
                    checked={selectedFormat === 'png'}
                    onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                    className="mr-2"
                  />
                  <span className="text-sm">PNG</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={selectedFormat === 'pdf'}
                    onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                    className="mr-2"
                  />
                  <span className="text-sm">PDF</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value="webp"
                    checked={selectedFormat === 'webp'}
                    onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                    className="mr-2"
                  />
                  <span className="text-sm">WEBP</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('selectPages')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {t('selectAll')}
                  </button>
                  <span className="text-xs text-gray-400">|</span>
                  <button
                    onClick={handleDeselectAll}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {t('deselectAll')}
                  </button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {pagesWithImages.map((page) => (
                    <label
                      key={page.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPageIds.has(page.id)}
                        onChange={() => handleTogglePage(page.id)}
                        className="flex-shrink-0"
                      />
                      <img
                        src={page.generatedImage!}
                        alt={page.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                      <span className="text-sm text-gray-700">{page.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {(selectedFormat === 'png' || selectedFormat === 'webp') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('exportOptions')}
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={!useZip}
                      onChange={() => setUseZip(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('individualDownloads')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      checked={useZip}
                      onChange={() => setUseZip(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('zipArchive')}</span>
                  </label>
                </div>
              </div>
            )}

            {selectedFormat === 'pdf' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('exportOptions')}
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pdfMode"
                      checked={singlePDF}
                      onChange={() => setSinglePDF(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('singlePDF')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="pdfMode"
                      checked={!singlePDF}
                      onChange={() => setSinglePDF(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">{t('separatePDFs')}</span>
                  </label>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="button-secondary"
            disabled={isExporting}
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleExport}
            disabled={selectedPageIds.size === 0 || isExporting || pagesWithImages.length === 0}
            className="button-primary"
          >
            {isExporting ? t('exporting') : t('export')}
          </button>
        </div>
      </div>
    </div>
  );
}
