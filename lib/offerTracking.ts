import fs from 'node:fs';
import path from 'node:path';

export type OfferClickLog = {
  product_id: string;
  timestamp: string;
  user_agent: string;
  referrer: string;
};

const logFilePath = path.join(process.cwd(), 'data', 'offer-clicks.json');

function ensureLogFile() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '[]', 'utf8');
  }
}

export function readOfferClicks(): OfferClickLog[] {
  ensureLogFile();
  const raw = fs.readFileSync(logFilePath, 'utf8');

  try {
    return JSON.parse(raw) as OfferClickLog[];
  } catch {
    return [];
  }
}

export function appendOfferClick(entry: OfferClickLog) {
  const existing = readOfferClicks();
  existing.push(entry);
  fs.writeFileSync(logFilePath, JSON.stringify(existing, null, 2), 'utf8');
}
