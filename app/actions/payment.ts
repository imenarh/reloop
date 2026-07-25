'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders, listings } from '@/db/schema';
import { requireUser } from '@/lib/session';
import { ActionError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';

interface VerifyPurchaseInput {
    listingId: string;
    transactionId: string;
    txRef: string;
}

/**
 * Called after the Flutterwave inline modal reports success on the client.
 * Never trusts that callback alone — re-verifies the transaction server-side
 * with the secret key before writing an order, and re-checks the listing is
 * still available inside the transaction to avoid a race between two buyers.
 */
export async function verifyFlutterwavePurchase({ listingId, transactionId, txRef }: VerifyPurchaseInput) {
    const buyer = await requireUser();

    const [listing] = await db.select().from(listings).where(eq(listings.id, listingId));
    if (!listing) throw new ActionError('LISTING_NOT_FOUND');
    if (listing.status !== 'active') throw new ActionError('LISTING_NOT_AVAILABLE');
    if (listing.disposalType !== 'resale') throw new ActionError('LISTING_IS_NOT_FOR_SALE');
    if (listing.sellerId === buyer.id) throw new ActionError('CANNOT_ORDER_OWN_LISTING');
    if (listing.price == null) throw new ActionError('LISTING_HAS_NO_PRICE');

    const verifyRes = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` } }
    );
    if (!verifyRes.ok) throw new ActionError('PAYMENT_VERIFICATION_FAILED');

    const verifyData = await verifyRes.json();
    const tx = verifyData?.data;
    const expectedAmount = Number(listing.price);

    const isValid =
        verifyData.status === 'success' &&
        tx?.status === 'successful' &&
        tx?.tx_ref === txRef &&
        tx?.currency === 'RWF' &&
        Number(tx?.amount) >= expectedAmount; // guards against amount tampering

    if (!isValid) throw new ActionError('PAYMENT_VERIFICATION_FAILED');

    return db.transaction(async (trx) => {
        const [freshListing] = await trx.select().from(listings).where(eq(listings.id, listingId));
        if (!freshListing || freshListing.status !== 'active') {
            throw new ActionError('LISTING_NOT_AVAILABLE');
        }

        const [order] = await trx
            .insert(orders)
            .values({
                listingId,
                buyerId: buyer.id,
                sellerId: listing.sellerId,
                type: 'purchase',
                amount: String(tx.amount),
                paymentStatus: 'completed',
            })
            .returning();

        await trx.update(listings).set({ status: 'sold', updatedAt: new Date() }).where(eq(listings.id, listingId));

        revalidatePath(`/listings/${listingId}`);
        revalidatePath('/listings');
        revalidatePath('/orders');
        return order;
    });
}