export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) return '';
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (isValidDateInput(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return toDateInputValue(parsed);
}

export function isValidDateInput(value: string): boolean {
  return Boolean(parseDateInput(value));
}

export function daysUntil(dateInputValue: string, now = new Date()): number | null {
  const date = parseDateInput(dateInputValue);
  if (!date) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}

export function formatDateForDisplay(dateInputValue: string): string {
  const date = parseDateInput(dateInputValue);
  if (!date) return 'Not selected';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function todayDateInputValue(now = new Date()): string {
  return toDateInputValue(now);
}

export function getTodayDateInputValue(now = new Date()): string {
  return todayDateInputValue(now);
}

export function normalizeShortDateInput(value: string, now = new Date()): string {
  const trimmed = value.trim();
  if (isValidDateInput(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!match) return '';
  const month = Number(match[1]);
  const day = Number(match[2]);
  const rawYear = match[3] ? Number(match[3]) : now.getFullYear();
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  return toDateInputValue(new Date(year, month - 1, day));
}
