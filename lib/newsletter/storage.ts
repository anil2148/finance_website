import fs from 'node:fs';
import path from 'node:path';

export type NewsletterSignupLog = {
  email_hash_hint: string;
  source: string;
  persona: string;
  lead_magnet: string;
  timestamp: string;
};

const DEFAULT_LOG_FILE_PATH = path.join(process.cwd(), 'data', 'newsletter-signups.json');
const FALLBACK_LOG_FILE_PATH = path.join('/tmp', 'newsletter-signups.json');

function resolveLogFilePath() {
  const configuredPath = process.env.NEWSLETTER_SIGNUPS_LOG_PATH?.trim();
  return configuredPath || DEFAULT_LOG_FILE_PATH;
}

function ensureParentDirectory(filePath: string) {
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function isReadOnlyFileSystemError(error: unknown) {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'EROFS'
  );
}

function ensureLogFile(filePath: string) {
  ensureParentDirectory(filePath);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }
}

function readSignups(filePath: string) {
  ensureLogFile(filePath);

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as NewsletterSignupLog[];
  } catch {
    return [];
  }
}

export function appendSignupLog(entry: NewsletterSignupLog) {
  const preferredPath = resolveLogFilePath();
  let activePath = preferredPath;
  let entries = readSignups(activePath);

  entries.push(entry);

  try {
    fs.writeFileSync(activePath, JSON.stringify(entries, null, 2), 'utf8');
  } catch (error) {
    if (!isReadOnlyFileSystemError(error)) {
      throw error;
    }

    activePath = FALLBACK_LOG_FILE_PATH;
    entries = readSignups(activePath);
    entries.push(entry);
    fs.writeFileSync(activePath, JSON.stringify(entries, null, 2), 'utf8');
  }
}
