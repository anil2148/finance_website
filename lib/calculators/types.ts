export type CalculatorFieldDefinition<TInputs extends Record<string, number>> = {
  key: keyof TInputs;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
};

export type BaseCalculatorInputs = {
  loanAmount: number;
  homePrice: number;
  downPayment: number;
  interestRate: number;
  minimumPayment: number;
  monthlyContribution: number;
  years: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  inflationRate: number;
  expectedReturn: number;
};


export type MortgageCalculatorInputs = Required<Pick<BaseCalculatorInputs, 'loanAmount' | 'homePrice' | 'downPayment' | 'interestRate' | 'years' | 'propertyTax' | 'insurance' | 'pmi'>> &
  Pick<BaseCalculatorInputs, 'monthlyContribution'>;

export type LoanCalculatorInputs = Required<Pick<BaseCalculatorInputs, 'loanAmount' | 'interestRate' | 'years'>> &
  Pick<BaseCalculatorInputs, 'monthlyContribution'>;

export type DebtPayoffCalculatorInputs = Required<Pick<BaseCalculatorInputs, 'loanAmount' | 'interestRate' | 'years' | 'monthlyContribution'>> &
  Pick<BaseCalculatorInputs, 'minimumPayment'>;

export type GrowthCalculatorInputs = Required<Pick<BaseCalculatorInputs, 'loanAmount' | 'years' | 'monthlyContribution' | 'expectedReturn'>> &
  Pick<BaseCalculatorInputs, 'inflationRate'>;

export type SalaryAfterTaxCalculatorInputs = Required<Pick<BaseCalculatorInputs, 'loanAmount' | 'interestRate'>> &
  Pick<BaseCalculatorInputs, 'inflationRate'>;

export type ProjectionPoint = {
  month: number;
  year: number;
  balance: number;
  contributed: number;
  interestEarned: number;
  principalPaid?: number;
  interestPaid?: number;
  payment?: number;
};

export type SummaryMetric = {
  label: string;
  value: number;
  currency?: boolean;
  suffix?: string;
  helpText: string;
};

export type BreakdownRow = {
  label: string;
  value: string;
  amount?: number;
  currency?: boolean;
};

export type ChartKind = 'growth' | 'amortization' | 'pie' | 'bar';

export type CalculatorResult = {
  title: string;
  summary: SummaryMetric[];
  projection: ProjectionPoint[];
  breakdown: BreakdownRow[];
  chartKinds: ChartKind[];
};

export type CalculatorDefinition<TInputs extends Record<string, number> = Record<string, number>> = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  faq: Array<{ question: string; answer: string }>;
  blogLinks: Array<{ title: string; href: string }>;
  defaultInputs: TInputs;
  inputSchema?: Array<CalculatorFieldDefinition<TInputs>>;
  compute: (inputs: TInputs | any) => CalculatorResult;
};
