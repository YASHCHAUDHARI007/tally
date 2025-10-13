import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
    const mockInvoices = [
        { id: 'INV-003', customer: 'Prestige Constructions', date: '2023-11-20', total: '₹1,25,000.00', status: 'Paid' },
        { id: 'INV-002', customer: 'Global Tech Park', date: '2023-11-15', total: '₹45,000.00', status: 'Paid' },
        { id: 'INV-001', customer: 'Innovate Co-working', date: '2023-11-10', total: '₹88,750.00', status: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Invoices</h1>
                    <p className="text-muted-foreground">Manage and track customer invoices.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/invoices/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Invoice
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>A list of your most recent invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead className="hidden sm:table-cell text-right">Total</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.customer}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{invoice.date}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-right">{invoice.total}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
