import { MediaKitClient } from './MediaKitClient';

export const metadata = {
  title: 'Media Kit | FinanceSphere',
  description: 'Download the FinanceSphere media kit with partnership options, placements, and contact information.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/media-kit' }
};

export default function MediaKitPage() {
  return <MediaKitClient />;
}
