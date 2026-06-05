'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';

type WebViewerInstance = {
  UI: {
    loadDocument: (document: File | string | Blob, options?: { filename?: string }) => void;
    setToolMode?: (toolName: string) => void;
    setToolbarGroup?: (toolbarGroup: string) => void;
    enableFeatures?: (features: unknown[]) => void;
    disableElements?: (elementNames: string[]) => void;
    openElements?: (elementNames: string[]) => void;
    downloadPdf?: (options?: { filename?: string; includeAnnotations?: boolean }) => void;
  };
  Core: {
    documentViewer: {
      addEventListener: (eventName: string, listener: () => void) => void;
      removeEventListener?: (eventName: string, listener: () => void) => void;
      getDocument: () => {
        getFileData: (options?: { xfdfString?: string; downloadType?: string }) => Promise<ArrayBuffer>;
        getPageInfo?: (pageNumber: number) => { width: number; height: number };
      } | null;
      getCurrentPage: () => number;
    };
    annotationManager: {
      exportAnnotations: () => Promise<string>;
      getAnnotationsList?: () => unknown[];
      deleteAnnotations?: (annotations: unknown[]) => void;
      addAnnotation?: (annotation: unknown) => void;
      redrawAnnotation?: (annotation: unknown) => void;
    };
    Annotations?: {
      FreeTextAnnotation?: new () => {
        PageNumber: number;
        X: number;
        Y: number;
        Width: number;
        Height: number;
        FontSize?: string;
        TextColor?: unknown;
        setContents?: (content: string) => void;
      };
      Color?: new (red: number, green: number, blue: number, alpha?: number) => unknown;
    };
  };
};

type WebViewerFactory = (
  options: {
    path: string;
    licenseKey?: string;
    fullAPI?: boolean;
  },
  element: HTMLElement,
) => Promise<WebViewerInstance>;

const viewerAssetPath = '/webviewer';
const privacyMessage = 'Your PDF stays in your browser. Files are not uploaded to our server.';
const missingAssetsMessage =
  'PDF editor assets are missing. Please run npm install or ensure WebViewer assets are copied to public/webviewer.';
const limitationMessage =
  'Some PDFs allow text selection. For scanned or flattened PDFs, use Erase Area to cover content and add replacement text.';

const sdkToolNames = {
  pan: 'Pan',
  select: 'AnnotationEdit',
  text: 'AnnotationCreateFreeText',
  signature: 'AnnotationCreateSignature',
  highlight: 'AnnotationCreateTextHighlight',
  underline: 'AnnotationCreateTextUnderline',
  strikeout: 'AnnotationCreateTextStrikeout',
  rectangle: 'AnnotationCreateRectangle',
  line: 'AnnotationCreateLine',
  arrow: 'AnnotationCreateArrow',
  redaction: 'AnnotationCreateRedaction',
  ink: 'AnnotationCreateFreeHand',
};

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

function editedFileName(fileName: string | null) {
  if (!fileName) return 'edited-document.pdf';
  return fileName.replace(/\.pdf$/i, '') + '-edited.pdf';
}

export function PdfEditorClient() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const fileUrlRef = useRef<string | null>(null);
  const loadTokenRef = useRef(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [viewerReady, setViewerReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Upload a PDF to begin editing.');

  const loadPdf = useCallback((nextFile: File) => {
    if (!isPdfFile(nextFile)) {
      setError('Please upload a PDF file.');
      return;
    }

    if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    const nextUrl = URL.createObjectURL(nextFile);
    fileUrlRef.current = nextUrl;
    setFile(nextFile);
    setFileUrl(nextUrl);
    setViewerReady(false);
    setError(null);
    setStatus('Preparing PDF editor...');
    setIsLoading(true);
  }, []);

  useEffect(() => {
    return () => {
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!fileUrl || !file || !viewerRef.current) return;

    let cancelled = false;
    let settled = false;
    let timeoutId: number | undefined;
    let fallbackId: number | undefined;
    const loadToken = loadTokenRef.current + 1;
    loadTokenRef.current = loadToken;
    const activeFile = file;
    const viewerElement = viewerRef.current;

    const finishLoaded = () => {
      if (cancelled || settled || loadTokenRef.current !== loadToken) return;
      settled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (fallbackId) window.clearTimeout(fallbackId);
      setViewerReady(true);
      setIsLoading(false);
      setError(null);
      setStatus('PDF loaded. Use the toolbar to edit, fill, sign, annotate, and download.');
    };

    const failLoad = (message: string) => {
      if (cancelled || settled || loadTokenRef.current !== loadToken) return;
      settled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (fallbackId) window.clearTimeout(fallbackId);
      setViewerReady(false);
      setIsLoading(false);
      setError(message);
      setStatus('PDF editor failed to load.');
    };

    const startLoadWatchdog = () => {
      timeoutId = window.setTimeout(() => {
        failLoad('PDF editor took too long to load. Please refresh or check WebViewer assets.');
      }, 15000);
    };

    const checkDocumentFallback = (instance: WebViewerInstance) => {
      fallbackId = window.setTimeout(() => {
        if (instance.Core.documentViewer.getDocument()) {
          finishLoaded();
        }
      }, 1200);
    };

    const handleDocumentLoaded = (instance: WebViewerInstance) => {
      instance.Core.documentViewer.removeEventListener?.('documentLoaded', onDocumentLoaded);
      finishLoaded();
    };

    const onDocumentLoaded = () => {
      const instance = instanceRef.current;
      if (instance) handleDocumentLoaded(instance);
    };

    async function initializeViewer() {
      try {
        setViewerReady(false);
        setIsLoading(true);
        setError(null);
        setStatus('Preparing PDF editor...');
        startLoadWatchdog();

        setStatus('Loading editor assets...');
        const assetResponse = await fetch(`${viewerAssetPath}/ui/index.html`, {
          method: 'HEAD',
          cache: 'no-store',
        });

        if (!assetResponse.ok) {
          failLoad(missingAssetsMessage);
          return;
        }

        if (instanceRef.current) {
          const instance = instanceRef.current;
          setStatus('Opening PDF...');
          instance.Core.documentViewer.addEventListener('documentLoaded', onDocumentLoaded);
          instanceRef.current.UI.loadDocument(activeFile, { filename: activeFile.name });
          checkDocumentFallback(instance);
          return;
        }

        const imported = await import('@pdftron/webviewer');
        const WebViewer = imported.default as WebViewerFactory;
        const instance = await WebViewer(
          {
            path: viewerAssetPath,
            fullAPI: true,
            // TODO: Set NEXT_PUBLIC_APRYSE_LICENSE_KEY for production licensing.
            licenseKey: process.env.NEXT_PUBLIC_APRYSE_LICENSE_KEY || undefined,
          },
          viewerElement,
        );

        if (cancelled) return;

        instanceRef.current = instance;
        instance.UI.setToolbarGroup?.('toolbarGroup-Annotate');
        instance.UI.openElements?.(['leftPanel']);
        instance.Core.documentViewer.addEventListener('documentLoaded', onDocumentLoaded);
        setStatus('Opening PDF...');
        instance.UI.loadDocument(activeFile, { filename: activeFile.name });
        checkDocumentFallback(instance);
      } catch (caughtError) {
        console.error('[pdf-editor] WebViewer initialization failed', caughtError);
        if (!cancelled) {
          failLoad('PDF editor failed to initialize.');
        }
      }
    }

    void initializeViewer();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      if (fallbackId) window.clearTimeout(fallbackId);
      instanceRef.current?.Core.documentViewer.removeEventListener?.('documentLoaded', onDocumentLoaded);
    };
  }, [file, fileUrl, loadAttempt]);

  const chooseFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileInput = (files: FileList | null) => {
    const nextFile = files?.[0];
    if (nextFile) loadPdf(nextFile);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileInput(event.dataTransfer.files);
  };

  const retryLoad = () => {
    if (!file) {
      chooseFile();
      return;
    }

    setError(null);
    setViewerReady(false);
    setIsLoading(true);
    setStatus('Preparing PDF editor...');
    setLoadAttempt((attempt) => attempt + 1);
  };

  const setToolMode = (toolName: string, friendlyName: string) => {
    const instance = instanceRef.current;
    if (!instance) {
      setError('Upload a PDF before choosing a tool.');
      return;
    }

    try {
      instance.UI.setToolMode?.(toolName);
      setStatus(`${friendlyName} tool active.`);
      setError(null);
    } catch {
      setError(`${friendlyName} is not available in this WebViewer configuration.`);
    }
  };

  const addFreeText = (text: string, label: string) => {
    const instance = instanceRef.current;
    const FreeTextAnnotation = instance?.Core.Annotations?.FreeTextAnnotation;
    const Color = instance?.Core.Annotations?.Color;
    if (!instance || !FreeTextAnnotation || !Color) {
      setToolMode(sdkToolNames.text, label);
      return;
    }

    try {
      const pageNumber = instance.Core.documentViewer.getCurrentPage();
      const pageInfo = instance.Core.documentViewer.getDocument()?.getPageInfo?.(pageNumber);
      const annotation = new FreeTextAnnotation();
      annotation.PageNumber = pageNumber;
      annotation.X = pageInfo ? pageInfo.width * 0.2 : 120;
      annotation.Y = pageInfo ? pageInfo.height * 0.2 : 120;
      annotation.Width = label === 'Checkmark' ? 45 : 160;
      annotation.Height = 36;
      annotation.FontSize = '16pt';
      annotation.TextColor = new Color(15, 23, 42);
      annotation.setContents?.(text);
      instance.Core.annotationManager.addAnnotation?.(annotation);
      instance.Core.annotationManager.redrawAnnotation?.(annotation);
      setStatus(`${label} added. Drag or resize it in the viewer.`);
      setError(null);
    } catch {
      setToolMode(sdkToolNames.text, label);
    }
  };

  const downloadEditedPdf = async () => {
    const instance = instanceRef.current;
    if (!instance || !file) {
      setError('Upload a PDF before downloading.');
      return;
    }

    try {
      const viewerDocument = instance.Core.documentViewer.getDocument();
      const xfdfString = await instance.Core.annotationManager.exportAnnotations();
      const data = await viewerDocument?.getFileData({ xfdfString, downloadType: 'pdf' });
      if (!data) throw new Error('No PDF data returned.');

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = editedFileName(file.name);
      link.click();
      URL.revokeObjectURL(url);
      setStatus('Edited PDF downloaded.');
      setError(null);
    } catch {
      try {
        instance.UI.downloadPdf?.({ filename: editedFileName(file.name), includeAnnotations: true });
        setStatus('Edited PDF download started.');
        setError(null);
      } catch {
        setError('Unable to download the edited PDF.');
      }
    }
  };

  const resetEditor = () => {
    if (!file || !instanceRef.current) return;
    const annotationManager = instanceRef.current.Core.annotationManager;
    const annotations = annotationManager.getAnnotationsList?.() ?? [];
    if (annotations.length > 0) {
      annotationManager.deleteAnnotations?.(annotations);
    }
    instanceRef.current.UI.loadDocument(file, { filename: file.name });
    setStatus('PDF reset to the uploaded file and annotations cleared.');
    setError(null);
  };

  const replaceFile = () => chooseFile();

  return (
    <section className="min-h-screen bg-neutral-200 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => handleFileInput(event.target.files)}
      />

      {!file ? (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">FinanceSphere PDF tools</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">PDF Editor</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Edit, fill, sign, annotate, organize, and download PDFs in a professional browser-based workspace.
            </p>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-8 rounded-3xl border-2 border-dashed p-10 text-center transition ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100'
                  : 'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              }`}
            >
              <p className="text-xl font-bold">Drag and drop a PDF here</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">or choose a file from your device</p>
              <button
                type="button"
                onClick={chooseFile}
                className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Choose PDF
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {['Add text', 'Sign', 'Fill forms', 'Highlight', 'Redact / erase', 'Organize pages', 'Draw and annotate', 'Download edited PDF'].map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold dark:border-slate-800 dark:bg-slate-950">
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <p className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                {privacyMessage}
              </p>
              <p className="rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                {limitationMessage}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col overflow-hidden">
          <header className="flex h-[72px] min-h-[72px] items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <a href="/tools" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
              Home
            </a>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{file.name}</p>
              <p className="truncate text-xs font-semibold text-emerald-700 dark:text-emerald-300">{privacyMessage}</p>
              <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{status}</p>
            </div>
            <div className="hidden max-w-[46vw] items-center gap-2 overflow-x-auto xl:flex">
              {[
                ['Select', () => setToolMode(sdkToolNames.select, 'Select')],
                ['Pan', () => setToolMode(sdkToolNames.pan, 'Pan')],
                ['Add Text', () => setToolMode(sdkToolNames.text, 'Add Text')],
                ['Sign', () => setToolMode(sdkToolNames.signature, 'Signature')],
                ['Initials', () => addFreeText('Initials', 'Initials')],
                ['Date', () => addFreeText(new Intl.DateTimeFormat('en-US').format(new Date()), 'Date')],
                ['Checkmark', () => addFreeText('✓', 'Checkmark')],
                ['Highlight', () => setToolMode(sdkToolNames.highlight, 'Highlight')],
                ['Underline', () => setToolMode(sdkToolNames.underline, 'Underline')],
                ['Strikeout', () => setToolMode(sdkToolNames.strikeout, 'Strikeout')],
                ['Redact / Erase', () => setToolMode(sdkToolNames.redaction, 'Redact / Erase')],
                ['Draw', () => setToolMode(sdkToolNames.ink, 'Draw')],
                ['Shape', () => setToolMode(sdkToolNames.rectangle, 'Shape')],
                ['Arrow', () => setToolMode(sdkToolNames.arrow, 'Arrow')],
              ].map(([label, action]) => (
                <button
                  key={label as string}
                  type="button"
                  onClick={action as () => void}
                  disabled={!viewerReady}
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {label as string}
                </button>
              ))}
            </div>
            <button type="button" onClick={replaceFile} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
              Replace PDF
            </button>
            <button type="button" onClick={resetEditor} disabled={!viewerReady} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">
              Reset
            </button>
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
              Print
            </button>
            <button type="button" onClick={() => void downloadEditedPdf()} disabled={!viewerReady} className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
              Download Edited PDF
            </button>
          </header>

          <div className="flex min-h-14 items-center gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900 xl:hidden">
            {[
              ['Select', () => setToolMode(sdkToolNames.select, 'Select')],
              ['Pan', () => setToolMode(sdkToolNames.pan, 'Pan')],
              ['Add Text', () => setToolMode(sdkToolNames.text, 'Add Text')],
              ['Sign', () => setToolMode(sdkToolNames.signature, 'Signature')],
              ['Initials', () => addFreeText('Initials', 'Initials')],
              ['Date', () => addFreeText(new Intl.DateTimeFormat('en-US').format(new Date()), 'Date')],
              ['Checkmark', () => addFreeText('✓', 'Checkmark')],
              ['Highlight', () => setToolMode(sdkToolNames.highlight, 'Highlight')],
              ['Underline', () => setToolMode(sdkToolNames.underline, 'Underline')],
              ['Strikeout', () => setToolMode(sdkToolNames.strikeout, 'Strikeout')],
              ['Redact / Erase', () => setToolMode(sdkToolNames.redaction, 'Redact / Erase')],
              ['Draw', () => setToolMode(sdkToolNames.ink, 'Draw')],
              ['Shape', () => setToolMode(sdkToolNames.rectangle, 'Shape')],
              ['Arrow', () => setToolMode(sdkToolNames.arrow, 'Arrow')],
            ].map(([label, action]) => (
              <button
                key={label as string}
                type="button"
                onClick={action as () => void}
                disabled={!viewerReady}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                {label as string}
              </button>
            ))}
            <button type="button" onClick={() => void downloadEditedPdf()} disabled={!viewerReady} className="ml-auto rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
              Download
            </button>
          </div>

          {error && (
            <div className="flex flex-col gap-3 border-b border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={retryLoad}
                  className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={replaceFile}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-slate-950 dark:text-red-200"
                >
                  Replace PDF
                </button>
              </div>
            </div>
          )}

          <main className="relative h-[calc(100vh-128px)] flex-1 bg-neutral-200 dark:bg-slate-900 xl:h-[calc(100vh-72px)]">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 text-sm font-bold text-slate-700 backdrop-blur dark:bg-slate-950/70 dark:text-slate-200">
                {status || 'Loading PDF editor...'}
              </div>
            )}
            <div className="absolute left-4 top-4 z-10 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              {limitationMessage}
            </div>
            <div ref={viewerRef} className="h-full w-full" />
          </main>
        </div>
      )}
    </section>
  );
}
