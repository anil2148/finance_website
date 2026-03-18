import { MediaKitClient } from './MediaKitClient';

export const metadata = {
  title: 'Media Kit | FinanceSphere',
  description: 'Download the FinanceSphere media kit with audience stats and ad offerings.'
};

export default function MediaKitPage() {
  return <MediaKitClient />;
}
