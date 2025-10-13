"use client";

import * as React from 'react';
import { CalendarIcon, PlusCircle, Trash2, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import type { StockItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  itemId: string;
  name: string;
  quantity: number;
  rate: number;
  gst: number;
}

export default function NewInvoicePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const [date, setDate] = React.useState<Date>(new Date());
    const [customerName, setCustomerName] = React.useState('');
    const [items, setItems] = React.useState<InvoiceItem[]>([]);

    const stockItemsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'stockItems');
      }, [firestore]);

    const { data: stockItems, isLoading: isLoadingStock } = useCollection<StockItem>(stockItemsQuery);
    
    const handleAddItem = () => {
        setItems([...items, { itemId: '', name: '', quantity: 1, rate: 0, gst: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        const newItems = [...items];
        const selectedStockItem = stockItems?.find(si => si.id === value);

        if(field === 'itemId' && selectedStockItem) {
            newItems[index] = {
                ...newItems[index],
                itemId: selectedStockItem.id,
                name: selectedStockItem.name,
                rate: selectedStockItem.rate,
                gst: selectedStockItem.gst,
            };
        } else {
          newItems[index] = { ...newItems[index], [field]: value };
        }
        
        setItems(newItems);
    };

    const calculateSubtotal = () => items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const calculateGst = () => items.reduce((acc, item) => acc + (item.quantity * item.rate * item.gst / 100), 0);
    const calculateTotal = () => calculateSubtotal() + calculateGst();
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);
      };

    const handleCreateInvoice = async () => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
            return;
        }
        if (!customerName || items.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill in customer name and add at least one item.' });
            return;
        }

        const receiptsCol = collection(firestore, `users/${user.uid}/receipts`);

        try {
            await addDocumentNonBlocking(receiptsCol, {
                employeeId: user.uid,
                customerId: '', // Add customer management later
                customerName,
                date: date.toISOString(),
                stockItemIds: items.map(i => i.itemId),
                items: items.map(({ name, ...rest }) => rest), // Don't store name
                totalAmount: calculateTotal(),
                status: 'Pending',
                createdAt: serverTimestamp(),
            });

            toast({ title: 'Success', description: 'Invoice created successfully!' });
            router.push('/dashboard/invoices');
        } catch (error) {
            console.error("Error creating invoice: ", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to create invoice.' });
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">New Invoice</h1>
                <p className="text-muted-foreground">Create a new sales receipt or invoice.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                    <CardDescription>Fill in the customer and item details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="customer-name">Customer Name</Label>
                            <Input id="customer-name" placeholder="Enter customer name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invoice-date">Invoice Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => setDate(d || new Date())}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Items</Label>
                      <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-full min-w-[250px] md:w-[40%]">Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Rate</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                      {isLoadingStock ? <Loader className="h-4 w-4 animate-spin"/> : (
                                        <Select value={item.itemId} onValueChange={(value) => handleItemChange(index, 'itemId', value)}>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select an item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            {stockItems?.map(si => (
                                                <SelectItem key={si.id} value={si.id}>{si.name}</SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                      )}
                                    </TableCell>
                                    <TableCell><Input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} className="w-20" /></TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.quantity * item.rate)}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button></TableCell>
                                </TableRow>
                                ))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No items added yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         <div className="p-4 border-t bg-muted/50">
                             <Button variant="outline" size="sm" onClick={handleAddItem}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                         </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <div className="w-full max-w-sm space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(calculateSubtotal())}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST</span>
                                <span>{formatCurrency(calculateGst())}</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleCreateInvoice}>Create Invoice & Sync to Tally</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
