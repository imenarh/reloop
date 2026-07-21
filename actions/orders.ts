'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders, listings, organizations } from '@/db/schema';
import { requireUser } from '@/lib/session';
import { createOrderSchema } from '@/lib/validators';
import type { CreateOrderInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createOrder(input: CreateOrderInput) {
    const buyer = await requireUser();
    const data = createOrderSchema.parse(input);

    return db.transaction(async (tx) => {
        const [listing] = await tx.select().from(listings).where(eq(listings.id, data.listingId));
        if (!listing) throw new Error('LISTING_NOT_FOUND');
        if (listing.status !== 'active') throw new Error('LISTING_NOT_AVAILABLE');

        if (data.type === 'donation_claim') {
            if (listing.disposalType !== 'donation') {
                throw new Error('LISTING_IS_NOT_A_DONATION');
            }
            const [org] = await tx
                .select()
                .from(organizations)
                .where(eq(organizations.id, data.organizationId as string));
            if (!org || org.charityStatus !== 'approved') {
                throw new Error('ORGANIZATION_NOT_APPROVED');
            }
        } else {
            if (listing.disposalType !== 'resale') {
                throw new Error('LISTING_IS_NOT_FOR_SALE');
            }
        }

        const [order] = await tx
            .insert(orders)
            .values({
                listingId: data.listingId,
                buyerId: buyer.id,
                sellerId: listing.sellerId,
                organizationId: data.organizationId ?? null,
                type: data.type,
                amount: data.type === 'purchase' ? listing.price : null,
                paymentStatus: data.type === 'purchase' ? 'mock_paid' : 'pending',
            })
            .returning();

        await tx
            .update(listings)
            .set({ status: data.type === 'purchase' ? 'sold' : 'claimed', updatedAt: new Date() })
            .where(eq(listings.id, data.listingId));

        revalidatePath('/listings');
        revalidatePath('/orders');
        return order;
    });
}

export async function completeOrder(orderId: string) {
    const currentUser = await requireUser();

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) throw new Error('NOT_FOUND');
    if (order.sellerId !== currentUser.id && currentUser.role !== 'admin') {
        throw new Error('FORBIDDEN');
    }

    const [updated] = await db
        .update(orders)
        .set({ paymentStatus: 'completed' })
        .where(eq(orders.id, orderId))
        .returning();

    revalidatePath('/orders');
    return updated;
}

export async function getUserOrders() {
    const currentUser = await requireUser();
    return db.query.orders.findMany({
        where: (o, { or, eq }) => or(eq(o.buyerId, currentUser.id), eq(o.sellerId, currentUser.id)),
        with: { listing: true },
        orderBy: (o, { desc }) => desc(o.createdAt),
    });
}