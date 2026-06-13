import type { StockDecisionSnapshot } from '@/lib/stock-decision-tools';

export const recentAnalysesKey = 'financeSphereRecentAnalyses';
export const savedAnalysisSnapshotsKey = 'financeSphereSavedAnalysisSnapshots';

export type RecentAnalyzedStock = {
  symbol: string;
  companyName: string;
  lastPrice: number;
  verdict?: string;
  analyzedAt: string;
};

export type SavedAnalysisSnapshot = StockDecisionSnapshot & {
  companyName: string;
  lastPrice: number;
  verdict: string;
  savedAt: string;
  entryPlan?: string;
  userNote?: string;
};

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getRecentAnalyses() {
  return readArray<RecentAnalyzedStock>(recentAnalysesKey)
    .filter((item) => item?.symbol && item?.analyzedAt)
    .slice(0, 8);
}

export function saveRecentAnalysis(item: RecentAnalyzedStock) {
  if (!canUseStorage()) return [];
  const normalized = {
    ...item,
    symbol: item.symbol.trim().toUpperCase(),
    companyName: item.companyName || item.symbol.trim().toUpperCase(),
  };
  const next = [
    normalized,
    ...getRecentAnalyses().filter((existing) => existing.symbol !== normalized.symbol),
  ].slice(0, 8);
  window.localStorage.setItem(recentAnalysesKey, JSON.stringify(next));
  return next;
}

export function getSavedAnalysisSnapshots() {
  return readArray<SavedAnalysisSnapshot>(savedAnalysisSnapshotsKey)
    .filter((item) => item?.symbol && item?.savedAt)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export function getLatestSavedAnalysisSnapshot(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  return getSavedAnalysisSnapshots().find((item) => item.symbol === normalized) || null;
}

export function upsertSavedAnalysisSnapshot(snapshot: SavedAnalysisSnapshot) {
  if (!canUseStorage()) return [];
  const normalized = {
    ...snapshot,
    symbol: snapshot.symbol.trim().toUpperCase(),
    companyName: snapshot.companyName || snapshot.symbol.trim().toUpperCase(),
    verdict: snapshot.verdict || snapshot.decision,
    lastPrice: snapshot.lastPrice || snapshot.price,
  };
  const next = [
    normalized,
    ...getSavedAnalysisSnapshots().filter((item) => item.symbol !== normalized.symbol),
  ];
  window.localStorage.setItem(savedAnalysisSnapshotsKey, JSON.stringify(next));
  return next;
}
