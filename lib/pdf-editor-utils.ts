export const INVALID_PAGE_RANGE_MESSAGE = 'Invalid page range.';

export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function createEditedFileName(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, '');
  return `${baseName || 'document'}-edited.pdf`;
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

export function validateReorderInput(input: string, pageCount: number) {
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

export const parsePageOrder = validateReorderInput;

export type DomRectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type PdfSelectionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function mapDomRectToPdfBox(
  rect: DomRectLike,
  pageRect: Pick<DomRectLike, 'left' | 'top' | 'width' | 'height'>,
  pdfPageSize: { width: number; height: number },
): PdfSelectionBox {
  const xRatio = pdfPageSize.width / pageRect.width;
  const yRatio = pdfPageSize.height / pageRect.height;
  const left = Math.max(0, rect.left - pageRect.left);
  const top = Math.max(0, rect.top - pageRect.top);
  const right = Math.min(pageRect.width, rect.right - pageRect.left);
  const bottom = Math.min(pageRect.height, rect.bottom - pageRect.top);

  return {
    x: left * xRatio,
    y: pdfPageSize.height - bottom * yRatio,
    width: Math.max(0, right - left) * xRatio,
    height: Math.max(0, bottom - top) * yRatio,
  };
}

export const convertDomRectToPdfRect = mapDomRectToPdfBox;

export function padPdfSelectionBox(
  box: PdfSelectionBox,
  padding: number,
  pdfPageSize: { width: number; height: number },
): PdfSelectionBox {
  const x = Math.max(0, box.x - padding);
  const y = Math.max(0, box.y - padding);
  const right = Math.min(pdfPageSize.width, box.x + box.width + padding);
  const top = Math.min(pdfPageSize.height, box.y + box.height + padding);

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, top - y),
  };
}

export function groupSelectionBoxes(boxes: PdfSelectionBox[]) {
  return boxes.filter((box) => box.width > 0 && box.height > 0);
}

export const padSelectionRects = (
  boxes: PdfSelectionBox[],
  padding: number,
  pdfPageSize: { width: number; height: number },
) => boxes.map((box) => padPdfSelectionBox(box, padding, pdfPageSize));

export function validateOnePageSelection(pageIndexes: number[]) {
  const uniquePages = new Set(pageIndexes);
  if (uniquePages.size > 1) {
    throw new Error('Please select text on one page at a time.');
  }
  return pageIndexes[0] ?? null;
}
