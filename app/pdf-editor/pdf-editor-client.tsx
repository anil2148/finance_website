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

type WatermarkPosition = 'center' | 'top' | 'bottom' | 'diagonal';
type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-right';
type PageNumberFormat = 'page' | 'number' | 'page-of-total';
type BlankPagePlacement = 'end' | 'before' | 'after';

type ToolStatus = 'Ready' | 'Coming soon';

type ToolCard = {
  title: string;
  description: string;
  status: ToolStatus;
  group: 'Organize Pages' | 'Edit Content' | 'Combine / Split' | 'Export';
};

const MAX_FILE_SIZE_MB = 50;
const INVALID_PAGE_RANGE_MESSAGE = 'Invalid page range.';

const toolCards: ToolCard[] = [
  {
    title: 'Rotate pages',
    description: 'Rotate all pages or a selected range such as 1,3,5-7.',
    status: 'Ready',
    group: 'Organize Pages',
  },
  {
    title: 'Delete pages',
    description: 'Remove selected pages while preventing empty PDFs.',
    status: 'Ready',
    group: 'Organize Pages',
  },
  {
    title: 'Reorder pages',
    description: 'Rebuild the PDF from a complete custom order like 1,3,2,4.',
    status: 'Ready',
    group: 'Organize Pages',
  },
  {
    title: 'Add blank page',
    description: 'Insert a blank page at the end or around a selected page.',
    status: 'Ready',
    group: 'Organize Pages',
  },
  {
    title: 'Add watermark',
    description: 'Apply text watermarks to all pages or selected pages.',
    status: 'Ready',
    group: 'Edit Content',
  },
  {
    title: 'Add page numbers',
    description: 'Stamp readable page numbers in common positions and formats.',
    status: 'Ready',
    group: 'Edit Content',
  },
  {
    title: 'Add text',
    description: 'Place simple text annotations by page and coordinates.',
    status: 'Ready',
    group: 'Edit Content',
  },
  {
    title: 'Signature text/date',
    description: 'Add signature text, initials, or a date stamp as typed text.',
    status: 'Ready',
    group: 'Edit Content',
  },
  {
    title: 'Merge PDFs',
    description: 'Combine multiple selected PDFs in the order shown.',
    status: 'Ready',
    group: 'Combine / Split',
  },
  {
    title: 'Extract pages',
    description: 'Create a new PDF from a selected page range.',
    status: 'Ready',
    group: 'Combine / Split',
  },
  {
    title: 'Split PDF',
    description: 'Single range extraction is available now. Multi-file ZIP export is planned.',
    status: 'Coming soon',
    group: 'Combine / Split',
  },
  {
    title: 'Compress PDF',
    description: 'True compression requires image/font optimization and is planned.',
    status: 'Coming soon',
    group: 'Export',
  },
  {
    title: 'Download edited PDF',
    description: 'Download the current edited copy or the original upload.',
    status: 'Ready',
    group: 'Export',
  },
];

function makeFileId(file: File) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
}

export function formatBytes(bytes: number) {
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

export function getEditedFileName(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, '');
  return `${baseName || 'document'}-edited.pdf`;
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function getPageLabel(count: number) {
  return `${count} page${count === 1 ? '' : 's'}`;
}

function formatPageIndexesForHistory(pageIndexes: number[], pageCount: number) {
  if (pageIndexes.length === pageCount) return 'all pages';
  return `page${pageIndexes.length === 1 ? '' : 's'} ${pageIndexes.map((index) => index + 1).join(', ')}`;
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

export function parsePageOrder(input: string, pageCount: number) {
  const values = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (values.length !== pageCount) {
    throw new Error(`Enter every page exactly once, from 1 to ${pageCount}.`);
  }

  const seen = new Set<number>();
  const order = values.map((value) => {
    if (!/^\d+$/.test(value)) throw new Error('Page order must use comma-separated page numbers.');
    const pageNumber = Number(value);
    if (pageNumber < 1 || pageNumber > pageCount) {
      throw new Error(`Page ${pageNumber} is out of range.`);
    }
    if (seen.has(pageNumber)) {
      throw new Error(`Page ${pageNumber} appears more than once.`);
    }
    seen.add(pageNumber);
    return pageNumber - 1;
  });

  return order;
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

function getPageNumberText(format: PageNumberFormat, pageNumber: number, totalPages: number) {
  if (format === 'number') return `${pageNumber}`;
  if (format === 'page-of-total') return `Page ${pageNumber} of ${totalPages}`;
  return `Page ${pageNumber}`;
}

function getPageNumberCoordinates(
  position: PageNumberPosition,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  fontSize: number,
) {
  if (position === 'top-right') {
    return { x: pageWidth - textWidth - 36, y: pageHeight - fontSize - 28 };
  }

  if (position === 'bottom-right') {
    return { x: pageWidth - textWidth - 36, y: 28 };
  }

  return { x: Math.max(24, (pageWidth - textWidth) / 2), y: 28 };
}

function getOriginalFileName(activeItem: PdfFileItem | null) {
  return activeItem?.name ?? 'document.pdf';
}

function ToolGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <h3 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

const secondaryButtonClassName =
  'rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';

const primaryButtonClassName =
  'rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50';

export function PdfEditorClient() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editedBytes, setEditedBytes] = useState<Uint8Array | null>(null);
  const [editedPageCount, setEditedPageCount] = useState<number | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [lastEditedStatus, setLastEditedStatus] = useState('No edits yet');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageSelection, setPageSelection] = useState('');
  const [deletePageSelection, setDeletePageSelection] = useState('');
  const [extractPageSelection, setExtractPageSelection] = useState('');
  const [pageOrderInput, setPageOrderInput] = useState('');
  const [blankPagePlacement, setBlankPagePlacement] = useState<BlankPagePlacement>('end');
  const [blankPageAnchor, setBlankPageAnchor] = useState('1');
  const [watermarkPageSelection, setWatermarkPageSelection] = useState('');
  const [watermarkText, setWatermarkText] = useState('FinanceSphere');
  const [watermarkFontSize, setWatermarkFontSize] = useState(42);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.22);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('diagonal');
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberPosition>('bottom-center');
  const [pageNumberFormat, setPageNumberFormat] = useState<PageNumberFormat>('page-of-total');
  const [pageNumberFontSize, setPageNumberFontSize] = useState(10);
  const [annotationText, setAnnotationText] = useState('Reviewed');
  const [annotationPage, setAnnotationPage] = useState('1');
  const [annotationX, setAnnotationX] = useState(72);
  const [annotationY, setAnnotationY] = useState(72);
  const [annotationFontSize, setAnnotationFontSize] = useState(14);
  const [signatureText, setSignatureText] = useState('');
  const [initialsText, setInitialsText] = useState('');
  const [signaturePage, setSignaturePage] = useState('1');
  const [signatureX, setSignatureX] = useState(72);
  const [signatureY, setSignatureY] = useState(96);
  const [signatureFontSize, setSignatureFontSize] = useState(16);

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

  const addHistory = useCallback((message: string) => {
    setEditHistory((previousHistory) => [message, ...previousHistory].slice(0, 20));
    setLastEditedStatus(message);
  }, []);

  const resetEditedState = useCallback((message?: string) => {
    setEditedBytes(null);
    setEditedPageCount(null);
    setDownloadFileName(null);
    if (message) {
      setLastEditedStatus(message);
      setEditHistory((previousHistory) => [message, ...previousHistory].slice(0, 20));
    } else {
      setLastEditedStatus('No edits yet');
    }
  }, []);

  const updateEditedPdf = useCallback((
    bytes: Uint8Array,
    pageCount: number,
    fileName: string,
    message: string,
  ) => {
    setEditedBytes(bytes);
    setEditedPageCount(pageCount);
    setDownloadFileName(fileName);
    setSuccess(message);
    setError(null);
    addHistory(message);
  }, [addHistory]);

  const withCurrentPdf = useCallback(async (
    action: (pdfDoc: PDFDocument, activeFile: PdfFileItem) => Promise<{
      bytes: Uint8Array;
      pageCount: number;
      fileName?: string;
      message: string;
    }>,
  ) => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const pdfDoc = await PDFDocument.load(currentBytes);
      const result = await action(pdfDoc, activeItem);
      updateEditedPdf(
        result.bytes,
        result.pageCount,
        result.fileName ?? getEditedFileName(activeItem.name),
        result.message,
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to edit this PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, [activeItem, currentBytes, updateEditedPdf]);

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
      setError(`File is too large. "${oversizedFile.name}" is larger than the suggested ${MAX_FILE_SIZE_MB} MB limit.`);
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
          ? 'PDF loaded successfully.'
          : `${loadedFiles.length} PDFs loaded successfully for merge.`,
      );
      setEditHistory((previousHistory) => [
        ...loadedFiles.map((file) => `Uploaded ${file.name} (${getPageLabel(file.pageCount)})`),
        ...previousHistory,
      ].slice(0, 20));
      setLastEditedStatus('PDF loaded successfully.');
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
    const removedFile = files.find((item) => item.id === fileId);
    const remainingFiles = files.filter((item) => item.id !== fileId);
    setFiles(remainingFiles);
    if (activeFileId === fileId) {
      setActiveFileId(remainingFiles[0]?.id ?? null);
    }
    resetEditedState(removedFile ? `Removed ${removedFile.name} from merge list.` : 'PDF list updated.');
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
    resetEditedState('Merge order updated.');
    setSuccess('Merge order updated.');
  };

  const clearAllFiles = () => {
    setFiles([]);
    setActiveFileId(null);
    setEditedBytes(null);
    setEditedPageCount(null);
    setDownloadFileName(null);
    setEditHistory([]);
    setLastEditedStatus('No edits yet');
    setError(null);
    setSuccess(null);
    setPageSelection('');
    setDeletePageSelection('');
    setExtractPageSelection('');
    setPageOrderInput('');
  };

  const rotatePages = async (direction: 'clockwise' | 'counterclockwise') => {
    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const pages = pdfDoc.getPages();
      const pageIndexes = parsePageSelection(pageSelection, pages.length);
      const delta = direction === 'clockwise' ? 90 : -90;

      pageIndexes.forEach((pageIndex) => {
        const page = pages[pageIndex];
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + delta + 360) % 360));
      });

      const savedBytes = await pdfDoc.save();
      const selectedPages = formatPageIndexesForHistory(pageIndexes, pages.length);
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: `Pages rotated successfully (${selectedPages}).`,
      };
    });
  };

  const deletePages = async () => {
    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const pageIndexes = parsePageSelection(deletePageSelection, pdfDoc.getPageCount());
      if (pageIndexes.length >= pdfDoc.getPageCount()) {
        throw new Error('You cannot delete every page. Keep at least one page in the PDF.');
      }

      [...pageIndexes].sort((a, b) => b - a).forEach((pageIndex) => {
        pdfDoc.removePage(pageIndex);
      });

      const savedBytes = await pdfDoc.save();
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: `Pages deleted successfully (${pageIndexes.map((index) => index + 1).join(', ')}).`,
      };
    });
  };

  const reorderPages = async () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const sourcePdf = await PDFDocument.load(currentBytes);
      const order = parsePageOrder(pageOrderInput, sourcePdf.getPageCount());
      const reorderedPdf = await PDFDocument.create();
      const copiedPages = await reorderedPdf.copyPages(sourcePdf, order);
      copiedPages.forEach((page) => reorderedPdf.addPage(page));
      const savedBytes = await reorderedPdf.save();
      updateEditedPdf(
        savedBytes,
        reorderedPdf.getPageCount(),
        getEditedFileName(activeItem.name),
        'Pages reordered successfully.',
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to reorder pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const addBlankPage = async () => {
    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const firstPage = pdfDoc.getPage(0);
      const { width, height } = firstPage.getSize();

      if (blankPagePlacement === 'end') {
        pdfDoc.addPage([width, height]);
      } else {
        const anchorPage = Number(blankPageAnchor);
        if (!Number.isInteger(anchorPage) || anchorPage < 1 || anchorPage > pdfDoc.getPageCount()) {
          throw new Error('Enter a valid page number for blank page placement.');
        }
        const insertIndex = blankPagePlacement === 'before' ? anchorPage - 1 : anchorPage;
        pdfDoc.insertPage(insertIndex, [width, height]);
      }

      const savedBytes = await pdfDoc.save();
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: 'Blank page added successfully.',
      };
    });
  };

  const applyWatermark = async () => {
    const trimmedWatermark = watermarkText.trim();
    if (!trimmedWatermark) {
      setError('Enter watermark text before applying it.');
      setSuccess(null);
      return;
    }

    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const safeFontSize = clampNumber(watermarkFontSize, 10, 96);
      const safeOpacity = clampNumber(watermarkOpacity, 0.05, 0.75);
      const pages = pdfDoc.getPages();
      const pageIndexes = parsePageSelection(watermarkPageSelection, pages.length);

      pageIndexes.forEach((pageIndex) => {
        const page = pages[pageIndex];
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
          rotate: watermarkPosition === 'diagonal' ? degrees(-24) : degrees(0),
        });
      });

      const savedBytes = await pdfDoc.save();
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: `Watermark added successfully to ${formatPageIndexesForHistory(pageIndexes, pages.length)}.`,
      };
    });
  };

  const addPageNumbers = async () => {
    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      const safeFontSize = clampNumber(pageNumberFontSize, 8, 24);

      pages.forEach((page, index) => {
        const text = getPageNumberText(pageNumberFormat, index + 1, totalPages);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, safeFontSize);
        const { x, y } = getPageNumberCoordinates(pageNumberPosition, width, height, textWidth, safeFontSize);

        page.drawText(text, {
          x,
          y,
          size: safeFontSize,
          font,
          color: rgb(0.12, 0.16, 0.24),
        });
      });

      const savedBytes = await pdfDoc.save();
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: 'Page numbers added successfully.',
      };
    });
  };

  const addTextToPdf = async (text: string, options?: { page?: string; x?: number; y?: number; size?: number; history?: string }) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError('Enter text before adding it to the PDF.');
      setSuccess(null);
      return;
    }

    await withCurrentPdf(async (pdfDoc, activeFile) => {
      const targetPageNumber = Number(options?.page ?? annotationPage);
      if (!Number.isInteger(targetPageNumber) || targetPageNumber < 1 || targetPageNumber > pdfDoc.getPageCount()) {
        throw new Error('Enter a valid page number for text placement.');
      }

      const page = pdfDoc.getPage(targetPageNumber - 1);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const safeFontSize = clampNumber(options?.size ?? annotationFontSize, 6, 72);
      const { width, height } = page.getSize();
      const x = clampNumber(options?.x ?? annotationX, 0, width);
      const y = clampNumber(options?.y ?? annotationY, 0, height);

      page.drawText(trimmedText, {
        x,
        y,
        size: safeFontSize,
        font,
        color: rgb(0.02, 0.22, 0.18),
      });

      const savedBytes = await pdfDoc.save();
      return {
        bytes: savedBytes,
        pageCount: pdfDoc.getPageCount(),
        fileName: getEditedFileName(activeFile.name),
        message: options?.history ?? `Text annotation added successfully to page ${targetPageNumber}.`,
      };
    });
  };

  const addDateStamp = async () => {
    const dateStamp = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date());

    await addTextToPdf(dateStamp, {
      page: signaturePage,
      x: signatureX,
      y: signatureY - signatureFontSize - 8,
      size: signatureFontSize,
      history: 'Date stamp added successfully.',
    });
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
        'PDF merged successfully.',
      );
    } catch {
      setError('Unable to merge these PDFs. One file may be encrypted or unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractPages = async () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const sourcePdf = await PDFDocument.load(currentBytes);
      const pageIndexes = parsePageSelection(extractPageSelection, sourcePdf.getPageCount());
      const extractedPdf = await PDFDocument.create();
      const copiedPages = await extractedPdf.copyPages(sourcePdf, pageIndexes);
      copiedPages.forEach((page) => extractedPdf.addPage(page));
      const savedBytes = await extractedPdf.save();
      updateEditedPdf(
        savedBytes,
        extractedPdf.getPageCount(),
        getEditedFileName(activeItem.name),
        'Selected pages extracted successfully.',
      );
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to extract selected pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBytes = (bytes: Uint8Array, fileName: string, message: string) => {
    const blobUrl = URL.createObjectURL(toPdfBlob(bytes));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
    setSuccess(message);
    setError(null);
  };

  const downloadEditedPdf = () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    const fileName = hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name;
    downloadBytes(currentBytes, fileName, hasEditedPdf ? 'Edited PDF ready to download.' : 'Original PDF download started.');
  };

  const downloadOriginalPdf = () => {
    if (!activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    downloadBytes(activeItem.bytes, activeItem.name, 'Original PDF download started.');
  };

  const resetChanges = () => {
    if (!activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    resetEditedState('Reset changes to the original PDF.');
    setSuccess('Changes reset. Preview restored to the original selected PDF.');
    setError(null);
  };

  const canEdit = hasFiles && !isProcessing;

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 text-white shadow-2xl shadow-slate-950/10">
        <div className="relative isolate px-5 py-10 sm:px-8 lg:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.86))]" />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere tools</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">PDF Editor</h1>
            <p className="mt-4 text-base leading-7 text-slate-200 sm:text-lg">
              Upload, preview, organize, annotate, merge, split, and download PDFs from a clean browser-only workspace.
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
                <button type="button" onClick={clearAllFiles} className={secondaryButtonClassName}>
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
                          resetEditedState(`${item.name} selected.`);
                          setSuccess(`${item.name} selected.`);
                          setError(null);
                        }}
                        className="min-w-0 text-left"
                        aria-label={`Select ${item.name} for preview`}
                      >
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatBytes(item.size)} · {getPageLabel(item.pageCount)}
                          {item.id === activeItem?.id ? ' · Active preview' : ''}
                        </p>
                      </button>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button type="button" onClick={() => moveFile(item.id, 'up')} disabled={index === 0} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                          Up
                        </button>
                        <button type="button" onClick={() => moveFile(item.id, 'down')} disabled={index === files.length - 1} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                          Down
                        </button>
                        <button type="button" onClick={() => removeFile(item.id)} className="rounded-lg border border-red-100 px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">
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
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Editing tools</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Each tool works on the current edited PDF, so edits stack in order.
                </p>
              </div>
              {isProcessing && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                  Processing...
                </span>
              )}
            </div>

            <div className="mt-5 space-y-5">
              <ToolGroup title="Organize Pages" description="Rotate, delete, reorder, and insert pages. Page numbers are 1-based for humans.">
                <FieldLabel label="Pages to rotate">
                  <input id="page-selection" value={pageSelection} onChange={(event) => setPageSelection(event.target.value)} placeholder="Blank for all, or 1,3,5-7" className={inputClassName} />
                </FieldLabel>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => void rotatePages('counterclockwise')} disabled={!canEdit} className={secondaryButtonClassName}>
                    Rotate left 90°
                  </button>
                  <button type="button" onClick={() => void rotatePages('clockwise')} disabled={!canEdit} className={primaryButtonClassName}>
                    Rotate right 90°
                  </button>
                </div>

                <FieldLabel label="Pages to delete">
                  <input value={deletePageSelection} onChange={(event) => setDeletePageSelection(event.target.value)} placeholder="Example: 1,3 or 2-5" className={inputClassName} />
                </FieldLabel>
                <button type="button" onClick={() => void deletePages()} disabled={!canEdit || !deletePageSelection.trim()} className={secondaryButtonClassName}>
                  Delete selected pages
                </button>

                <FieldLabel label="New page order">
                  <input value={pageOrderInput} onChange={(event) => setPageOrderInput(event.target.value)} placeholder={`Example: ${currentPageCount >= 4 ? '1,3,2,4' : '1,2'}`} className={inputClassName} />
                </FieldLabel>
                <button type="button" onClick={() => void reorderPages()} disabled={!canEdit || !pageOrderInput.trim()} className={secondaryButtonClassName}>
                  Reorder pages
                </button>

                <div className="grid gap-3 sm:grid-cols-3">
                  <FieldLabel label="Blank page placement">
                    <select value={blankPagePlacement} onChange={(event) => setBlankPagePlacement(event.target.value as BlankPagePlacement)} className={inputClassName}>
                      <option value="end">At end</option>
                      <option value="before">Before page</option>
                      <option value="after">After page</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Page">
                    <input value={blankPageAnchor} onChange={(event) => setBlankPageAnchor(event.target.value)} disabled={blankPagePlacement === 'end'} className={inputClassName} />
                  </FieldLabel>
                  <div className="flex items-end">
                    <button type="button" onClick={() => void addBlankPage()} disabled={!canEdit} className={`${primaryButtonClassName} w-full`}>
                      Add blank page
                    </button>
                  </div>
                </div>
              </ToolGroup>

              <ToolGroup title="Edit Content" description="Add watermarks, page numbers, typed notes, signatures, initials, and date stamps.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldLabel label="Watermark text">
                    <input value={watermarkText} onChange={(event) => setWatermarkText(event.target.value)} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Watermark pages">
                    <input value={watermarkPageSelection} onChange={(event) => setWatermarkPageSelection(event.target.value)} placeholder="Blank for all pages" className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Position">
                    <select value={watermarkPosition} onChange={(event) => setWatermarkPosition(event.target.value as WatermarkPosition)} className={inputClassName}>
                      <option value="diagonal">Diagonal center</option>
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Font size">
                    <input type="number" min={10} max={96} value={watermarkFontSize} onChange={(event) => setWatermarkFontSize(Number(event.target.value))} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Opacity">
                    <input type="number" min={0.05} max={0.75} step={0.05} value={watermarkOpacity} onChange={(event) => setWatermarkOpacity(Number(event.target.value))} className={inputClassName} />
                  </FieldLabel>
                  <div className="flex items-end">
                    <button type="button" onClick={() => void applyWatermark()} disabled={!canEdit} className={`${primaryButtonClassName} w-full`}>
                      Add watermark
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  <FieldLabel label="Page number position">
                    <select value={pageNumberPosition} onChange={(event) => setPageNumberPosition(event.target.value as PageNumberPosition)} className={inputClassName}>
                      <option value="bottom-center">Bottom center</option>
                      <option value="bottom-right">Bottom right</option>
                      <option value="top-right">Top right</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Format">
                    <select value={pageNumberFormat} onChange={(event) => setPageNumberFormat(event.target.value as PageNumberFormat)} className={inputClassName}>
                      <option value="page">Page 1</option>
                      <option value="number">1</option>
                      <option value="page-of-total">Page 1 of 10</option>
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Font size">
                    <input type="number" min={8} max={24} value={pageNumberFontSize} onChange={(event) => setPageNumberFontSize(Number(event.target.value))} className={inputClassName} />
                  </FieldLabel>
                  <div className="flex items-end">
                    <button type="button" onClick={() => void addPageNumbers()} disabled={!canEdit} className={`${secondaryButtonClassName} w-full`}>
                      Add page numbers
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Text annotation</h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Coordinates start from bottom-left of the page.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-5">
                    <FieldLabel label="Text">
                      <input value={annotationText} onChange={(event) => setAnnotationText(event.target.value)} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Page">
                      <input value={annotationPage} onChange={(event) => setAnnotationPage(event.target.value)} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="X">
                      <input type="number" value={annotationX} onChange={(event) => setAnnotationX(Number(event.target.value))} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Y">
                      <input type="number" value={annotationY} onChange={(event) => setAnnotationY(Number(event.target.value))} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Size">
                      <input type="number" min={6} max={72} value={annotationFontSize} onChange={(event) => setAnnotationFontSize(Number(event.target.value))} className={inputClassName} />
                    </FieldLabel>
                  </div>
                  <button type="button" onClick={() => void addTextToPdf(annotationText)} disabled={!canEdit} className={`${primaryButtonClassName} mt-3 w-full`}>
                    Add text annotation
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Signature text, initials, and date</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-5">
                    <FieldLabel label="Signature">
                      <input value={signatureText} onChange={(event) => setSignatureText(event.target.value)} placeholder="Typed name" className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Initials">
                      <input value={initialsText} onChange={(event) => setInitialsText(event.target.value)} placeholder="AB" className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Page">
                      <input value={signaturePage} onChange={(event) => setSignaturePage(event.target.value)} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="X">
                      <input type="number" value={signatureX} onChange={(event) => setSignatureX(Number(event.target.value))} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Y">
                      <input type="number" value={signatureY} onChange={(event) => setSignatureY(Number(event.target.value))} className={inputClassName} />
                    </FieldLabel>
                  </div>
                  <FieldLabel label="Signature font size">
                    <input type="number" min={8} max={72} value={signatureFontSize} onChange={(event) => setSignatureFontSize(Number(event.target.value))} className={inputClassName} />
                  </FieldLabel>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <button type="button" onClick={() => void addTextToPdf(signatureText, { page: signaturePage, x: signatureX, y: signatureY, size: signatureFontSize, history: 'Signature text added successfully.' })} disabled={!canEdit || !signatureText.trim()} className={secondaryButtonClassName}>
                      Add signature text
                    </button>
                    <button type="button" onClick={() => void addTextToPdf(initialsText, { page: signaturePage, x: signatureX, y: signatureY, size: signatureFontSize, history: 'Initials added successfully.' })} disabled={!canEdit || !initialsText.trim()} className={secondaryButtonClassName}>
                      Add initials
                    </button>
                    <button type="button" onClick={() => void addDateStamp()} disabled={!canEdit} className={secondaryButtonClassName}>
                      Add date stamp
                    </button>
                  </div>
                </div>
              </ToolGroup>

              <ToolGroup title="Combine / Split" description="Merge uploaded PDFs, or extract a selected page range into a new editable PDF.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => void mergePdfs()} disabled={files.length < 2 || isProcessing} className={primaryButtonClassName}>
                    Merge selected PDFs
                  </button>
                  <FieldLabel label="Pages to extract">
                    <input value={extractPageSelection} onChange={(event) => setExtractPageSelection(event.target.value)} placeholder="Example: 1,3,5-7" className={inputClassName} />
                  </FieldLabel>
                </div>
                <button type="button" onClick={() => void extractPages()} disabled={!canEdit || !extractPageSelection.trim()} className={secondaryButtonClassName}>
                  Extract selected pages into new PDF
                </button>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  Split PDF: single range extraction is available now. Splitting every page into separate downloads needs ZIP export and is coming soon.
                </div>
              </ToolGroup>

              <ToolGroup title="Export" description="Download the original file, download the edited result, or reset back to the original.">
                <div className="grid gap-3 sm:grid-cols-3">
                  <button type="button" onClick={downloadEditedPdf} disabled={!hasFiles || isProcessing} className={primaryButtonClassName}>
                    Download Edited PDF
                  </button>
                  <button type="button" onClick={downloadOriginalPdf} disabled={!hasFiles || isProcessing} className={secondaryButtonClassName}>
                    Download Original PDF
                  </button>
                  <button type="button" onClick={resetChanges} disabled={!hasFiles || isProcessing || !hasEditedPdf} className={secondaryButtonClassName}>
                    Reset Changes
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  Compress PDF: coming soon. True PDF compression requires meaningful image and font optimization.
                </div>
              </ToolGroup>
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

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">PDF preview</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {activeItem
                    ? `${hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name} · ${currentPageCount ? getPageLabel(currentPageCount) : 'Page count unavailable'}`
                    : 'Upload a PDF to see a local browser preview.'}
                </p>
              </div>
              {hasEditedPdf && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Edited
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Original file</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{getOriginalFileName(activeItem)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Last edited status</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{lastEditedStatus}</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
              {previewUrl ? (
                <object data={previewUrl} type="application/pdf" aria-label="PDF preview" className="h-[560px] w-full bg-white">
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
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Edit history</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">A simple local activity list for this browser session.</p>
              </div>
              <button type="button" onClick={() => setEditHistory([])} disabled={editHistory.length === 0} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Clear history
              </button>
            </div>
            {editHistory.length > 0 ? (
              <ol className="mt-4 space-y-2">
                {editHistory.map((entry, index) => (
                  <li key={`${entry}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                    {entry}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                No edits yet. Upload a PDF and your actions will appear here.
              </p>
            )}
          </section>
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
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(['Organize Pages', 'Edit Content', 'Combine / Split', 'Export'] as const).map((group) => (
            <div key={group} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{group}</h3>
              <div className="mt-3 space-y-3">
                {toolCards.filter((tool) => tool.group === group).map((tool) => (
                  <article
                    key={tool.title}
                    className={`rounded-2xl border p-4 ${
                      tool.status === 'Ready'
                        ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                        : 'border-slate-200 bg-slate-50 opacity-75 dark:border-slate-800 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tool.title}</h4>
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
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
