import fs from 'node:fs';
import path from 'node:path';

export type NewsletterSignupLog = {
  email_hash_hint: string;
  source: string;
  persona: string;
  lead_magnet: string;
  timestamp: string;
};

const logFilePath = path.join(process.cwd(), 'data', 'newsletter-signups.json');

function ensureLogFile() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '[]', 'utf8');
  }
}

function readSignups() {
  ensureLogFile();
  try {
    return JSON.parse(fs.readFileSync(logFilePath, 'utf8')) as NewsletterSignupLog[];
  } catch {
    return [];
  }
}

export function appendSignupLog(entry: NewsletterSignupLog) {
  const entries = readSignups();
  entries.push(entry);
  fs.writeFileSync(logFilePath, JSON.stringify(entries, null, 2), 'utf8');
}
