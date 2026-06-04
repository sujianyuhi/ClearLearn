import type { MarkdownToken } from '../types';

export function parseMarkdown(text: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      tokens.push({ type: 'codeBlock', language, content: codeLines.join('\n') });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      tokens.push({ type: 'heading', level: headingMatch[1].length, content: parseInline(headingMatch[2]) });
      continue;
    }

    // Quote
    if (line.startsWith('> ')) {
      tokens.push({ type: 'quote', content: parseInline(line.slice(2)) });
      continue;
    }

    // Ordered list
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      const items: string[] = [parseInline(orderedMatch[2])];
      while (i + 1 < lines.length && lines[i + 1].match(/^\d+\.\s+/)) {
        i++;
        const m = lines[i].match(/^\d+\.\s+(.+)$/);
        if (m) items.push(parseInline(m[1]));
      }
      tokens.push({ type: 'list', items, ordered: true });
      continue;
    }

    // Unordered list
    const unorderedMatch = line.match(/^[-*+]\s+(.+)$/);
    if (unorderedMatch) {
      const items: string[] = [parseInline(unorderedMatch[1])];
      while (i + 1 < lines.length && lines[i + 1].match(/^[-*+]\s+/)) {
        i++;
        const m = lines[i].match(/^[-*+]\s+(.+)$/);
        if (m) items.push(parseInline(m[1]));
      }
      tokens.push({ type: 'list', items, ordered: false });
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      tokens.push({ type: 'lineBreak' });
      continue;
    }

    // Regular paragraph with inline formatting
    tokens.push({ type: 'text', content: parseInline(line) });
  }

  return tokens;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

import React from 'react';

export function renderMarkdownToJSX(text: string): React.ReactNode {
  const tokens = parseMarkdown(text);
  return tokens.map((token, index) => renderToken(token, index));
}

function renderToken(token: MarkdownToken, key: number): React.ReactNode {
  switch (token.type) {
    case 'text':
      return <p key={key} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: token.content }} />;
    case 'heading': {
      const headingClasses = {
        1: 'text-xl font-bold mt-4 mb-2 text-ink',
        2: 'text-lg font-bold mt-3 mb-2 text-ink',
        3: 'text-base font-bold mt-3 mb-1 text-ink',
        4: 'text-sm font-bold mt-2 mb-1 text-ink',
        5: 'text-sm font-semibold mt-2 mb-1 text-ink',
        6: 'text-xs font-semibold mt-1 mb-1 text-ink',
      };
      return (
        <div
          key={key}
          className={headingClasses[token.level as keyof typeof headingClasses] || headingClasses[3]}
          dangerouslySetInnerHTML={{ __html: token.content }}
        />
      );
    }
    case 'codeBlock':
      return (
        <div key={key} className="my-3 rounded-lg bg-ink/5 border border-ink/10 overflow-hidden">
          {token.language && (
            <div className="px-3 py-1 bg-ink/10 text-xs text-ink/60 font-mono border-b border-ink/10">
              {token.language}
            </div>
          )}
          <pre className="p-3 overflow-x-auto">
            <code className="text-sm font-mono text-charcoal">{token.content}</code>
          </pre>
        </div>
      );
    case 'list': {
      const ListTag = token.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={key}
          className={`my-2 ${token.ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}
        >
          {token.items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-2 pl-3 border-l-3 border-amber bg-amber/5 py-2 pr-2 rounded-r-lg"
        >
          <p className="text-sm text-charcoal/80 italic" dangerouslySetInnerHTML={{ __html: token.content }} />
        </blockquote>
      );
    case 'lineBreak':
      return <div key={key} className="h-2" />;
    default:
      return null;
  }
}
