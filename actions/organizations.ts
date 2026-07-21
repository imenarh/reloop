'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { organizations } from '@/db/schema';
import { requireUser, requireAdmin } from '@/lib/session';
import { createOrganizationSchema } from '@/lib/validators';
import type { CreateOrganizationInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function applyAsOrganization(input: CreateOrganizationInput) {
    const currentUser = await requireUser();
    const data = createOrganizationSchema.parse(input);

    const [org] = await db
        .insert(organizations)
        .values({ ...data, createdBy: currentUser.id })
        .returning();

    revalidatePath('/organizations');
    return org;
}

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
    return db.select().from(organizations).where(eq(organizations.charityStatus, 'approved'));
}