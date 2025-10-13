import { Barcode, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BarcodeScannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Barcode Scanner</h1>
        <p className="text-muted-foreground">Scan item barcodes to get details instantly.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scan Item</CardTitle>
            <CardDescription>Use your device camera or a USB scanner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted">
              <div className="text-center text-muted-foreground">
                <ScanLine className="mx-auto h-12 w-12" />
                <p className="mt-2">Camera view will appear here</p>
              </div>
            </div>
            <Button className="w-full" size="lg">
              <Barcode className="mr-2 h-5 w-5" />
              Start Scanning
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter manually
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode-input">Barcode Number</Label>
              <Input id="barcode-input" placeholder="Enter barcode..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>Details for the scanned item will show here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg bg-muted/50 p-6">
              <p className="text-muted-foreground">Waiting for scan...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
