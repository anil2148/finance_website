'use client';

import { useMemo, useState } from 'react';
import type { RefObject } from 'react';

type DownloadPdfButtonProps = {
  targetRef: RefObject<HTMLElement>;
  calculatorTitle: string;
  fileName?: string;
};

type ToastState = {
  type: 'success' | 'error';
  message: string;
} | null;

const createFileName = (base: string) => {
  const safeBase = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `${safeBase || 'calculator-output'}-${date}.pdf`;
};

export function DownloadPdfButton({ targetRef, calculatorTitle, fileName }: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const resolvedFileName = useMemo(
    () => (fileName?.endsWith('.pdf') ? fileName : createFileName(fileName ?? calculatorTitle)),
    [calculatorTitle, fileName]
  );

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleDownload = async () => {
    if (!targetRef.current || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth
      });

      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let remainingHeight = contentHeight;
      let offsetY = 0;

      pdf.addImage(imageData, 'PNG', margin, margin + offsetY, contentWidth, contentHeight, undefined, 'FAST');
      remainingHeight -= pageHeight - margin * 2;

      while (remainingHeight > 0) {
        offsetY -= pageHeight - margin * 2;
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', margin, margin + offsetY, contentWidth, contentHeight, undefined, 'FAST');
        remainingHeight -= pageHeight - margin * 2;
      }

      pdf.save(resolvedFileName);
      showToast({ type: 'success', message: 'PDF downloaded successfully.' });
    } catch (error) {
      console.error('Failed to generate PDF', error);
      showToast({ type: 'error', message: 'Unable to generate PDF. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative inline-flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDownload}
        aria-disabled={isGenerating}
        className={`inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
          isGenerating ? 'cursor-not-allowed opacity-70' : 'hover:bg-brand/90'
        }`}
      >
        {isGenerating ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
            Generating PDF...
          </>
        ) : (
          'Download PDF'
        )}
      </button>

      {toast ? (
        <p
          role="status"
          className={`pointer-events-none rounded-md px-3 py-2 text-xs font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.message}
        </p>
      ) : null}
    </div>
  );
}
