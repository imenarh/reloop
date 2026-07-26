/**
 * Shared shape for anything that renders a listing summary (grid cards,
 * "my listings" rows, etc). Mirrors the return shape of
 * `getListingById` from actions/listings.ts, which is the richest source
 * we have (joins seller + category, plus ordered images).
 */
export interface ListingSummary {
    listing: {
        id: string;
        title: string;
        description: string;
        price: string | null;
        condition: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
        disposalType: 'resale' | 'donation';
        status: 'active' | 'pending' | 'sold' | 'claimed' | 'removed';
        sellerId: string;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    };
    seller: {
        id: string;
        name: string;
        image: string | null;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    images: {
        id: string;
        listingId: string;
        url: string;
        position: number;
    }[];
}

export const conditionLabels: Record<ListingSummary['listing']['condition'], string> = {
    new: 'New',
    like_new: 'Like new',
    good: 'Good',
    fair: 'Fair',
    worn: 'Worn',
};

export function formatPrice(price: string | null): string {
    if (price == null) return '';
    const amount = Number(price);
    return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF',
        maximumFractionDigits: 0,
    }).format(amount);
}
