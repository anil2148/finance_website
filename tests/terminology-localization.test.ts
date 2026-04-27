import assert from 'node:assert/strict';
import { getTerm, terminology } from '../lib/finance-terminology';
import fs from 'node:fs';
import path from 'node:path';

export function runTerminologyLocalizationTests() {
  assert.equal(terminology.US.mortgage, 'Mortgage', 'US terminology should keep mortgage label');
  assert.equal(terminology.INDIA.mortgage, 'Home Loan', 'India terminology should localize mortgage as Home Loan');

  assert.equal(getTerm('checking_account', 'US'), 'Checking Account', 'US checking account term should resolve');
  assert.equal(getTerm('checking_account', 'IN'), 'Current Account', 'India checking account term should resolve');
  assert.equal(getTerm('stocks', 'IN'), 'Shares', 'India stocks term should resolve as Shares');

  const root = path.resolve(__dirname, '..');
  const provider = fs.readFileSync(path.join(root, 'components/providers/RegionProvider.tsx'), 'utf8');
  assert.match(
    provider,
    /const nextRegion = fromPath \?\? fromCookie \?\? fromStorage \?\? DEFAULT_REGION;/,
    'Path-level region should have precedence to prevent mixed-region terminology on a page'
  );
}
