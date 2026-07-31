'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { applyAsOrganization } from '@/actions/organizations';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ApplyOrganizationForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function validate(): boolean {
        const next: Record<string, string> = {};
        if (name.trim().length < 2) next.name = 'Organization name must be at least 2 characters.';
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGeneralError(null);
        if (!validate()) return;

        setSubmitting(true);
        try {
            await applyAsOrganization({
                name,
                description: description.trim() || undefined,
            });
            toast.success("Application submitted! we'll review it shortly.");
            router.push('/organizations');
            router.refresh();
        } catch (err) {
            if (err instanceof ActionError) {
                setGeneralError(err.message);
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {generalError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {generalError}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Organization name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={150} />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="What does your organization do, and who does it help?"
                />
            </div>

            <Button type="submit" disabled={submitting} size="lg" className="self-start">
                {submitting ? 'Submitting...' : 'Submit application'}
            </Button>
        </form>
    );
}