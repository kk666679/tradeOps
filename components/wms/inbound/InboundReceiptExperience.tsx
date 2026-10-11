'use client';

import { InboundReceiptForm } from './InboundReceiptForm';

export function InboundReceiptExperience() {
  return (
    <InboundReceiptForm
      onSubmit={async (values) => {
        console.log('Submit inbound receipt:', values);
      }}
      onCancel={() => console.log('Cancel')}
    />
  );
}
