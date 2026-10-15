import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TEAM = [
  { name: 'R. Ahmed', email: 'r.ahmed@example.com', role: 'OWNER' },
  { name: 'S. Tan', email: 's.tan@example.com', role: 'ADMIN' },
  { name: 'M. Faiz', email: 'm.faiz@example.com', role: 'MEMBER' },
  { name: 'L. Chen', email: 'l.chen@example.com', role: 'VIEWER' },
];

export function TeamList() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px]">Name</TableHead>
            <TableHead className="text-[10px]">Email</TableHead>
            <TableHead className="text-[10px]">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TEAM.map((m) => (
            <TableRow key={m.email}>
              <TableCell className="text-xs">{m.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{m.email}</TableCell>
              <TableCell><Badge variant="outline" className="h-4 text-[9px]">{m.role}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}