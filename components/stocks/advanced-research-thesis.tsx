import type { StockMetrics } from '@/lib/stocks';

type Props = {
  stock: StockMetrics;
  score: {
    total: number;
    rating: string;
  };
  upside: number;
};

function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

function getResearchView(stock: StockMetrics, score: Props['score'], upside: number) {
  const growthStrong = stock.revenueGrowth > 10 || stock.epsGrowth > 10;
  const qualityStrong = stock.profitMargin > 15 && stock.roe > 10;
  const balanceStrong = stock.debtToEquity < 1;
  const valuationRisk = stock.forwardPe > 35;
  const momentumRisk = stock.rsi > 70;
  const weakMomentum = stock.rsi < 35;

  const bullScore = Math.min(80, Math.max(10, score.total * 0.65 + Math.max(0, upside) * 0.5 + (growthStrong ? 8 : 0) + (qualityStrong ? 8 : 0)));
  const bearScore = Math.min(70, Math.max(10, 100 - score.total + (valuationRisk ? 10 : 0) + (momentumRisk ? 8 : 0) + (!balanceStrong ? 8 : 0)));
  const neutralScore = Math.max(10, 100 - bullScore - bearScore);
  const total = bullScore + bearScore + neutralScore;
  const bull = Math.round((bullScore / total) * 100);
  const bear = Math.round((bearScore / total) * 100);
  const neutral = Math.max(0, 100 - bull - bear);

  const view = score.total >= 72 && upside > 8 && !valuationRisk ? 'BUY CANDIDATE' : score.total >= 55 ? 'WATCHLIST / HOLD' : 'AVOID / WAIT';

  return {
    view,
    bull,
    neutral,
    bear,
    thesis: growthStrong && qualityStrong
      ? `${stock.name} has a constructive setup because growth and profitability are both supportive. The key question is whether valuation and future earnings can continue to justify the current price.`
      : `${stock.name} needs a balanced review. Some signals may be supportive, but investors should verify growth durability, margins, valuation, and upcoming earnings before making a decision.`,
    bullCase: [
      growthStrong ? `Growth is supportive: revenue growth is ${pct(stock.revenueGrowth)} and EPS growth is ${pct(stock.epsGrowth)}.` : 'Growth could improve if revenue and EPS trends accelerate in future quarters.',
      qualityStrong ? `Profitability is a positive factor with ${pct(stock.profitMargin)} profit margin and ${pct(stock.roe)} ROE.` : 'Profitability can become a bullish factor if margins and ROE improve.',
      balanceStrong ? 'Debt appears manageable, giving the company more flexibility.' : 'Debt is not ideal, but strong cash flow could offset some balance-sheet risk.',
      upside > 8 ? `Estimated target implies ${pct(upside)} upside from the current price.` : 'More upside may appear if estimates rise or the stock pulls back.',
    ],
    bearCase: [
      valuationRisk ? `Forward P/E of ${stock.forwardPe.toFixed(1)} suggests high expectations are already priced in.` : 'Valuation risk is not extreme, but valuation should still be compared with peers.',
      momentumRisk ? 'RSI is above 70, which can mean the stock is short-term overbought.' : weakMomentum ? 'RSI is weak, which can signal negative momentum or a possible oversold setup.' : 'Momentum is not extreme, so price action should be monitored.',
      !balanceStrong ? `Debt/equity of ${stock.debtToEquity.toFixed(2)} means balance-sheet risk deserves attention.` : 'Even with manageable debt, refinancing and interest-rate risk should be watched.',
      stock.profitMargin < 10 ? 'Low profit margin can make the stock sensitive to cost pressure.' : 'Margins are important to watch because margin compression can hurt valuation.',
    ],
    swot: {
      strengths: [
        qualityStrong ? 'Healthy profitability profile' : 'Recognizable public company with trackable data',
        growthStrong ? 'Positive growth indicators' : 'Potential for future growth improvement',
        balanceStrong ? 'Manageable leverage' : 'Balance sheet can be monitored through filings',
      ],
      weaknesses: [
        valuationRisk ? 'High valuation expectations' : 'Valuation depends on future earnings delivery',
        stock.profitMargin < 12 ? 'Margins need improvement' : 'Margins must remain durable',
        stock.beta > 1.5 ? 'Higher volatility than the market' : 'Market volatility can still affect returns',
      ],
      opportunities: [
        'Better-than-expected earnings guidance',
        'Analyst estimate upgrades',
        'Sector momentum or improved macro conditions',
      ],
      threats: [
        'Earnings miss or weaker guidance',
        'Interest-rate or recession pressure',
        'Multiple compression if growth slows',
      ],
    },
    buyTriggers: [
      'Revenue and EPS growth continue improving',
      'Margins stay stable or expand',
      'Valuation becomes more attractive after a pullback',
      'Management guidance confirms demand strength',
    ],
    avoidTriggers: [
      'Growth slows for multiple quarters',
      'Margins compress meaningfully',
      'Debt rises while cash flow weakens',
      'Stock price runs far ahead of fundamentals',
    ],
    baseCase: [
      'Business performs near current expectations without a major positive or negative surprise.',
      'Valuation remains supported only if earnings and guidance stay credible.',
      'Position sizing matters because the base case may still include normal market volatility.',
    ],
    mustGoRight: [
      'Revenue and EPS growth need to remain durable.',
      'Margins should hold or improve instead of compressing.',
      'Management guidance should support the current valuation.',
    ],
    couldGoWrong: [
      'Growth slows while valuation remains high.',
      'Earnings guidance turns negative or misses repeat.',
      'Momentum breaks down while institutional or insider signals weaken.',
    ],
    thesisBreaker: 'The thesis weakens if growth slows while valuation remains high, or if earnings guidance turns negative.',
  };
}

export function AdvancedResearchThesis({ stock, score, upside }: Props) {
  const view = getResearchView(stock, score, upside);

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Investment Thesis</p>
          <h3 className="mt-2 text-2xl font-bold">Would I buy this today?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{view.thesis}</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Current View</p>
          <p className="mt-2 text-2xl font-black text-white">{view.view}</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">Educational signal only, not financial advice.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ProbabilityCard label="Bull Case" value={view.bull} text="Chance that upside drivers dominate." />
        <ProbabilityCard label="Neutral Case" value={view.neutral} text="Chance that the stock moves mostly with expectations." />
        <ProbabilityCard label="Bear Case" value={view.bear} text="Chance that risks or valuation pressure dominate." />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ThesisCard title="Bull Thesis" tone="bull" items={view.bullCase} />
        <ThesisCard title="Bear Thesis" tone="bear" items={view.bearCase} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <ThesisCard title="Base Case" tone="neutral" items={view.baseCase} />
        <ThesisCard title="What must go right" tone="bull" items={view.mustGoRight} />
        <ThesisCard title="What could go wrong" tone="bear" items={view.couldGoWrong} />
      </div>

      <div className="mt-6 rounded-xl border border-red-300/20 bg-red-300/10 p-4">
        <h4 className="font-bold text-white">Thesis breaker</h4>
        <p className="mt-2 text-sm leading-6 text-red-100">{view.thesisBreaker}</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-4">
        <SwotCard title="Strengths" items={view.swot.strengths} />
        <SwotCard title="Weaknesses" items={view.swot.weaknesses} />
        <SwotCard title="Opportunities" items={view.swot.opportunities} />
        <SwotCard title="Threats" items={view.swot.threats} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ThesisCard title="What would make this a stronger BUY?" tone="bull" items={view.buyTriggers} />
        <ThesisCard title="What would make this an AVOID?" tone="bear" items={view.avoidTriggers} />
      </div>
    </section>
  );
}

function ProbabilityCard({ label, value, text }: { label: string; value: number; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-bold text-white">{label}</h4>
        <span className="text-2xl font-black text-emerald-300">{value}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function ThesisCard({ title, items, tone }: { title: string; items: string[]; tone: 'bull' | 'bear' | 'neutral' }) {
  const toneClass = tone === 'bull'
    ? 'border-emerald-300/20 bg-emerald-300/10'
    : tone === 'bear'
      ? 'border-amber-300/20 bg-amber-300/10'
      : 'border-white/10 bg-black/20';
  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h4 className="font-bold text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function SwotCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <h4 className="font-bold text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
