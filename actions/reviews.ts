'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { reviews, orders } from '@/db/schema';
import { requireUser } from '@/lib/session';
import { createReviewSchema } from '@/lib/validators';
import type { CreateReviewInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createReview(input: CreateReviewInput) {
    const reviewer = await requireUser();
    const data = createReviewSchema.parse(input);

    const [order] = await db.select().from(orders).where(eq(orders.id, data.orderId));
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.buyerId !== reviewer.id) throw new Error('ONLY_BUYER_CAN_REVIEW');
    if (order.paymentStatus !== 'completed') throw new Error('ORDER_NOT_COMPLETED');

    const [existing] = await db.select().from(reviews).where(eq(reviews.orderId, data.orderId));
    if (existing) throw new Error('ALREADY_REVIEWED');

    const [review] = await db
        .insert(reviews)
        .values({
            orderId: data.orderId,
            reviewerId: reviewer.id,
            sellerId: order.sellerId,
            rating: data.rating,
            comment: data.comment,
        })
        .returning();

    revalidatePath(`/users/${order.sellerId}`);
    return review;
}

export async function getReviewsForSeller(sellerId: string) {
    return db.query.reviews.findMany({
        where: (r, { eq }) => eq(r.sellerId, sellerId),
        orderBy: (r, { desc }) => desc(r.createdAt),
    });
}