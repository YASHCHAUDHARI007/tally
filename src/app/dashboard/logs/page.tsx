"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ActivityLog } from '@/lib/types';
import { Loader } from 'lucide-react';

export default function ActivityLogsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const logsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        // This is a simplification. In a real app, an admin would see all logs.
        // This requires more complex rules and queries. For now, users see their own logs.
        return query(collection(firestore, `users/${user.uid}/activityLogs`), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    const { data: activityLogs, isLoading } = useCollection<ActivityLog>(logsQuery);

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
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <Loader className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
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
                            {activityLogs?.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</TableCell>
                                    <TableCell>{log.user.name}</TableCell>
                                    <TableCell>{log.user.role}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.details}</TableCell>
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
