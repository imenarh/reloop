'use server';

import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { createCategorySchema } from '@/lib/validators';
import type { CreateCategoryInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function listCategories() {
    return db.select().from(categories).orderBy(asc(categories.name));
}

export async function createCategory(input: CreateCategoryInput) {
    await requireAdmin();
    const data = createCategorySchema.parse(input);

    const [category] = await db.insert(categories).values(data).returning();
    revalidatePath('/categories');
    return category;
}

export async function deleteCategory(categoryId: string) {
    await requireAdmin();
    await db.delete(categories).where(eq(categories.id, categoryId));
    revalidatePath('/categories');
}