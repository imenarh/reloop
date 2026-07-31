import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/session';
import { ActionError } from '@/lib/errors';
import { ApplyOrganizationForm } from '@/components/organizations/apply-form';

export default async function ApplyOrganizationPage() {
    try {
        await requireUser();
    } catch (err) {
        if (err instanceof ActionError) redirect('/login?redirect=/organizations/apply');
        throw err;
    }

    return (
        <section className="py-10">
            <div className="mx-auto max-w-xl px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Apply as an organization</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Once approved, you can claim donated items on behalf of your organization.
                    </p>
                </div>

                <ApplyOrganizationForm />
            </div>
        </section>
    );
}