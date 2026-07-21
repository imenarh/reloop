'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { favorites } from '@/db/schema';
import { requireUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(listingId: string) {
    const currentUser = await requireUser();

    const [existing] = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.userId, currentUser.id), eq(favorites.listingId, listingId)));

    if (existing) {
        await db.delete(favorites).where(eq(favorites.id, existing.id));
        revalidatePath('/favorites');
        return { favorited: false };
    }

    await db.insert(favorites).values({ userId: currentUser.id, listingId });
    revalidatePath('/favorites');
    return { favorited: true };
}

export async function getUserFavorites() {
    const currentUser = await requireUser();
    return db.query.favorites.findMany({
        where: (f, { eq }) => eq(f.userId, currentUser.id),
        with: { listing: true },
    });
}