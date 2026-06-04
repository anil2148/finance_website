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
import {
  createEditedFileName,
  formatBytes,
  getPdfEditorWorkflowStep,
  getPdfTextFallbackMessage,
  getPendingChangesCount,
  groupSelectionBoxes,
  mapDomRectToPdfBox,
  padPdfSelectionBox,
  parsePageOrder,
  parsePageSelection,
  validateOnePageSelection,
  type PdfSelectionBox,
} from '@/lib/pdf-editor-utils';

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
type DownloadChoice = 'apply' | 'current';
type EditorTool =
  | 'none'
  | 'select-text'
  | 'add-text'
  | 'erase'
  | 'blackout'
  | 'signature'
  | 'initials'
  | 'date'
  | 'checkmark'
  | 'x-mark'
  | 'circle'
  | 'line'
  | 'highlight'
  | 'sticky-note'
  | 'form-text'
  | 'form-checkbox'
  | 'form-radio'
  | 'form-dropdown'
  | 'form-date'
  | 'form-signature'
  | 'page-tools';
type PreviewMode = 'edited' | 'original';
type PdfTextColor = 'slate' | 'emerald' | 'blue' | 'red';
type PendingObjectType = 'text' | 'erase' | 'blackout' | 'highlight' | 'circle' | 'line' | 'sticky-note' | 'form-field';
type FormFieldKind = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'signature';

type ToolStatus = 'Ready' | 'Coming soon';

type PendingObject = {
  id: string;
  type: PendingObjectType;
  formKind?: FormFieldKind;
  label?: string;
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

type SelectedTextState = {
  text: string;
  pageIndex: number;
  boxes: PdfSelectionBox[];
};

type SelectedTextMenu = {
  xPercent: number;
  yPercent: number;
};

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

type PagePointerState = {
  x: number;
  y: number;
  tool: EditorTool;
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

type GoalAction = {
  title: string;
  description: string;
  helper: string;
  action: () => void;
  disabled?: boolean;
};

const MAX_FILE_SIZE_MB = 50;
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

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function toPdfBlob(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: 'application/pdf' });
}

export const getEditedFileName = createEditedFileName;

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

function getCssTextColor(color: PdfTextColor) {
  if (color === 'emerald') return '#047857';
  if (color === 'blue') return '#1d4ed8';
  if (color === 'red') return '#b91c1c';
  return '#1f2937';
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
  if (tool === 'select-text') return 'Select text in the PDF, then delete or replace it in the right panel.';
  if (tool === 'add-text') return 'Click anywhere on the PDF to add text. Drag it to reposition.';
  if (tool === 'erase') return 'Drag over the content you want to remove. Use this when text cannot be selected.';
  if (tool === 'signature') return 'Click where you want your signature.';
  if (tool === 'initials') return 'Click where you want your initials.';
  if (tool === 'date') return 'Click where you want to place today’s date.';
  if (tool === 'checkmark') return 'Click where you want to place a checkmark.';
  if (tool === 'x-mark') return 'Click where you want to place an X.';
  if (tool === 'circle') return 'Click to place a circle. Drag to move it.';
  if (tool === 'line') return 'Click to place a line. Drag to move it.';
  if (tool === 'highlight') return 'Click where you want to highlight.';
  if (tool === 'sticky-note') return 'Click to add a note. Drag it to move.';
  if (tool.startsWith('form-')) return 'Click where the form field should appear.';
  if (tool === 'page-tools') return 'Select pages from the left panel, then rotate, delete, or extract.';
  return 'Choose what you want to do, then click or select content on the PDF.';
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

function getPendingObjectName(object: PendingObject) {
  if (object.type === 'erase') return 'Area to remove';
  if (object.type === 'blackout') return 'Blackout area';
  if (object.type === 'highlight') return 'Highlight';
  if (object.type === 'circle') return 'Circle';
  if (object.type === 'line') return 'Line';
  if (object.type === 'sticky-note') return 'Sticky note';
  if (object.type === 'form-field') return `${object.label || object.formKind || 'Form'} field`;
  if (object.text === '✓') return 'Checkmark';
  if (object.text === 'X') return 'X mark';
  return object.text || 'Text';
}

function isPlaceableEditorTool(tool: EditorTool) {
  return tool !== 'none' && tool !== 'page-tools' && tool !== 'select-text';
}

function pdfSelectionBoxToPercents(box: PdfSelectionBox, pageSize: { width: number; height: number }) {
  return {
    xPercent: (box.x / pageSize.width) * 100,
    yPercent: ((pageSize.height - box.y - box.height) / pageSize.height) * 100,
    widthPercent: (box.width / pageSize.width) * 100,
    heightPercent: (box.height / pageSize.height) * 100,
  };
}

function formLabel(kind?: FormFieldKind) {
  if (kind === 'checkbox') return 'Checkbox';
  if (kind === 'radio') return 'Radio button';
  if (kind === 'dropdown') return 'Dropdown';
  if (kind === 'date') return 'Date field';
  if (kind === 'signature') return 'Signature field';
  return 'Text field';
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
  const pdfPageLayerRef = useRef<HTMLDivElement | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfTextLayerRef = useRef<HTMLDivElement | null>(null);
  const pagePointerRef = useRef<PagePointerState | null>(null);
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
  const [resizingObject, setResizingObject] = useState<{ id: string; handle: ResizeHandle } | null>(null);
  const [selectedText, setSelectedText] = useState<SelectedTextState | null>(null);
  const [selectedTextMenu, setSelectedTextMenu] = useState<SelectedTextMenu | null>(null);
  const [replacementText, setReplacementText] = useState('');
  const [replacementFontSize, setReplacementFontSize] = useState(12);
  const [textLayerStatus, setTextLayerStatus] = useState('Upload a PDF to enable text selection.');
  const [textLayerAvailable, setTextLayerAvailable] = useState(false);
  const [pdfRenderFailed, setPdfRenderFailed] = useState(false);
  const [pdfPageSize, setPdfPageSize] = useState<{ width: number; height: number } | null>(null);
  const [undoStack, setUndoStack] = useState<PdfSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<PdfSnapshot[]>([]);
  const [draftStatus, setDraftStatus] = useState('No local draft yet.');
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [lastEditedStatus, setLastEditedStatus] = useState('No edits yet');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showFirstUploadGuide, setShowFirstUploadGuide] = useState(false);
  const [downloadPromptOpen, setDownloadPromptOpen] = useState(false);
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
    let cancelled = false;

    async function renderActivePdfPage() {
      if (!previewBytes || !pdfCanvasRef.current || !pdfTextLayerRef.current) {
        setTextLayerAvailable(false);
        setTextLayerStatus('Upload a PDF to enable text selection.');
        setPdfPageSize(null);
        return;
      }

      setPdfRenderFailed(false);
      setTextLayerStatus('Preparing selectable text...');

      try {
        const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(previewBytes), disableWorker: true } as Parameters<typeof pdfjs.getDocument>[0] & { disableWorker: boolean });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(Math.min(activePageIndex + 1, pdf.numPages));
        if (cancelled) return;

        const viewport = page.getViewport({ scale: Math.max(0.75, Math.min(1.8, zoom)) });
        const canvas = pdfCanvasRef.current;
        const canvasContext = canvas.getContext('2d');
        const textLayerContainer = pdfTextLayerRef.current;
        if (!canvas || !canvasContext || !textLayerContainer) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        setPdfPageSize({ width: viewport.width / viewport.scale, height: viewport.height / viewport.scale });

        await page.render({ canvasContext, viewport }).promise;
        if (cancelled) return;

        const textContent = await page.getTextContent();
        if (cancelled) return;

        textLayerContainer.innerHTML = '';
        textLayerContainer.style.width = `${viewport.width}px`;
        textLayerContainer.style.height = `${viewport.height}px`;
        textLayerContainer.style.setProperty('--scale-factor', String(viewport.scale));

        const hasText = textContent.items.some((item) => 'str' in item && String(item.str).trim());
        setTextLayerAvailable(hasText);
        setTextLayerStatus(
          hasText
            ? 'Text selection is available on this page.'
            : 'This page appears scanned or flattened. Direct text selection is unavailable. Use Erase Text Area to cover text, then add replacement text.',
        );

        if (hasText) {
          const textLayer = new pdfjs.TextLayer({
            textContentSource: textContent,
            container: textLayerContainer,
            viewport,
          });
          await textLayer.render();
        }
      } catch {
        if (!cancelled) {
          setPdfRenderFailed(true);
          setTextLayerAvailable(false);
          setTextLayerStatus('Direct text selection is unavailable. Use Erase Text Area to cover text, then add replacement text.');
        }
      }
    }

    void renderActivePdfPage();

    return () => {
      cancelled = true;
    };
  }, [activePageIndex, previewBytes, zoom]);

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
      setActiveTool('add-text');
      setSuccess(
        loadedFiles.length === 1
          ? 'PDF loaded successfully.'
          : `${loadedFiles.length} PDFs loaded successfully for merge.`,
      );
      setShowFirstUploadGuide(true);
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
    if (!window.confirm('Delete the selected pages? This changes the edited PDF.')) return;

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

  const addPendingObject = (
    type: PendingObject['type'],
    xPercent: number,
    yPercent: number,
    options?: Partial<PendingObject>,
  ) => {
    const objectText = options?.text ??
      (activeTool === 'signature' ? signatureText || 'Signature'
        : activeTool === 'initials' ? initialsText || 'Initials'
          : activeTool === 'date' ? new Intl.DateTimeFormat('en-US').format(new Date())
            : activeTool === 'checkmark' ? '✓'
              : activeTool === 'x-mark' ? 'X'
                : activeTool === 'sticky-note' ? 'Note'
                  : annotationText || 'Text');
    const nextObject: PendingObject = {
      id: makeObjectId(),
      type,
      formKind: options?.formKind,
      label: options?.label,
      pageIndex: activePageIndex,
      xPercent: clampNumber(xPercent, 0, 92),
      yPercent: clampNumber(yPercent, 0, 92),
      widthPercent: options?.widthPercent ?? (type === 'erase' || type === 'blackout' ? 28 : type === 'line' ? 26 : type === 'form-field' ? 24 : type === 'highlight' ? 26 : 18),
      heightPercent: options?.heightPercent ?? (type === 'erase' || type === 'blackout' ? 8 : type === 'line' ? 1.5 : type === 'form-field' ? 6 : type === 'highlight' ? 5 : type === 'circle' ? 10 : 5),
      text: type === 'erase' || type === 'blackout' ? '' : objectText,
      fontSize: options?.fontSize ?? (type === 'erase' || type === 'blackout' ? 12 : activeTool === 'signature' || activeTool === 'initials' ? signatureFontSize : annotationFontSize),
      color: options?.color ?? annotationColor,
      bold: options?.bold ?? (activeTool === 'signature' || activeTool === 'initials' || annotationBold),
    };

    setPendingObjects((previousObjects) => [...previousObjects, nextObject]);
    setSelectedObjectId(nextObject.id);
    setSuccess(`${getPendingObjectName(nextObject)} placed. Drag or edit it, then apply pending edits.`);
    setError(null);
  };

  const addPendingObjectForActiveTool = (xPercent: number, yPercent: number) => {
    if (activeTool === 'erase') {
      addPendingObject('erase', xPercent, yPercent);
      return;
    }

    if (activeTool === 'blackout') {
      addPendingObject('blackout', xPercent, yPercent);
      return;
    }

    if (activeTool === 'highlight') {
      addPendingObject('highlight', xPercent, yPercent, { color: 'emerald', widthPercent: 28, heightPercent: 5 });
      return;
    }

    if (activeTool === 'circle') {
      addPendingObject('circle', xPercent, yPercent, { widthPercent: 13, heightPercent: 9 });
      return;
    }

    if (activeTool === 'line') {
      addPendingObject('line', xPercent, yPercent, { widthPercent: 26, heightPercent: 1.5 });
      return;
    }

    if (activeTool === 'sticky-note') {
      addPendingObject('sticky-note', xPercent, yPercent, { text: 'Note', widthPercent: 24, heightPercent: 10, color: 'slate' });
      return;
    }

    if (activeTool.startsWith('form-')) {
      const kind = activeTool.replace('form-', '') as FormFieldKind;
      addPendingObject('form-field', xPercent, yPercent, {
        formKind: kind,
        label: formLabel(kind),
        text: '',
        widthPercent: kind === 'checkbox' || kind === 'radio' ? 14 : 26,
        heightPercent: kind === 'checkbox' || kind === 'radio' ? 5 : 6,
      });
      return;
    }

    addPendingObject('text', xPercent, yPercent);
  };

  const handlePreviewClick = (event: PointerEvent<HTMLDivElement>) => {
    if (!pdfPageLayerRef.current || !hasFiles) return;
    if (activeTool === 'none' || activeTool === 'page-tools' || activeTool === 'select-text') return;

    const rect = pdfPageLayerRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    addPendingObjectForActiveTool(xPercent, yPercent);
  };

  const captureSelectedPdfText = () => {
    const selection = window.getSelection();
    const pageLayer = pdfTextLayerRef.current;
    if (!selection || selection.rangeCount === 0 || !pageLayer || !pdfPageSize) return;

    const selectedValue = selection.toString().trim();
    if (!selectedValue) return;

    const selectionPage = validateOnePageSelection([activePageIndex]);
    if (selectionPage === null) return;

    if (
      (selection.anchorNode && !pageLayer.contains(selection.anchorNode)) ||
      (selection.focusNode && !pageLayer.contains(selection.focusNode))
    ) {
      setError('Please select text on one page at a time.');
      setSuccess(null);
      return;
    }

    const pageRect = pageLayer.getBoundingClientRect();
    const selectedBoxes: PdfSelectionBox[] = [];
    let hasRectOutsidePage = false;

    for (let rangeIndex = 0; rangeIndex < selection.rangeCount; rangeIndex += 1) {
      const range = selection.getRangeAt(rangeIndex);
      for (const rect of Array.from(range.getClientRects())) {
        if (rect.width <= 0 || rect.height <= 0) continue;
        const intersectsPage =
          rect.left >= pageRect.left - 1 &&
          rect.right <= pageRect.right + 1 &&
          rect.top >= pageRect.top - 1 &&
          rect.bottom <= pageRect.bottom + 1;

        if (!intersectsPage) {
          hasRectOutsidePage = true;
          continue;
        }

        selectedBoxes.push(
          padPdfSelectionBox(
            mapDomRectToPdfBox(rect, pageRect, pdfPageSize),
            2,
            pdfPageSize,
          ),
        );
      }
    }

    const boxes = groupSelectionBoxes(selectedBoxes);
    if (!boxes.length) {
      setError(hasRectOutsidePage ? 'Please select text on one page at a time.' : 'No selectable text boxes were found. Use Erase Text Area instead.');
      setSelectedText(null);
      setSelectedTextMenu(null);
      return;
    }

    if (hasRectOutsidePage) {
      setError('Please select text on one page at a time.');
      setSuccess(null);
      return;
    }

    const suggestedFontSize = clampNumber(Math.round(Math.max(...boxes.map((box) => box.height)) * 0.8), 6, 72);
    const firstBox = boxes[0];
    const menuPosition = pdfSelectionBoxToPercents(firstBox, pdfPageSize);
    setSelectedText({ text: selectedValue, pageIndex: selectionPage, boxes });
    setSelectedTextMenu({
      xPercent: clampNumber(menuPosition.xPercent, 2, 72),
      yPercent: clampNumber(menuPosition.yPercent - 8, 0, 88),
    });
    setSelectedObjectId(null);
    setReplacementText(selectedValue);
    setReplacementFontSize(suggestedFontSize);
    setSuccess(`Selected ${boxes.length} text box${boxes.length === 1 ? '' : 'es'} on page ${selectionPage + 1}.`);
    setError(null);
  };

  const clearSelectedPdfText = () => {
    setSelectedText(null);
    setSelectedTextMenu(null);
    setReplacementText('');
    setReplacementFontSize(12);
    window.getSelection()?.removeAllRanges();
  };

  const createSelectedTextCoverObjects = (mode: 'delete' | 'edit' | 'highlight') => {
    if (!selectedText || !pdfPageSize) {
      setError('Select text in the PDF first.');
      return;
    }

    const coverObjects: PendingObject[] = selectedText.boxes.map((box) => {
      const boxPercents = pdfSelectionBoxToPercents(box, pdfPageSize);
      return {
        id: makeObjectId(),
        type: mode === 'highlight' ? 'highlight' : 'erase',
        pageIndex: selectedText.pageIndex,
        xPercent: clampNumber(boxPercents.xPercent, 0, 94),
        yPercent: clampNumber(boxPercents.yPercent, 0, 94),
        widthPercent: clampNumber(boxPercents.widthPercent, 1, 96),
        heightPercent: clampNumber(boxPercents.heightPercent, 1, 40),
        text: '',
        fontSize: replacementFontSize,
        color: mode === 'highlight' ? 'emerald' : 'slate',
        bold: false,
      };
    });

    let replacementObject: PendingObject | null = null;
    if (mode === 'edit' && selectedText.boxes[0]) {
      const firstBox = pdfSelectionBoxToPercents(selectedText.boxes[0], pdfPageSize);
      const selectionWidth = selectedText.boxes.reduce((sum, box) => sum + box.width, 0);
      replacementObject = {
        id: makeObjectId(),
        type: 'text',
        pageIndex: selectedText.pageIndex,
        xPercent: clampNumber(firstBox.xPercent, 0, 94),
        yPercent: clampNumber(firstBox.yPercent, 0, 94),
        widthPercent: clampNumber((selectionWidth / pdfPageSize.width) * 100, 8, 90),
        heightPercent: clampNumber(firstBox.heightPercent * 1.5, 3, 30),
        text: replacementText || selectedText.text,
        fontSize: replacementFontSize,
        color: annotationColor,
        bold: false,
      };
    }

    const nextObjects = replacementObject ? [...coverObjects, replacementObject] : coverObjects;
    setPendingObjects((previousObjects) => [...previousObjects, ...nextObjects]);
    setSelectedObjectId(replacementObject?.id ?? coverObjects[0]?.id ?? null);
    setActivePageIndex(selectedText.pageIndex);
    setSuccess(
      mode === 'edit'
        ? 'Created an adjustable cover and replacement text. Resize or move them, then Apply Changes.'
        : mode === 'highlight'
          ? 'Created adjustable highlight boxes. Resize or move them, then Apply Changes.'
          : 'Created removable text covers. Adjust if needed, then Apply Changes.',
    );
    setError(null);
    clearSelectedPdfText();
  };

  const copySelectedPdfText = () => {
    if (!selectedText) return;
    void navigator.clipboard?.writeText(selectedText.text);
    setSuccess('Selected text copied.');
    setError(null);
  };

  const handleObjectPointerDown = (event: PointerEvent<HTMLDivElement>, objectId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedObjectId(objectId);
    setSelectedText(null);
    setSelectedTextMenu(null);
    setDraggingObjectId(objectId);
  };

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>, objectId: string, handle: ResizeHandle) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedObjectId(objectId);
    setDraggingObjectId(null);
    setResizingObject({ id: objectId, handle });
  };

  const handlePagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasFiles || !isPlaceableEditorTool(activeTool)) return;
    if ((event.target as HTMLElement).closest('[data-editor-object="true"], [data-resize-handle="true"], button, textarea, input, select')) return;

    pagePointerRef.current = {
      x: event.clientX,
      y: event.clientY,
      tool: activeTool,
    };
  };

  const handlePagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const pointerStart = pagePointerRef.current;
    pagePointerRef.current = null;
    window.setTimeout(captureSelectedPdfText, 0);

    if (!pointerStart || !pdfPageLayerRef.current || !hasFiles || !isPlaceableEditorTool(pointerStart.tool)) return;
    if ((event.target as HTMLElement).closest('[data-editor-object="true"], [data-resize-handle="true"], button, textarea, input, select')) return;

    const dragDistance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    if (dragDistance > 6 || window.getSelection()?.toString().trim()) return;

    const rect = pdfPageLayerRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
    addPendingObjectForActiveTool(xPercent, yPercent);
  };

  const handlePreviewPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!pdfPageLayerRef.current) return;

    const rect = pdfPageLayerRef.current.getBoundingClientRect();
    const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((event.clientY - rect.top) / rect.height) * 100;

    if (resizingObject) {
      const object = pendingObjects.find((candidate) => candidate.id === resizingObject.id);
      if (!object) return;

      const right = object.xPercent + object.widthPercent;
      const bottom = object.yPercent + object.heightPercent;
      const nextX = resizingObject.handle.includes('w') ? clampNumber(xPercent, 0, right - 1) : object.xPercent;
      const nextY = resizingObject.handle.includes('n') ? clampNumber(yPercent, 0, bottom - 1) : object.yPercent;
      const nextRight = resizingObject.handle.includes('e') ? clampNumber(xPercent, object.xPercent + 1, 100) : right;
      const nextBottom = resizingObject.handle.includes('s') ? clampNumber(yPercent, object.yPercent + 1, 100) : bottom;

      updatePendingObject(resizingObject.id, {
        xPercent: clampNumber(nextX, 0, 96),
        yPercent: clampNumber(nextY, 0, 96),
        widthPercent: clampNumber(nextRight - nextX, 1, 100 - nextX),
        heightPercent: clampNumber(nextBottom - nextY, 1, 100 - nextY),
      });
      return;
    }

    if (!draggingObjectId) return;

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
    const objectWidth = (object.widthPercent / 100) * width;
    const objectHeight = (object.heightPercent / 100) * height;

    if (object.type === 'erase') {
      page.drawRectangle({
        x,
        y: y - objectHeight,
        width: objectWidth,
        height: objectHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.85, 0.9, 0.88),
        borderWidth: 0.5,
      });

      if (object.text.trim()) {
        const font = await pdfDoc.embedFont(object.bold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica);
        page.drawText(object.text.trim(), {
          x: x + 4,
          y: y - objectHeight + 4,
          size: object.fontSize,
          font,
          color: getTextColor(object.color),
        });
      }
      return;
    }

    if (object.type === 'blackout') {
      page.drawRectangle({
        x,
        y: y - objectHeight,
        width: objectWidth,
        height: objectHeight,
        color: rgb(0, 0, 0),
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
      });
      return;
    }

    if (object.type === 'highlight') {
      page.drawRectangle({
        x,
        y: y - objectHeight,
        width: objectWidth,
        height: objectHeight,
        color: rgb(1, 0.92, 0.2),
        opacity: 0.35,
      });
      return;
    }

    if (object.type === 'circle') {
      page.drawEllipse({
        x: x + objectWidth / 2,
        y: y - objectHeight / 2,
        xScale: objectWidth / 2,
        yScale: objectHeight / 2,
        borderColor: getTextColor(object.color),
        borderWidth: 2,
      });
      return;
    }

    if (object.type === 'line') {
      page.drawLine({
        start: { x, y },
        end: { x: x + objectWidth, y: y - objectHeight },
        color: getTextColor(object.color),
        thickness: Math.max(1, object.fontSize / 8),
      });
      return;
    }

    if (object.type === 'sticky-note') {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawRectangle({
        x,
        y: y - objectHeight,
        width: objectWidth,
        height: objectHeight,
        color: rgb(1, 0.96, 0.55),
        borderColor: rgb(0.82, 0.62, 0.12),
        borderWidth: 1,
      });
      page.drawText(object.text.trim() || 'Note', {
        x: x + 6,
        y: y - object.fontSize - 6,
        size: clampNumber(object.fontSize, 8, 28),
        font,
        color: rgb(0.42, 0.31, 0.05),
        maxWidth: Math.max(20, objectWidth - 12),
      });
      return;
    }

    if (object.type === 'form-field') {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const label = object.label || formLabel(object.formKind);
      const isRound = object.formKind === 'radio';
      const isSmallChoice = object.formKind === 'checkbox' || object.formKind === 'radio';

      if (isRound) {
        page.drawEllipse({
          x: x + 8,
          y: y - 8,
          xScale: 7,
          yScale: 7,
          borderColor: rgb(0.15, 0.23, 0.36),
          borderWidth: 1.2,
        });
      } else {
        page.drawRectangle({
          x,
          y: y - objectHeight,
          width: isSmallChoice ? 14 : objectWidth,
          height: isSmallChoice ? 14 : objectHeight,
          borderColor: rgb(0.15, 0.23, 0.36),
          borderWidth: 1.2,
          color: rgb(1, 1, 1),
        });
      }

      page.drawText(label, {
        x: x + (isSmallChoice ? 20 : 5),
        y: y - Math.max(12, objectHeight / 2 + 4),
        size: 9,
        font,
        color: rgb(0.28, 0.34, 0.45),
      });
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

  const applySelectedTextEdit = async (mode: 'delete' | 'replace') => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }
    if (!selectedText || selectedText.boxes.length === 0) {
      setError('Select text in the PDF first.');
      return;
    }
    const replacement = replacementText.trim();
    if (mode === 'replace' && !replacement) {
      setError('Enter replacement text first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const pdfDoc = await PDFDocument.load(currentBytes);
      const page = pdfDoc.getPage(Math.min(selectedText.pageIndex, pdfDoc.getPageCount() - 1));
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      selectedText.boxes.forEach((box) => {
        page.drawRectangle({
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          color: rgb(1, 1, 1),
        });
      });

      if (mode === 'replace') {
        const firstBox = selectedText.boxes[0];
        page.drawText(replacement, {
          x: firstBox.x,
          y: firstBox.y + Math.max(2, firstBox.height * 0.2),
          size: clampNumber(replacementFontSize, 6, 72),
          font,
          color: getTextColor(annotationColor),
        });
      }

      const savedBytes = await pdfDoc.save();
      const historyText = selectedText.text.slice(0, 40);
      updateEditedPdf(
        savedBytes,
        pdfDoc.getPageCount(),
        getEditedFileName(activeItem.name),
        mode === 'delete'
          ? `Deleted selected text: ${historyText}`
          : 'Replaced selected text.',
      );
      setSelectedText(null);
      setReplacementText('');
      setReplacementFontSize(12);
      window.getSelection()?.removeAllRanges();
      setSuccess(mode === 'delete' ? 'Selected text removed from visible PDF.' : 'Selected text replaced.');
    } catch {
      setError('Unable to edit the selected text. Use Erase Text Area as a fallback.');
    } finally {
      setIsProcessing(false);
    }
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
      setSuccess('Changes applied. Your PDF is ready to download.');
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

  const applyQuickAction = (action: 'signature' | 'initials' | 'date' | 'name' | 'checkmark' | 'x-mark' | 'na' | 'page-numbers' | 'watermark' | 'erase' | 'merge' | 'extract') => {
    if (action === 'signature') {
      setSignatureText(signatureText || 'Signature');
      setToolAndMessage('signature', 'Click where you want your signature.');
      return;
    }

    if (action === 'initials') {
      setInitialsText(initialsText || 'AB');
      setToolAndMessage('initials', 'Click where you want your initials.');
      return;
    }

    if (action === 'date') {
      setAnnotationText(new Intl.DateTimeFormat('en-US').format(new Date()));
      setToolAndMessage('date', 'Click where you want the date.');
      return;
    }

    if (action === 'name') {
      setAnnotationText('Name');
      setToolAndMessage('add-text', 'Click where you want the name field.');
      return;
    }

    if (action === 'checkmark') {
      setToolAndMessage('checkmark', 'Click where you want a checkmark.');
      return;
    }

    if (action === 'x-mark') {
      setToolAndMessage('x-mark', 'Click where you want an X mark.');
      return;
    }

    if (action === 'na') {
      setAnnotationText('N/A');
      setToolAndMessage('add-text', 'Click where you want N/A.');
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
      setToolAndMessage('erase', 'Click or drag over existing text to cover it. Add replacement text if needed.');
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

  const downloadEditedPdf = async (choice?: DownloadChoice) => {
    if (!currentBytes || !activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    if (pendingObjects.length > 0 && !choice) {
      setDownloadPromptOpen(true);
      setError(null);
      setSuccess(null);
      return;
    }

    if (pendingObjects.length > 0 && choice === 'apply') {
      setIsProcessing(true);
      try {
        const result = await buildPendingAppliedPdf();
        updateEditedPdf(result.bytes, result.pageCount, result.fileName, result.message);
        setPendingObjects([]);
        setSelectedObjectId(null);
        setDownloadPromptOpen(false);
        downloadBytes(result.bytes, result.fileName, 'Pending edits applied. Download started.');
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to apply pending edits before download.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    const fileName = hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name;
    setDownloadPromptOpen(false);
    downloadBytes(currentBytes, fileName, hasEditedPdf ? 'Edited PDF ready to download.' : 'Original PDF download started.');
  };

  const downloadOriginalPdf = () => {
    if (!activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    downloadBytes(activeItem.bytes, activeItem.name, 'Original PDF download started.');
  };

  const printEditedPdf = () => {
    if (!currentBytes) {
      setError('Please upload a PDF file.');
      return;
    }

    const printUrl = URL.createObjectURL(toPdfBlob(currentBytes));
    const printWindow = window.open(printUrl, '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      setError('Your browser blocked the print window. Allow popups or download the PDF instead.');
      URL.revokeObjectURL(printUrl);
      return;
    }

    setSuccess('Print preview opened for the edited PDF.');
    window.setTimeout(() => URL.revokeObjectURL(printUrl), 30_000);
  };

  const resetChanges = () => {
    if (!activeItem) {
      setError('Please upload a PDF file.');
      return;
    }

    if (!window.confirm('Reset to the original PDF and clear pending edits?')) return;

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

  const focusWorkspace = () => {
    previewWorkspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const activateToolAndFocus = (tool: EditorTool, message?: string) => {
    setToolAndMessage(tool, message);
    window.setTimeout(focusWorkspace, 50);
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
  const pendingChangesCount = getPendingChangesCount(pendingObjects.length, false);
  const workflowStep = getPdfEditorWorkflowStep(hasFiles, pendingChangesCount, hasEditedPdf);
  const textSelectionSummary = getPdfTextFallbackMessage(hasFiles, textLayerAvailable);
  const workflowSteps = ['Upload', 'Edit', 'Apply', 'Download'];
  const goalActions: GoalAction[] = [
    {
      title: 'Add Text',
      description: 'Click anywhere on the PDF and type.',
      helper: 'Best for filling blanks and forms.',
      action: () => activateToolAndFocus('add-text'),
      disabled: !hasFiles,
    },
    {
      title: 'Replace Text',
      description: 'Select text directly, then type the replacement.',
      helper: textLayerAvailable ? 'Select text in the document.' : 'Use Remove Area if text cannot be selected.',
      action: () => activateToolAndFocus(textLayerAvailable ? 'select-text' : 'erase', textLayerAvailable ? 'Select text in the PDF, then type replacement text in the right panel.' : 'This looks scanned or flattened. Drag over the area to cover it, then add replacement text.'),
      disabled: !hasFiles,
    },
    {
      title: 'Remove Text',
      description: 'Select text and remove it, or cover an area.',
      helper: textLayerAvailable ? 'Try selecting text first.' : 'Use Remove Area for scanned PDFs.',
      action: () => activateToolAndFocus(textLayerAvailable ? 'select-text' : 'erase', textLayerAvailable ? 'Select text to remove. If you cannot select it, use Remove Area.' : 'Drag over the content you want to remove.'),
      disabled: !hasFiles,
    },
    {
      title: 'Sign',
      description: 'Place a typed signature or initials.',
      helper: 'Click where the signature belongs.',
      action: () => {
        setSignatureText(signatureText || 'Signature');
        activateToolAndFocus('signature');
      },
      disabled: !hasFiles,
    },
    {
      title: 'Date',
      description: 'Click to place today’s date.',
      helper: 'Drag it into position before applying.',
      action: () => activateToolAndFocus('date'),
      disabled: !hasFiles,
    },
    {
      title: 'Checkmark',
      description: 'Click to place a checkmark.',
      helper: 'Useful for forms and approvals.',
      action: () => activateToolAndFocus('checkmark'),
      disabled: !hasFiles,
    },
    {
      title: 'Highlight',
      description: 'Click to place a highlight box.',
      helper: 'Move it over the text you want to mark.',
      action: () => activateToolAndFocus('highlight'),
      disabled: !hasFiles,
    },
    {
      title: 'Page Tools',
      description: 'Rotate, delete, extract, or reorder pages.',
      helper: 'Select pages from the page cards.',
      action: () => activateToolAndFocus('page-tools'),
      disabled: !hasFiles,
    },
    {
      title: 'Merge PDFs',
      description: 'Upload multiple PDFs and merge them in order.',
      helper: 'Use the file list to move PDFs up or down.',
      action: () => void mergePdfs(),
      disabled: files.length < 2,
    },
    {
      title: 'Watermark / Page Numbers',
      description: 'Add document labels or page numbers.',
      helper: 'Use secondary tools below.',
      action: () => {
        setSuccess('Open Secondary tools to add a watermark or page numbers.');
        setError(null);
      },
      disabled: !hasFiles,
    },
  ];
  const topToolbarButtonClassName =
    'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-emerald-500/10';
  const activeToolLabel: Record<EditorTool, string> = {
    none: 'Choose a tool',
    'select-text': 'Replace or remove text',
    'add-text': 'Add Text',
    erase: 'Remove Area',
    blackout: 'Blackout',
    signature: 'Sign',
    initials: 'Initials',
    date: 'Date',
    checkmark: 'Checkmark',
    'x-mark': 'X Mark',
    circle: 'Circle',
    line: 'Line',
    highlight: 'Highlight',
    'sticky-note': 'Note',
    'form-text': 'Text Field',
    'form-checkbox': 'Checkbox',
    'form-radio': 'Radio Button',
    'form-dropdown': 'Dropdown',
    'form-date': 'Date Field',
    'form-signature': 'Signature Field',
    'page-tools': 'Page Tools',
  };
  const showPropertiesPanel = Boolean(selectedObject || selectedText || downloadPromptOpen || pendingObjects.length > 0 || activeTool !== 'add-text');
  const editorRibbonTools: {
    label: string;
    icon: string;
    tool?: EditorTool;
    run?: () => void;
    disabled?: boolean;
  }[] = [
    { label: 'Pages', icon: 'Pg', tool: 'page-tools' },
    { label: 'Select', icon: 'Sel', tool: 'select-text', disabled: hasFiles && !textLayerAvailable },
    { label: 'Text', icon: 'T', tool: 'add-text' },
    { label: 'Sign', icon: 'Sig', run: () => applyQuickAction('signature') },
    { label: 'Initials', icon: 'In', run: () => applyQuickAction('initials') },
    { label: 'Erase', icon: 'Er', tool: 'erase' },
    { label: 'Image', icon: 'Img', disabled: true },
    { label: 'Check', icon: 'Chk', run: () => applyQuickAction('checkmark') },
    { label: 'Cross', icon: 'X', run: () => applyQuickAction('x-mark') },
    { label: 'Circle', icon: 'O', tool: 'circle' },
    { label: 'Table', icon: 'Tbl', disabled: true },
    { label: 'Text Box', icon: 'Box', tool: 'add-text' },
    { label: 'Date', icon: 'Dt', run: () => applyQuickAction('date') },
    { label: 'Blackout', icon: 'Blk', tool: 'blackout' },
    { label: 'Highlight', icon: 'Hi', tool: 'highlight' },
    { label: 'Draw', icon: 'Dr', disabled: true },
    { label: 'Line', icon: 'Ln', tool: 'line' },
    { label: 'Arrow', icon: 'Arr', disabled: true },
    { label: 'Tools', icon: 'More', tool: 'page-tools' },
  ];

  return (
    <section className={hasFiles ? '-mx-4 min-h-[calc(100vh-80px)] bg-slate-100 dark:bg-slate-950 sm:-mx-6 lg:-mx-8' : 'space-y-8'}>
      <style jsx global>{`
        .pdf-text-layer {
          line-height: 1;
          text-align: initial;
        }
        .pdf-text-layer span,
        .pdf-text-layer br {
          color: transparent;
          cursor: text;
          position: absolute;
          transform-origin: 0% 0%;
          white-space: pre;
        }
        .pdf-text-layer ::selection {
          background: rgba(59, 130, 246, 0.35);
          color: transparent;
        }
      `}</style>
      <div className={`overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950 text-white shadow-2xl shadow-slate-950/10 ${hasFiles ? 'hidden' : ''}`}>
        <div className="relative isolate px-5 py-10 sm:px-8 lg:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.86))]" />
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere tools</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">PDF Editor</h1>
            <p className="mt-4 text-base leading-7 text-slate-200 sm:text-lg">
              Upload a PDF, choose a goal, click or select content on the page, apply changes, and download the finished file.
            </p>
            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-50">
              Your PDF stays in your browser. Files are not uploaded to our server.
            </div>
            <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
              PDF text can be selected when the document contains real text. If the PDF is scanned or flattened, use Erase Text Area.
            </div>
          </div>
        </div>
      </div>

      <section className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${hasFiles ? 'hidden' : ''}`}>
        <div className="grid gap-3 md:grid-cols-5">
          {workflowSteps.map((step, index) => {
            const isActive = step === workflowStep;
            const isComplete = workflowSteps.indexOf(workflowStep) > index;
            return (
              <div key={step} className={`rounded-2xl border p-3 ${isActive ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : isComplete ? 'border-emerald-200 bg-white dark:border-emerald-500/30 dark:bg-slate-950' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'}`}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
                <p className={`mt-1 text-sm font-bold ${isActive ? 'text-emerald-700 dark:text-emerald-200' : 'text-slate-900 dark:text-white'}`}>{step}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {workflowStep === 'Upload' ? 'Step 1: Upload your PDF.' : workflowStep === 'Edit' ? 'Step 2: Choose a tool, then click or select content on the PDF.' : workflowStep === 'Apply' ? `Step 3: You have ${pendingChangesCount} pending edit${pendingChangesCount === 1 ? '' : 's'}. Apply changes before downloading.` : 'Step 4: Download your edited PDF.'}
        </p>
      </section>

      <div className={`${hasFiles ? 'sticky top-0 z-40' : 'hidden'} border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950`}>
        <div className="flex h-14 w-full items-center gap-2 overflow-x-auto px-3">
          <a href="/tools" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
            Home
          </a>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
              {activeItem ? hasEditedPdf ? downloadFileName ?? getEditedFileName(activeItem.name) : activeItem.name : 'PDF Editor'}
            </p>
            <p className="truncate text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Your PDF stays in your browser. Files are not uploaded to our server.
            </p>
          </div>
          <button type="button" onClick={undoLastEdit} disabled={undoStack.length === 0 || isProcessing} className={topToolbarButtonClassName}>Undo</button>
          <button type="button" onClick={redoLastEdit} disabled={redoStack.length === 0 || isProcessing} className={topToolbarButtonClassName}>Redo</button>
          <div className="hidden h-9 min-w-48 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900 md:flex">
            Find form or field
          </div>
          <span className="rounded-lg bg-orange-100 px-3 py-2 text-xs font-bold text-orange-800 dark:bg-orange-500/20 dark:text-orange-100">
            Edit & Fill
          </span>
          <button type="button" className={topToolbarButtonClassName}>Invite to sign</button>
          <button type="button" className={topToolbarButtonClassName}>Create form</button>
          <button type="button" onClick={() => void downloadEditedPdf()} disabled={!hasFiles || isProcessing} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50">
            Download
          </button>
          <button type="button" onClick={printEditedPdf} disabled={!hasFiles || isProcessing} className={topToolbarButtonClassName}>Print</button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              setSuccess('Share link copied.');
              setError(null);
            }}
            className={topToolbarButtonClassName}
          >
            Share
          </button>
        </div>
        <div className="flex h-16 items-center gap-1 overflow-x-auto border-t border-slate-100 bg-slate-50 px-3 dark:border-slate-800 dark:bg-slate-900">
          {editorRibbonTools.map((tool) => {
            const isActive = tool.tool ? activeTool === tool.tool : false;
            return (
              <button
                key={tool.label}
                type="button"
                onClick={() => {
                  if (tool.disabled) return;
                  if (tool.run) {
                    tool.run();
                    return;
                  }
                  if (tool.tool) setToolAndMessage(tool.tool);
                }}
                disabled={tool.disabled}
                className={`flex h-12 min-w-[58px] flex-col items-center justify-center rounded-lg border px-2 text-[11px] font-bold transition ${
                  isActive
                    ? 'border-orange-300 bg-orange-100 text-orange-900 shadow-sm dark:border-orange-400/50 dark:bg-orange-500/20 dark:text-orange-100'
                    : 'border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:disabled:bg-slate-900'
                }`}
              >
                <span className="text-[10px] leading-none">{tool.icon}</span>
                <span className="mt-1 leading-none">{tool.label}</span>
              </button>
            );
          })}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
              Active: {activeToolLabel[activeTool]}
            </span>
            <button type="button" onClick={() => void applyPendingObjects()} disabled={!canEdit || pendingObjects.length === 0} className={topToolbarButtonClassName}>Apply Changes</button>
            <button type="button" onClick={resetChanges} disabled={!hasFiles || isProcessing || (!hasEditedPdf && pendingObjects.length === 0)} className={topToolbarButtonClassName}>Reset</button>
            <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setPreviewMode('original')} disabled={!activeItem} className={`px-3 py-2 text-xs font-bold disabled:opacity-50 ${previewMode === 'original' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300'}`}>
                Original
              </button>
              <button type="button" onClick={() => setPreviewMode('edited')} className={`px-3 py-2 text-xs font-bold ${previewMode === 'edited' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 dark:bg-slate-950 dark:text-slate-300'}`}>
                Edited
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={hasFiles ? `grid h-[calc(100vh-120px)] min-h-[680px] gap-0 ${showPropertiesPanel ? 'lg:grid-cols-[220px_minmax(760px,1fr)_420px]' : 'lg:grid-cols-[220px_minmax(760px,1fr)]'}` : 'grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px]'}>
        <div className={hasFiles ? 'space-y-4 border-r border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 lg:h-[calc(100vh-120px)] lg:overflow-auto' : 'space-y-6'}>
          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className={hasFiles ? 'text-base font-bold text-slate-950 dark:text-white' : 'text-xl font-semibold text-slate-950 dark:text-white'}>Upload PDFs</h2>
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
              className={`${hasFiles ? 'mt-3 rounded-2xl p-4' : 'mt-5 rounded-3xl p-6'} border-2 border-dashed text-center transition ${
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
              <div className={`${hasFiles ? 'hidden' : 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl text-emerald-600'}`}>
                PDF
              </div>
              <p className={hasFiles ? 'text-sm font-semibold' : 'mt-4 text-base font-semibold'}>{hasFiles ? 'Replace or merge PDFs' : 'Drag and drop PDFs here'}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">or choose files from your device</p>
              <label className={`${hasFiles ? 'mt-3 rounded-xl px-4 py-2 text-xs' : 'mt-5 rounded-2xl px-5 py-3 text-sm'} inline-flex cursor-pointer items-center justify-center bg-emerald-500 font-bold text-white shadow-sm transition hover:bg-emerald-600 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950`}>
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

            {!hasFiles && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">What you can do</h3>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Fill forms and add text</span>
                  <span>Sign documents</span>
                  <span>Replace or remove visible text</span>
                  <span>Merge, split, rotate, and organize pages</span>
                </div>
                <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                  Your PDF stays in your browser. Files are not uploaded to our server.
                </p>
              </div>
            )}

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
                    className={`${hasFiles ? 'rounded-xl p-3' : 'rounded-2xl p-4'} border transition ${
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

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className={hasFiles ? 'text-base font-bold text-slate-950 dark:text-white' : 'text-xl font-semibold text-slate-950 dark:text-white'}>{hasFiles ? 'Tools' : 'What do you want to do?'}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {hasFiles ? 'Choose a task, then work directly on the PDF.' : 'Pick a goal. The editor will choose the right tool and guide your next click.'}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                Beginner friendly
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {goalActions.map((goal) => (
                <button
                  key={goal.title}
                  type="button"
                  onClick={goal.action}
                  disabled={goal.disabled}
                  className={`${hasFiles ? 'rounded-xl px-3 py-2' : 'rounded-2xl p-4'} border border-slate-200 bg-white text-left transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-emerald-500/10`}
                >
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">{goal.title}</span>
                  <span className={hasFiles ? 'mt-1 block text-xs leading-4 text-slate-600 dark:text-slate-300' : 'mt-1 block text-xs leading-5 text-slate-600 dark:text-slate-300'}>{goal.description}</span>
                  {!hasFiles && <span className="mt-2 block text-xs font-semibold text-emerald-700 dark:text-emerald-300">{goal.helper}</span>}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {textSelectionSummary}
            </div>
            {showFirstUploadGuide && hasFiles && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">Try this first</p>
                    <p className="mt-1">1. Click Text. 2. Click on the PDF. 3. Type your text. 4. Drag it into place. 5. Apply and download.</p>
                  </div>
                  <button type="button" onClick={() => setShowFirstUploadGuide(false)} className="rounded-lg border border-blue-200 px-2 py-1 text-xs font-bold text-blue-700 dark:border-blue-400/40 dark:text-blue-100">
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <summary className="cursor-pointer text-sm font-bold text-slate-900 dark:text-white">Secondary tools</summary>
            <div className="mt-4 space-y-4">
              {[
                {
                  title: 'Fill & Sign',
                  actions: [
                    { label: 'Add Signature', action: 'signature' as const },
                    { label: 'Add Initials', action: 'initials' as const },
                    { label: 'Add Date', action: 'date' as const },
                    { label: 'Add Checkmark', action: 'checkmark' as const },
                    { label: 'Add X', action: 'x-mark' as const },
                    { label: 'Add N/A', action: 'na' as const },
                  ],
                },
                {
                  title: 'Form Fields',
                  actions: [
                    { label: 'Text field', tool: 'form-text' as const },
                    { label: 'Checkbox field', tool: 'form-checkbox' as const },
                    { label: 'Radio button', tool: 'form-radio' as const },
                    { label: 'Dropdown field', tool: 'form-dropdown' as const },
                    { label: 'Date field', tool: 'form-date' as const },
                    { label: 'Signature field', tool: 'form-signature' as const },
                  ],
                },
                {
                  title: 'Edit PDF',
                  actions: [
                    { label: 'Select Text', tool: 'select-text' as const },
                    { label: 'Text', tool: 'add-text' as const },
                    { label: 'Erase Text Area', action: 'erase' as const },
                    { label: 'Highlight', tool: 'highlight' as const },
                    { label: 'Sticky note', tool: 'sticky-note' as const },
                    { label: 'Circle', tool: 'circle' as const },
                    { label: 'Line', tool: 'line' as const },
                  ],
                },
                {
                  title: 'Pages',
                  actions: [
                    { label: 'Page tools', tool: 'page-tools' as const },
                    { label: 'Merge PDFs', action: 'merge' as const },
                    { label: 'Extract Pages', action: 'extract' as const },
                  ],
                },
                {
                  title: 'Export',
                  actions: [
                    { label: 'Download Edited', run: () => void downloadEditedPdf() },
                    { label: 'Print Edited', run: printEditedPdf },
                  ],
                },
              ].map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{group.title}</h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    {group.actions.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          if ('action' in item && item.action) applyQuickAction(item.action);
                          if ('tool' in item && item.tool) setToolAndMessage(item.tool);
                          if ('run' in item && item.run) item.run();
                        }}
                        disabled={
                          (!hasFiles && item.label !== 'Merge PDFs') ||
                          ('tool' in item && item.tool === 'select-text' && hasFiles && !textLayerAvailable)
                        }
                        className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          'tool' in item && item.tool === activeTool
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100'
                            : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-emerald-500/10'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Add Name', action: 'name' as const },
                { label: 'Add Page Numbers', action: 'page-numbers' as const },
                { label: 'Add Confidential Watermark', action: 'watermark' as const },
              ].map((quickAction) => (
                <button
                  key={quickAction.label}
                  type="button"
                  onClick={() => applyQuickAction(quickAction.action)}
                  disabled={!hasFiles}
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
                Recommended next actions: Select Text to delete or replace visible text, Add Text, Sign, Add Page Numbers, then Download.
              </div>
            )}
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
              <p className="font-bold">Selected text workflow</p>
              <p className="mt-1">Step 1: Choose Select Text. Step 2: Highlight text in the PDF. Step 3: Delete or replace it.</p>
              <p className="mt-2 text-xs">Use Erase Text Area when text selection is unavailable or the PDF is scanned.</p>
            </div>
            </details>
          </section>

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Selected object</h2>
            {selectedObject ? (
              <div className="mt-4 space-y-3">
                {selectedObject.type === 'form-field' ? (
                  <FieldLabel label="Field label">
                    <input value={selectedObject.label || ''} onChange={(event) => updatePendingObject(selectedObject.id, { label: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                ) : (
                  <FieldLabel label={selectedObject.type === 'erase' ? 'Replacement text (optional)' : selectedObject.type === 'sticky-note' ? 'Note' : 'Content'}>
                    <input value={selectedObject.text} onChange={(event) => updatePendingObject(selectedObject.id, { text: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldLabel label={selectedObject.type === 'line' ? 'Line size' : 'Font size'}>
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
                {(selectedObject.type === 'erase' || selectedObject.type === 'blackout' || selectedObject.type === 'highlight' || selectedObject.type === 'circle' || selectedObject.type === 'line' || selectedObject.type === 'sticky-note' || selectedObject.type === 'form-field') && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldLabel label="Width">
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={Math.round(selectedObject.widthPercent)}
                        onChange={(event) => updatePendingObject(selectedObject.id, { widthPercent: clampNumber(Number(event.target.value), 5, 90) })}
                        className={inputClassName}
                      />
                    </FieldLabel>
                    <FieldLabel label="Height">
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
                <FieldLabel label="Page">
                  <input
                    type="number"
                    min={1}
                    max={currentPageCount || 1}
                    value={selectedObject.pageIndex + 1}
                    onChange={(event) => updatePendingObject(selectedObject.id, { pageIndex: clampNumber(Number(event.target.value) - 1, 0, Math.max(0, currentPageCount - 1)) })}
                    className={inputClassName}
                  />
                </FieldLabel>
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

          {hasFiles && (
            <section className="h-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">Manage pages</h2>
                  <p className="mt-0.5 text-xs text-slate-500">{currentPageCount} total</p>
                </div>
                <button type="button" className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300">
                  Close
                </button>
              </div>
              <div className="mt-3 grid max-h-[calc(100vh-190px)] gap-3 overflow-auto pr-1">
                {Array.from({ length: currentPageCount }, (_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className={`group rounded-xl border bg-slate-50 p-2 transition dark:bg-slate-900 ${activePageIndex === pageIndex ? 'border-orange-400 ring-2 ring-orange-200 dark:ring-orange-500/30' : 'border-slate-200 hover:border-emerald-300 dark:border-slate-800'}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActivePageIndex(pageIndex);
                        focusWorkspace();
                      }}
                      className="w-full text-left"
                      aria-label={`Go to page ${pageIndex + 1}`}
                    >
                      <div className="mx-auto flex aspect-[3/4] w-full max-w-[140px] flex-col justify-between rounded-md border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                        <div className="space-y-1">
                          <span className="block h-1.5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                          <span className="block h-1.5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                          <span className="block h-1.5 w-12 rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <span className="text-center text-lg font-black text-slate-300 dark:text-slate-600">{pageIndex + 1}</span>
                        <div className="space-y-1">
                          <span className="block h-1.5 w-full rounded bg-slate-100 dark:bg-slate-800" />
                          <span className="block h-1.5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                        </div>
                      </div>
                      <p className="mt-2 text-center text-xs font-bold text-slate-700 dark:text-slate-200">Page {pageIndex + 1}</p>
                    </button>
                    <div className="mt-2 grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-500">
                      <button type="button" onClick={() => moveFile(activeFileId ?? '', 'up')} disabled className="rounded border border-slate-200 px-1 py-1 opacity-50 dark:border-slate-700">Up</button>
                      <button type="button" disabled className="rounded border border-slate-200 px-1 py-1 opacity-50 dark:border-slate-700">Down</button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletePageSelection(String(pageIndex + 1));
                          setToolAndMessage('page-tools', `Page ${pageIndex + 1} selected. Use page tools to delete, rotate, or extract it.`);
                        }}
                        className="rounded border border-red-100 px-1 py-1 text-red-600 dark:border-red-500/30"
                      >
                        Del
                      </button>
                      <button type="button" onClick={() => togglePageSelection(pageIndex)} className="rounded border border-slate-200 px-1 py-1 dark:border-slate-700">More</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
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

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Shortcuts</h2>
            <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <span>Ctrl/Cmd+Z: undo</span>
              <span>Ctrl/Cmd+Y: redo</span>
              <span>Delete/Backspace: delete selected object</span>
              <span>Escape: deselect tool/object</span>
              <span>+ / -: zoom in or out</span>
            </div>
          </section>

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
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
                    Use Erase Text Area only when the PDF text cannot be selected. It covers visible text with a white box and does not remove embedded text data or OCR content.
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

        <main className={hasFiles ? 'relative min-h-[calc(100vh-120px)] bg-neutral-200 p-4 dark:bg-slate-950 lg:h-[calc(100vh-120px)] lg:overflow-hidden' : 'space-y-6 lg:sticky lg:top-28 lg:self-start'}>
          <section className={hasFiles ? 'flex h-full min-h-[calc(100vh-152px)] flex-col' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
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

            <div className={`${hasFiles ? 'hidden' : 'mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2'}`}>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Original file</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{getOriginalFileName(activeItem)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Last edited status</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{lastEditedStatus}</p>
              </div>
            </div>

            <div className={hasFiles ? 'mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-900 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100' : 'mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100'}>
              {getToolInstruction(activeTool)}
            </div>
            {hasFiles && !textLayerAvailable && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                This PDF appears scanned or flattened. Use Erase to cover text, then add replacement text.
              </div>
            )}

            <div className={hasFiles ? 'hidden' : 'mt-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950'}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Quick fill</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: 'Text', run: () => activateToolAndFocus('add-text') },
                  { label: 'Signature', run: () => applyQuickAction('signature') },
                  { label: 'Initials', run: () => applyQuickAction('initials') },
                  { label: 'Date', run: () => applyQuickAction('date') },
                  { label: 'Checkmark', run: () => applyQuickAction('checkmark') },
                  { label: 'X', run: () => applyQuickAction('x-mark') },
                  { label: 'N/A', run: () => applyQuickAction('na') },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.run}
                    disabled={!hasFiles}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-500/10"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={hasFiles ? 'hidden' : 'mt-4 flex flex-wrap items-center gap-2'}>
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

            <div className={hasFiles ? 'mt-4 grid min-h-0 flex-1 gap-4' : 'mt-5 grid gap-4 xl:grid-cols-[132px_minmax(0,1fr)]'}>
              <div className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950'}>
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

              <div className={hasFiles ? 'min-h-[calc(100vh-285px)] overflow-auto bg-neutral-300 p-6 shadow-inner dark:bg-slate-900' : 'overflow-auto rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950'}>
                {hasFiles && (
                  <div className="sticky top-0 z-10 mx-auto mb-4 w-fit rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-700 shadow dark:bg-slate-950/95 dark:text-slate-200">
                    Page {currentPageCount ? activePageIndex + 1 : 0} of {currentPageCount || 0}
                  </div>
                )}
                <div
                  ref={(node) => {
                    previewWorkspaceRef.current = node;
                    pdfPageLayerRef.current = node;
                  }}
                  className={hasFiles ? 'relative mx-auto min-h-[calc(100vh-350px)] w-fit origin-top bg-white shadow-2xl shadow-slate-900/20' : 'relative mx-auto min-h-[560px] w-fit origin-top bg-white'}
                  onPointerDownCapture={handlePagePointerDown}
                  onPointerUpCapture={handlePagePointerUp}
                  onPointerMove={handlePreviewPointerMove}
                  onPointerUp={() => {
                    setDraggingObjectId(null);
                    setResizingObject(null);
                  }}
                  onPointerLeave={() => {
                    setDraggingObjectId(null);
                    setResizingObject(null);
                    pagePointerRef.current = null;
                  }}
                  onMouseUp={captureSelectedPdfText}
                >
                  {previewUrl && pdfRenderFailed ? (
                    <object data={previewUrl} type="application/pdf" aria-label="PDF preview" className={hasFiles ? 'h-[calc(100vh-340px)] min-h-[640px] w-full bg-white' : 'h-[560px] w-full bg-white'}>
                      <div className={hasFiles ? 'flex h-[calc(100vh-340px)] min-h-[640px] flex-col items-center justify-center p-6 text-center' : 'flex h-[560px] flex-col items-center justify-center p-6 text-center'}>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preview unavailable in this browser.</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          You can still download the PDF and open it in your device viewer.
                        </p>
                      </div>
                    </object>
                  ) : previewBytes ? (
                    <div className="relative mx-auto w-fit bg-white shadow-sm">
                      <canvas ref={pdfCanvasRef} className="block bg-white" aria-label="Rendered PDF page" />
                      <div
                        ref={pdfTextLayerRef}
                        className="pdf-text-layer absolute inset-0 overflow-hidden text-transparent"
                        style={{
                          cursor: activeTool === 'select-text' ? 'text' : 'default',
                          userSelect: draggingObjectId || resizingObject ? 'none' : 'text',
                          pointerEvents: draggingObjectId || resizingObject ? 'none' : 'auto',
                        }}
                      />
                      {selectedText && selectedText.pageIndex === activePageIndex && pdfPageSize && selectedText.boxes.map((box, index) => (
                        <div
                          key={`${box.x}-${box.y}-${index}`}
                          className="pointer-events-none absolute rounded-sm border-2 border-dashed border-orange-500 bg-orange-300/15"
                          style={{
                            left: `${(box.x / pdfPageSize.width) * 100}%`,
                            top: `${((pdfPageSize.height - box.y - box.height) / pdfPageSize.height) * 100}%`,
                            width: `${(box.width / pdfPageSize.width) * 100}%`,
                            height: `${(box.height / pdfPageSize.height) * 100}%`,
                          }}
                        />
                      ))}
                      {selectedText && selectedText.pageIndex === activePageIndex && selectedTextMenu && (
                        <div
                          className="absolute z-30 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-700 shadow-2xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                          style={{
                            left: `${selectedTextMenu.xPercent}%`,
                            top: `${selectedTextMenu.yPercent}%`,
                          }}
                          onPointerDown={(event) => event.stopPropagation()}
                        >
                          <button type="button" onClick={() => createSelectedTextCoverObjects('edit')} className="rounded-lg bg-emerald-500 px-2 py-1 text-white">Edit</button>
                          <button type="button" onClick={() => createSelectedTextCoverObjects('delete')} className="rounded-lg bg-red-600 px-2 py-1 text-white">Delete</button>
                          <button type="button" onClick={copySelectedPdfText} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700">Copy</button>
                          <button type="button" onClick={() => createSelectedTextCoverObjects('highlight')} className="rounded-lg border border-amber-200 px-2 py-1 text-amber-700 dark:border-amber-500/30 dark:text-amber-100">Highlight</button>
                          <button type="button" onClick={clearSelectedPdfText} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700">Clear</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={hasFiles ? 'flex h-[calc(100vh-340px)] min-h-[640px] flex-col items-center justify-center p-6 text-center' : 'flex h-[560px] flex-col items-center justify-center p-6 text-center'}>
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
                    className="pointer-events-none absolute inset-0"
                  >
                    {pendingObjects.filter((object) => object.pageIndex === activePageIndex).map((object) => {
                      const isSelected = object.id === selectedObjectId;
                      return (
                        <div
                          key={object.id}
                          role="button"
                          tabIndex={0}
                          data-editor-object="true"
                          onPointerDown={(event) => handleObjectPointerDown(event, object.id)}
                          className={`pointer-events-auto absolute cursor-move rounded-md border-2 border-dashed shadow-lg ${
                            isSelected ? 'border-orange-500 ring-4 ring-orange-300/30' : 'border-emerald-400'
                          }`}
                          style={{
                            left: `${object.xPercent}%`,
                            top: `${object.yPercent}%`,
                            width: `${object.widthPercent}%`,
                            minHeight: `${object.heightPercent}%`,
                            backgroundColor: object.type === 'blackout' ? '#000' : object.type === 'highlight' ? 'rgba(250, 204, 21, 0.35)' : object.type === 'sticky-note' ? '#fef08a' : object.type === 'line' || object.type === 'circle' ? 'transparent' : 'rgba(255, 255, 255, 0.85)',
                          }}
                        >
                          {object.type === 'erase' ? (
                            <div className="h-full min-h-8 rounded bg-white text-center text-[10px] font-semibold text-slate-400">
                              Area to remove
                            </div>
                          ) : object.type === 'blackout' ? (
                            <div className="h-full min-h-8 rounded bg-black text-center text-[10px] font-semibold text-white/70">
                              Blackout
                            </div>
                          ) : object.type === 'highlight' ? (
                            <div className="h-full min-h-7 rounded text-center text-[10px] font-semibold text-amber-800/70">
                              Highlight
                            </div>
                          ) : object.type === 'circle' ? (
                            <div className="h-full min-h-12 rounded-[999px] border-2 border-current" style={{ color: getCssTextColor(object.color) }} />
                          ) : object.type === 'line' ? (
                            <div className="h-1 rounded-full bg-current" style={{ color: getCssTextColor(object.color), marginTop: '0.25rem' }} />
                          ) : object.type === 'sticky-note' ? (
                            <div className="min-h-12 px-2 py-1 text-xs font-semibold text-amber-950">
                              {object.text || 'Note'}
                            </div>
                          ) : object.type === 'form-field' ? (
                            <div className="flex h-full min-h-8 items-center gap-2 rounded border border-slate-500 bg-white/80 px-2 text-[10px] font-semibold text-slate-600">
                              {(object.formKind === 'checkbox' || object.formKind === 'radio') && <span className={object.formKind === 'radio' ? 'h-3 w-3 rounded-full border border-slate-500' : 'h-3 w-3 border border-slate-500'} />}
                              <span className="truncate">{object.label || formLabel(object.formKind)}</span>
                            </div>
                          ) : object.type === 'text' && isSelected ? (
                            <textarea
                              value={object.text}
                              onPointerDown={(event) => event.stopPropagation()}
                              onChange={(event) => updatePendingObject(object.id, { text: event.target.value })}
                              className="h-full min-h-10 w-full resize-none border-0 bg-transparent px-2 py-1 outline-none"
                              style={{
                                fontSize: `${Math.max(10, object.fontSize)}px`,
                                fontWeight: object.bold ? 700 : 400,
                                color: getCssTextColor(object.color),
                              }}
                              aria-label="Edit placed text"
                            />
                          ) : (
                            <div
                              className="truncate px-2 py-1"
                              style={{
                                fontSize: `${Math.max(10, object.fontSize)}px`,
                                fontWeight: object.bold ? 700 : 400,
                                color: getCssTextColor(object.color),
                              }}
                            >
                              {object.text || 'Text'}
                            </div>
                          )}
                          {isSelected && (
                            <>
                              {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
                                <div
                                  key={handle}
                                  data-resize-handle="true"
                                  onPointerDown={(event) => handleResizePointerDown(event, object.id, handle)}
                                  className={`absolute h-3 w-3 rounded-full border-2 border-white bg-orange-500 shadow ${
                                    handle === 'nw' ? '-left-1.5 -top-1.5 cursor-nwse-resize' :
                                      handle === 'ne' ? '-right-1.5 -top-1.5 cursor-nesw-resize' :
                                        handle === 'sw' ? '-bottom-1.5 -left-1.5 cursor-nesw-resize' :
                                          '-bottom-1.5 -right-1.5 cursor-nwse-resize'
                                  }`}
                                />
                              ))}
                              <div className="absolute -top-9 left-0 z-20 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 text-[10px] font-bold text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                                <button type="button" onClick={() => duplicatePendingObject(object.id)} className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">Duplicate</button>
                                <button type="button" onClick={() => deletePendingObject(object.id)} className="rounded px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                                <button type="button" onClick={() => void applyPendingObjects()} className="rounded bg-emerald-500 px-2 py-1 text-white">Apply</button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {selectedObject && (
                      <div
                        className="pointer-events-auto absolute z-20 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-2 text-xs shadow-xl"
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

          <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
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
          {hasFiles && (
            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-2 text-xs font-bold text-slate-700 shadow-2xl shadow-slate-900/20 backdrop-blur dark:border-slate-700 dark:bg-slate-950/95 dark:text-slate-200">
              <button
                type="button"
                onClick={() => setActivePageIndex((page) => clampNumber(page - 1, 0, Math.max(0, currentPageCount - 1)))}
                disabled={activePageIndex === 0}
                className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
              >
                Prev
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">
                {currentPageCount ? activePageIndex + 1 : 0} / {currentPageCount || 0}
              </span>
              <button
                type="button"
                onClick={() => setActivePageIndex((page) => clampNumber(page + 1, 0, Math.max(0, currentPageCount - 1)))}
                disabled={activePageIndex >= currentPageCount - 1}
                className="rounded-lg border border-slate-200 px-2 py-1 disabled:opacity-40 dark:border-slate-700"
              >
                Next
              </button>
              <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <button type="button" onClick={() => setZoom((value) => clampNumber(Number((value - 0.1).toFixed(2)), 0.75, 1.8))} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700">
                -
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1 dark:bg-slate-800">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => clampNumber(Number((value + 0.1).toFixed(2)), 0.75, 1.8))} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700">
                +
              </button>
              <button type="button" onClick={() => setZoom(1)} className="rounded-lg border border-slate-200 px-2 py-1 dark:border-slate-700">
                Fit
              </button>
            </div>
          )}
        </main>

        <aside className={hasFiles ? `${showPropertiesPanel ? 'space-y-4' : 'hidden'} border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:h-[calc(100vh-120px)] lg:overflow-auto` : 'space-y-6 lg:sticky lg:top-28 lg:self-start'}>
          <section className={hasFiles ? 'rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Current step</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {workflowStep === 'Upload' ? 'Upload a PDF to begin.' : workflowStep === 'Edit' ? 'Choose a goal and edit directly on the PDF.' : workflowStep === 'Apply' ? 'Apply pending edits before downloading.' : 'Your edited PDF is ready to download.'}
            </p>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Download</h3>
                  <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-100">
                    {pendingChangesCount > 0 ? `You have ${pendingChangesCount} pending edit${pendingChangesCount === 1 ? '' : 's'}. Apply them before downloading.` : 'No pending edits blocking download.'}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <button type="button" onClick={() => void applyPendingObjects()} disabled={!canEdit || pendingObjects.length === 0} className={primaryButtonClassName}>
                  Apply Changes
                </button>
                <button type="button" onClick={() => void downloadEditedPdf()} disabled={!hasFiles || isProcessing} className={primaryButtonClassName}>
                  Download Edited PDF
                </button>
                <button type="button" onClick={downloadOriginalPdf} disabled={!hasFiles || isProcessing} className={secondaryButtonClassName}>
                  Download Original PDF
                </button>
              </div>
              {downloadPromptOpen && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                  <p className="font-bold">You have pending edits. Apply them before downloading?</p>
                  <div className="mt-3 grid gap-2">
                    <button type="button" onClick={() => void downloadEditedPdf('apply')} className={primaryButtonClassName}>Apply and Download</button>
                    <button type="button" onClick={() => void downloadEditedPdf('current')} className={secondaryButtonClassName}>Download without pending edits</button>
                    <button type="button" onClick={() => setDownloadPromptOpen(false)} className={secondaryButtonClassName}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Page info</h3>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span>Current page: {currentPageCount ? activePageIndex + 1 : 'None'}</span>
                <span>Total pages: {currentPageCount || 'Not available'}</span>
                <span>Selected pages: {selectedPageIndexes.length || 0}</span>
                <span>Zoom: {Math.round(zoom * 100)}%</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-blue-950 dark:text-blue-100">Selected Text</h3>
                <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-100">
                  {textLayerAvailable ? 'Selectable' : 'Fallback'}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-blue-800 dark:text-blue-100">{textLayerStatus}</p>
              <p className="mt-2 rounded-xl bg-white/70 p-3 text-xs font-semibold leading-5 text-blue-900 dark:bg-slate-950/70 dark:text-blue-100">
                Selected PDF text is removed by covering the selected visible text. Some scanned PDFs may require Erase Area.
              </p>
              {selectedText ? (
                <div className="mt-4 space-y-3">
                  <FieldLabel label="Original selected text">
                    <textarea value={selectedText.text} readOnly className={`${inputClassName} min-h-28 resize-y`} />
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-blue-900 dark:text-blue-100">
                    <span>Page {selectedText.pageIndex + 1}</span>
                    <span>{selectedText.boxes.length} text box{selectedText.boxes.length === 1 ? '' : 'es'}</span>
                  </div>
                  <FieldLabel label="Replacement text">
                    <textarea value={replacementText} onChange={(event) => setReplacementText(event.target.value)} className={`${inputClassName} min-h-28 resize-y`} />
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Replacement font size">
                      <input
                        type="number"
                        min={6}
                        max={72}
                        value={replacementFontSize}
                        onChange={(event) => setReplacementFontSize(clampNumber(Number(event.target.value), 6, 72))}
                        className={inputClassName}
                      />
                    </FieldLabel>
                    <FieldLabel label="Replacement color">
                      <select value={annotationColor} onChange={(event) => setAnnotationColor(event.target.value as PdfTextColor)} className={inputClassName}>
                        <option value="slate">Slate</option>
                        <option value="emerald">Green</option>
                        <option value="blue">Blue</option>
                        <option value="red">Red</option>
                      </select>
                    </FieldLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => createSelectedTextCoverObjects('edit')} disabled={isProcessing} className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50">
                      Edit Selected Text
                    </button>
                    <button type="button" onClick={() => createSelectedTextCoverObjects('delete')} disabled={isProcessing} className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-50">
                      Delete Selected Text
                    </button>
                    <button type="button" onClick={() => createSelectedTextCoverObjects('highlight')} disabled={isProcessing} className={secondaryButtonClassName}>
                      Highlight Selected Text
                    </button>
                    <button type="button" onClick={copySelectedPdfText} className={secondaryButtonClassName}>
                      Copy Text
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedPdfText}
                    className={`${secondaryButtonClassName} w-full`}
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-white/70 p-3 text-sm text-blue-900 dark:bg-slate-950/70 dark:text-blue-100">
                  No selectable text selected yet.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Selected object</h3>
                {selectedObject && <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">Page {selectedObject.pageIndex + 1}</span>}
              </div>
              {selectedObject ? (
                <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">{getPendingObjectName(selectedObject)}</p>
                  <FieldLabel label={selectedObject.type === 'form-field' ? 'Label' : 'Content'}>
                    <textarea
                      value={selectedObject.type === 'form-field' ? selectedObject.label || '' : selectedObject.text}
                      onChange={(event) => updatePendingObject(selectedObject.id, selectedObject.type === 'form-field' ? { label: event.target.value } : { text: event.target.value })}
                      className={`${inputClassName} min-h-24 resize-y`}
                    />
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="X position">
                      <input type="number" min={0} max={100} value={Math.round(selectedObject.xPercent)} onChange={(event) => updatePendingObject(selectedObject.id, { xPercent: clampNumber(Number(event.target.value), 0, 98) })} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Y position">
                      <input type="number" min={0} max={100} value={Math.round(selectedObject.yPercent)} onChange={(event) => updatePendingObject(selectedObject.id, { yPercent: clampNumber(Number(event.target.value), 0, 98) })} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Width">
                      <input type="number" min={1} max={100} value={Math.round(selectedObject.widthPercent)} onChange={(event) => updatePendingObject(selectedObject.id, { widthPercent: clampNumber(Number(event.target.value), 1, 100 - selectedObject.xPercent) })} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label="Height">
                      <input type="number" min={1} max={100} value={Math.round(selectedObject.heightPercent)} onChange={(event) => updatePendingObject(selectedObject.id, { heightPercent: clampNumber(Number(event.target.value), 1, 100 - selectedObject.yPercent) })} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label={selectedObject.type === 'line' ? 'Stroke size' : 'Font size'}>
                      <input type="number" min={1} max={96} value={selectedObject.fontSize} onChange={(event) => updatePendingObject(selectedObject.id, { fontSize: clampNumber(Number(event.target.value), 1, 96) })} className={inputClassName} />
                    </FieldLabel>
                    <FieldLabel label={selectedObject.type === 'erase' ? 'Replacement color' : 'Color'}>
                      <select value={selectedObject.color} onChange={(event) => updatePendingObject(selectedObject.id, { color: event.target.value as PdfTextColor })} className={inputClassName}>
                        <option value="slate">Slate</option>
                        <option value="emerald">Green</option>
                        <option value="blue">Blue</option>
                        <option value="red">Red</option>
                      </select>
                    </FieldLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => updatePendingObject(selectedObject.id, { bold: !selectedObject.bold })} className={secondaryButtonClassName}>{selectedObject.bold ? 'Bold on' : 'Bold off'}</button>
                    <button type="button" onClick={() => duplicatePendingObject(selectedObject.id)} className={secondaryButtonClassName}>Duplicate</button>
                    <button type="button" onClick={() => deletePendingObject(selectedObject.id)} className={secondaryButtonClassName}>Delete</button>
                    <button type="button" onClick={() => void applyPendingObjects()} disabled={!canEdit || pendingObjects.length === 0} className={primaryButtonClassName}>Apply</button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Select an overlay object to edit it here.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Pending edits</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{pendingObjects.length} object{pendingObjects.length === 1 ? '' : 's'} waiting to apply.</p>
              </div>
              <button type="button" onClick={() => void applyPendingObjects()} disabled={!canEdit || pendingObjects.length === 0} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                Apply all
              </button>
            </div>
            {pendingObjects.length > 0 ? (
              <div className="mt-4 space-y-2">
                {pendingObjects.map((object) => (
                  <div key={object.id} className={`rounded-2xl border p-3 text-sm ${object.id === selectedObjectId ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'}`}>
                    <button type="button" onClick={() => setSelectedObjectId(object.id)} className="w-full text-left">
                      <span className="block font-semibold text-slate-900 dark:text-white">{getPendingObjectName(object)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Page {object.pageIndex + 1} · {Math.round(object.widthPercent)}% wide</span>
                    </button>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => duplicatePendingObject(object.id)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">Duplicate</button>
                      <button type="button" onClick={() => deletePendingObject(object.id)} className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600">Delete</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={clearPendingEdits} className={`${secondaryButtonClassName} w-full`}>Clear pending edits</button>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">No pending edits yet.</p>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Help and limits</h2>
            <div className="mt-4 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Can</h3>
                <p className="mt-1">Fill forms visually, add text/signature/date/checkmarks, cover visible text, add visual form fields, highlight, rotate/delete/reorder pages, merge/extract PDFs.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Cannot yet</h3>
                <p className="mt-1">Perfectly rewrite embedded PDF text like Microsoft Word, OCR scanned PDFs, edit images inside PDFs directly, or deep-compress PDFs.</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                Some PDFs do not store text as editable text. If text selection does not work, the PDF may be scanned, flattened, or image-based. In that case, use Erase Text Area.
              </div>
            </div>
          </section>
        </aside>
      </div>

      <section className={hasFiles ? 'hidden' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'}>
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
