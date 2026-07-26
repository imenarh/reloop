import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserFavorites } from '@/lib/mock';
import { requireUser } from '@/lib/mock';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';

export default async function FavoritesPage() {
    try {
        await requireUser();
    } catch (err) {
        if (err instanceof ActionError) redirect('/login?redirect=/favorites');
        throw err;
    }

    const favs = await getUserFavorites();

    const listings = favs
        .filter((f) => f.listing)
        .map((f) => {
            const l = f.listing;
            return {
                listing: l,
                category: l.category,
                images: l.images ?? [],
            };
        });

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Favorites</h1>
                    <p className="text-sm tabular-nums text-muted-foreground">
                        {listings.length} {listings.length === 1 ? 'item' : 'items'}
                    </p>
                </div>

                {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">No favorites yet.</p>
                        <p className="text-sm text-muted-foreground">
                            Tap the heart on any listing to save it here.
                        </p>
                        <Button nativeButton={false} render={<Link href="/listings" />} className="mt-2">
                            Browse listings
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.listing.id}
                                listing={listing as any}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
