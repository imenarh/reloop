import Link from 'next/link';
import { listCategories } from '@/lib/mock';
import { listListings } from '@/lib/mock';
import { ListingCard } from '@/components/listings/listing-card';
import { CategoryFilter } from '@/components/listings/category-filter';
import { SearchBox } from '@/components/listings/search-box';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ListingsPageProps {
    searchParams: Promise<{ category?: string; type?: string; q?: string }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
    const { category, type, q } = await searchParams;
    const disposalType = type === 'resale' || type === 'donation' ? type : undefined;
    const query = q?.trim() || undefined;

    const [categories, listings] = await Promise.all([
        listCategories(),
        listListings({ categoryId: category || undefined, disposalType, query }),
    ]);

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-heading text-3xl font-semibold text-foreground">
                            {query ? `Results for “${query}”` : 'Browse listings'}
                        </h1>
                        <p className="text-sm tabular-nums text-muted-foreground">
                            {listings.length} {listings.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <FilterLink href={buildHref({ category, q: query })} active={!type}>
                            All
                        </FilterLink>
                        <FilterLink href={buildHref({ category, type: 'resale', q: query })} active={type === 'resale'}>
                            For sale
                        </FilterLink>
                        <FilterLink
                            href={buildHref({ category, type: 'donation', q: query })}
                            active={type === 'donation'}
                        >
                            Donations
                        </FilterLink>

                        <CategoryFilter
                            categories={categories}
                            selectedCategory={category}
                            type={type}
                            query={query}
                        />

                        <SearchBox key={query ?? ''} defaultValue={query ?? ''} className="w-full sm:w-64" />
                    </div>
                </div>

                {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">No listings match.</p>
                        <p className="text-sm text-muted-foreground">
                            Try a different search, category or type.
                        </p>
                        <Button variant="outline" nativeButton={false} render={<Link href="/listings" />} className="mt-2">
                            Clear filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                        {listings.map((listing) => (
                            <ListingCard key={listing.listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function buildHref({ category, type, q }: { category?: string; type?: string; q?: string }) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (type) params.set('type', type);
    if (q) params.set('q', q);
    const qs = params.toString();
    return qs ? `/listings?${qs}` : '/listings';
}

function FilterLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/25 hover:text-foreground'
            )}
        >
            {children}
        </Link>
    );
}
