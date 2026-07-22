/**
 * Frontend-only mock data layer.
 *
 * Mirrors the exported function names and return shapes of the server
 * actions (`actions/*`) and `lib/session`, so pages/components can render
 * with realistic data without touching the database or auth. Swap these
 * imports back to `@/actions/*` / `@/lib/session` when wiring the backend.
 */

import type { ListingSummary } from '@/components/listings/types';

// ---------------------------------------------------------------------------
// Mock session
// ---------------------------------------------------------------------------

const MOCK_USER = {
    id: 'user_mock',
    name: 'Amina Uwase',
    email: 'amina@example.com',
    image: null as string | null,
    role: 'user',
    bio: null as string | null,
    onboardedAt: null as Date | null,
};

export async function requireUser() {
    return MOCK_USER;
}

export async function getCurrentSession() {
    return { user: MOCK_USER };
}

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------

const CATEGORIES = [
    { id: 'cat_clothes', name: 'Clothes', slug: 'clothes' },
    { id: 'cat_shoes', name: 'Shoes', slug: 'shoes' },
    { id: 'cat_furniture', name: 'Furniture', slug: 'furniture' },
    { id: 'cat_accessories', name: 'Accessories', slug: 'accessories' },
];

const now = new Date();

function makeListing(
    n: number,
    overrides: Partial<ListingSummary['listing']> & { seller?: ListingSummary['seller'] }
): ListingSummary {
    const { seller, ...listingOverrides } = overrides;
    const id = `listing_${n}`;
    const category = CATEGORIES[n % CATEGORIES.length];
    return {
        listing: {
            id,
            title: `Listing ${n}`,
            description: 'A well-kept second-hand item looking for a new home.',
            price: '15000',
            condition: 'good',
            disposalType: 'resale',
            status: 'active',
            sellerId: MOCK_USER.id,
            categoryId: category.id,
            createdAt: now,
            updatedAt: now,
            ...listingOverrides,
        },
        seller: seller ?? { id: MOCK_USER.id, name: MOCK_USER.name, image: null },
        category,
        images: [
            {
                id: `img_${n}`,
                listingId: id,
                url: `https://picsum.photos/seed/reloop-${n}/600/600`,
                position: 0,
            },
        ],
    };
}

const LISTINGS: ListingSummary[] = [
    makeListing(1, { title: 'Denim jacket, barely worn', price: '18000', condition: 'like_new' }),
    makeListing(2, { title: 'Leather office chair', price: '45000', condition: 'good' }),
    makeListing(3, { title: 'Running shoes — size 42', price: '22000', condition: 'fair' }),
    makeListing(4, { title: 'Woven basket set', price: '9000', condition: 'new' }),
    makeListing(5, { title: 'Kids winter coats (bundle)', price: null, disposalType: 'donation' }),
    makeListing(6, { title: 'Wooden bookshelf', price: '38000', condition: 'good' }),
    makeListing(7, { title: 'Handbag, genuine leather', price: '26000', condition: 'like_new' }),
    makeListing(8, { title: 'School uniforms (assorted)', price: null, disposalType: 'donation' }),
];

// ---------------------------------------------------------------------------
// actions/listings
// ---------------------------------------------------------------------------

type ListingStatus = ListingSummary['listing']['status'];

interface ListListingsFilters {
    categoryId?: string;
    disposalType?: 'resale' | 'donation';
    status?: ListingStatus | ListingStatus[];
    sellerId?: string;
    query?: string;
    limit?: number;
    offset?: number;
}

export async function listListings(filters: ListListingsFilters = {}) {
    const { categoryId, disposalType, sellerId, query, limit = 20, offset = 0 } = filters;
    let rows = LISTINGS;
    if (categoryId) rows = rows.filter((r) => r.listing.categoryId === categoryId);
    if (disposalType) rows = rows.filter((r) => r.listing.disposalType === disposalType);
    if (sellerId) rows = rows.filter((r) => r.listing.sellerId === sellerId);
    const q = query?.trim().toLowerCase();
    if (q) {
        rows = rows.filter(
            (r) =>
                r.listing.title.toLowerCase().includes(q) ||
                r.listing.description.toLowerCase().includes(q)
        );
    }
    return rows.slice(offset, offset + limit);
}

export async function getListingById(listingId: string) {
    return LISTINGS.find((r) => r.listing.id === listingId) ?? null;
}

export async function createListing(_input: unknown) {
    return LISTINGS[0].listing;
}

export async function updateListing(listingId: string, _input: unknown) {
    return (await getListingById(listingId))?.listing ?? LISTINGS[0].listing;
}

export async function removeListing(_listingId: string) {
    return { ok: true };
}

// ---------------------------------------------------------------------------
// actions/categories
// ---------------------------------------------------------------------------

export async function listCategories() {
    return CATEGORIES;
}

// ---------------------------------------------------------------------------
// actions/stats
// ---------------------------------------------------------------------------

export async function getMarketplaceStats() {
    return { activeListings: 128, itemsReLooped: 342, itemsDonated: 87, charityPartners: 6 };
}

// ---------------------------------------------------------------------------
// actions/favorites
// ---------------------------------------------------------------------------

export async function getUserFavorites() {
    return LISTINGS.slice(0, 3).map((r, i) => ({
        id: `fav_${i}`,
        userId: MOCK_USER.id,
        listingId: r.listing.id,
        listing: { ...r.listing, images: r.images, category: r.category },
    }));
}

export async function isListingFavorited(_listingId: string): Promise<boolean> {
    return false;
}

export async function toggleFavorite(_listingId: string) {
    return { favorited: true };
}

// ---------------------------------------------------------------------------
// actions/organizations
// ---------------------------------------------------------------------------

const ORGANIZATIONS = [
    {
        id: 'org_1',
        name: 'Kigali Cares',
        description: 'Distributes clothing to families across Kigali.',
        logoUrl: null as string | null,
        charityStatus: 'approved' as const,
        createdBy: MOCK_USER.id,
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'org_2',
        name: 'Warm Hands Rwanda',
        description: 'Winter clothing drives for rural communities.',
        logoUrl: null as string | null,
        charityStatus: 'approved' as const,
        createdBy: 'user_other',
        createdAt: now,
        updatedAt: now,
    },
];

export async function listApprovedOrganizations() {
    return ORGANIZATIONS;
}

export async function getUserApprovedOrganizations() {
    return ORGANIZATIONS.filter((o) => o.createdBy === MOCK_USER.id);
}

// ---------------------------------------------------------------------------
// actions/orders
// ---------------------------------------------------------------------------

export async function getUserOrders() {
    return [
        {
            id: 'order_1',
            listingId: LISTINGS[0].listing.id,
            buyerId: MOCK_USER.id,
            sellerId: 'user_other',
            organizationId: null as string | null,
            type: 'purchase' as const,
            amount: LISTINGS[0].listing.price,
            paymentStatus: 'mock_paid' as const,
            createdAt: now,
            listing: LISTINGS[0].listing,
        },
        {
            id: 'order_2',
            listingId: LISTINGS[4].listing.id,
            buyerId: 'user_other',
            sellerId: MOCK_USER.id,
            organizationId: ORGANIZATIONS[0].id,
            type: 'donation_claim' as const,
            amount: null as string | null,
            paymentStatus: 'pending' as const,
            createdAt: now,
            listing: LISTINGS[4].listing,
        },
    ];
}

export async function createOrder(_input: unknown) {
    return (await getUserOrders())[0];
}

// ---------------------------------------------------------------------------
// actions/users
// ---------------------------------------------------------------------------

export async function completeOnboarding(_input: unknown) {
    return { ...MOCK_USER, onboardedAt: now };
}
