"use client";

import * as React from 'react';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockStockItems } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';

export default function NewInvoicePage() {
    const [date, setDate] = React.useState<Date>(new Date());
    
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
                            <Input id="customer-name" placeholder="Enter customer name" />
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
                                        onSelect={setDate}
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
                                <TableRow>
                                    <TableCell>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select an item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {mockStockItems.map(item => (
                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell><Input type="number" defaultValue="1" className="w-20" /></TableCell>
                                    <TableCell className="text-right">₹15,000.00</TableCell>
                                    <TableCell className="text-right">₹15,000.00</TableCell>
                                    <TableCell><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                         <div className="p-4 border-t bg-muted/50">
                             <Button variant="outline" size="sm">
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
                                <span>₹15,000.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span>₹2,700.00</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹17,700.00</span>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Button variant="ghost">Cancel</Button>
                    <Button>Create Invoice & Sync to Tally</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
