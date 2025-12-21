import React from 'react';

export function AgentChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded bg-accent text-accent-foreground text-sm">
      {name}
    </span>
  );
}
