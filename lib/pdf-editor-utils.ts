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
