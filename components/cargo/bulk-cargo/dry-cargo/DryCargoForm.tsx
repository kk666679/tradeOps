import React, { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DryCargoFormData {
  cargoId: string;
  tons: number;
  moisture: number;
  density: number;
  origin: string;
  destination: string;
}

const DryCargoForm = () => {
  const [formData, setFormData] = useState<DryCargoFormData>({
    cargoId: '',
    tons: 0,
    moisture: 0,
    density: 0,
    origin: '',
    destination: '',
  });
  const createMutation = trpc.cargo.bulk.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData, type: 'dry' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Cargo ID</Label>
        <Input value={formData.cargoId} onChange={(e) => setFormData({...formData, cargoId: e.target.value})} />
      </div>
      <div>
        <Label>Tons</Label>
        <Input type="number" value={formData.tons} onChange={(e) => setFormData({...formData, tons: Number(e.target.value)})} />
      </div>
      <div>
        <Label>Moisture %</Label>
        <Input type="number" step="0.1" value={formData.moisture} onChange={(e) => setFormData({...formData, moisture: Number(e.target.value)})} />
      </div>
      {/* density, origin, destination fields */}
      <Button type="submit" disabled={createMutation.isPending}>Create Dry Cargo</Button>
    </form>
  );
};

export default DryCargoForm;
