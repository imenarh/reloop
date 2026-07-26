import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories, listings, organizations, orders, reviews } from '@/db/schema';

/* Categories — admin-managed reference data */
export const createCategorySchema = createInsertSchema(categories, {
    name: (fields) => fields.name.trim().min(2).max(60),
    slug: (fields) =>
        fields.slug
            .trim()
            .toLowerCase()
            .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, numbers, and hyphens only'),
}).omit({ id: true });

/* Listings — core marketplace/donation entity */
const baseListingSchema = createInsertSchema(listings, {
    title: (fields) => fields.title.trim().min(3).max(150),
    description: (fields) => fields.description.trim().min(10).max(2000),
}).omit({ id: true, sellerId: true, status: true, createdAt: true, updatedAt: true });

export const createListingSchema = baseListingSchema
    .extend({
        // At least one photo per listing so the marketplace stays visual/trustworthy
        imageUrls: z.array(z.string().url()).min(1, 'At least one image is required').max(8),
        price: z.union([z.string(), z.number()]).optional(),
    })
    .refine(
        (data) => (data.disposalType === 'resale' ? data.price != null && Number(data.price) > 0 : true),
        { message: 'Resale listings must have a price greater than 0', path: ['price'] }
    )
    .refine((data) => (data.disposalType === 'donation' ? data.price == null : true), {
        message: 'Donation listings must not have a price',
        path: ['price'],
    });

export const updateListingSchema = baseListingSchema
    .extend({
        price: z.union([z.string(), z.number()]).optional(),
        imageUrls: z.array(z.string().url()).min(1).max(8).optional(),
    })
    .partial();

/* Organizations — NGO onboarding, admin-approved */
export const createOrganizationSchema = createInsertSchema(organizations, {
    name: (fields) => fields.name.trim().min(2).max(150),
    description: (fields) => fields.description.trim().max(1000).optional(),
}).omit({ id: true, createdBy: true, charityStatus: true, createdAt: true, updatedAt: true });

/* Orders — direct buy or donation claim, one listing = one order */
export const createOrderSchema = createInsertSchema(orders)
    .omit({ id: true, buyerId: true, sellerId: true, paymentStatus: true, createdAt: true })
    .refine((data) => (data.type === 'donation_claim' ? data.organizationId != null : true), {
        message: 'A donation claim must specify the claiming organization',
        path: ['organizationId'],
    });

/* Reviews — left after an order completes */
export const createReviewSchema = createInsertSchema(reviews, {
    rating: (fields) => fields.rating.min(1).max(5),
    comment: (fields) => fields.comment.trim().max(1000).optional(),
}).omit({ id: true, reviewerId: true, sellerId: true, createdAt: true });

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;