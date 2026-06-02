import type { Metadata } from 'next';
import StockAnalyzer from './stock-analyzer';

export const metadata: Metadata = {
  title: 'Stock Analyzer | FinanceSphere',
  description:
    'Analyze stocks with valuation, risk, growth, dividend, and technical scoring tools.',
};

export default function StockAnalyzerPage() {
  return <StockAnalyzer />;
}
