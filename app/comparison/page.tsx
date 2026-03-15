import { ComparisonPageClient } from '@/components/comparison/ComparisonPageClient';

export const revalidate = 3600;

export default function ComparisonPage() {
  return <ComparisonPageClient />;
}
