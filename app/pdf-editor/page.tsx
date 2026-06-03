import type { Metadata } from 'next';
import { PdfEditorClient } from './pdf-editor-client';

export const metadata: Metadata = {
  title: 'PDF Editor | FinanceSphere',
  description:
    'Upload, preview, and edit PDF files with common tools like merge, split, rotate, watermark, and page organization.',
};

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
