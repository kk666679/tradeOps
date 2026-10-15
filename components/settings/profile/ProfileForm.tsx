'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ProfileForm() {
  return (
    <Card className="p-6">
      <div className="mb-4 text-sm font-semibold">Profile</div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Full name</Label>
          <Input defaultValue="R. Ahmed" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input type="email" defaultValue="r.ahmed@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Broker licence</Label>
          <Input defaultValue="4471" />
        </div>
        <Button>Save changes</Button>
      </div>
    </Card>
  );
}