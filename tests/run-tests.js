const Module = require('node:module');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const mappedRequest = path.join(projectRoot, request.slice(2));
    return originalResolveFilename.call(this, mappedRequest, parent, isMain, options);
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require('sucrase/register/ts');

const { runUtilsTests } = require('./utils.test.ts');
const { runCalculatorTests } = require('./calculators.test.ts');

runUtilsTests();
console.log('✅ utils tests passed');

runCalculatorTests();
console.log('✅ calculator tests passed');

console.log('🎉 all unit tests passed');
