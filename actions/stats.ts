'use server';

import { count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { listings, organizations, orders } from '@/db/schema';

async function countRows(table: any, condition?: any) {
    const query = db.select({ value: count() }).from(table);
    const rows = condition ? await query.where(condition as never) : await query;
    return Number(rows[0]?.value ?? 0);
}

export async function getMarketplaceStats() {
    const [activeListings, itemsReLooped, itemsDonated, charityPartners] = await Promise.all([
        countRows(listings, eq(listings.status, 'active')),
        countRows(orders),
        countRows(orders, eq(orders.type, 'donation_claim')),
        countRows(organizations, eq(organizations.charityStatus, 'approved')),
    ]);

    return {
        activeListings,
        itemsReLooped,
        itemsDonated,
        charityPartners,
    };
}