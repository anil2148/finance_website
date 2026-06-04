import assert from 'node:assert/strict';
import {
  createEditedFileName,
  formatBytes,
  parsePageSelection,
  validateReorderInput,
} from '@/lib/pdf-editor-utils';

export function runPdfEditorUtilsTests() {
  assert.deepEqual(parsePageSelection('', 3), [0, 1, 2]);
  assert.deepEqual(parsePageSelection('1,3,5-7', 8), [0, 2, 4, 5, 6]);
  assert.deepEqual(parsePageSelection('2-4', 5), [1, 2, 3]);
  assert.throws(() => parsePageSelection('4-2', 5), /Invalid page range/);
  assert.throws(() => parsePageSelection('1,9', 5), /Invalid page range/);

  assert.deepEqual(validateReorderInput('1,3,2,4', 4), [0, 2, 1, 3]);
  assert.throws(() => validateReorderInput('1,2,2', 3), /appears more than once/);
  assert.throws(() => validateReorderInput('1,2', 3), /Enter every page exactly once/);

  assert.equal(createEditedFileName('contract.pdf'), 'contract-edited.pdf');
  assert.equal(createEditedFileName('PDF'), 'PDF-edited.pdf');
  assert.equal(createEditedFileName('.pdf'), 'document-edited.pdf');

  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(10 * 1024), '10 KB');
}
