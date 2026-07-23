export type UserRole = 'user' | 'admin';
export type Condition = 'new' | 'like_new' | 'good' | 'fair' | 'worn';
export type DisposalType = 'resale' | 'donation';
export type ListingStatus = 'active' | 'pending' | 'sold' | 'claimed' | 'removed';
export type CharityStatus = 'pending' | 'approved' | 'rejected';
export type OrderType = 'purchase' | 'donation_claim';
export type PaymentStatus = 'pending' | 'mock_paid' | 'completed' | 'cancelled';

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: UserRole;
    bio: string | null;
    onboardedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Listing {
    id: string;
    sellerId: string;
    categoryId: string;
    title: string;
    description: string;
    price: string | null;
    condition: Condition;
    disposalType: DisposalType;
    status: ListingStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface ListingImage {
    id: string;
    listingId: string;
    url: string;
    position: number;
}

export interface Organization {
    id: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    charityStatus: CharityStatus;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    organizationId: string | null;
    type: OrderType;
    amount: string | null;
    paymentStatus: PaymentStatus;
    createdAt: Date;
}

export interface Review {
    id: string;
    orderId: string;
    reviewerId: string;
    sellerId: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
}

export interface CreateCategoryInput {
    name: string;
    slug: string;
}

export interface CreateListingInput {
    categoryId: string;
    title: string;
    description: string;
    condition: Condition;
    disposalType: DisposalType;
    price?: string | number;
    imageUrls: string[];
}

export type UpdateListingInput = Partial<Omit<CreateListingInput, 'imageUrls'>> & {
    imageUrls?: string[];
};

export interface CreateOrganizationInput {
    name: string;
    description?: string;
    logoUrl?: string | null;
}

export interface CreateOrderInput {
    listingId: string;
    type: OrderType;
    organizationId?: string | null;
    amount?: string | null;
}

export interface CreateReviewInput {
    orderId: string;
    rating: number;
    comment?: string;
}