import assert from 'node:assert/strict';
import {
  createEditedFileName,
  convertDomRectToPdfRect,
  formatBytes,
  getPdfEditorWorkflowStep,
  getPdfTextFallbackMessage,
  getPendingChangesCount,
  groupSelectionBoxes,
  mapDomRectToPdfBox,
  padPdfSelectionBox,
  padSelectionRects,
  parsePageSelection,
  validateOnePageSelection,
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

  assert.deepEqual(
    mapDomRectToPdfBox(
      { left: 110, top: 220, right: 210, bottom: 240, width: 100, height: 20 },
      { left: 10, top: 20, width: 600, height: 800 },
      { width: 300, height: 400 },
    ),
    { x: 50, y: 290, width: 50, height: 10 },
  );
  assert.deepEqual(
    convertDomRectToPdfRect(
      { left: 110, top: 220, right: 210, bottom: 240, width: 100, height: 20 },
      { left: 10, top: 20, width: 600, height: 800 },
      { width: 300, height: 400 },
    ),
    { x: 50, y: 290, width: 50, height: 10 },
  );

  assert.deepEqual(
    padPdfSelectionBox({ x: 5, y: 7, width: 30, height: 10 }, 10, { width: 100, height: 100 }),
    { x: 0, y: 0, width: 45, height: 27 },
  );
  assert.deepEqual(
    padSelectionRects([{ x: 5, y: 7, width: 30, height: 10 }], 10, { width: 100, height: 100 }),
    [{ x: 0, y: 0, width: 45, height: 27 }],
  );

  assert.deepEqual(
    groupSelectionBoxes([
      { x: 1, y: 2, width: 3, height: 4 },
      { x: 1, y: 2, width: 0, height: 4 },
    ]),
    [{ x: 1, y: 2, width: 3, height: 4 }],
  );
  assert.equal(validateOnePageSelection([2, 2]), 2);
  assert.equal(validateOnePageSelection([]), null);
  assert.throws(() => validateOnePageSelection([1, 2]), /one page at a time/);

  assert.equal(getPendingChangesCount(0, false), 0);
  assert.equal(getPendingChangesCount(2, true), 3);
  assert.equal(getPdfTextFallbackMessage(false, false), 'Upload a PDF to check whether text can be selected.');
  assert.equal(getPdfTextFallbackMessage(true, true), 'Text selection is available for this PDF.');
  assert.equal(
    getPdfTextFallbackMessage(true, false),
    'This PDF appears scanned or flattened. You can still cover text areas and add replacement text.',
  );
  assert.equal(getPdfEditorWorkflowStep(false, 0, false), 'Upload');
  assert.equal(getPdfEditorWorkflowStep(true, 0, false), 'Edit');
  assert.equal(getPdfEditorWorkflowStep(true, 2, false), 'Apply');
  assert.equal(getPdfEditorWorkflowStep(true, 0, true), 'Download');
}
