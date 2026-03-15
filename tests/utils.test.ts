import assert from 'node:assert/strict';
import { getCurrencySymbol, resolveCurrencyPrefix } from '../lib/utils';

assert.equal(getCurrencySymbol('USD'), '$', 'USD should use dollar symbol');
assert.equal(getCurrencySymbol('INR'), '₹', 'INR should use rupee symbol');
assert.equal(resolveCurrencyPrefix('$', '€'), '€', 'Default dollar prefix should use selected currency symbol');
assert.equal(resolveCurrencyPrefix('%', '€'), '%', 'Non-currency prefix should be preserved');
assert.equal(resolveCurrencyPrefix(undefined, '€'), undefined, 'Undefined prefix should remain undefined');

console.log('utils tests passed');
