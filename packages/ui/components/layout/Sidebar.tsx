import React from 'react';

export function Sidebar({ children, collapsed = false }: { children?: React.ReactNode; collapsed?: boolean }) {
  const width = collapsed ? '4rem' : '16rem';
  return (
    <aside style={{ width }} className="bg-sidebar p-4 border-r border-token">
      {children ?? <div className="text-sidebar-foreground">Sidebar</div>}
    </aside>
  );
}
