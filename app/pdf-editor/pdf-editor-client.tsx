'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';

type PdfFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  bytes: Uint8Array;
  pageCount: number;
};

type WatermarkPosition = 'center' | 'top' | 'bottom';

type ToolStatus = 'Ready' | 'Coming soon';

type ToolCard = {
  title: string;
  description: string;
  status: ToolStatus;
};

const MAX_FILE_SIZE_MB = 50;
const INVALID_PAGE_RANGE_MESSAGE = 'Invalid page range.';

const toolCards: ToolCard[] = [
  {
    title: 'Preview PDF',
    description: 'Open a browser preview from the local file, with no upload step.',
    status: 'Ready',
  },
  {
    title: 'Rotate pages',
    description: 'Rotate every page, or enter page numbers such as 1,3,5 or 2-4.',
    status: 'Ready',
  },
  {
    title: 'Delete pages',
    description: 'Remove selected pages from a PDF.',
    status: 'Coming soon',
  },
  {
    title: 'Reorder pages',
    description: 'Drag pages into a new order before exporting.',
    status: 'Coming soon',
  },
  {
    title: 'Split PDF',
    description: 'Extract a page range into a smaller document.',
    status: 'Coming soon',
  },
  {
    title: 'Merge PDFs',
    description: 'Combine multiple uploaded PDFs in the order shown.',
    status: 'Ready',
  },
  {
    title: 'Add watermark',
    description: 'Apply local text watermarks to each page.',
    status: 'Ready',
  },
  {
    title: 'Add page numbers',
    description: 'Stamp page numbers before export.',
    status: 'Coming soon',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size when browser-safe compression is added.',
    status: 'Coming soon',
  },
  {
    title: 'Download edited PDF',
    description: 'Download the latest edited copy, or the original when no edit exists.',
    status: 'Ready',
  },
];

function makeFileId(file: File) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function toPdfBlob(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: 'application/pdf' });
}

function getEditedFileName(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, '');
  return `${baseName || 'document'}-edited.pdf`;
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function parsePageSelection(input: string, pageCount: number) {
  const trimmed = input.trim();

  if (!trimmed) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const selected = new Set<number>();
  const addPage = (pageNumber: number) => {
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(INVALID_PAGE_RANGE_MESSAGE);
    }
    selected.add(pageNumber - 1);
  };

  for (const part of trimmed.split(',')) {
    const token = part.trim();
    if (!token) throw new Error(INVALID_PAGE_RANGE_MESSAGE);

    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start > end) throw new Error(INVALID_PAGE_RANGE_MESSAGE);

      for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
        addPage(pageNumber);
      }
      continue;
    }

    if (!/^\d+$/.test(token)) throw new Error(INVALID_PAGE_RANGE_MESSAGE);
    addPage(Number(token));
  }

  return Array.from(selected).sort((a, b) => a - b);
}

async function readPdfFile(file: File): Promise<PdfFileItem> {
  if (!isPdfFile(file)) {
    throw new Error('Please upload a PDF file.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  try {
    const pdfDoc = await PDFDocument.load(bytes);
    return {
      id: makeFileId(file),
      file,
      name: file.name,
      size: file.size,
      bytes,
      pageCount: pdfDoc.getPageCount(),
    };
  } catch {
    throw new Error('Unable to read this PDF. This PDF may be encrypted or unsupported.');
  }
}

function getWatermarkY(position: WatermarkPosition, pageHeight: number, fontSize: number) {
  if (position === 'top') return pageHeight - fontSize * 3;
  if (position === 'bottom') return fontSize * 2;
  return pageHeight / 2;
}

export function PdfEditorClient() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editedBytes, setEditedBytes] = useState<Uint8Array | null>(null);
  const [editedPageCount, setEditedPageCount] = useState<number | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageSelection, setPageSelection] = useState('');
  const [watermarkText, setWatermarkText] = useState('FinanceSphere');
  const [watermarkFontSize, setWatermarkFontSize] = useState(42);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.22);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('center');

  const activeItem = useMemo(
    () => files.find((item) => item.id === activeFileId) ?? files[0] ?? null,
    [activeFileId, files],
  );
  const currentBytes = editedBytes ?? activeItem?.bytes ?? null;
  const currentPageCount = editedPageCount ?? activeItem?.pageCount ?? 0;
  const hasFiles = files.length > 0;
  const hasEditedPdf = Boolean(editedBytes);

  useEffect(() => {
    if (!currentBytes) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(toPdfBlob(currentBytes));
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [currentBytes]);

  const resetEditedState = useCallback(() => {
    setEditedBytes(null);
    setEditedPageCount(null);
    setDownloadFileName(null);
  }, []);

  const updateEditedPdf = useCallback((bytes: Uint8Array, pageCount: number, fileName: string, message: string) => {
    setEditedBytes(bytes);
    setEditedPageCount(pageCount);
    setDownloadFileName(fileName);
    setSuccess(message);
    setError(null);
  }, []);

  const loadFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const incomingFiles = Array.from(selectedFiles);
    if (incomingFiles.length === 0) return;

    const invalidFile = incomingFiles.find((file) => !isPdfFile(file));
    if (invalidFile) {
      setError(`Please upload a PDF file. "${invalidFile.name}" was not accepted.`);
      setSuccess(null);
      return;
    }

    const oversizedFile = incomingFiles.find((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFile) {
      setError(`"${oversizedFile.name}" is larger than the suggested ${MAX_FILE_SIZE_MB} MB limit.`);
      setSuccess(null);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const loadedFiles = await Promise.all(incomingFiles.map(readPdfFile));
      setFiles((previousFiles) => [...previousFiles, ...loadedFiles]);
      setActiveFileId((currentActiveId) => currentActiveId ?? loadedFiles[0]?.id ?? null);
      resetEditedState();
      setSuccess(
        loadedFiles.length === 1
          ? `${loadedFiles[0].name} is ready to preview and edit.`
          : `${loadedFiles.length} PDFs are ready to merge.`,
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to read this PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, [resetEditedState]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      void loadFiles(event.target.files);
      event.target.value = '';
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      void loadFiles(event.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    const remainingFiles = files.filter((item) => item.id !== fileId);
    setFiles(remainingFiles);
    if (activeFileId === fileId) {
      setActiveFileId(remainingFiles[0]?.id ?? null);
    }
    resetEditedState();
    setSuccess(remainingFiles.length > 0 ? 'PDF list updated.' : null);
    setError(null);
  };

  const moveFile = (fileId: string, direction: 'up' | 'down') => {
    setFiles((previousFiles) => {
      const index = previousFiles.findIndex((item) => item.id === fileId);
      const nextIndex = direction === 'up' ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= previousFiles.length) {
        return previousFiles;
      }

      const reorderedFiles = [...previousFiles];
      const [movedFile] = reorderedFiles.splice(index, 1);
      reorderedFiles.splice(nextIndex, 0, movedFile);
      return reorderedFiles;
    });
    resetEditedState();
    setSuccess('Merge order updated.');
  };

  const clearAllFiles = () => {
    setFiles([]);
    setActiveFileId(null);
    resetEditedState();
    setError(null);
    setSuccess(null);
    setPageSelection('');
  };

  const rotatePages = async (direction: 'clockwise' | 'counterclockwise') => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const pdfDoc = await PDFDocument.load(currentBytes);
      const pages = pdfDoc.getPages();
      const pageIndexes = parsePageSelection(pageSelection, pages.length);
      const delta = direction === 'clockwise' ? 90 : -90;

      pageIndexes.forEach((pageIndex) => {
        const page = pages[pageIndex];
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + delta + 360) % 360));
      });

      const savedBytes = await pdfDoc.save();
      updateEditedPdf(
        savedBytes,
        pdfDoc.getPageCount(),
        getEditedFileName(activeItem.name),
        `Rotated ${pageIndexes.length} page${pageIndexes.length === 1 ? '' : 's'}.`,
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : INVALID_PAGE_RANGE_MESSAGE);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyWatermark = async () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    const trimmedWatermark = watermarkText.trim();
    if (!trimmedWatermark) {
      setError('Enter watermark text before applying it.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const pdfDoc = await PDFDocument.load(currentBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const safeFontSize = clampNumber(watermarkFontSize, 10, 96);
      const safeOpacity = clampNumber(watermarkOpacity, 0.05, 0.75);

      pdfDoc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(trimmedWatermark, safeFontSize);
        const x = Math.max(24, (width - textWidth) / 2);
        const y = getWatermarkY(watermarkPosition, height, safeFontSize);

        page.drawText(trimmedWatermark, {
          x,
          y,
          size: safeFontSize,
          font,
          color: rgb(0.04, 0.45, 0.32),
          opacity: safeOpacity,
          rotate: watermarkPosition === 'center' ? degrees(-18) : degrees(0),
        });
      });

      const savedBytes = await pdfDoc.save();
      updateEditedPdf(
        savedBytes,
        pdfDoc.getPageCount(),
        getEditedFileName(activeItem.name),
        'Watermark applied to every page.',
      );
    } catch {
      setError('Unable to add watermark to this PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please choose at least two PDFs to merge.');
      setSuccess(null);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const sourcePdf = await PDFDocument.load(pdfFile.bytes);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const savedBytes = await mergedPdf.save();
      updateEditedPdf(
        savedBytes,
        mergedPdf.getPageCount(),
        'merged-document.pdf',
        `Merged ${files.length} PDFs into one document.`,
      );
    } catch {
      setError('Unable to merge these PDFs. One file may be encrypted or unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    const blobUrl = URL.createObjectURL(toPdfBlob(currentBytes));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
    setSuccess('Download started.');
    setError(null);
  };

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 text-white shadow-2xl shadow-slate-950/10">
        <div className="relative isolate px-5 py-10 sm:px-8 lg:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.86))]" />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere tools</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">PDF Editor</h1>
            <p className="mt-4 text-base leading-7 text-slate-200 sm:text-lg">
              Upload, preview, rotate, watermark, merge, and download PDFs from a clean browser-only workspace.
            </p>
            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
              Your PDF stays in your browser. Files are not uploaded to our server.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Upload PDFs</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Select one PDF for editing, or multiple PDFs for merge. Suggested max size: {MAX_FILE_SIZE_MB} MB each.
                </p>
              </div>
              {hasFiles && (
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="self-start rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Clear all
                </button>
              )}
            </div>

            <div
              className={`mt-5 rounded-3xl border-2 border-dashed p-6 text-center transition ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100'
                  : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl text-emerald-600">
                PDF
              </div>
              <p className="mt-4 text-base font-semibold">Drag and drop PDFs here</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or choose files from your device</p>
              <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950">
                Choose PDF files
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  className="sr-only"
                  onChange={handleInputChange}
                  aria-label="Choose PDF files"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Selected files
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{files.length} file{files.length === 1 ? '' : 's'}</span>
                </div>
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition ${
                      item.id === activeItem?.id
                        ? 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveFileId(item.id);
                          resetEditedState();
                          setSuccess(`${item.name} selected.`);
                          setError(null);
                        }}
                        className="min-w-0 text-left"
                        aria-label={`Select ${item.name} for preview`}
                      >
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatBytes(item.size)} · {item.pageCount} page{item.pageCount === 1 ? '' : 's'}
                          {item.id === activeItem?.id ? ' · Active preview' : ''}
                        </p>
                      </button>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => moveFile(item.id, 'up')}
                          disabled={index === 0}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFile(item.id, 'down')}
                          disabled={index === files.length - 1}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(item.id)}
                          className="rounded-lg border border-red-100 px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Edit tools</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Functional tools are enabled below. Future tools are clearly marked.
                </p>
              </div>
              {isProcessing && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                  Processing...
                </span>
              )}
            </div>

            <div className="mt-5 space-y-5">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <label htmlFor="page-selection" className="text-sm font-semibold text-slate-900 dark:text-white">
                  Pages to rotate
                </label>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Leave blank for all pages, or use formats like 1,3,5 and 2-4.
                </p>
                <input
                  id="page-selection"
                  value={pageSelection}
                  onChange={(event) => setPageSelection(event.target.value)}
                  placeholder="Example: 1,3,5 or 2-4"
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void rotatePages('counterclockwise')}
                    disabled={!hasFiles || isProcessing}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Rotate left 90°
                  </button>
                  <button
                    type="button"
                    onClick={() => void rotatePages('clockwise')}
                    disabled={!hasFiles || isProcessing}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Rotate right 90°
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Watermark text</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <span>Text</span>
                    <input
                      value={watermarkText}
                      onChange={(event) => setWatermarkText(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <span>Position</span>
                    <select
                      value={watermarkPosition}
                      onChange={(event) => setWatermarkPosition(event.target.value as WatermarkPosition)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </label>
                  <label className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <span>Font size</span>
                    <input
                      type="number"
                      min={10}
                      max={96}
                      value={watermarkFontSize}
                      onChange={(event) => setWatermarkFontSize(Number(event.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <label className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <span>Opacity</span>
                    <input
                      type="number"
                      min={0.05}
                      max={0.75}
                      step={0.05}
                      value={watermarkOpacity}
                      onChange={(event) => setWatermarkOpacity(Number(event.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => void applyWatermark()}
                  disabled={!hasFiles || isProcessing}
                  className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply watermark
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void mergePdfs()}
                  disabled={files.length < 2 || isProcessing}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                >
                  Merge selected PDFs
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={!hasFiles || isProcessing}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Download {hasEditedPdf ? 'edited' : 'original'} PDF
                </button>
              </div>

              {hasEditedPdf && (
                <button
                  type="button"
                  onClick={() => {
                    resetEditedState();
                    setSuccess('Preview restored to the original selected PDF.');
                  }}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Reset edits for active preview
                </button>
              )}
            </div>

            {(error || success) && (
              <div className="mt-5 space-y-3" aria-live="polite">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                    {success}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">PDF preview</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {activeItem
                  ? `${activeItem.name} · ${formatBytes(activeItem.size)} · ${currentPageCount} page${currentPageCount === 1 ? '' : 's'}`
                  : 'Upload a PDF to see a local browser preview.'}
              </p>
            </div>
            {hasEditedPdf && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                Edited
              </span>
            )}
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            {previewUrl ? (
              <object
                data={previewUrl}
                type="application/pdf"
                aria-label="PDF preview"
                className="h-[560px] w-full bg-white"
              >
                <div className="flex h-[560px] flex-col items-center justify-center p-6 text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preview unavailable in this browser.</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    You can still download the PDF and open it in your device viewer.
                  </p>
                </div>
              </object>
            ) : (
              <div className="flex h-[560px] flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-xl font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  PDF
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">No PDF selected yet.</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Upload a file to preview it without sending anything to a server.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Available PDF tools</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Ready tools work locally today. Disabled tools are labelled clearly for future implementation.
            </p>
          </div>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">No server storage. No external upload.</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {toolCards.map((tool) => (
            <article
              key={tool.title}
              className={`rounded-2xl border p-4 ${
                tool.status === 'Ready'
                  ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                  : 'border-slate-200 bg-slate-50 opacity-75 dark:border-slate-800 dark:bg-slate-950'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tool.title}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide ${
                    tool.status === 'Ready'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tool.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{tool.description}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
