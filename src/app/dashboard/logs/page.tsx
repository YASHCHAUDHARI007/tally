import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockActivityLogs } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityLogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Activity Logs</h1>
                <p className="text-muted-foreground">Track all user activities in the system.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>A log of recent actions performed by users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockActivityLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground">{formatDistanceToNow(log.timestamp, { addSuffix: true })}</TableCell>
                                    <TableCell>{log.user.name}</TableCell>
                                    <TableCell>{log.user.role}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.details}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
