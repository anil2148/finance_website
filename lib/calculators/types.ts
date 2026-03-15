export type BaseCalculatorInputs = {
  loanAmount: number;
  interestRate: number;
  monthlyContribution: number;
  years: number;
  inflationRate: number;
  expectedReturn: number;
};

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
};

export type ChartKind = 'growth' | 'amortization' | 'pie' | 'bar';

export type CalculatorResult = {
  title: string;
  summary: SummaryMetric[];
  projection: ProjectionPoint[];
  breakdown: BreakdownRow[];
  chartKinds: ChartKind[];
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  faq: Array<{ question: string; answer: string }>;
  blogLinks: Array<{ title: string; href: string }>;
  defaultInputs: BaseCalculatorInputs;
  compute: (inputs: BaseCalculatorInputs) => CalculatorResult;
};
