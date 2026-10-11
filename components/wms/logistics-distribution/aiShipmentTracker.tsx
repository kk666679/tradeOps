'use client';

import { useState } from 'react';
import { AILoadingState } from '@common/ailoading-state';
import { AIAlert } from '@common/aialert';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

export default function AIShipmentTracker({ shipmentId }: { shipmentId: string }) {
  const [showSummary, setShowSummary] = useState(false);
  const { data: shipment, isLoading, error } =
    trpc.logistics.byId.useQuery({ id: shipmentId });

  if (isLoading) return <AILoadingState message="Loading shipment…" />;
  if (error) return <AIAlert type="error" message="Error loading shipment data." />;
  if (!shipment) return <AIAlert type="warning" message="Shipment not found." />;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold">Shipment {shipment.trackingId}</h2>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <p><strong>Status:</strong> {shipment.status}</p>
        <p><strong>Carrier:</strong> {shipment.carrier?.name}</p>
        <p><strong>Origin:</strong> {shipment.origin}</p>
        <p><strong>Destination:</strong> {shipment.destination}</p>
        <p>
          <strong>Est. Arrival:</strong>{' '}
          {shipment.estimatedArrival
            ? new Date(shipment.estimatedArrival).toLocaleString()
            : 'N/A'}
        </p>
      </div>

      <Button
        onClick={() => setShowSummary((visible) => !visible)}
        size="sm"
      >
        {showSummary ? 'Hide shipment summary' : 'Show shipment summary'}
      </Button>

      {showSummary ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Shipment {shipment.trackingId} is {shipment.status}, travelling from {shipment.origin} to {shipment.destination}.
        </p>
      ) : null}
    </div>
  );
}
