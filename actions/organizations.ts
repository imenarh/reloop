'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { requireUser, requireAdmin } from '@/lib/session';
import { createOrganizationSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';

/** Any logged-in user can apply to register an organization; starts as 'pending'. */
export async function applyAsOrganization(input: unknown) {
    const currentUser = await requireUser();
    const data = createOrganizationSchema.parse(input);

    const [org] = await db
        .insert(organizations)
        .values({ ...data, createdBy: currentUser.id })
        .returning();

    revalidatePath('/organizations');
    return org;
}

/** Admin approval workflow — this gates who can receive donation claims. */
export async function approveOrganization(organizationId: string) {
    await requireAdmin();
    const [org] = await db
        .update(organizations)
        .set({ charityStatus: 'approved', updatedAt: new Date() })
        .where(eq(organizations.id, organizationId))
        .returning();

    revalidatePath('/organizations');
    return org;
}

export async function rejectOrganization(organizationId: string) {
    await requireAdmin();
    const [org] = await db
        .update(organizations)
        .set({ charityStatus: 'rejected', updatedAt: new Date() })
        .where(eq(organizations.id, organizationId))
        .returning();

    revalidatePath('/organizations');
    return org;
}

export async function listPendingOrganizations() {
    await requireAdmin();
    return db.select().from(organizations).where(eq(organizations.charityStatus, 'pending'));
}

export async function listApprovedOrganizations() {
    // Public — donors/sellers need to see who they can donate to.
    return db.select().from(organizations).where(eq(organizations.charityStatus, 'approved'));
}
