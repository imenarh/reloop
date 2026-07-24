import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/listings/favorite-button';
import { formatPrice, type ListingSummary } from '@/components/listings/types';

interface ListingCardProps {
    listing: ListingSummary;
    showFavorite?: boolean;
}

export function ListingCard({ listing, showFavorite = true }: ListingCardProps) {
    const { listing: l, category, images } = listing;
    const coverImage = images[0]?.url;

    return (
        <Card className="relative aspect-[4/5] overflow-hidden p-0 ring-0">
            <Link href={`/listings/${l.id}`} className="block h-full w-full">
                {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={coverImage}
                        alt={l.title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
                        No image
                    </div>
                )}

                {/* scrim for legible text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {l.disposalType === 'donation' ? (
                    <Badge variant="secondary" className="absolute top-2.5 left-2.5">Donation</Badge>
                ) : null}

                {showFavorite && (
                    <FavoriteButton listingId={l.id} className="absolute top-2.5 right-2.5" />
                )}

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3 text-white">
                    <span className="text-xs text-white/70">{category.name}</span>
                    <h3 className="line-clamp-1 text-sm font-medium">{l.title}</h3>
                    {l.disposalType === 'resale' ? (
                        <span className="text-base font-semibold tabular-nums">{formatPrice(l.price)}</span>
                    ) : (
                        <span className="text-base font-semibold">Free</span>
                    )}
                </div>
            </Link>
        </Card>
    );
}
