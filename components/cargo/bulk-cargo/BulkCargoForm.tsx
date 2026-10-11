import React, { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BulkCargoFormData {
  cargoId: string;
  type: 'dry' | 'liquid';
  tons: number;
  density: number;
  moisture?: number;
  origin: string;
  destination: string;
}

const BulkCargoForm = () => {
  const [formData, setFormData] = useState<BulkCargoFormData>({
    type: 'dry',
    cargoId: '',
    tons: 0,
    density: 0,
    moisture: 0,
    origin: '',
    destination: ''
  });
  const createMutation = trpc.cargo.bulk.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label>Cargo ID</Label>
        <Input 
          value={formData.cargoId} 
          onChange={(e) => setFormData({ ...formData, cargoId: e.target.value })} 
        />
      </div>
      <div>
        <Label>Type</Label>
        <Select value={formData.type} onValueChange={(value: 'dry' | 'liquid') => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dry">Dry Cargo</SelectItem>
            <SelectItem value="liquid">Liquid Cargo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tons</Label>
        <Input 
          type="number" 
          value={formData.tons} 
          onChange={(e) => setFormData({ ...formData, tons: Number(e.target.value) })} 
        />
      </div>
      <div>
        <Label>Density</Label>
        <Input 
          type="number" step="0.01" 
          value={formData.density} 
          onChange={(e) => setFormData({ ...formData, density: Number(e.target.value) })} 
        />
      </div>
      <div>
        <Label>Origin</Label>
        <Input 
          value={formData.origin} 
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })} 
        />
      </div>
      <div>
        <Label>Destination</Label>
        <Input 
          value={formData.destination} 
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })} 
        />
      </div>
      <Button type="submit" disabled={createMutation.isPending} className="w-full">
        {createMutation.isPending ? 'Creating...' : 'Create Bulk Cargo'}
      </Button>
    </form>
  );
};

export default BulkCargoForm;
