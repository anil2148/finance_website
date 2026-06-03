'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type PointerEvent,
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
type EditorTool = 'none' | 'add-text' | 'erase' | 'signature' | 'page-tools';
type PreviewMode = 'edited' | 'original';
type PdfTextColor = 'slate' | 'emerald' | 'blue' | 'red';

type ToolStatus = 'Ready' | 'Coming soon';

type PendingObject = {
  id: string;
  type: 'text' | 'erase';
  pageIndex: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  text: string;
  fontSize: number;
  color: PdfTextColor;
  bold: boolean;
};

type PdfSnapshot = {
  bytes: Uint8Array;
  pageCount: number;
  fileName: string;
  isOriginal: boolean;
};

type DraftState = {
  pendingObjects: PendingObject[];
  activeTool: EditorTool;
  activePageIndex: number;
  selectedPageIndexes: number[];
  annotationText: string;
  signatureText: string;
  initialsText: string;
  savedAt: string;
};

type ToolCard = {
  title: string;
  description: string;
  status: ToolStatus;
  group: 'Organize Pages' | 'Edit Content' | 'Combine / Split' | 'Export';
};

const MAX_FILE_SIZE_MB = 50;
const INVALID_PAGE_RANGE_MESSAGE = 'Invalid page range.';
const PDF_EDITOR_DRAFT_KEY = 'financesphere-pdf-editor-draft-v1';

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
    title: 'Erase Text Area',
    description: 'Cover visible text with a white box. This does not rewrite embedded PDF text.',
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

function makeObjectId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `object-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

function getTextColor(color: PdfTextColor) {
  if (color === 'emerald') return rgb(0.04, 0.45, 0.32);
  if (color === 'blue') return rgb(0.1, 0.28, 0.72);
  if (color === 'red') return rgb(0.72, 0.12, 0.12);
  return rgb(0.12, 0.16, 0.24);
}

function getPageLabel(count: number) {
  return `${count} page${count === 1 ? '' : 's'}`;
}

function formatPageIndexesForHistory(pageIndexes: number[], pageCount: number) {
  if (pageIndexes.length === pageCount) return 'all pages';
  return `page${pageIndexes.length === 1 ? '' : 's'} ${pageIndexes.map((index) => index + 1).join(', ')}`;
}

function pageIndexesToInput(pageIndexes: number[]) {
  return pageIndexes.map((index) => index + 1).join(',');
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable;
}

function getToolInstruction(tool: EditorTool) {
  if (tool === 'add-text') return 'Add Text: Click anywhere on the PDF to place text. Drag to reposition before applying.';
  if (tool === 'erase') return 'Erase Text Area: Click to place a cover box over visible text. Add replacement text if needed.';
  if (tool === 'signature') return 'Signature: Click where you want your signature, initials, or date.';
  if (tool === 'page-tools') return 'Page Tools: Select pages from thumbnails or enter page numbers.';
  return 'Choose a quick action or tool, then review your PDF before downloading.';
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
  const previewWorkspaceRef = useRef<HTMLDivElement | null>(null);
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editedBytes, setEditedBytes] = useState<Uint8Array | null>(null);
  const [editedPageCount, setEditedPageCount] = useState<number | null>(null);
  const [downloadFileName, setDownloadFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('edited');
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<EditorTool>('none');
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [selectedPageIndexes, setSelectedPageIndexes] = useState<number[]>([]);
  const [pendingObjects, setPendingObjects] = useState<PendingObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<PdfSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<PdfSnapshot[]>([]);
  const [draftStatus, setDraftStatus] = useState('No local draft yet.');
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
  const [annotationColor, setAnnotationColor] = useState<PdfTextColor>('slate');
  const [annotationBold, setAnnotationBold] = useState(false);
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
  const previewBytes = previewMode === 'original' ? activeItem?.bytes ?? null : currentBytes;
  const selectedPageInput = useMemo(() => pageIndexesToInput(selectedPageIndexes), [selectedPageIndexes]);
  const selectedObject = useMemo(
    () => pendingObjects.find((object) => object.id === selectedObjectId) ?? null,
    [pendingObjects, selectedObjectId],
  );
  const hasFiles = files.length > 0;
  const hasEditedPdf = Boolean(editedBytes);

  useEffect(() => {
    if (!previewBytes) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(toPdfBlob(previewBytes));
    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [previewBytes]);

  useEffect(() => {
    if (currentPageCount <= 0) {
      setActivePageIndex(0);
      setSelectedPageIndexes([]);
      return;
    }

    setActivePageIndex((previousIndex) => Math.min(previousIndex, currentPageCount - 1));
    setSelectedPageIndexes((previousIndexes) =>
      previousIndexes.filter((pageIndex) => pageIndex >= 0 && pageIndex < currentPageCount),
    );
  }, [currentPageCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasDraftContent = pendingObjects.length > 0 || selectedPageIndexes.length > 0 || activeTool !== 'none';
    if (!hasDraftContent) return;

    const draft: DraftState = {
      pendingObjects,
      activeTool,
      activePageIndex,
      selectedPageIndexes,
      annotationText,
      signatureText,
      initialsText,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(PDF_EDITOR_DRAFT_KEY, JSON.stringify(draft));
    setDraftStatus('Draft saved locally.');
  }, [
    activePageIndex,
    activeTool,
    annotationText,
    initialsText,
    pendingObjects,
    selectedPageIndexes,
    signatureText,
  ]);

  const addHistory = useCallback((message: string) => {
    setEditHistory((previousHistory) => [message, ...previousHistory].slice(0, 20));
    setLastEditedStatus(message);
  }, []);

  const resetEditedState = useCallback((message?: string) => {
    setEditedBytes(null);
    setEditedPageCount(null);
    setDownloadFileName(null);
    setPreviewMode('edited');
    setUndoStack([]);
    setRedoStack([]);
    if (message) {
      setLastEditedStatus(message);
      setEditHistory((previousHistory) => [message, ...previousHistory].slice(0, 20));
    } else {
      setLastEditedStatus('No edits yet');
    }
  }, []);

  const getCurrentSnapshot = useCallback((): PdfSnapshot | null => {
    if (!currentBytes || !activeItem) return null;

    return {
      bytes: currentBytes,
      pageCount: currentPageCount,
      fileName: hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name,
      isOriginal: !hasEditedPdf,
    };
  }, [activeItem, currentBytes, currentPageCount, downloadFileName, hasEditedPdf]);

  const updateEditedPdf = useCallback((
    bytes: Uint8Array,
    pageCount: number,
    fileName: string,
    message: string,
  ) => {
    const previousSnapshot = getCurrentSnapshot();
    if (previousSnapshot) {
      setUndoStack((previousStack) => [...previousStack, previousSnapshot].slice(-10));
      setRedoStack([]);
    }
    setEditedBytes(bytes);
    setEditedPageCount(pageCount);
    setDownloadFileName(fileName);
    setPreviewMode('edited');
    setSuccess(message);
    setError(null);
    addHistory(message);
  }, [addHistory, getCurrentSnapshot]);

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
      setPendingObjects([]);
      setSelectedObjectId(null);
      setSelectedPageIndexes([]);
      setActivePageIndex(0);
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
    setPreviewMode('edited');
    setPendingObjects([]);
    setSelectedObjectId(null);
    setDraggingObjectId(null);
    setSelectedPageIndexes([]);
    setActivePageIndex(0);
    setActiveTool('none');
    setUndoStack([]);
    setRedoStack([]);
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
      const pageIndexes = parsePageSelection(pageSelection.trim() || selectedPageInput, pages.length);
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
      const pageIndexes = parsePageSelection(deletePageSelection.trim() || selectedPageInput, pdfDoc.getPageCount());
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
      const pageIndexes = parsePageSelection(watermarkPageSelection.trim() || selectedPageInput, pages.length);

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
      const font = await pdfDoc.embedFont(annotationBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
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
        color: getTextColor(annotationColor),
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

  const updatePendingObject = (objectId: string, updates: Partial<PendingObject>) => {
    setPendingObjects((previousObjects) =>
      previousObjects.map((object) => (object.id === objectId ? { ...object, ...updates } : object)),
    );
  };

  const deletePendingObject = useCallback((objectId: string | null = selectedObjectId) => {
    if (!objectId) return;

    setPendingObjects((previousObjects) => previousObjects.filter((object) => object.id !== objectId));
    setSelectedObjectId(null);
  }, [selectedObjectId]);

  const duplicatePendingObject = (objectId: string | null = selectedObjectId) => {
    const sourceObject = pendingObjects.find((object) => object.id === objectId);
    if (!sourceObject) return;

    const nextObject: PendingObject = {
      ...sourceObject,
      id: makeObjectId(),
      xPercent: clampNumber(sourceObject.xPercent + 3, 0, 92),
      yPercent: clampNumber(sourceObject.yPercent + 3, 0, 92),
    };

    setPendingObjects((previousObjects) => [...previousObjects, nextObject]);
    setSelectedObjectId(nextObject.id);
  };

  const addPendingObject = (type: PendingObject['type'], xPercent: number, yPercent: number, text?: string) => {
    const objectText =
      text ??
      (activeTool === 'signature' ? signatureText || initialsText || 'Signature' : annotationText || 'Text');
    const nextObject: PendingObject = {
      id: makeObjectId(),
      type,
      pageIndex: activePageIndex,
      xPercent: clampNumber(xPercent, 0, 92),
      yPercent: clampNumber(yPercent, 0, 92),
      widthPercent: type === 'erase' ? 28 : 18,
      heightPercent: type === 'erase' ? 8 : 5,
      text: type === 'erase' ? '' : objectText,
      fontSize: type === 'erase' ? 12 : activeTool === 'signature' ? signatureFontSize : annotationFontSize,
      color: annotationColor,
      bold: activeTool === 'signature' || annotationBold,
    };

    setPendingObjects((previousObjects) => [...previousObjects, nextObject]);
    setSelectedObjectId(nextObject.id);
    setSuccess(type === 'erase' ? 'Erase area placed. Review it, then apply pending edits.' : 'Text box placed. Drag or edit it, then apply pending edits.');
    setError(null);
  };

  const handlePreviewClick = (event: PointerEvent<HTMLDivElement>) => {
    if (!previewWorkspaceRef.current || !hasFiles) return;
    if (activeTool !== 'add-text' && activeTool !== 'signature' && activeTool !== 'erase') return;

    const rect = previewWorkspaceRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    addPendingObject(activeTool === 'erase' ? 'erase' : 'text', xPercent, yPercent);
  };

  const handleObjectPointerDown = (event: PointerEvent<HTMLDivElement>, objectId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedObjectId(objectId);
    setDraggingObjectId(objectId);
  };

  const handlePreviewPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingObjectId || !previewWorkspaceRef.current) return;

    const rect = previewWorkspaceRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    updatePendingObject(draggingObjectId, {
      xPercent: clampNumber(xPercent, 0, 94),
      yPercent: clampNumber(yPercent, 0, 94),
    });
  };

  const renderPendingObjectToPdf = async (pdfDoc: PDFDocument, object: PendingObject) => {
    const pageIndex = Math.min(object.pageIndex, pdfDoc.getPageCount() - 1);
    const page = pdfDoc.getPage(pageIndex);
    const { width, height } = page.getSize();
    const x = (object.xPercent / 100) * width;
    const y = height - (object.yPercent / 100) * height;

    if (object.type === 'erase') {
      const eraseWidth = (object.widthPercent / 100) * width;
      const eraseHeight = (object.heightPercent / 100) * height;
      page.drawRectangle({
        x,
        y: y - eraseHeight,
        width: eraseWidth,
        height: eraseHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.85, 0.9, 0.88),
        borderWidth: 0.5,
      });

      if (object.text.trim()) {
        const font = await pdfDoc.embedFont(object.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
        page.drawText(object.text.trim(), {
          x: x + 4,
          y: y - eraseHeight + 4,
          size: object.fontSize,
          font,
          color: getTextColor(object.color),
        });
      }
      return;
    }

    const font = await pdfDoc.embedFont(object.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
    page.drawText(object.text.trim() || 'Text', {
      x,
      y,
      size: object.fontSize,
      font,
      color: getTextColor(object.color),
    });
  };

  const buildPendingAppliedPdf = async () => {
    if (!currentBytes || !activeItem) {
      throw new Error('Please upload a PDF file.');
    }
    if (pendingObjects.length === 0) {
      throw new Error('No pending edits to apply.');
    }

    const pdfDoc = await PDFDocument.load(currentBytes);
    for (const object of pendingObjects) {
      await renderPendingObjectToPdf(pdfDoc, object);
    }
    const savedBytes = await pdfDoc.save();

    return {
      bytes: savedBytes,
      pageCount: pdfDoc.getPageCount(),
      fileName: getEditedFileName(activeItem.name),
      message: `${pendingObjects.length} pending edit${pendingObjects.length === 1 ? '' : 's'} applied successfully.`,
    };
  };

  const applyPendingObjects = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await buildPendingAppliedPdf();
      updateEditedPdf(result.bytes, result.pageCount, result.fileName, result.message);
      setPendingObjects([]);
      setSelectedObjectId(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to apply pending edits.');
    } finally {
      setIsProcessing(false);
    }
  };

  const setToolAndMessage = (tool: EditorTool, message?: string) => {
    setActiveTool(tool);
    if (tool === 'page-tools') {
      setSuccess(message ?? 'Select pages from thumbnails or enter page numbers.');
    } else if (tool !== 'none') {
      setSuccess(message ?? getToolInstruction(tool));
    } else {
      setSuccess(null);
    }
    setError(null);
  };

  const applyQuickAction = (action: 'signature' | 'date' | 'name' | 'page-numbers' | 'watermark' | 'erase' | 'merge' | 'extract') => {
    if (action === 'signature') {
      setSignatureText(signatureText || 'Signature');
      setToolAndMessage('signature', 'Click where you want your signature/date.');
      return;
    }

    if (action === 'date') {
      setAnnotationText(new Intl.DateTimeFormat('en-US').format(new Date()));
      setToolAndMessage('add-text', 'Click where you want the date.');
      return;
    }

    if (action === 'name') {
      setAnnotationText('Name');
      setToolAndMessage('add-text', 'Click where you want the name field.');
      return;
    }

    if (action === 'page-numbers') {
      void addPageNumbers();
      return;
    }

    if (action === 'watermark') {
      setWatermarkText('CONFIDENTIAL');
      void applyWatermark();
      return;
    }

    if (action === 'erase') {
      setToolAndMessage('erase', 'Drag over existing text to cover it. Add replacement text if needed.');
      return;
    }

    if (action === 'merge') {
      void mergePdfs();
      return;
    }

    setToolAndMessage('page-tools', 'Select pages from thumbnails or enter page numbers, then extract pages.');
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
      const pageIndexes = parsePageSelection(extractPageSelection.trim() || selectedPageInput, sourcePdf.getPageCount());
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

  const downloadEditedPdf = async () => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    if (pendingObjects.length > 0) {
      const shouldApplyPendingEdits = window.confirm('You have pending edits. Apply them before downloading?');
      if (!shouldApplyPendingEdits) {
        setError('You have pending edits. Apply them before downloading, or clear pending edits.');
        setSuccess(null);
        return;
      }

      setIsProcessing(true);
      try {
        const result = await buildPendingAppliedPdf();
        updateEditedPdf(result.bytes, result.pageCount, result.fileName, result.message);
        setPendingObjects([]);
        setSelectedObjectId(null);
        downloadBytes(result.bytes, result.fileName, 'Pending edits applied. Download started.');
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to apply pending edits before download.');
      } finally {
        setIsProcessing(false);
      }
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
    setPendingObjects([]);
    setSelectedObjectId(null);
    setSuccess('Changes reset. Preview restored to the original selected PDF.');
    setError(null);
  };

  const restoreSnapshot = (snapshot: PdfSnapshot) => {
    if (snapshot.isOriginal) {
      setEditedBytes(null);
      setEditedPageCount(null);
      setDownloadFileName(null);
    } else {
      setEditedBytes(snapshot.bytes);
      setEditedPageCount(snapshot.pageCount);
      setDownloadFileName(snapshot.fileName);
    }
    setPreviewMode('edited');
  };

  const undoLastEdit = useCallback(() => {
    const currentSnapshot = getCurrentSnapshot();
    if (!currentSnapshot || undoStack.length === 0) return;

    const previousSnapshot = undoStack[undoStack.length - 1];
    setUndoStack((previousStack) => previousStack.slice(0, -1));
    setRedoStack((previousStack) => [...previousStack, currentSnapshot].slice(-10));
    restoreSnapshot(previousSnapshot);
    addHistory('Undo applied.');
  }, [addHistory, getCurrentSnapshot, undoStack]);

  const redoLastEdit = useCallback(() => {
    const currentSnapshot = getCurrentSnapshot();
    if (!currentSnapshot || redoStack.length === 0) return;

    const nextSnapshot = redoStack[redoStack.length - 1];
    setRedoStack((previousStack) => previousStack.slice(0, -1));
    setUndoStack((previousStack) => [...previousStack, currentSnapshot].slice(-10));
    restoreSnapshot(nextSnapshot);
    addHistory('Redo applied.');
  }, [addHistory, getCurrentSnapshot, redoStack]);

  const clearPendingEdits = () => {
    setPendingObjects([]);
    setSelectedObjectId(null);
    setDraggingObjectId(null);
    setSuccess('Pending edits cleared.');
    setError(null);
  };

  const resumeLastDraft = () => {
    if (typeof window === 'undefined') return;

    const rawDraft = window.localStorage.getItem(PDF_EDITOR_DRAFT_KEY);
    if (!rawDraft) {
      setDraftStatus('No saved draft found.');
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as DraftState;
      setPendingObjects(draft.pendingObjects ?? []);
      setActiveTool(draft.activeTool ?? 'none');
      setActivePageIndex(draft.activePageIndex ?? 0);
      setSelectedPageIndexes(draft.selectedPageIndexes ?? []);
      setAnnotationText(draft.annotationText ?? annotationText);
      setSignatureText(draft.signatureText ?? signatureText);
      setInitialsText(draft.initialsText ?? initialsText);
      setDraftStatus('Draft resumed locally. Upload or keep using the matching PDF before applying.');
      setSuccess('Draft resumed locally.');
      setError(null);
    } catch {
      setDraftStatus('Saved draft could not be restored.');
    }
  };

  const clearLocalDraft = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(PDF_EDITOR_DRAFT_KEY);
    }
    setDraftStatus('Local draft cleared.');
  };

  const togglePageSelection = (pageIndex: number) => {
    setActiveTool('page-tools');
    setActivePageIndex(pageIndex);
    setSelectedPageIndexes((previousIndexes) => {
      if (previousIndexes.includes(pageIndex)) {
        return previousIndexes.filter((index) => index !== pageIndex);
      }

      return [...previousIndexes, pageIndex].sort((a, b) => a - b);
    });
  };

  const selectAllPages = () => {
    setActiveTool('page-tools');
    setSelectedPageIndexes(Array.from({ length: currentPageCount }, (_, index) => index));
  };

  const clearSelectedPages = () => {
    setSelectedPageIndexes([]);
  };

  const useSelectedPagesForToolInputs = () => {
    if (!selectedPageInput) {
      setError('Select one or more page cards first.');
      setSuccess(null);
      return;
    }

    setPageSelection(selectedPageInput);
    setDeletePageSelection(selectedPageInput);
    setExtractPageSelection(selectedPageInput);
    setWatermarkPageSelection(selectedPageInput);
    setSuccess('Selected pages copied into page tools.');
    setError(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const isModifierPressed = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (isModifierPressed && key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undoLastEdit();
        return;
      }

      if ((isModifierPressed && key === 'y') || (isModifierPressed && event.shiftKey && key === 'z')) {
        event.preventDefault();
        redoLastEdit();
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedObjectId) {
        event.preventDefault();
        deletePendingObject(selectedObjectId);
        return;
      }

      if (event.key === 'Escape') {
        setSelectedObjectId(null);
        setActiveTool('none');
        return;
      }

      if (event.key === '+' || event.key === '=') {
        setZoom((previousZoom) => clampNumber(Number((previousZoom + 0.1).toFixed(2)), 0.75, 1.5));
      }

      if (event.key === '-' || event.key === '_') {
        setZoom((previousZoom) => clampNumber(Number((previousZoom - 0.1).toFixed(2)), 0.75, 1.5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletePendingObject, redoLastEdit, selectedObjectId, undoLastEdit]);

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
                          setPendingObjects([]);
                          setSelectedObjectId(null);
                          setSelectedPageIndexes([]);
                          setActivePageIndex(0);
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Quick actions</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Pick a common task and the editor will switch to the right mode.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                Beginner friendly
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Add Signature', action: 'signature' as const },
                { label: 'Add Date', action: 'date' as const },
                { label: 'Add Name', action: 'name' as const },
                { label: 'Add Page Numbers', action: 'page-numbers' as const },
                { label: 'Add Confidential Watermark', action: 'watermark' as const },
                { label: 'Erase Text Area', action: 'erase' as const },
                { label: 'Merge PDFs', action: 'merge' as const },
                { label: 'Extract Pages', action: 'extract' as const },
              ].map((quickAction) => (
                <button
                  key={quickAction.label}
                  type="button"
                  onClick={() => applyQuickAction(quickAction.action)}
                  disabled={!hasFiles && quickAction.action !== 'merge'}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-emerald-500/10"
                >
                  {quickAction.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                Your PDF stays in your browser.
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                Text removal works by covering visible text. Some PDFs do not allow true embedded text editing.
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
                Review your PDF before downloading.
              </div>
            </div>

            {!hasFiles ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Example workflow: upload a PDF, choose Add Text or Sign, click the preview to place it, apply pending edits, then download.
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                Recommended next actions: Add Text, Erase Text Area, Sign, Add Page Numbers, then Download.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Selected object</h2>
            {selectedObject ? (
              <div className="mt-4 space-y-3">
                <FieldLabel label={selectedObject.type === 'erase' ? 'Replacement text (optional)' : 'Text'}>
                  <input
                    value={selectedObject.text}
                    onChange={(event) => updatePendingObject(selectedObject.id, { text: event.target.value })}
                    className={inputClassName}
                  />
                </FieldLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldLabel label="Font size">
                    <input
                      type="number"
                      min={6}
                      max={72}
                      value={selectedObject.fontSize}
                      onChange={(event) => updatePendingObject(selectedObject.id, { fontSize: Number(event.target.value) })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Color">
                    <select
                      value={selectedObject.color}
                      onChange={(event) => updatePendingObject(selectedObject.id, { color: event.target.value as PdfTextColor })}
                      className={inputClassName}
                    >
                      <option value="slate">Slate</option>
                      <option value="emerald">Emerald</option>
                      <option value="blue">Blue</option>
                      <option value="red">Red</option>
                    </select>
                  </FieldLabel>
                </div>
                {selectedObject.type === 'erase' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldLabel label="Erase width">
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={Math.round(selectedObject.widthPercent)}
                        onChange={(event) => updatePendingObject(selectedObject.id, { widthPercent: clampNumber(Number(event.target.value), 5, 90) })}
                        className={inputClassName}
                      />
                    </FieldLabel>
                    <FieldLabel label="Erase height">
                      <input
                        type="number"
                        min={3}
                        max={40}
                        value={Math.round(selectedObject.heightPercent)}
                        onChange={(event) => updatePendingObject(selectedObject.id, { heightPercent: clampNumber(Number(event.target.value), 3, 40) })}
                        className={inputClassName}
                      />
                    </FieldLabel>
                  </div>
                )}
                <div className="grid gap-2 sm:grid-cols-3">
                  <button type="button" onClick={() => updatePendingObject(selectedObject.id, { bold: !selectedObject.bold })} className={secondaryButtonClassName}>
                    {selectedObject.bold ? 'Bold on' : 'Bold off'}
                  </button>
                  <button type="button" onClick={() => duplicatePendingObject(selectedObject.id)} className={secondaryButtonClassName}>
                    Duplicate
                  </button>
                  <button type="button" onClick={() => deletePendingObject(selectedObject.id)} className={secondaryButtonClassName}>
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                Select a pending text or erase box on the preview to edit it here.
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Local draft</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{draftStatus}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={resumeLastDraft} className={secondaryButtonClassName}>
                  Resume last draft
                </button>
                <button type="button" onClick={clearLocalDraft} className={secondaryButtonClassName}>
                  Clear draft
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Shortcuts</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <span>Ctrl/Cmd+Z: undo</span>
              <span>Ctrl/Cmd+Y: redo</span>
              <span>Delete/Backspace: delete selected object</span>
              <span>Escape: deselect tool/object</span>
              <span>+ / -: zoom in or out</span>
            </div>
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
                <button type="button" onClick={() => void deletePages()} disabled={!canEdit || (!deletePageSelection.trim() && selectedPageIndexes.length === 0)} className={secondaryButtonClassName}>
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
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Click the preview to place text, or use manual placement for fine control.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { label: 'Name', value: 'Name' },
                      { label: 'Address', value: 'Address' },
                      { label: 'Date', value: new Intl.DateTimeFormat('en-US').format(new Date()) },
                      { label: 'Signature', value: signatureText || 'Signature' },
                      { label: 'Initials', value: initialsText || 'Initials' },
                      { label: '✓ Checkbox', value: '✓' },
                      { label: 'X mark', value: 'X' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setAnnotationText(preset.value);
                          setToolAndMessage('add-text', `${preset.label} preset selected. Click the preview to place it.`);
                        }}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
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
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <FieldLabel label="Text color">
                      <select value={annotationColor} onChange={(event) => setAnnotationColor(event.target.value as PdfTextColor)} className={inputClassName}>
                        <option value="slate">Slate</option>
                        <option value="emerald">Emerald</option>
                        <option value="blue">Blue</option>
                        <option value="red">Red</option>
                      </select>
                    </FieldLabel>
                    <button type="button" onClick={() => setAnnotationBold((previous) => !previous)} className={`${secondaryButtonClassName} self-end ${annotationBold ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200' : ''}`}>
                      {annotationBold ? 'Bold on' : 'Bold off'}
                    </button>
                    <button type="button" onClick={() => setToolAndMessage('add-text')} disabled={!canEdit} className={`${primaryButtonClassName} self-end`}>
                      Click to place text
                    </button>
                  </div>
                  <button type="button" onClick={() => void addTextToPdf(annotationText)} disabled={!canEdit} className={`${secondaryButtonClassName} mt-3 w-full`}>
                    Add text using manual page/X/Y
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

                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Erase Text Area</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This covers visible text with a white box. It does not remove embedded text data or OCR content.
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setToolAndMessage('erase')} disabled={!canEdit} className={primaryButtonClassName}>
                      Click preview to place erase box
                    </button>
                    <button type="button" onClick={() => setToolAndMessage('add-text', 'Click to add replacement text after placing an erase box.')} disabled={!canEdit} className={secondaryButtonClassName}>
                      Add replacement text
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Pending visual edits</h4>
                      <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-200">
                        {pendingObjects.length} pending object{pendingObjects.length === 1 ? '' : 's'} waiting to be applied.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => void applyPendingObjects()} disabled={!canEdit || pendingObjects.length === 0} className={primaryButtonClassName}>
                        Apply pending edits
                      </button>
                      <button type="button" onClick={clearPendingEdits} disabled={pendingObjects.length === 0} className={secondaryButtonClassName}>
                        Clear pending edits
                      </button>
                    </div>
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
                <button type="button" onClick={() => void extractPages()} disabled={!canEdit || (!extractPageSelection.trim() && selectedPageIndexes.length === 0)} className={secondaryButtonClassName}>
                  Extract selected pages into new PDF
                </button>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  Split PDF: single range extraction is available now. Splitting every page into separate downloads needs ZIP export and is coming soon.
                </div>
              </ToolGroup>

              <ToolGroup title="Export" description="Download the original file, download the edited result, or reset back to the original.">
                <div className="grid gap-3 sm:grid-cols-5">
                  <button type="button" onClick={() => void downloadEditedPdf()} disabled={!hasFiles || isProcessing} className={primaryButtonClassName}>
                    Download Edited PDF
                  </button>
                  <button type="button" onClick={downloadOriginalPdf} disabled={!hasFiles || isProcessing} className={secondaryButtonClassName}>
                    Download Original PDF
                  </button>
                  <button type="button" onClick={undoLastEdit} disabled={undoStack.length === 0 || isProcessing} className={secondaryButtonClassName}>
                    Undo
                  </button>
                  <button type="button" onClick={redoLastEdit} disabled={redoStack.length === 0 || isProcessing} className={secondaryButtonClassName}>
                    Redo
                  </button>
                  <button type="button" onClick={resetChanges} disabled={!hasFiles || isProcessing || !hasEditedPdf} className={secondaryButtonClassName}>
                    Reset All
                  </button>
                </div>
                <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 sm:grid-cols-2">
                  <span>✓ Preview updated</span>
                  <span>{pendingObjects.length === 0 ? '✓ No pending edits' : '• Pending edits need applying'}</span>
                  <span>{hasFiles ? '✓ File ready' : '• Upload a file first'}</span>
                  <span>Page count: {currentPageCount || 'Not available'}</span>
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

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
              {getToolInstruction(activeTool)}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewMode('edited')}
                  className={`px-3 py-1.5 text-xs font-bold ${previewMode === 'edited' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300'}`}
                >
                  Edited
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('original')}
                  disabled={!activeItem}
                  className={`px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${previewMode === 'original' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300'}`}
                >
                  Original
                </button>
              </div>
              <button type="button" onClick={() => setZoom((value) => clampNumber(Number((value - 0.1).toFixed(2)), 0.75, 1.5))} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                -
              </button>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {Math.round(zoom * 100)}%
              </span>
              <button type="button" onClick={() => setZoom((value) => clampNumber(Number((value + 0.1).toFixed(2)), 0.75, 1.5))} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                +
              </button>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[132px_minmax(0,1fr)]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Pages</h3>
                  <span className="text-xs text-slate-500">{selectedPageIndexes.length} selected</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Page render thumbnails are not enabled, so cards show page numbers for selection clarity.
                </p>
                <div className="mt-3 flex max-h-[560px] gap-2 overflow-auto xl:block xl:space-y-2">
                  {currentPageCount > 0 ? Array.from({ length: currentPageCount }, (_, pageIndex) => {
                    const isActivePage = activePageIndex === pageIndex;
                    const isSelectedPage = selectedPageIndexes.includes(pageIndex);

                    return (
                      <button
                        key={pageIndex}
                        type="button"
                        onClick={() => togglePageSelection(pageIndex)}
                        className={`min-w-24 rounded-2xl border p-2 text-left transition xl:min-w-0 xl:w-full ${
                          isActivePage
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                            : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                        } ${isSelectedPage ? 'ring-2 ring-emerald-300' : ''}`}
                      >
                        <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100 text-lg font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          {pageIndex + 1}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Page {pageIndex + 1}</span>
                          <span className={isSelectedPage ? 'text-emerald-600' : 'text-slate-400'}>{isSelectedPage ? 'Selected' : 'Select'}</span>
                        </div>
                      </button>
                    );
                  }) : (
                    <p className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                      Upload a PDF to see page cards.
                    </p>
                  )}
                </div>
                <div className="mt-3 grid gap-2">
                  <button type="button" onClick={selectAllPages} disabled={!hasFiles} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300">
                    Select all
                  </button>
                  <button type="button" onClick={clearSelectedPages} disabled={selectedPageIndexes.length === 0} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300">
                    Clear selection
                  </button>
                  <button type="button" onClick={useSelectedPagesForToolInputs} disabled={selectedPageIndexes.length === 0} className="rounded-lg bg-emerald-500 px-2 py-1 text-xs font-bold text-white disabled:opacity-50">
                    Use selected pages
                  </button>
                </div>
              </div>

              <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                <div
                  ref={previewWorkspaceRef}
                  className="relative min-h-[560px] w-full origin-top bg-white"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                  onPointerMove={handlePreviewPointerMove}
                  onPointerUp={() => setDraggingObjectId(null)}
                  onPointerLeave={() => setDraggingObjectId(null)}
                >
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
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-200 text-xl font-bold text-slate-500">
                        PDF
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-700">No PDF selected yet.</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Upload a file to preview it without sending anything to a server.
                      </p>
                    </div>
                  )}

                  <div
                    className="absolute inset-0"
                    style={{ pointerEvents: activeTool !== 'none' || pendingObjects.length > 0 ? 'auto' : 'none' }}
                    onPointerDown={handlePreviewClick}
                  >
                    {pendingObjects.filter((object) => object.pageIndex === activePageIndex).map((object) => {
                      const isSelected = object.id === selectedObjectId;
                      return (
                        <div
                          key={object.id}
                          role="button"
                          tabIndex={0}
                          onPointerDown={(event) => handleObjectPointerDown(event, object.id)}
                          className={`absolute cursor-move rounded-md border-2 bg-white/85 shadow-lg ${
                            isSelected ? 'border-emerald-500 ring-4 ring-emerald-300/30' : 'border-blue-400'
                          }`}
                          style={{
                            left: `${object.xPercent}%`,
                            top: `${object.yPercent}%`,
                            width: `${object.widthPercent}%`,
                            minHeight: `${object.heightPercent}%`,
                          }}
                        >
                          {object.type === 'erase' ? (
                            <div className="h-full min-h-8 rounded bg-white text-center text-[10px] font-semibold text-slate-400">
                              Erase area
                            </div>
                          ) : (
                            <div
                              className="truncate px-2 py-1"
                              style={{
                                fontSize: `${Math.max(10, object.fontSize)}px`,
                                fontWeight: object.bold ? 700 : 400,
                                color: object.color === 'emerald' ? '#047857' : object.color === 'blue' ? '#1d4ed8' : object.color === 'red' ? '#b91c1c' : '#1f2937',
                              }}
                            >
                              {object.text || 'Text'}
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                          )}
                        </div>
                      );
                    })}

                    {selectedObject && (
                      <div
                        className="absolute z-20 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-xl"
                        onPointerDown={(event) => event.stopPropagation()}
                        style={{
                          left: `${Math.min(selectedObject.xPercent, 62)}%`,
                          top: `${Math.max(0, selectedObject.yPercent - 10)}%`,
                        }}
                      >
                        {selectedObject.type === 'text' && (
                          <>
                            <input
                              type="number"
                              min={6}
                              max={72}
                              value={selectedObject.fontSize}
                              onChange={(event) => updatePendingObject(selectedObject.id, { fontSize: Number(event.target.value) })}
                              className="w-16 rounded border border-slate-200 px-1 py-0.5"
                              aria-label="Selected text font size"
                            />
                            <select
                              value={selectedObject.color}
                              onChange={(event) => updatePendingObject(selectedObject.id, { color: event.target.value as PdfTextColor })}
                              className="rounded border border-slate-200 px-1 py-0.5"
                              aria-label="Selected text color"
                            >
                              <option value="slate">Slate</option>
                              <option value="emerald">Green</option>
                              <option value="blue">Blue</option>
                              <option value="red">Red</option>
                            </select>
                            <button type="button" onClick={() => updatePendingObject(selectedObject.id, { bold: !selectedObject.bold })} className="rounded border border-slate-200 px-2 py-0.5 font-bold">
                              B
                            </button>
                          </>
                        )}
                        <button type="button" onClick={() => duplicatePendingObject(selectedObject.id)} className="rounded border border-slate-200 px-2 py-0.5">
                          Duplicate
                        </button>
                        <button type="button" onClick={() => deletePendingObject(selectedObject.id)} className="rounded border border-red-200 px-2 py-0.5 text-red-600">
                          Delete
                        </button>
                        <button type="button" onClick={() => void applyPendingObjects()} className="rounded bg-emerald-500 px-2 py-0.5 font-bold text-white">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
