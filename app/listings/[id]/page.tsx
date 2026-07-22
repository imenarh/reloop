import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { getListingById } from '@/lib/mock';
import { isListingFavorited } from '@/lib/mock';
import { getUserApprovedOrganizations } from '@/lib/mock';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ListingActions } from '@/components/listings/listing-actions';
import { conditionLabels, formatPrice } from '@/components/listings/types';

interface ListingDetailPageProps {
    params: Promise<{ id: string }>;
}

function initialsFromName(name?: string | null) {
    if (!name) return '?';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
    const { id } = await params;
    const [listing, favorited, userOrgs] = await Promise.all([
        getListingById(id),
        isListingFavorited(id),
        getUserApprovedOrganizations(),
    ]);
    if (!listing) notFound();

    const { listing: l, category, seller, images } = listing;
    const mainImage = images[0]?.url;

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <Link
                    href="/listings"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <IconArrowLeft className="size-4" />
                    Back to listings
                </Link>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    {/* Gallery */}
                    <div className="flex flex-col gap-3">
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
                            {mainImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={mainImage} alt={l.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                    No image
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto">
                                {images.map((img, i) => (
                                    <div
                                        key={img.id}
                                        className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.url}
                                            alt={`${l.title}, photo ${i + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                                <Link
                                    href={`/listings?category=${category.id}`}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {category.name}
                                </Link>
                                <span aria-hidden>·</span>
                                <span>{conditionLabels[l.condition]}</span>
                                {l.disposalType === 'donation' && <Badge>Donation</Badge>}
                            </div>
                            <h1 className="font-heading text-3xl font-semibold text-foreground">{l.title}</h1>
                            {l.disposalType === 'resale' ? (
                                <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                                    {formatPrice(l.price)}
                                </p>
                            ) : (
                                <p className="mt-2 text-lg font-medium text-primary">Free to a good home</p>
                            )}
                        </div>

                        <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">{l.description}</p>

                        <div className="flex items-center gap-3 rounded-xl p-4 ring-1 ring-foreground/10">
                            <Avatar>
                                <AvatarImage src={seller.image ?? undefined} alt={seller.name} />
                                <AvatarFallback>{initialsFromName(seller.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm font-medium text-foreground">{seller.name}</div>
                                <div className="text-xs text-muted-foreground">Seller on ReLoop</div>
                            </div>
                        </div>

                        <ListingActions
                            listingId={l.id}
                            sellerId={l.sellerId}
                            disposalType={l.disposalType}
                            price={l.price}
                            status={l.status}
                            initialFavorited={favorited}
                            userOrganizations={userOrgs}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
