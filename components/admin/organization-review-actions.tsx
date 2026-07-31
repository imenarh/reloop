'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { approveOrganization, rejectOrganization } from '@/actions/organizations';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';

export function OrganizationReviewActions({ organizationId }: { organizationId: string }) {
    const router = useRouter();
    const [pending, setPending] = useState<'approve' | 'reject' | null>(null);

    async function handle(action: 'approve' | 'reject') {
        setPending(action);
        try {
            if (action === 'approve') {
                await approveOrganization(organizationId);
                toast.success('Organization approved.');
            } else {
                await rejectOrganization(organizationId);
                toast.success('Organization rejected.');
            }
            router.refresh();
        } catch (err) {
            toast.error(err instanceof ActionError ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setPending(null);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={pending !== null} onClick={() => handle('reject')}>
                {pending === 'reject' ? 'Rejecting...' : 'Reject'}
            </Button>
            <Button size="sm" disabled={pending !== null} onClick={() => handle('approve')}>
                {pending === 'approve' ? 'Approving...' : 'Approve'}
            </Button>
        </div>
    );
}