import Link from 'next/link';
import { addSubscriberToAudience, sendWelcomeEmail } from '@/lib/newsletter/mailchimp';
import { readConfirmationToken } from '@/lib/newsletter/token';

type ConfirmPageProps = {
  params: {
    token: string;
  };
};

export default async function NewsletterConfirmPage({ params }: ConfirmPageProps) {
  try {
    const email = readConfirmationToken(params.token);

    await addSubscriberToAudience(email);
    await sendWelcomeEmail(email);

    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-emerald-900">Subscription confirmed 🎉</h1>
        <p className="mt-3 text-sm text-emerald-800">
          {email} has been added to our newsletter. A welcome email is on its way.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">
          Return to homepage
        </Link>
      </section>
    );
  } catch {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-red-900">Confirmation link is invalid or expired</h1>
        <p className="mt-3 text-sm text-red-800">
          Please subscribe again and use the latest confirmation email.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-red-700 px-4 py-2 font-semibold text-white">
          Back to homepage
        </Link>
      </section>
    );
  }
}
