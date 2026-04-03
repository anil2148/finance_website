import React from 'react';

const EmiCalculator = ({ isIndiaCurrency }) => {
    const principal = isIndiaCurrency ? 5000000 : 350000;
    const rate = isIndiaCurrency ? 8 : 6.8;
    const years = isIndiaCurrency ? 20 : 30;

    // Other calculator logic

    const title = isIndiaCurrency ? 'Home Loan EMI Calculator (India)' : 'Home Loan EMI Calculator';

function buildLoanProjection(principal: number, monthlyPayment: number, annualRate: number, years: number): GrowthPoint[] {
  const monthlyRate = annualRate / 12 / 100;
  let remaining = principal;

  return Array.from({ length: years }, (_, index) => {
    for (let i = 0; i < 12; i++) {
      const interest = remaining * monthlyRate;
      remaining = Math.max(0, remaining + interest - monthlyPayment);
    }

    return {
      year: index + 1,
      value: Number(remaining.toFixed(0))
    };
  });
}

export function EmiCalculator({ type = 'loan' }: { type?: CalculatorType }) {
  const { currency, formatCurrency } = usePreferences();
  const isIndiaCurrency = currency === 'INR';
  const currencySymbol = getCurrencySymbol(currency, getLocaleForCurrency(currency));
  const [principal, setPrincipal] = useState(
    type === 'mortgage' ? (isIndiaCurrency ? 5000000 : 350000) : 10000
  );
  const [rate, setRate] = useState(
    type === 'mortgage' ? (isIndiaCurrency ? 8 : 6.8) : 10
  );
  const [years, setYears] = useState(
    type === 'mortgage' ? (isIndiaCurrency ? 20 : 30) : 5
  );
  const [contribution, setContribution] = useState(type === 'retirement' ? 800 : 500);
  const [assets, setAssets] = useState(100000);
  const [liabilities, setLiabilities] = useState(25000);

  const result = useMemo(() => {
    if (type === 'networth') {
      return {
        value: assets - liabilities,
        chartData: [
          { year: 1, value: assets },
          { year: 2, value: liabilities },
          { year: 3, value: assets - liabilities }
        ]
      };
    }

    const months = Math.max(1, years * 12);
    const monthlyRate = rate / 12 / 100;

    if (type === 'loan' || type === 'mortgage') {
      const emi =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);

      return {
        value: emi,
        chartData: buildLoanProjection(principal, emi, rate, years)
      };
    }

    const growthData: GrowthPoint[] = [];
    let futureValue = principal;

    for (let y = 1; y <= years; y++) {
      futureValue = futureValue * (1 + rate / 100) + contribution * 12;
      growthData.push({ year: y, value: Number(futureValue.toFixed(0)) });
    }

    return {
      value: growthData.at(-1)?.value ?? 0,
      chartData: growthData
    };
  }, [assets, contribution, liabilities, principal, rate, type, years]);

  const title =
    type === 'mortgage'
      ? isIndiaCurrency ? 'Home Loan EMI Calculator (India)' : 'Home Loan EMI Calculator'
      : type === 'loan'
        ? 'Loan EMI Calculator'
        : type === 'compound'
          ? isIndiaCurrency
            ? 'SIP Calculator (India)'
            : 'Compound Interest Calculator'
          : type === 'retirement'
            ? 'Retirement Calculator'
            : 'Net Worth Calculator';

  const description =
    type === 'mortgage'
      ? 'Estimate your monthly EMI based on loan amount, interest rate, and tenure.'
      : type === 'loan'
        ? 'Calculate your monthly EMI with principal, rate, and tenure inputs.'
        : type === 'compound'
          ? isIndiaCurrency
            ? 'Forecast SIP growth with monthly ₹ contributions and return assumptions.'
            : 'Forecast investment growth with compounding and monthly contributions.'
          : type === 'retirement'
            ? 'Project retirement corpus using expected return and annual timeline.'
            : 'Calculate net worth by subtracting liabilities from assets.';

  const principalLabel =
    type === 'mortgage'
      ? `Home Loan Amount (${currencySymbol})`
      : type === 'compound'
        ? `Starting Amount (${currencySymbol})`
        : `Principal (${currencySymbol})`;

  const rateLabel = type === 'mortgage' ? 'Interest Rate (% p.a.)' : 'Annual Rate (%)';
  const yearsLabel = type === 'mortgage' ? 'Loan Tenure (Years)' : 'Years';
  const contributionLabel =
    type === 'compound' && isIndiaCurrency
      ? `Monthly SIP Amount (${currencySymbol})`
      : `Monthly Contribution (${currencySymbol})`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
    );
};

export default EmiCalculator;