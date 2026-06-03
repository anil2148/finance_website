import StockOpportunityClient from './stock-opportunity-client';

export const metadata = {
  title: 'Stock Opportunity | FinanceSphere',
  description: 'Generate a beginner-friendly buy, sell, or hold opportunity view using stock analysis signals.',
};

export default function StockOpportunityPage() {
  return <StockOpportunityClient />;
}
