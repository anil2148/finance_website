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
      nodes.push(<strong key={`b-${key++}`}>{token.slice(2, -2)}</strong>);
    } else {
      const parts = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (parts) {
        nodes.push(
          <a
            key={`a-${key++}`}
            className="text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:decoration-blue-500 dark:hover:text-blue-300"
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
    <div className="space-y-8">
      {sections.map((section, idx) => {
        const paragraphBuffer: string[] = [];
        const elements: JSX.Element[] = [];

        const flushParagraph = () => {
          if (!paragraphBuffer.length) return;
          const paragraph = paragraphBuffer.join(' ').trim();
          if (paragraph) {
            elements.push(
              <p key={`${section.id}-p-${elements.length}`} className="leading-relaxed text-gray-900 dark:text-gray-100">
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

          if (line.startsWith('### ')) {
            flushParagraph();
            elements.push(
              <h3 key={`${section.id}-h-${i}`} className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {line.replace(/^###\s+/, '').trim()}
              </h3>
            );
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
                className="rounded-lg border-l-4 border-blue-500 bg-blue-50 px-4 py-3 dark:bg-blue-900/20"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{variant}</p>
                <p className="mt-1 leading-relaxed text-gray-900 dark:text-gray-100">{renderInline(message)}</p>
              </div>
            );

            i = cursor;
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
            elements.push(
              <div key={`${section.id}-table-${i}`} className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full border-collapse bg-white text-sm dark:bg-gray-900">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      {table.headers.map((header, headerIndex) => (
                        <th key={`${section.id}-th-${headerIndex}`} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          {renderInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={`${section.id}-tr-${rowIndex}`} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800/60">
                        {row.map((cell, cellIndex) => (
                          <td key={`${section.id}-td-${rowIndex}-${cellIndex}`} className="border border-gray-200 px-4 py-2 align-top text-gray-900 dark:border-gray-700 dark:text-gray-100">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

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
              <ul key={`${section.id}-ul-${i}`} className="list-disc space-y-2 pl-6 text-gray-900 dark:text-gray-100">
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
              <ol key={`${section.id}-ol-${i}`} className="list-decimal space-y-2 pl-6 text-gray-900 dark:text-gray-100">
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
            className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
          >
            <h2 className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100">{section.title}</h2>
            <div className="space-y-4">{elements}</div>
          </section>
        );
      })}
    </div>
  );
}
