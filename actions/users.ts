 'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { user } from '@/db/schema';
import { requireUser } from '@/lib/session';

interface CompleteOnboardingInput {
    name: string;
    image?: string | null;
    bio?: string | null;
}

export async function completeOnboarding(input: CompleteOnboardingInput) {
    const currentUser = await requireUser();

    const [updated] = await db
        .update(user)
        .set({
            name: input.name.trim(),
            image: input.image ?? null,
            bio: input.bio ?? null,
            onboardedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(user.id, currentUser.id))
        .returning();

    return updated;
}