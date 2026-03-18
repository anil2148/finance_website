import Link from 'next/link';

type JumpLink = {
  href: string;
  label: string;
};

type JumpNavProps = {
  links: JumpLink[];
};

export function JumpNav({ links }: JumpNavProps) {
  return (
    <nav aria-label="On-page navigation" className="sticky top-20 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Jump to section</p>
      <ul className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <a className="rounded-md px-2 py-1 text-blue-700 transition hover:bg-blue-50 hover:text-blue-800" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

type TrustBarProps = {
  updatedAt: string;
  disclaimer: string;
  methodologyAnchor?: string;
};

export function TrustBar({ updatedAt, disclaimer, methodologyAnchor }: TrustBarProps) {
  return (
    <section className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700 md:grid-cols-3">
      <p>
        <span className="font-semibold text-slate-900">Last updated:</span> {updatedAt}
      </p>
      <p>
        <span className="font-semibold text-slate-900">Affiliate disclosure:</span> {disclaimer}
      </p>
      {methodologyAnchor ? (
        <p>
          <a className="font-semibold text-blue-700 hover:underline" href={methodologyAnchor}>
            See our ratings methodology
          </a>
        </p>
      ) : null}
    </section>
  );
}

type ResourceCard = {
  href: string;
  title: string;
  description: string;
  tag?: string;
};

type ResourceGridProps = {
  resources: ResourceCard[];
};

export function ResourceGrid({ resources }: ResourceGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <Link key={resource.href} href={resource.href} className="card transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
          {resource.tag ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">{resource.tag}</p> : null}
          <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{resource.description}</p>
        </Link>
      ))}
    </div>
  );
}

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer list-none font-semibold text-slate-900">{item.question}</summary>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
