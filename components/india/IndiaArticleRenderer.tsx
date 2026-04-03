import type { ReactNode } from 'react';
import Link from 'next/link';
import { DecisionSupportPanel } from '@/components/common/DecisionSupportPanel';
import { IndiaAuthorityNote } from '@/components/india/IndiaAuthorityNote';

export type IndiaArticleSection = {
  type: 'table' | 'text' | 'decision-panel' | 'cta-block' | 'decision-path';
  title?: string;
  content?: string;
  tone?: 'blue' | 'amber' | 'slate' | 'emerald';
  points?: Array<{ label: string; text: string }>;
  table?: {
    headers: string[];
    rows: Array<Record<string, string>>;
  };
  links?: Array<{ label: string; href: string }>;
};

export type IndiaArticleProps = {
  title: string;
  subtitle?: string;
  description: string;
  sections: IndiaArticleSection[];
  cta?: {
    heading: string;
    text: string;
    links: Array<{ label: string; href: string }>;
  };
  nextDecisions?: Array<{
    title: string;
    description: string;
    links?: Array<{ label: string; href: string }>;
  }>;
  references?: Array<{ label: string; href: string; external?: boolean }>;
  showAuthorityNote?: boolean;
};

function CardSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      {title ? <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2> : null}
      {children}
    </section>
  );
}

export function IndiaArticleRenderer({
  title,
  subtitle,
  description,
  sections,
  cta,
  nextDecisions,
  references,
  showAuthorityNote = true
}: IndiaArticleProps) {
  return (
    <article className="article-prose space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        {subtitle ? <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{subtitle}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </header>

      {showAuthorityNote ? <IndiaAuthorityNote /> : null}

      {sections.map((section, idx) => {
        if (section.type === 'table' && section.table) {
          return (
            <CardSection key={`${section.type}-${section.title ?? idx}`} title={section.title}>
              <div className="table-shell mt-4 overflow-x-auto">
                <table className="comparison-table min-w-[720px]">
                  <thead>
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rowIdx) => (
                      <tr key={`row-${rowIdx}`}>
                        {section.table?.headers.map((header) => (
                          <td key={`${rowIdx}-${header}`}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {section.content ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{section.content}</p> : null}
            </CardSection>
          );
        }

        if (section.type === 'text') {
          return (
            <CardSection key={`${section.type}-${section.title ?? idx}`} title={section.title}>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{section.content}</p>
            </CardSection>
          );
        }

        if (section.type === 'decision-panel') {
          return <DecisionSupportPanel key={`${section.type}-${section.title ?? idx}`} title={section.title ?? ''} tone={section.tone ?? 'amber'} points={section.points ?? []} />;
        }

        if (section.type === 'cta-block') {
          return (
            <section key={`${section.type}-${section.title ?? idx}`} className="cta-block">
              <h2 className="cta-block-title">{section.title}</h2>
              {section.content ? <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{section.content}</p> : null}
              {section.links ? (
                <div className="cta-block-actions mt-4">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href} className="content-link-chip">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          );
        }

        if (section.type === 'decision-path') {
          return (
            <CardSection key={`${section.type}-${section.title ?? idx}`} title={section.title}>
              <div className="decision-path-grid mt-4 text-sm gap-3">
                {section.points?.map((point) => (
                  <article key={point.label} className="decision-path-card">
                    <h3 className="font-semibold">{point.label}</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{point.text}</p>
                  </article>
                ))}
              </div>
            </CardSection>
          );
        }

        return null;
      })}

      {cta ? (
        <section className="cta-block">
          <h2 className="cta-block-title">{cta.heading}</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{cta.text}</p>
          <div className="cta-block-actions mt-4">
            {cta.links.map((link) => (
              <Link key={link.href} href={link.href} className="content-link-chip">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {nextDecisions?.length ? (
        <CardSection title="Next decision path">
          <div className="decision-path-grid mt-4 text-sm gap-3">
            {nextDecisions.map((decision) => (
              <article key={decision.title} className="decision-path-card">
                <h3 className="font-semibold">{decision.title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{decision.description}</p>
                {decision.links?.length ? (
                  <div className="mt-3 inline-link-row">
                    {decision.links.map((link) => (
                      <Link key={link.href} href={link.href} className="content-link-chip">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </CardSection>
      ) : null}

      {references?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">References</h2>
          <ul className="reference-list mt-3 sm:grid-cols-2">
            {references.map((reference) => (
              <li key={reference.label} className="reference-item">
                <Link href={reference.href} target={reference.external ? '_blank' : undefined} rel={reference.external ? 'noreferrer' : undefined} className="content-link">
                  {reference.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showAuthorityNote ? <IndiaAuthorityNote /> : null}
    </article>
  );
}
