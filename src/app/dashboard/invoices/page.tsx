"use client";

import Link from 'next/link';
import { PlusCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Invoice } from '@/lib/types';
import { format } from 'date-fns';

export default function InvoicesPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const invoicesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'receipts'), where("employeeId", "==", user.uid));
    }, [firestore, user]);

    const { data: invoices, isLoading } = useCollection<Invoice>(invoicesQuery);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
      };

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
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
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
                                {invoices?.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">{invoice.id.substring(0, 8)}</TableCell>
                                        <TableCell>{invoice.customerName}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{format(new Date(invoice.date), "PPP")}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
