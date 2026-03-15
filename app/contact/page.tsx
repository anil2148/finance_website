import type { Metadata } from 'next';

const pageUrl = 'https://www.financesphere.io/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact FinanceSphere for general support, privacy/legal requests, or affiliate partnership questions.',
  alternates: {
    canonical: pageUrl
  }
};

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-4xl gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Contact FinanceSphere</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Need help or have a compliance request? Reach out using the form below or email us directly at{' '}
          <a className="font-semibold text-brand hover:underline" href="mailto:support@financesphere.io">
            support@financesphere.io
          </a>
          .
        </p>
      </header>

      <form className="grid gap-4" action="mailto:support@financesphere.io" method="post" encType="text/plain">
        <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Name
          <input
            required
            name="name"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950"
            placeholder="Your full name"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input
            required
            type="email"
            name="email"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Category
          <select
            name="category"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950"
            defaultValue="general"
          >
            <option value="general">General Inquiry</option>
            <option value="privacy-legal">Privacy / Legal Request</option>
            <option value="affiliate">Affiliate Question</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          Message
          <textarea
            required
            name="message"
            rows={6}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand/30 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950"
            placeholder="How can we help you?"
          />
        </label>

        <button type="submit" className="w-full rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 sm:w-fit">
          Send Message
        </button>
      </form>
    </section>
  );
}
