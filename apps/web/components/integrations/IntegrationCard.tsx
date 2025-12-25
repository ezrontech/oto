"use client";
import React from 'react';

export default function IntegrationCard({ connector, onConnect, savedEntry, onTest, onDisconnect }: any) {
  function handleCardClick() {
    if (!savedEntry && onConnect) onConnect(connector);
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 shadow-sm cursor-pointer" onClick={handleCardClick}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold">{connector.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{connector.description}</p>
          {savedEntry && (
            <p className="text-[11px] text-muted-foreground mt-2">Connected as <strong className="text-foreground">{savedEntry.name || savedEntry.provider}</strong></p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!savedEntry ? (
            <button
              className="px-3 py-1 rounded bg-primary text-white text-xs"
              onClick={(e) => { e.stopPropagation(); onConnect && onConnect(connector); }}
            >
              Connect
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded bg-amber-600 text-white text-xs" onClick={(e) => { e.stopPropagation(); onTest && onTest(savedEntry); }}>
                Test
              </button>
              <button className="px-2 py-1 rounded bg-red-600 text-white text-xs" onClick={(e) => { e.stopPropagation(); onDisconnect && onDisconnect(savedEntry); }}>
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
