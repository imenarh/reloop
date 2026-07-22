import Link from 'next/link';
import {
    IconArrowRight,
    IconArrowBackUp,
    IconGift,
    IconPackage,
    IconShieldCheck,
    IconTag,
    IconTruckDelivery,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { listListings } from '@/lib/mock';
import { getMarketplaceStats } from '@/lib/mock';
import { ListingCard } from '@/components/listings/listing-card';
import { SearchBox } from '@/components/listings/search-box';

const TRUST_ITEMS = [
    { icon: IconShieldCheck, label: 'Buyer protection', detail: 'Payment is held until you confirm' },
    { icon: IconTruckDelivery, label: 'Tracked delivery', detail: 'Follow your parcel door to door' },
    { icon: IconPackage, label: 'Condition checked', detail: 'Reviewed before it ships' },
    { icon: IconArrowBackUp, label: 'Easy disputes', detail: "Flag it if it isn't right" },
];

const PATHS = [
    {
        icon: IconTag,
        title: 'Sell it',
        desc: 'Set your price. The buyer pays shipping on top, and the money is released to you once they confirm the item matches.',
        cta: 'Start selling',
    },
    {
        icon: IconGift,
        title: 'Donate it',
        desc: 'No price, no fees. We check the condition and route it to one of our charity partners in Kigali.',
        cta: 'Donate an item',
    },
];

export default async function Home() {
    const [recentListings, stats] = await Promise.all([
        listListings({ limit: 8 }),
        getMarketplaceStats(),
    ]);

    return (
        <>
            {/* HERO */}
            <section>
                <div className="mx-auto max-w-3xl px-6 py-20 text-center">
                    <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
                        Your closet still has somewhere to go.
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-balance text-muted-foreground">
                        Buy and sell second-hand clothes, shoes, furniture and accessories — or donate them to a
                        charity partner nearby.
                    </p>
                    <div className="mx-auto mt-8 max-w-xl">
                        <SearchBox className="w-full" placeholder="Search clothes, shoes, furniture…" />
                    </div>
                    <p className="mt-6 text-sm tabular-nums text-muted-foreground">
                        {stats.activeListings} active listings · {stats.charityPartners} charity partners ·{' '}
                        {stats.itemsDonated} items donated to families
                    </p>
                </div>
            </section>

            {/* FRESH LISTINGS */}
            <section className="py-14">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <h2 className="font-heading text-2xl font-semibold text-foreground">Featured on ReLoop</h2>
                        <Link
                            href="/listings"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            View all
                            <IconArrowRight className="size-4" />
                        </Link>
                    </div>

                    {recentListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                            <p className="font-heading text-lg text-foreground">Nothing listed yet.</p>
                            <p className="text-sm text-muted-foreground">
                                The first item on ReLoop could be yours.
                            </p>
                            <Button nativeButton={false} render={<Link href="/listings/new" />} className="mt-2">
                                List an item
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                            {recentListings.map((listing) => (
                                <ListingCard key={listing.listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* SELL / DONATE */}
            <section className="border-y border-border bg-muted/40 py-14">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-8 max-w-lg">
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                            List it once. Choose where it goes.
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Every listing starts the same way — snap a photo, describe it, pick a path.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {PATHS.map((path) => (
                            <div key={path.title} className="rounded-xl bg-background p-6 ring-1 ring-foreground/10">
                                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <path.icon className="size-5" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold text-foreground">{path.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{path.desc}</p>
                                <Link
                                    href="/listings/new"
                                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    {path.cta}
                                    <IconArrowRight className="size-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST ROW */}
            <section className="py-14">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
                    {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
                        <div key={label} className="flex items-start gap-3">
                            <Icon className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.75} />
                            <div>
                                <div className="text-sm font-semibold text-foreground">{label}</div>
                                <div className="text-xs text-muted-foreground">{detail}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
