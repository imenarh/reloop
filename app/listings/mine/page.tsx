import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { listListings, removeListing } from '@/lib/mock';
import { requireUser } from '@/lib/mock';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { cn } from '@/lib/utils';
import type { ListingSummary } from '@/components/listings/types';

const ALL_STATUSES = ['active', 'pending', 'sold', 'claimed', 'removed'] as const;

type Status = ListingSummary['listing']['status'];

const statusStyles: Record<Status, string> = {
    active: 'bg-primary/10 text-primary',
    pending: 'bg-muted text-muted-foreground',
    sold: 'bg-foreground text-background',
    claimed: 'bg-foreground text-background',
    removed: 'bg-muted text-muted-foreground line-through',
};

export default async function MyListingsPage() {
    let user;
    try {
        user = await requireUser();
    } catch (err) {
        if (err instanceof ActionError) redirect('/login?redirect=/listings/mine');
        throw err;
    }

    const hydrated = await listListings({ status: [...ALL_STATUSES], sellerId: user.id, limit: 100 });

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-heading text-3xl font-semibold text-foreground">My listings</h1>
                        <p className="text-sm tabular-nums text-muted-foreground">
                            {hydrated.length} {hydrated.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" nativeButton={false} render={<Link href="/listings" />}>
                            Browse all listings
                        </Button>
                        <Button nativeButton={false} render={<Link href="/listings/new" />}>List an item</Button>
                    </div>
                </div>

                {hydrated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">You haven&apos;t listed anything yet.</p>
                        <p className="text-sm text-muted-foreground">
                            It takes about two minutes to list your first item.
                        </p>
                        <Button nativeButton={false} render={<Link href="/listings/new" />} className="mt-2">
                            List your first item
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                        {hydrated.map((listing) => {
                            const l = listing.listing;
                            return (
                                <div key={l.id} className="relative">
                                    {l.status !== 'active' && (
                                        <span
                                            className={cn(
                                                'absolute top-2.5 right-2.5 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                                statusStyles[l.status]
                                            )}
                                        >
                                            {l.status}
                                        </span>
                                    )}
                                    <ListingCard listing={listing} showFavorite={false} />
                                    <div className="mt-2 flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            render={<Link href={`/listings/${l.id}/edit`} />}
                                            className="flex-1"
                                        >
                                            Edit
                                        </Button>
                                        {l.status !== 'removed' && (
                                            <form
                                                action={async () => {
                                                    'use server';
                                                    await removeListing(l.id);
                                                    revalidatePath('/listings/mine');
                                                }}
                                                className="flex-1"
                                            >
                                                <Button type="submit" variant="ghost" size="sm" className="w-full">
                                                    Remove
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
