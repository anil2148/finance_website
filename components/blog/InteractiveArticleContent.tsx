'use client';

import { useMemo } from 'react';

type Section = {
  id: string;
  title: string;
  lines: string[];
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
            className="text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-700 dark:text-blue-300 dark:decoration-blue-500 dark:hover:text-blue-200"
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

export function InteractiveArticleContent({ content }: { content: string }) {
  const sections = useMemo(() => parseSections(content), [content]);

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const paragraphBuffer: string[] = [];
        const elements: JSX.Element[] = [];

        const flushParagraph = () => {
          if (!paragraphBuffer.length) return;
          const paragraph = paragraphBuffer.join(' ').trim();
          if (paragraph) {
            elements.push(
              <p key={`${section.id}-p-${elements.length}`} className="leading-7 text-slate-700 dark:text-slate-300">
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
              <h4 key={`${section.id}-h-${i}`} className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {line.replace(/^###\s+/, '').trim()}
              </h4>
            );
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
              <ul key={`${section.id}-ul-${i}`} className="list-disc space-y-1 pl-6 text-slate-700 dark:text-slate-300">
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
              <ol key={`${section.id}-ol-${i}`} className="list-decimal space-y-1 pl-6 text-slate-700 dark:text-slate-300">
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
          <details
            key={section.id}
            id={section.id}
            open={idx === 0}
            className="rounded-xl border border-slate-200 bg-white p-4 open:shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900 dark:text-slate-100">
              <span>{section.title}</span>
            </summary>
            <div className="mt-4 space-y-3">{elements}</div>
          </details>
        );
      })}
    </div>
  );
}
