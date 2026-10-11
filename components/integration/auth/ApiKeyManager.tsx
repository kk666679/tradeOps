'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ApiKey { id: string; label: string; masked: string; createdAt: string; scopes: string[]; }
export interface ApiKeyManagerProps { keys?: ApiKey[]; onRotate?: (id: string) => void; onRevoke?: (id: string) => void; onCreate?: () => void; }
export function ApiKeyManager({ keys = [], onRotate, onRevoke, onCreate }: ApiKeyManagerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle>API Keys</CardTitle><Button size="sm" onClick={onCreate}>Create</Button></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {keys.length === 0 ? <p className="text-xs text-muted-foreground">No keys</p> :
          keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between rounded border p-2">
              <div>
                <div className="font-medium">{k.label}</div>
                <div className="font-mono text-xs text-muted-foreground">{k.masked}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onRotate?.(k.id)}>Rotate</Button>
                <Button size="sm" variant="destructive" onClick={() => onRevoke?.(k.id)}>Revoke</Button>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
export default ApiKeyManager;
