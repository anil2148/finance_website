import type { Metadata } from 'next';
import { PdfEditorClient } from './pdf-editor-client';

export const metadata: Metadata = {
  title: 'PDF Editor | FinanceSphere',
  description: 'Edit, fill, sign, annotate, organize, and download PDFs in your browser.',
};

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
