import type { Metadata } from 'next';
import { PdfEditorClient } from './pdf-editor-client';

export const metadata: Metadata = {
  title: 'Browser PDF Editor | FinanceSphere',
  description:
    'Upload, preview, fill, sign, mark up, organize, merge, and download PDFs in a browser-only FinanceSphere PDF editor.',
};

export default function PdfEditorPage() {
  return <PdfEditorClient />;
}
