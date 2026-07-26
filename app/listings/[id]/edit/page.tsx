import { notFound, redirect } from 'next/navigation';
import { getListingById } from '@/lib/mock';
import { requireUser } from '@/lib/mock';
import { ActionError } from '@/lib/errors';
import { ListingForm } from '@/components/listings/listing-form';

interface EditListingPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
    const { id } = await params;

    let user;
    try {
        user = await requireUser();
    } catch (err) {
        if (err instanceof ActionError) redirect(`/login?redirect=/listings/${id}/edit`);
        throw err;
    }

    const existing = await getListingById(id);
    if (!existing) notFound();

    if (existing.listing.sellerId !== user.id && user.role !== 'admin') {
        redirect(`/listings/${id}`);
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-2xl px-6">
                <h1 className="mb-8 font-heading text-3xl font-semibold text-foreground">Edit listing</h1>
                <ListingForm
                    existingListing={{
                        id: existing.listing.id,
                        title: existing.listing.title,
                        description: existing.listing.description,
                        categoryId: existing.listing.categoryId,
                        condition: existing.listing.condition,
                        disposalType: existing.listing.disposalType,
                        price: existing.listing.price,
                        images: existing.images.map((img) => ({ url: img.url })),
                    }}
                />
            </div>
        </section>
    );
}
