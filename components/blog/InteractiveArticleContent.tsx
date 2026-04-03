'use client';

import { useMemo } from 'react';

type Section = {
  id: string;
  title: string;
  lines: string[];
};

type TableData = {
  headers: string[];
  rows: string[][];
};

function toId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function renderInline(text: string) {
  const nodes: Array<string | JSX.Element> = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^\)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('**')) {
      nodes.push(<strong key={`b-${key++}`}>{renderInline(token.slice(2, -2))}</strong>);
    } else {
      const parts = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (parts) {
        nodes.push(
          <a
            key={`a-${key++}`}
            className="content-link"
            href={parts[2]}
          >
            {parts[1]}
          </a>
        );
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseSections(content: string): Section[] {
  const lines = content.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('# ')) {
      continue;
    }

    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      const title = line.replace(/^##\s+/, '').trim();
      current = { id: toId(title), title, lines: [] };
      continue;
    }

    if (!current) {
      current = { id: 'overview', title: 'Overview', lines: [] };
    }

    current.lines.push(line);
  }

  if (current) sections.push(current);

  return sections.filter((section) => section.lines.some((line) => line.trim().length > 0));
}

function parseTable(lines: string[]): TableData {
  const parsedRows = lines.map((line) =>
    line
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((cell) => cell.trim())
  );

  const headers = parsedRows[0] ?? [];
  const rows = parsedRows.slice(2);
  return { headers, rows };
}

export function InteractiveArticleContent({ content }: { content: string }) {
  const sections = useMemo(() => parseSections(content), [content]);

  return (
    <div className="space-y-10">
      {sections.map((section) => {
        const paragraphBuffer: string[] = [];
        const elements: JSX.Element[] = [];
        let pendingAnchorId: string | null = null;

        const flushParagraph = () => {
          if (!paragraphBuffer.length) return;
          const paragraph = paragraphBuffer.join(' ').trim();
          if (paragraph) {
            elements.push(
              <p key={`${section.id}-p-${elements.length}`} className="text-[1.02rem] leading-8 text-neutral-700 dark:text-neutral-200">
                {renderInline(paragraph)}
              </p>
            );
          }
          paragraphBuffer.length = 0;
        };

        for (let i = 0; i < section.lines.length; i += 1) {
          const line = section.lines[i].trim();

          if (!line) {
            flushParagraph();
            continue;
          }

          const divOpenMatch = line.match(/^<div id="([^"]+)">$/);
          if (divOpenMatch) {
            flushParagraph();
            pendingAnchorId = divOpenMatch[1];
            continue;
          }

          if (line === '</div>') {
            flushParagraph();
            pendingAnchorId = null;
            continue;
          }

          const paragraphMatch = line.match(/^<p id="([^"]+)">(.*)<\/p>$/);
          if (paragraphMatch) {
            flushParagraph();
            const [, paragraphId, paragraphText] = paragraphMatch;
            if (paragraphText.trim().length > 0) {
              elements.push(
                <p
                  key={`${section.id}-html-p-${i}`}
                  id={paragraphId}
                  className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-[1.02rem] leading-8 text-neutral-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-neutral-200"
                >
                  {renderInline(paragraphText.trim())}
                </p>
              );
            }
            continue;
          }

          if (line.startsWith('```')) {
            flushParagraph();
            const codeLines: string[] = [];
            let cursor = i + 1;

            while (cursor < section.lines.length && !section.lines[cursor].trim().startsWith('```')) {
              codeLines.push(section.lines[cursor]);
              cursor += 1;
            }

            const blockProps = pendingAnchorId ? { id: pendingAnchorId } : {};
            elements.push(
              <div
                key={`${section.id}-code-${i}`}
                {...blockProps}
                className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-900 p-4 text-sm leading-6 text-neutral-100 dark:border-neutral-700"
              >
                <pre className="font-mono whitespace-pre">{codeLines.join('\n')}</pre>
              </div>
            );

            pendingAnchorId = null;
            i = cursor;
            continue;
          }

          if (line.startsWith('### ')) {
            flushParagraph();
            const headingProps = pendingAnchorId ? { id: pendingAnchorId } : {};
            elements.push(
              <h3 key={`${section.id}-h-${i}`} {...headingProps} className="scroll-mt-28 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {line.replace(/^###\s+/, '').trim()}
              </h3>
            );
            pendingAnchorId = null;
            continue;
          }

          if (line.startsWith('#### ')) {
            flushParagraph();
            const headingProps = pendingAnchorId ? { id: pendingAnchorId } : {};
            elements.push(
              <h4 key={`${section.id}-h4-${i}`} {...headingProps} className="scroll-mt-28 text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {line.replace(/^####\s+/, '').trim()}
              </h4>
            );
            pendingAnchorId = null;
            continue;
          }

          if (line.startsWith(':::insight') || line.startsWith(':::takeaway')) {
            flushParagraph();
            const variant = line.includes('insight') ? 'Insight' : 'Key takeaway';
            const calloutLines: string[] = [];
            let cursor = i + 1;
            while (cursor < section.lines.length && section.lines[cursor].trim() !== ':::') {
              calloutLines.push(section.lines[cursor].trim());
              cursor += 1;
            }

            const message = calloutLines.join(' ');
            elements.push(
              <div
                key={`${section.id}-callout-${i}`}
                className="rounded-xl border-l-4 border-blue-500 bg-blue-50 px-4 py-3 dark:bg-blue-900/20"
              >
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{variant}</p>
                <p className="mt-1 text-base leading-7 text-blue-900 dark:text-blue-100">{renderInline(message)}</p>
              </div>
            );

            i = cursor;
            continue;
          }


          if (line.startsWith('>')) {
            flushParagraph();
            const quoteLines: string[] = [];
            let cursor = i;

            while (cursor < section.lines.length && section.lines[cursor].trim().startsWith('>')) {
              quoteLines.push(section.lines[cursor].trim().replace(/^>\s?/, ''));
              cursor += 1;
            }

            elements.push(
              <blockquote
                key={`${section.id}-quote-${i}`}
                className="rounded-xl border-l-4 border-blue-500 bg-blue-50/70 px-4 py-3 text-base font-medium leading-7 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
              >
                {renderInline(quoteLines.join(' '))}
              </blockquote>
            );

            i = cursor - 1;
            continue;
          }

          if (line.startsWith('|')) {
            flushParagraph();
            const tableLines: string[] = [];
            let cursor = i;

            while (cursor < section.lines.length && section.lines[cursor].trim().startsWith('|')) {
              tableLines.push(section.lines[cursor].trim());
              cursor += 1;
            }

            const table = parseTable(tableLines);
            const wrapperProps = pendingAnchorId ? { id: pendingAnchorId } : {};
            elements.push(
              <div
                key={`${section.id}-table-${i}`}
                {...wrapperProps}
                className="table-shell my-6"
              >
                <table className="min-w-full text-sm text-neutral-900 dark:text-neutral-100">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800">
                      {table.headers.map((header, headerIndex) => (
                        <th key={`${section.id}-th-${headerIndex}`} className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {renderInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {table.rows.map((row, rowIndex) => (
                      <tr key={`${section.id}-tr-${rowIndex}`} className="odd:bg-white even:bg-neutral-50/70 dark:odd:bg-neutral-900 dark:even:bg-neutral-800/40">
                        {row.map((cell, cellIndex) => (
                          <td key={`${section.id}-td-${rowIndex}-${cellIndex}`} className="px-4 py-3 align-top text-neutral-700 dark:text-neutral-300">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

            pendingAnchorId = null;
            i = cursor - 1;
            continue;
          }

          if (line.startsWith('- ')) {
            flushParagraph();
            const listItems: string[] = [];
            let cursor = i;

            while (cursor < section.lines.length && section.lines[cursor].trim().startsWith('- ')) {
              listItems.push(section.lines[cursor].trim().replace(/^-\s+/, ''));
              cursor += 1;
            }

            elements.push(
              <ul key={`${section.id}-ul-${i}`} className="list-disc space-y-2.5 pl-6 text-base leading-7 text-neutral-700 dark:text-neutral-300">
                {listItems.map((item) => (
                  <li key={`${section.id}-li-${item}`}>{renderInline(item)}</li>
                ))}
              </ul>
            );

            i = cursor - 1;
            continue;
          }

          if (/^\d+\.\s+/.test(line)) {
            flushParagraph();
            const listItems: string[] = [];
            let cursor = i;

            while (cursor < section.lines.length && /^\d+\.\s+/.test(section.lines[cursor].trim())) {
              listItems.push(section.lines[cursor].trim().replace(/^\d+\.\s+/, ''));
              cursor += 1;
            }

            elements.push(
              <ol key={`${section.id}-ol-${i}`} className="list-decimal space-y-2.5 pl-6 text-base leading-7 text-neutral-700 dark:text-neutral-300">
                {listItems.map((item) => (
                  <li key={`${section.id}-oi-${item}`}>{renderInline(item)}</li>
                ))}
              </ol>
            );

            i = cursor - 1;
            continue;
          }

          paragraphBuffer.push(line);
        }

        flushParagraph();

        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 space-y-6 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <h2 className="text-2xl font-semibold leading-tight text-neutral-900 dark:text-neutral-100">{section.title}</h2>
            <div className="space-y-5 [&_a]:font-medium">{elements}</div>
          </section>
        );
      })}
    </div>
  );
}
