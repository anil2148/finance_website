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
 *
 * India-specific conventions:
 *   CTC (Cost-to-Company) monthly → annual = monthly × 12
 *   1 lakh = 100,000 (₹1L = ₹100,000)
 *   1 crore = 10,000,000 (₹1Cr = ₹10,000,000)
 *   INR bounds: min ₹120,000/year (₹10,000/month), max ₹1,000,000,000/year
 */

export type SalaryRegion = 'US' | 'India';

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
  /** Whether income was interpreted as monthly CTC (India context) */
  wasMonthlyCTC?: boolean;
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

/** Minimum plausible annual INR salary (₹1,20,000/year = ₹10,000/month) */
const MIN_ANNUAL_SALARY_INR = 120_000;
/** Maximum plausible annual INR salary (₹100 crore = ₹1,000,000,000) */
const MAX_ANNUAL_SALARY_INR = 1_000_000_000;
/** Maximum plausible monthly INR salary (₹10 crore/month) */
const MAX_MONTHLY_INCOME_INR = 100_000_000;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Strip currency symbols ($ and ₹) and commas, then parse as float.
 * Returns NaN if the string is not a valid number.
 */
function parseCurrencyValue(raw: string): number {
  return parseFloat(raw.replace(/[$₹,]/g, ''));
}

/**
 * Expand shorthand like "135K" → 135000, "1.2M" → 1200000.
 * Also handles Indian shorthands: "5L" / "5 lakh" → 500000, "1.2Cr" / "1.2 crore" → 12000000.
 * Returns the original value unchanged if no suffix is present.
 */
function expandShorthand(value: number, suffix: string): number {
  const s = suffix.toLowerCase();
  if (s === 'k') return value * 1_000;
  if (s === 'm') return value * 1_000_000;
  // Indian denominations
  if (s === 'l' || s === 'lakh' || s === 'lacs' || s === 'lac') return value * 100_000;
  if (s === 'cr' || s === 'crore' || s === 'crores') return value * 10_000_000;
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

// ─── India-specific patterns ──────────────────────────────────────────────────

/**
 * Match "₹X lakh", "₹X L", "X lakh", "X lakhs" (Indian currency shorthand).
 * e.g. "₹12 lakh CTC", "12L per month", "salary of 15 lakhs"
 * Capture groups: [1] digits+decimal, [2] lakh/l/lacs/lac, [3] per month/year context.
 */
const INR_LAKH_PATTERN =
  /₹?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lakhs|lacs|lac|l)\b(?:\s*(?:per|\/|a)\s*(?:month|mo|year|yr|annum))?/gi;

/**
 * Match "₹X crore", "₹X Cr" (Indian large number).
 * e.g. "₹1.5 crore package", "2Cr CTC"
 */
const INR_CRORE_PATTERN =
  /₹?\s*([\d,]+(?:\.\d+)?)\s*(crore|crores|cr)\b/gi;

/**
 * Match ₹-prefixed amounts, e.g. "₹85,000", "₹85000", "₹85K".
 * Capture groups: [1] digits+decimal, [2] K/M shorthand.
 */
const INR_AMOUNT_PATTERN =
  /₹\s*([\d,]+(?:\.\d+)?)\s*(k|m)?\b/gi;

/**
 * Match "X per month CTC" or "monthly CTC of X" — Indian salary convention.
 * CTC = Cost to Company (gross package before deductions).
 */
const INR_MONTHLY_PATTERN =
  /₹?\s*([\d,]+(?:\.\d+)?)\s*(k|m|lakh|l|lacs|lac)?\s*(?:per|\/|a)?\s*(?:month|mo)\b(?:\s*ctc)?|ctc\s+(?:of\s+)?₹?\s*([\d,]+(?:\.\d+)?)\s*(k|m|lakh|l|lacs|lac)?\s*(?:per|\/|a)?\s*(?:month|mo)/gi;

/**
 * Match contextual Indian salary phrases.
 * e.g. "CTC of 8 lakhs", "salary is 80000 per month"
 */
const INR_CONTEXTUAL_PATTERN =
  /(?:ctc|salary|income|earn(?:ing|s)?|package|compensation|pay)\s+(?:is\s+|of\s+|at\s+|about\s+)?₹?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lakhs|lacs|lac|l|crore|crores|cr|k|m)?\b/gi;

// US state abbreviations (two-letter)
const STATE_PATTERN =
  /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)\b/gi;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Extract financial data from one or more text sources (question, context, etc.).
 * All sources are joined and scanned together; the first meaningful match wins
 * for each field to avoid double-counting.
 *
 * When region is 'India', Indian salary conventions are tried first:
 *   - ₹ symbol, lakh/crore notation, monthly CTC interpreted as annual × 12.
 *
 * @param sources - Array of free-form strings to scan (nullish entries are skipped).
 * @param region  - 'US' (default) or 'India' — controls which patterns run first.
 * @returns Populated ParsedSalaryData; all fields optional — only set when found.
 */
export function parseFinancialDataFromText(
  ...args: [...Array<string | undefined | null>] | [...Array<string | undefined | null>, SalaryRegion]
): ParsedSalaryData {
  // Detect if last argument is a region string
  let region: SalaryRegion = 'US';
  let sources: Array<string | undefined | null>;
  const last = args[args.length - 1];
  if (last === 'US' || last === 'India') {
    region = last as SalaryRegion;
    sources = args.slice(0, -1) as Array<string | undefined | null>;
  } else {
    sources = args as Array<string | undefined | null>;
  }

  const text = sources.filter(Boolean).join(' ');
  if (!text.trim()) return {};

  const result: ParsedSalaryData = {};

  if (region === 'India') {
    // ── India: try ₹ + lakh/crore patterns first ────────────────────────────

    // 1a. ₹ monthly CTC pattern (monthly × 12 → annual)
    INR_MONTHLY_PATTERN.lastIndex = 0;
    const inrMonthly = INR_MONTHLY_PATTERN.exec(text);
    if (inrMonthly) {
      const rawStr = inrMonthly[1] ?? inrMonthly[3];
      const suffixStr = inrMonthly[2] ?? inrMonthly[4] ?? '';
      if (rawStr) {
        const raw = parseCurrencyValue(rawStr);
        const monthly = expandShorthand(raw, suffixStr);
        if (!isNaN(monthly) && monthly > 0 && monthly < MAX_MONTHLY_INCOME_INR) {
          const annual = monthly * 12;
          Object.assign(result, fromAnnual(annual));
          result.monthlyIncome = Math.round(monthly);
          result.wasMonthlyCTC = true;
        }
      }
    }

    // 1b. Lakh-denominated amounts (e.g. "12 lakh CTC", "₹15 lakhs")
    if (!result.annualIncome) {
      INR_LAKH_PATTERN.lastIndex = 0;
      const lakhMatch = INR_LAKH_PATTERN.exec(text);
      if (lakhMatch) {
        const raw = parseCurrencyValue(lakhMatch[1]);
        const value = expandShorthand(raw, lakhMatch[2] ?? '');
        if (!isNaN(value) && value >= MIN_ANNUAL_SALARY_INR && value <= MAX_ANNUAL_SALARY_INR) {
          Object.assign(result, fromAnnual(value));
        }
      }
    }

    // 1c. Crore-denominated amounts
    if (!result.annualIncome) {
      INR_CRORE_PATTERN.lastIndex = 0;
      const croreMatch = INR_CRORE_PATTERN.exec(text);
      if (croreMatch) {
        const raw = parseCurrencyValue(croreMatch[1]);
        const value = expandShorthand(raw, croreMatch[2] ?? '');
        if (!isNaN(value) && value >= MIN_ANNUAL_SALARY_INR && value <= MAX_ANNUAL_SALARY_INR) {
          Object.assign(result, fromAnnual(value));
        }
      }
    }

    // 1d. Contextual Indian salary phrases ("CTC of 8 lakhs")
    if (!result.annualIncome) {
      INR_CONTEXTUAL_PATTERN.lastIndex = 0;
      const ctxInrMatch = INR_CONTEXTUAL_PATTERN.exec(text);
      if (ctxInrMatch) {
        const raw = parseCurrencyValue(ctxInrMatch[1]);
        const value = expandShorthand(raw, ctxInrMatch[2] ?? '');
        if (!isNaN(value) && value >= MIN_ANNUAL_SALARY_INR && value <= MAX_ANNUAL_SALARY_INR) {
          Object.assign(result, fromAnnual(value));
        }
      }
    }

    // 1e. Plain ₹ amount (e.g. "₹85,000", "₹85K")
    if (!result.annualIncome) {
      INR_AMOUNT_PATTERN.lastIndex = 0;
      let inrMatch: RegExpExecArray | null;
      while ((inrMatch = INR_AMOUNT_PATTERN.exec(text)) !== null) {
        const raw = parseCurrencyValue(inrMatch[1]);
        const value = expandShorthand(raw, inrMatch[2] ?? '');
        if (!isNaN(value) && value >= MIN_ANNUAL_SALARY_INR && value <= MAX_ANNUAL_SALARY_INR) {
          Object.assign(result, fromAnnual(value));
          break;
        }
      }
    }
  }

  // ── 1. Hourly rate (highest specificity — check before annual) ────────────
  if (!result.annualIncome) {
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
 * Normalize financial inputs for a given region.
 *
 * For India:
 *   - If `incomePeriod` is 'monthly' (CTC), convert annualSalary to annual (× 12).
 *   - If a `monthlySalaryINR` field is present, derive annualSalary.
 *   - Never assume missing income = 0.
 *
 * For US:
 *   - Assume annualSalary is already annual.
 *   - hourlyRate × 2080 = annual equivalent.
 *
 * @returns New inputs object with income normalized to annual basis.
 */
export function normalizeInputsForRegion<T extends {
  annualSalary?: number;
  hourlyRate?: number;
  newAnnualSalary?: number;
  incomePeriod?: 'monthly' | 'annual';
}>(inputs: T, region: SalaryRegion): T {
  const normalized = { ...inputs };

  if (region === 'India') {
    // Monthly CTC → convert to annual. Never assume 0.
    if (normalized.incomePeriod === 'monthly' && normalized.annualSalary && normalized.annualSalary > 0) {
      normalized.annualSalary = normalized.annualSalary * 12;
    }
    if (normalized.incomePeriod === 'monthly' && normalized.newAnnualSalary && normalized.newAnnualSalary > 0) {
      normalized.newAnnualSalary = normalized.newAnnualSalary * 12;
    }
    // After normalization, clear incomePeriod flag so downstream doesn't double-convert
    if (normalized.incomePeriod === 'monthly') {
      (normalized as Record<string, unknown>).incomePeriod = 'annual';
    }
  }

  return normalized;
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
