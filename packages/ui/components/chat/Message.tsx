import React from 'react';

export function Message({ author, content }: { author: string; content: string }) {
  return (
    <article className="p-3 rounded-md bg-card text-card-foreground shadow-sm">
      <div className="text-sm font-medium text-card-foreground">{author}</div>
      <div className="mt-1 text-sm text-card-foreground">{content}</div>
    </article>
  );
}
