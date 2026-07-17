import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const conditionEnum = pgEnum("condition", [
  "new",
  "like_new",
  "good",
  "fair",
  "poor",
]);
export const disposalTypeEnum = pgEnum("disposal_type", ["sale", "donation"]);
export const listingStatusEnum = pgEnum("listing_status", [
  "available",
  "reserved",
  "completed",
  "removed",
]);
export const charityStatusEnum = pgEnum("charity_status", [
  "pending",
  "approved",
  "rejected",
]);
export const orderTypeEnum = pgEnum("order_type", ["purchase", "donation"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "cancelled",
]);

// Categories 

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

// Listings

export const listings = pgTable(
  "listings",
  {
    id: serial("id").primaryKey(),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").references(() => categories.id),
    title: text("title").notNull(),
    description: text("description"),
    price: integer("price").default(0).notNull(),
    condition: conditionEnum("condition").notNull(),
    disposalType: disposalTypeEnum("disposal_type").notNull(),
    status: listingStatusEnum("status").default("available").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("listing_sellerId_idx").on(table.sellerId),
    index("listing_categoryId_idx").on(table.categoryId),
    index("listing_status_idx").on(table.status),
  ],
);

export const listingImages = pgTable(
  "listing_images",
  {
    id: serial("id").primaryKey(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    position: integer("position").default(0).notNull(),
  },
  (table) => [index("listingImage_listingId_idx").on(table.listingId)],
);

// Organizations

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  charityStatus: charityStatusEnum("charity_status")
    .default("pending")
    .notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Orders

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => user.id),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id),
    organizationId: integer("organization_id").references(
      () => organizations.id,
    ),
    type: orderTypeEnum("type").notNull(),
    amount: integer("amount").default(0).notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("order_buyerId_idx").on(table.buyerId),
    index("order_sellerId_idx").on(table.sellerId),
    index("order_listingId_idx").on(table.listingId),
  ],
);

// Reviews

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id)
      .unique(),
    reviewerId: text("reviewer_id")
      .notNull()
      .references(() => user.id),
    sellerId: text("seller_id")
      .notNull()
      .references(() => user.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("review_sellerId_idx").on(table.sellerId)],
);

// Favorites

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingId: integer("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("favorite_unique_idx").on(table.userId, table.listingId),
  ],
);

// Relations

export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  seller: one(user, { fields: [listings.sellerId], references: [user.id] }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  images: many(listingImages),
  orders: many(orders),
  favorites: many(favorites),
}));

export const listingImagesRelations = relations(listingImages, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImages.listingId],
    references: [listings.id],
  }),
}));

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    creator: one(user, {
      fields: [organizations.createdBy],
      references: [user.id],
    }),
    orders: many(orders),
  }),
);

export const ordersRelations = relations(orders, ({ one }) => ({
  listing: one(listings, {
    fields: [orders.listingId],
    references: [listings.id],
  }),
  buyer: one(user, {
    fields: [orders.buyerId],
    references: [user.id],
    relationName: "buyerOrders",
  }),
  seller: one(user, {
    fields: [orders.sellerId],
    references: [user.id],
    relationName: "sellerOrders",
  }),
  organization: one(organizations, {
    fields: [orders.organizationId],
    references: [organizations.id],
  }),
  review: one(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
  reviewer: one(user, {
    fields: [reviews.reviewerId],
    references: [user.id],
    relationName: "reviewsGiven",
  }),
  seller: one(user, {
    fields: [reviews.sellerId],
    references: [user.id],
    relationName: "reviewsReceived",
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, { fields: [favorites.userId], references: [user.id] }),
  listing: one(listings, {
    fields: [favorites.listingId],
    references: [listings.id],
  }),
}));
