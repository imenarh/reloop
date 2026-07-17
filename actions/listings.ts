'use server';

import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/db';
import { listings, listingImages, categories, user } from '@/db/schema';
import { requireUser, requireAdmin } from '@/lib/session';
import { createListingSchema, updateListingSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

/**
 * Creates a listing plus its images in one transaction.
 * `imageUrls` come from the client after it's already uploaded each
 * file directly to R2 via the presigned URL from /api/upload.
 */
export async function createListing(input: unknown) {
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

export async function updateListing(listingId: string, input: unknown) {
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
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.categoryId && { categoryId: data.categoryId }),
            ...(data.condition && { condition: data.condition }),
            ...(data.price !== undefined && { price: data.price != null ? String(data.price) : null }),
            updatedAt: new Date(),
        })
        .where(eq(listings.id, listingId))
        .returning();

    revalidatePath(`/listings/${listingId}`);
    return updated;
}

/** Admin-only takedown for moderation (reported/abusive listings). */
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
    const [listing] = await db
        .select({
            listing: listings,
            seller: { id: user.id, name: user.name, image: user.image },
            category: { id: categories.id, name: categories.name, slug: categories.slug },
        })
        .from(listings)
        .innerJoin(user, eq(listings.sellerId, user.id))
        .innerJoin(categories, eq(listings.categoryId, categories.id))
        .where(eq(listings.id, listingId));

    if (!listing) return null;

    const images = await db
        .select()
        .from(listingImages)
        .where(eq(listingImages.listingId, listingId))
        .orderBy(listingImages.position);

    return { ...listing, images };
}

interface ListListingsFilters {
    categoryId?: string;
    disposalType?: 'resale' | 'donation';
    status?: 'active' | 'pending' | 'sold' | 'claimed' | 'removed';
    limit?: number;
    offset?: number;
}

export async function listListings(filters: ListListingsFilters = {}) {
    const { categoryId, disposalType, status = 'active', limit = 20, offset = 0 } = filters;

    const conditions = [eq(listings.status, status)];
    if (categoryId) conditions.push(eq(listings.categoryId, categoryId));
    if (disposalType) conditions.push(eq(listings.disposalType, disposalType));

    return db
        .select()
        .from(listings)
        .where(and(...conditions))
        .orderBy(desc(listings.createdAt))
        .limit(limit)
        .offset(offset);
}
