import React from 'react';

export function ToolBlock({ title }: { title: string }) {
  return (
    <section className="p-3 rounded border border-token bg-secondary text-foreground">
      <div className="font-medium">{title}</div>
    </section>
  );
}
