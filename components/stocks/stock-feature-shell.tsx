'use client';

import Link from 'next/link';
import { demoStocks, scoreStock, calculateDcf, optionIncome } from '@/lib/stocks';

const tools = [
  { href: '/watchlist', title: 'Watchlist', description: 'Track favorite stocks and scores.' },
  { href: '/portfolio', title: 'Portfolio', description: 'Estimate holdings, gains, and risk.' },
  { href: '/stock-analyzer/compare', title: 'Compare', description: 'Compare stocks side by side.' },
  { href: '/stock-analyzer/dcf', title: 'DCF', description: 'Estimate fair value from cash flow.' },
  { href: '/stock-analyzer/dividends', title: 'Dividends', description: 'Screen income-focused stocks.' },
  { href: '/stock-analyzer/options', title: 'Options', description: 'Covered call income calculator.' },
  { href: '/alerts', title: 'Alerts', description: 'Create price and score alerts.' },
  { href: '/pricing', title: 'Pricing', description: 'Free and premium plan structure.' },
  { href: '/stock-analyzer/ai-insights', title: 'AI Insights', description: 'Summaries and decision checklist.' },
];

export function StockFeatureShell({ feature }: { feature: 'watchlist' | 'portfolio' | 'compare' | 'dcf' | 'dividends' | 'options' | 'alerts' | 'pricing' | 'ai' }) {
  const stocks = Object.values(demoStocks).map((stock) => ({ ...stock, score: scoreStock(stock) }));
  const dcfValue = calculateDcf({ freeCashFlow: 85000, growthRate: 8, discountRate: 10, terminalGrowthRate: 3, sharesOutstanding: 15500 });
  const call = optionIncome({ stockPrice: demoStocks.MSFT.price, strikePrice: 450, premium: 6.25, contracts: 1 });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-emerald-950 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">FinanceSphere Pro</p>
          <h1 className="mt-3 text-4xl font-bold">{titleFor(feature)}</h1>
          <p className="mt-3 max-w-3xl text-slate-300">{subtitleFor(feature)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                {tool.title}
              </Link>
            ))}
          </div>
        </div>

        {feature === 'watchlist' && (
          <Grid title="Watchlist MVP">
            {stocks.map((stock) => <StockCard key={stock.symbol} stock={stock} />)}
          </Grid>
        )}

        {feature === 'portfolio' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Stat label="Portfolio Value" value="$57,842" note="Demo holdings: AAPL, MSFT, NVDA" />
            <Stat label="Estimated Gain" value="$8,420" note="Local-storage/database ready concept" />
            <Stat label="Risk Level" value="Moderate" note="Based on beta and concentration" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-3">
              <h2 className="text-2xl font-bold">Holdings</h2>
              <table className="mt-5 w-full text-left text-sm">
                <thead className="text-slate-400"><tr><th>Symbol</th><th>Shares</th><th>Avg Cost</th><th>Price</th><th>Value</th></tr></thead>
                <tbody>{stocks.slice(0, 3).map((stock, index) => <tr key={stock.symbol} className="border-t border-white/10"><td className="py-3 font-bold">{stock.symbol}</td><td>{[25, 18, 40][index]}</td><td>${[172, 330, 94][index]}</td><td>${stock.price}</td><td>${Math.round(stock.price * [25, 18, 40][index]).toLocaleString()}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {feature === 'compare' && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-bold">Stock Comparison</h2>
            <table className="mt-5 w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th>Stock</th><th>Score</th><th>Rating</th><th>P/E</th><th>EPS Growth</th><th>Profit Margin</th><th>RSI</th></tr></thead>
              <tbody>{stocks.map((stock) => <tr key={stock.symbol} className="border-t border-white/10"><td className="py-3 font-bold">{stock.symbol}</td><td>{stock.score.total}</td><td>{stock.score.rating}</td><td>{stock.pe}</td><td>{stock.epsGrowth}%</td><td>{stock.profitMargin}%</td><td>{stock.rsi}</td></tr>)}</tbody>
            </table>
          </div>
        )}

        {feature === 'dcf' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Stat label="Fair Value Estimate" value={`$${dcfValue.toFixed(2)}`} note="Demo DCF using 5-year FCF forecast" />
            <Stat label="Growth Rate" value="8%" note="Adjustable in production UI" />
            <Stat label="Discount Rate" value="10%" note="Investor required return" />
          </div>
        )}

        {feature === 'dividends' && (
          <Grid title="Dividend Screener">
            {stocks.sort((a, b) => b.dividendYield - a.dividendYield).map((stock) => <Stat key={stock.symbol} label={stock.symbol} value={`${stock.dividendYield}%`} note={`${stock.name} dividend yield`} />)}
          </Grid>
        )}

        {feature === 'options' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <Stat label="Covered Call Income" value={`$${call.income.toFixed(0)}`} note="MSFT $450 call, $6.25 premium" />
            <Stat label="Max Gain" value={`$${call.maxGain.toFixed(0)}`} note="Premium plus upside to strike" />
            <Stat label="Breakeven" value={`$${call.breakeven.toFixed(2)}`} note="Stock price minus premium" />
          </div>
        )}

        {feature === 'alerts' && (
          <Grid title="Alert Rules">
            <Stat label="Price Alert" value="MSFT > $450" note="Send email or app notification" />
            <Stat label="Score Alert" value="NVDA < 70" note="Notify when quality score drops" />
            <Stat label="Dividend Alert" value="Yield > 3%" note="For income investors" />
          </Grid>
        )}

        {feature === 'pricing' && (
          <Grid title="Subscription Plans">
            <Plan name="Free" price="$0" features={["5 watchlist stocks", "Basic scoring", "Demo portfolio"]} />
            <Plan name="Pro" price="$9/mo" features={["Live data", "AI insights", "DCF and options tools", "Alerts"]} />
            <Plan name="Investor" price="$19/mo" features={["Unlimited portfolios", "Email alerts", "Advanced screeners", "Export reports"]} />
          </Grid>
        )}

        {feature === 'ai' && (
          <Grid title="AI Investment Insights">
            {stocks.map((stock) => <Stat key={stock.symbol} label={stock.symbol} value={stock.score.rating} note={`${stock.name} has a ${stock.score.total}/100 score. Review valuation, growth, debt, and technical trend before investing.`} />)}
          </Grid>
        )}
      </section>
    </main>
  );
}

function titleFor(feature: string) {
  return ({ watchlist: 'Watchlist', portfolio: 'Portfolio Tracker', compare: 'Stock Comparison Tool', dcf: 'DCF Valuation Calculator', dividends: 'Dividend Screener', options: 'Options Analyzer', alerts: 'Price & Score Alerts', pricing: 'Pricing & Subscriptions', ai: 'AI Stock Insights' } as Record<string, string>)[feature];
}

function subtitleFor(feature: string) {
  return ({ watchlist: 'Save favorite stocks and quickly monitor scores, price movement, and ratings.', portfolio: 'Track holdings, estimated gains, allocation, and risk in one place.', compare: 'Compare valuation, growth, profitability, risk, and momentum side by side.', dcf: 'Estimate fair value using free cash flow, growth, discount rate, and terminal value.', dividends: 'Find dividend-paying stocks and rank them by income yield.', options: 'Model covered call income, max gain, and breakeven before selling calls.', alerts: 'Configure price, score, dividend, and technical alerts.', pricing: 'Monetize the platform using free, pro, and investor subscription plans.', ai: 'Generate plain-English insights and investment checklists from metrics.' } as Record<string, string>)[feature];
}

function Grid({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-8"><h2 className="mb-5 text-2xl font-bold">{title}</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{children}</div></div>;
}

function StockCard({ stock }: { stock: ReturnType<typeof scoreStock> & any }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><p className="text-sm text-slate-400">{stock.symbol}</p><h3 className="text-xl font-bold">{stock.name}</h3><p className="mt-3 text-3xl font-black text-emerald-300">{stock.score.total}</p><p className="mt-2 text-slate-300">{stock.score.rating} • ${stock.price}</p></div>;
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-white">{value}</p><p className="mt-2 text-sm text-slate-400">{note}</p></div>;
}

function Plan({ name, price, features }: { name: string; price: string; features: string[] }) {
  return <div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-6"><h3 className="text-2xl font-bold">{name}</h3><p className="mt-3 text-4xl font-black text-emerald-300">{price}</p><ul className="mt-5 space-y-2 text-slate-300">{features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">Choose {name}</button></div>;
}
