import {
    pgTable,
    text,
    integer,
    numeric,
    timestamp,
    boolean,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/* -------------------------------------------------------------------------- */
/*  Enums                                                                      */
/* -------------------------------------------------------------------------- */

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const conditionEnum = pgEnum('condition', ['new', 'like_new', 'good', 'fair', 'worn']);
export const disposalTypeEnum = pgEnum('disposal_type', ['resale', 'donation']);
export const listingStatusEnum = pgEnum('listing_status', [
    'active',
    'pending',
    'sold',
    'claimed',
    'removed',
]);
export const charityStatusEnum = pgEnum('charity_status', ['pending', 'approved', 'rejected']);
export const orderTypeEnum = pgEnum('order_type', ['purchase', 'donation_claim']);
export const paymentStatusEnum = pgEnum('payment_status', [
    'pending',
    'mock_paid',
    'completed',
    'cancelled',
]);

/* -------------------------------------------------------------------------- */
/*  Better Auth core tables                                                    */
/*  Column shapes follow Better Auth's expected schema exactly so the          */
/*  Drizzle adapter can read/write them without extra mapping.                 */
/* -------------------------------------------------------------------------- */

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    role: userRoleEnum('role').notNull().default('user'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/* -------------------------------------------------------------------------- */
/*  App tables                                                                 */
/* -------------------------------------------------------------------------- */

export const categories = pgTable('categories', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
});

export const listings = pgTable('listings', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    sellerId: text('seller_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
        .notNull()
        .references(() => categories.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    // Null when disposal_type = 'donation'
    price: numeric('price', { precision: 10, scale: 2 }),
    condition: conditionEnum('condition').notNull(),
    disposalType: disposalTypeEnum('disposal_type').notNull().default('resale'),
    status: listingStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const listingImages = pgTable('listing_images', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    listingId: text('listing_id')
        .notNull()
        .references(() => listings.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    position: integer('position').notNull().default(0),
});

export const organizations = pgTable('organizations', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    charityStatus: charityStatusEnum('charity_status').notNull().default('pending'),
    createdBy: text('created_by')
        .notNull()
        .references(() => user.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    listingId: text('listing_id')
        .notNull()
        .unique() // one listing -> one order (no cart, direct buy/claim)
        .references(() => listings.id, { onDelete: 'cascade' }),
    buyerId: text('buyer_id')
        .notNull()
        .references(() => user.id, { onDelete: 'restrict' }),
    sellerId: text('seller_id')
        .notNull()
        .references(() => user.id, { onDelete: 'restrict' }),
    organizationId: text('organization_id').references(() => organizations.id, {
        onDelete: 'set null',
    }),
    type: orderTypeEnum('type').notNull(),
    // Mock payments for now; column stays generic for a future real gateway.
    amount: numeric('amount', { precision: 10, scale: 2 }),
    paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    orderId: text('order_id')
        .notNull()
        .references(() => orders.id, { onDelete: 'cascade' }),
    reviewerId: text('reviewer_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    sellerId: text('seller_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(), // 1-5, enforced in app layer + zod
    comment: text('comment'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const favorites = pgTable('favorites', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    listingId: text('listing_id')
        .notNull()
        .references(() => listings.id, { onDelete: 'cascade' }),
});

/* -------------------------------------------------------------------------- */
/*  Relations (used for Drizzle's relational query API)                       */
/* -------------------------------------------------------------------------- */

export const userRelations = relations(user, ({ many }) => ({
    listings: many(listings),
    organizations: many(organizations),
    favorites: many(favorites),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
    seller: one(user, { fields: [listings.sellerId], references: [user.id] }),
    category: one(categories, { fields: [listings.categoryId], references: [categories.id] }),
    images: many(listingImages),
    order: one(orders, { fields: [listings.id], references: [orders.listingId] }),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
    listing: one(listings, { fields: [listingImages.listingId], references: [listings.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    listings: many(listings),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
    owner: one(user, { fields: [organizations.createdBy], references: [user.id] }),
    orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    listing: one(listings, { fields: [orders.listingId], references: [listings.id] }),
    buyer: one(user, { fields: [orders.buyerId], references: [user.id] }),
    seller: one(user, { fields: [orders.sellerId], references: [user.id] }),
    organization: one(organizations, {
        fields: [orders.organizationId],
        references: [organizations.id],
    }),
    reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
    reviewer: one(user, { fields: [reviews.reviewerId], references: [user.id] }),
    seller: one(user, { fields: [reviews.sellerId], references: [user.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(user, { fields: [favorites.userId], references: [user.id] }),
    listing: one(listings, { fields: [favorites.listingId], references: [listings.id] }),
}));
