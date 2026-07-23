'use server';

import { and, eq, ilike, inArray, or } from 'drizzle-orm';
import { db } from '@/db';
import { listings, listingImages } from '@/db/schema';
import { requireUser, requireAdmin } from '@/lib/session';
import { createListingSchema, updateListingSchema } from '@/lib/validators';
import type { CreateListingInput, UpdateListingInput, DisposalType, ListingStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import type { ListingSummary } from '@/components/listings/types';

function toSummary(row: {
    id: string;
    sellerId: string;
    categoryId: string;
    title: string;
    description: string;
    price: string | null;
    condition: ListingSummary['listing']['condition'];
    disposalType: ListingSummary['listing']['disposalType'];
    status: ListingSummary['listing']['status'];
    createdAt: Date;
    updatedAt: Date;
    seller: { id: string; name: string; image: string | null };
    category: { id: string; name: string; slug: string };
    images: { id: string; listingId: string; url: string; position: number }[];
}): ListingSummary {
    const { seller, category, images, ...listing } = row;
    return { listing, seller, category, images };
}

export async function createListing(input: CreateListingInput) {
    const seller = await requireUser();
    const data = createListingSchema.parse(input);

    return db.transaction(async (tx) => {
        const [listing] = await tx
            .insert(listings)
            .values({
                sellerId: seller.id,
                categoryId: data.categoryId,
                title: data.title,
                description: data.description,
                price: data.disposalType === 'resale' ? String(data.price) : null,
                condition: data.condition,
                disposalType: data.disposalType,
            })
            .returning();

        await tx.insert(listingImages).values(
            data.imageUrls.map((url, index) => ({
                listingId: listing.id,
                url,
                position: index,
            }))
        );

        revalidatePath('/listings');
        return listing;
    });
}

export async function updateListing(listingId: string, input: UpdateListingInput) {
    const currentUser = await requireUser();
    const data = updateListingSchema.parse(input);

    const [existing] = await db.select().from(listings).where(eq(listings.id, listingId));
    if (!existing) throw new Error('NOT_FOUND');
    if (existing.sellerId !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error('FORBIDDEN');
    }

    const [updated] = await db
        .update(listings)
        .set({
            ...(data.title !== undefined && { title: data.title }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
            ...(data.condition !== undefined && { condition: data.condition }),
            ...(data.price !== undefined && { price: data.price != null ? String(data.price) : null }),
            updatedAt: new Date(),
        })
        .where(eq(listings.id, listingId))
        .returning();

    if (data.imageUrls?.length) {
        await db.delete(listingImages).where(eq(listingImages.listingId, listingId));
        await db.insert(listingImages).values(
            data.imageUrls.map((url, index) => ({
                listingId,
                url,
                position: index,
            }))
        );
    }

    revalidatePath(`/listings/${listingId}`);
    return updated;
}

export async function removeListing(listingId: string) {
    await requireAdmin();
    const [updated] = await db
        .update(listings)
        .set({ status: 'removed', updatedAt: new Date() })
        .where(eq(listings.id, listingId))
        .returning();

    revalidatePath('/listings');
    return updated;
}

export async function getListingById(listingId: string) {
    const listing = await db.query.listings.findFirst({
        where: (listingTable, { eq }) => eq(listingTable.id, listingId),
        with: {
            seller: { columns: { id: true, name: true, image: true } },
            category: { columns: { id: true, name: true, slug: true } },
            images: {
                orderBy: (imageTable, { asc }) => asc(imageTable.position),
            },
        },
    });

    if (!listing) return null;

    return toSummary(listing as Parameters<typeof toSummary>[0]);
}

interface ListListingsFilters {
    categoryId?: string;
    disposalType?: DisposalType;
    status?: ListingStatus | ListingStatus[];
    sellerId?: string;
    query?: string;
    limit?: number;
    offset?: number;
}

export async function listListings(filters: ListListingsFilters = {}) {
    const { categoryId, disposalType, status = 'active', sellerId, query, limit = 20, offset = 0 } = filters;
    const statuses = Array.isArray(status) ? status : [status];

    const rows = await db.query.listings.findMany({
        where: (listingTable, { and, eq, inArray, ilike, or }) => {
            const conditions: any[] = [inArray(listingTable.status, statuses)];
            if (categoryId) conditions.push(eq(listingTable.categoryId, categoryId));
            if (disposalType) conditions.push(eq(listingTable.disposalType, disposalType));
            if (sellerId) conditions.push(eq(listingTable.sellerId, sellerId));
            if (query) {
                const searchCondition = or(
                    ilike(listingTable.title, `%${query}%`),
                    ilike(listingTable.description, `%${query}%`)
                );
                conditions.push(searchCondition as any);
            }

            return and(...conditions);
        },
        with: {
            seller: { columns: { id: true, name: true, image: true } },
            category: { columns: { id: true, name: true, slug: true } },
            images: {
                orderBy: (imageTable, { asc }) => asc(imageTable.position),
            },
        },
        orderBy: (listingTable, { desc }) => desc(listingTable.createdAt),
        limit,
        offset,
    });

    return rows.map((row) => toSummary(row as Parameters<typeof toSummary>[0]));
}