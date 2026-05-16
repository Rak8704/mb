'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function MigrateAgentColumnPage() {
    const [status, setStatus] = useState<'idle' | 'checking' | 'running' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [needsMigration, setNeedsMigration] = useState<boolean | null>(null);

    const checkMigration = async () => {
        setStatus('checking');
        setMessage('Checking if migration is needed...');

        try {
            const res = await fetch('/api/admin/migrate-agent-column');
            const data = await res.json();

            if (res.ok) {
                setNeedsMigration(data.migrationNeeded);
                setMessage(data.message);
                setStatus('idle');
            } else {
                setMessage(`Error: ${data.error}`);
                setStatus('error');
            }
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStatus('error');
        }
    };

    const runMigration = async () => {
        setStatus('running');
        setMessage('Running migration...');

        try {
            const res = await fetch('/api/admin/migrate-agent-column', {
                method: 'POST',
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setStatus('success');
                setNeedsMigration(false);
            } else {
                setMessage(`Error: ${data.error}`);
                setStatus('error');
            }
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setStatus('error');
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Database Migration: Add Agent Column</CardTitle>
                    <CardDescription>
                        This migration adds the agent_id column to the user_balances table to enable agent-user relationships.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Status Message */}
                    {message && (
                        <div
                            className={`p-4 rounded-md flex items-start gap-3 ${status === 'success'
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    : status === 'error'
                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                }`}
                        >
                            {status === 'success' && <CheckCircle className="h-5 w-5 mt-0.5" />}
                            {status === 'error' && <AlertCircle className="h-5 w-5 mt-0.5" />}
                            {(status === 'checking' || status === 'running') && (
                                <Loader2 className="h-5 w-5 mt-0.5 animate-spin" />
                            )}
                            <div className="flex-1">
                                <p className="font-medium">{message}</p>
                            </div>
                        </div>
                    )}

                    {/* Migration Status */}
                    {needsMigration !== null && (
                        <div className="p-4 rounded-md bg-muted">
                            <p className="text-sm font-medium">
                                Migration Status:{' '}
                                <span className={needsMigration ? 'text-yellow-500' : 'text-green-500'}>
                                    {needsMigration ? 'Required' : 'Already Applied'}
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={checkMigration}
                            disabled={status === 'checking' || status === 'running'}
                            variant="outline"
                        >
                            {status === 'checking' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Check Migration Status
                        </Button>

                        <Button
                            onClick={runMigration}
                            disabled={status === 'checking' || status === 'running' || needsMigration === false}
                        >
                            {status === 'running' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Run Migration
                        </Button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 rounded-md bg-muted/50 border border-border">
                        <h3 className="font-semibold mb-2">Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Click "Check Migration Status" to see if migration is needed</li>
                            <li>If migration is required, click "Run Migration"</li>
                            <li>Wait for success message</li>
                            <li>You can now create agents and assign users to them!</li>
                        </ol>
                    </div>

                    {/* What This Does */}
                    <div className="mt-4 p-4 rounded-md bg-blue-500/5 border border-blue-500/20">
                        <h3 className="font-semibold text-blue-500 mb-2">What This Migration Does:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Adds <code className="text-xs bg-muted px-1 py-0.5 rounded">agent_id</code> column to <code className="text-xs bg-muted px-1 py-0.5 rounded">user_balances</code> table</li>
                            <li>Creates foreign key relationship to track which agent manages each user</li>
                            <li>Creates index for faster agent-user lookups</li>
                            <li>Enables agent-user relationship system</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
