/**
 * NLP-based financial data extractor.
 *
 * Parses salary, hourly wage, and job-offer details from free-form text
 * (user question, context, or raw message) so the copilot engine can
 * produce meaningful output even when structured inputs are empty.
 *
 * Conversion conventions:
 *   annual_income   = raw annual figure
 *   monthly_income  = annual_income / 12
 *   hourly_equivalent = annual_income / 2080  (40h × 52 weeks)
 */

export interface ParsedSalaryData {
  /** Annual income extracted from text (undefined when not found) */
  annualIncome?: number;
  /** Monthly income derived from annual (annual / 12) */
  monthlyIncome?: number;
  /** Hourly equivalent derived from annual (annual / 2080) */
  hourlyEquivalent?: number;
  /** Hourly rate when the text explicitly states an hourly figure */
  hourlyRate?: number;
  /** New / offer salary for comparison scenarios */
  newAnnualIncome?: number;
  /** Employment type hint found in text */
  employmentType?: 'w2' | 'c2c' | 'contractor';
  /** State mentioned in text (two-letter abbreviation) */
  state?: string;
}

// ─── Validation bounds ───────────────────────────────────────────────────────

/** Minimum plausible annual salary ($10k/year) */
const MIN_ANNUAL_SALARY = 10_000;
/** Maximum plausible annual salary ($10M/year) */
const MAX_ANNUAL_SALARY = 10_000_000;
/** Maximum plausible hourly rate ($10k/hr covers virtually all real-world cases) */
const MAX_HOURLY_RATE = 10_000;
/** Maximum plausible monthly income ($1M/month covers all realistic scenarios) */
const MAX_MONTHLY_INCOME = 1_000_000;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Strip currency symbols and commas, then parse as float.
 * Returns NaN if the string is not a valid number.
 */
function parseCurrencyValue(raw: string): number {
  return parseFloat(raw.replace(/[$,]/g, ''));
}

/**
 * Expand shorthand like "135K" → 135000, "1.2M" → 1200000.
 * Returns the original value unchanged if no suffix is present.
 */
function expandShorthand(value: number, suffix: string): number {
  const s = suffix.toLowerCase();
  if (s === 'k') return value * 1_000;
  if (s === 'm') return value * 1_000_000;
  return value;
}

/** Convert a raw annual figure to the full ParsedSalaryData shape. */
function fromAnnual(annual: number): { annualIncome: number; monthlyIncome: number; hourlyEquivalent: number } {
  return {
    annualIncome: annual,
    monthlyIncome: Math.round(annual / 12),
    hourlyEquivalent: Math.round((annual / 2080) * 100) / 100
  };
}

// ─── Pattern groups ──────────────────────────────────────────────────────────

/**
 * Match "$135K", "$135k", "$135,000", "$135000" (with optional per-year suffix).
 * Capture groups: [1] digits+decimal, [2] K/M shorthand, [3] per year/annually.
 */
const ANNUAL_SALARY_PATTERN =
  /\$\s*([\d,]+(?:\.\d+)?)\s*(k|m)?\s*(?:(?:per|a|\/)\s*(?:year|yr|annum|annually)|\byr\b|\bann(?:ually)?\b)?/gi;

/**
 * Match "$75 per hour", "$75/hr", "$75 an hour" etc.
 * Capture groups: [1] digits+decimal.
 */
const HOURLY_RATE_PATTERN =
  /\$\s*([\d,]+(?:\.\d+)?)\s*(?:per|\/|an?)?\s*(?:hour|hr)\b/gi;

/**
 * Match plain number followed by K/M suffix in a salary context.
 * e.g. "salary of 135K", "earning 85k a year", "make 200k"
 */
const CONTEXTUAL_KM_PATTERN =
  /(?:salary|income|earn(?:ing|s)?|mak(?:e|ing)|offer(?:ing)?|compens(?:ation|ated)?|pay(?:ing|ment)?|gross|base|total\s+comp)\s+(?:of\s+|is\s+|at\s+|around\s+|about\s+|~)?\$?([\d,]+(?:\.\d+)?)\s*(k|m)\b/gi;

/**
 * Match "X per month" patterns, e.g. "$8,000 per month", "$8k/month".
 */
const MONTHLY_PATTERN =
  /\$\s*([\d,]+(?:\.\d+)?)\s*(k|m)?\s*(?:per|\/|a)\s*(?:month|mo)\b/gi;

/**
 * Match "new offer", "new job", "offer of $X" for second-scenario salary.
 */
const NEW_OFFER_PATTERN =
  /(?:new\s+(?:offer|job|salary|role|position|comp)|offer(?:ing|ed)?\s+(?:me\s+)?(?:at\s+|of\s+)?)\$?\s*([\d,]+(?:\.\d+)?)\s*(k|m)?\b/gi;

// US state abbreviations (two-letter)
const STATE_PATTERN =
  /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/gi;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Extract financial data from one or more text sources (question, context, etc.).
 * All sources are joined and scanned together; the first meaningful match wins
 * for each field to avoid double-counting.
 *
 * @param sources - Array of free-form strings to scan (nullish entries are skipped).
 * @returns Populated ParsedSalaryData; all fields optional — only set when found.
 */
export function parseFinancialDataFromText(...sources: Array<string | undefined | null>): ParsedSalaryData {
  const text = sources.filter(Boolean).join(' ');
  if (!text.trim()) return {};

  const result: ParsedSalaryData = {};

  // ── 1. Hourly rate (highest specificity — check before annual) ────────────
  HOURLY_RATE_PATTERN.lastIndex = 0;
  const hourlyMatch = HOURLY_RATE_PATTERN.exec(text);
  if (hourlyMatch) {
    const rate = parseCurrencyValue(hourlyMatch[1]);
    if (!isNaN(rate) && rate > 0 && rate < MAX_HOURLY_RATE) {
      result.hourlyRate = rate;
      // Derive annual from hourly; do NOT also set annualIncome so callers can
      // distinguish an explicitly-hourly position from an annual-salary position.
      Object.assign(result, fromAnnual(rate * 2080));
    }
  }

  // ── 2. Monthly salary ─────────────────────────────────────────────────────
  if (!result.annualIncome) {
    MONTHLY_PATTERN.lastIndex = 0;
    const monthlyMatch = MONTHLY_PATTERN.exec(text);
    if (monthlyMatch) {
      const raw = parseCurrencyValue(monthlyMatch[1]);
      const suffix = monthlyMatch[2] ?? '';
      const monthly = expandShorthand(raw, suffix);
      if (!isNaN(monthly) && monthly > 0 && monthly < MAX_MONTHLY_INCOME) {
        const annual = monthly * 12;
        Object.assign(result, fromAnnual(annual));
        result.monthlyIncome = Math.round(monthly);
      }
    }
  }

  // ── 3. Explicit annual salary with "$" prefix ─────────────────────────────
  if (!result.annualIncome) {
    ANNUAL_SALARY_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = ANNUAL_SALARY_PATTERN.exec(text)) !== null) {
      const raw = parseCurrencyValue(match[1]);
      const suffix = match[2] ?? '';
      const value = expandShorthand(raw, suffix);
      // Accept values in a plausible annual salary range
      if (!isNaN(value) && value >= MIN_ANNUAL_SALARY && value <= MAX_ANNUAL_SALARY) {
        Object.assign(result, fromAnnual(value));
        break;
      }
    }
  }

  // ── 4. Contextual K/M pattern (salary of 85K) ────────────────────────────
  if (!result.annualIncome) {
    CONTEXTUAL_KM_PATTERN.lastIndex = 0;
    const ctxMatch = CONTEXTUAL_KM_PATTERN.exec(text);
    if (ctxMatch) {
      const raw = parseCurrencyValue(ctxMatch[1]);
      const suffix = ctxMatch[2] ?? '';
      const value = expandShorthand(raw, suffix);
      if (!isNaN(value) && value >= MIN_ANNUAL_SALARY && value <= MAX_ANNUAL_SALARY) {
        Object.assign(result, fromAnnual(value));
      }
    }
  }

  // ── 5. New offer / comparison salary ──────────────────────────────────────
  NEW_OFFER_PATTERN.lastIndex = 0;
  const offerMatch = NEW_OFFER_PATTERN.exec(text);
  if (offerMatch) {
    const raw = parseCurrencyValue(offerMatch[1]);
    const suffix = offerMatch[2] ?? '';
    const value = expandShorthand(raw, suffix);
    if (!isNaN(value) && value >= MIN_ANNUAL_SALARY && value <= MAX_ANNUAL_SALARY) {
      result.newAnnualIncome = value;
    }
  }

  // ── 6. Employment type hints ──────────────────────────────────────────────
  const lower = text.toLowerCase();
  if (lower.includes('c2c') || lower.includes('corp-to-corp') || lower.includes('corp to corp')) {
    result.employmentType = 'c2c';
  } else if (lower.includes('contractor') || lower.includes('1099')) {
    result.employmentType = 'contractor';
  } else if (lower.includes('w2') || lower.includes('w-2') || lower.includes('full-time') || lower.includes('full time')) {
    result.employmentType = 'w2';
  }

  // ── 7. State hint ─────────────────────────────────────────────────────────
  STATE_PATTERN.lastIndex = 0;
  const stateMatch = STATE_PATTERN.exec(text);
  if (stateMatch) {
    result.state = stateMatch[1].toUpperCase();
  }

  return result;
}

/**
 * Merge NLP-extracted data into the existing inputs object.
 * Structured inputs take precedence; NLP values are used only when the
 * corresponding input field is absent (undefined / 0 / falsy).
 *
 * @param inputs - Existing structured financial inputs from the request.
 * @param parsed - Data extracted by parseFinancialDataFromText.
 * @returns New inputs object with NLP-derived fields filled in where missing.
 */
export function mergeNlpIntoInputs<T extends {
  annualSalary?: number;
  hourlyRate?: number;
  newAnnualSalary?: number;
  newHourlyRate?: number;
  employmentType?: string;
  state?: string;
}>(inputs: T, parsed: ParsedSalaryData): T {
  const merged = { ...inputs };

  if (!merged.annualSalary && !merged.hourlyRate) {
    if (parsed.hourlyRate) {
      // Hourly-rate match is more specific — use it as the primary income field.
      merged.hourlyRate = parsed.hourlyRate;
    } else if (parsed.annualIncome) {
      // Annual income match (from $ prefix or monthly conversion).
      merged.annualSalary = parsed.annualIncome;
    }
  }

  if (!merged.newAnnualSalary && !merged.newHourlyRate) {
    if (parsed.newAnnualIncome) merged.newAnnualSalary = parsed.newAnnualIncome;
  }

  if (!merged.employmentType && parsed.employmentType) {
    (merged as Record<string, unknown>).employmentType = parsed.employmentType;
  }

  if (!merged.state && parsed.state) {
    merged.state = parsed.state;
  }

  return merged;
}
