import { redirect } from 'next/navigation';
import { listPendingOrganizations } from '@/actions/organizations';
import { requireAdmin } from '@/lib/session';
import { ActionError } from '@/lib/errors';
import { OrganizationReviewActions } from '@/components/admin/organization-review-actions';

export default async function AdminOrganizationsPage() {
    try {
        await requireAdmin();
    } catch (err) {
        if (err instanceof ActionError) redirect('/');
        throw err;
    }

    const pending = await listPendingOrganizations();

    return (
        <section className="py-10">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Pending organizations</h1>
                    <p className="text-sm tabular-nums text-muted-foreground">
                        {pending.length} awaiting review
                    </p>
                </div>

                {pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">Nothing to review.</p>
                        <p className="text-sm text-muted-foreground">New applications will show up here.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {pending.map((org) => (
                            <div
                                key={org.id}
                                className="flex flex-col gap-4 rounded-xl p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <h2 className="font-heading text-base font-semibold text-foreground">{org.name}</h2>
                                    {org.description && (
                                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{org.description}</p>
                                    )}
                                </div>
                                <OrganizationReviewActions organizationId={org.id} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}