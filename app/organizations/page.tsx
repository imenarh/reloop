import Link from 'next/link';
import { IconBuildingCommunity } from '@tabler/icons-react';
import { listApprovedOrganizations } from '@/actions/organizations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default async function OrganizationsPage() {
    const organizations = await listApprovedOrganizations();

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="font-heading text-3xl font-semibold text-foreground">Charity partners</h1>
                        <p className="text-sm tabular-nums text-muted-foreground">
                            {organizations.length} approved {organizations.length === 1 ? 'organization' : 'organizations'}
                        </p>
                    </div>
                    <Button nativeButton={false} render={<Link href="/organizations/apply" />}>
                        Apply as an organization
                    </Button>
                </div>

                {organizations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">No approved organizations yet.</p>
                        <p className="text-sm text-muted-foreground">
                            Charities that claim donations will show up here once approved.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {organizations.map((org) => (
                            <Card key={org.id}>
                                <CardContent className="flex flex-col gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <IconBuildingCommunity className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-heading text-base font-semibold text-foreground">{org.name}</h2>
                                        {org.description && (
                                            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{org.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}