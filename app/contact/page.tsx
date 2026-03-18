import Link from 'next/link';

export const metadata = {
  title: 'Contact FinanceSphere',
  description: 'Contact the FinanceSphere editorial team.'
};

export default function ContactPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p>For partnerships or editorial feedback, email support@financesphere.io.</p>
      <p>
        Looking for ad options? Download our{' '}
        <Link className="font-medium text-brand underline" href="/media-kit">
          Media Kit PDF
        </Link>
        .
      </p>
    </section>
  );
}
