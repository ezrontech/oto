"use client";
import React, { useEffect, useState } from 'react';
import { CONNECTORS } from '@/lib/integrations';
import IntegrationCard from '@/components/integrations/IntegrationCard';

export default function LabsIntegrationsPage() {
  const [list, setList] = useState<any[]>([]);
  const [saved, setSaved] = useState<Record<string, any>>({});

  useEffect(() => {
    // load connectors from registry
    const arr = Object.values(CONNECTORS || {});
    setList(arr as any);
    // load saved integrations
    fetch('/api/integrations/list').then(r => r.json()).then(d => {
      setSaved(d.integrations || {});
    }).catch(() => {});
  }, []);

  async function handleConnect(connector: any) {
    if (connector.authType === 'oauth2') {
      // Open a blank popup immediately to avoid browser popup blockers,
      // then set its location once we have the provider's authorize URL.
      const popup = window.open('', '_blank');
      try {
        const res = await fetch('/api/integrations/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: connector.key }),
        });
        const data = await res.json();
        if (data?.authorizeUrl) {
          if (popup) popup.location.href = data.authorizeUrl;
          else window.open(data.authorizeUrl, '_blank');
        } else {
          if (popup) popup.close();
          alert('Failed to start OAuth flow');
        }
      } catch (e) {
        if (popup) popup.close();
        alert('Failed to start OAuth flow');
      }
      return;
    }

    if (connector.authType === 'apikey') {
      const key = prompt(`Enter API key for ${connector.name}`);
      if (!key) return;
      const res = await fetch('/api/integrations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: connector.key, apiKey: key }),
      });
      const data = await res.json();
      if (data?.ok) {
        alert('Saved integration');
        // refresh saved list
        const listRes = await fetch('/api/integrations/list');
        const dd = await listRes.json();
        setSaved(dd.integrations || {});
      } else alert('Save failed');
      return;
    }

    alert('Auth type not supported yet');
  }

  async function handleTest(entry: any) {
    const res = await fetch('/api/integrations/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: entry.id }) });
    const data = await res.json();
    alert(data.ok ? 'Test successful' : `Test failed: ${data.details || data.error}`);
  }

  async function handleDisconnect(entry: any) {
    if (!confirm('Disconnect this integration?')) return;
    const res = await fetch('/api/integrations/disconnect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: entry.id }) });
    const data = await res.json();
    if (data.ok) {
      alert('Disconnected');
      const listRes = await fetch('/api/integrations/list');
      const dd = await listRes.json();
      setSaved(dd.integrations || {});
    } else alert('Disconnect failed');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Labs → Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((c: any) => (
          <IntegrationCard key={c.key} connector={c} onConnect={handleConnect} savedEntry={Object.values(saved).find((s: any) => s.provider === c.key)} onTest={handleTest} onDisconnect={handleDisconnect} />
        ))}
      </div>
    </div>
  );
}
