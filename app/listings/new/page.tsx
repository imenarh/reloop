'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { ListingForm } from '@/components/listings/listing-form';
import { Button } from '@/components/ui/button';

export default function NewListingPage() {
    const { data: session, isPending } = useSession();

    // This route is already protected by proxy.ts, so an unauthenticated
    // render here should only happen in a brief race — fall back gracefully.
    if (!isPending && !session?.user) {
        return (
            <section className="py-20 text-center">
                <p className="mb-4 text-muted-foreground">You need to be logged in to list an item.</p>
                <Button nativeButton={false} render={<Link href="/login?redirect=/listings/new" />}>Log in</Button>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="mx-auto max-w-2xl px-6">
                <h1 className="mb-8 font-heading text-3xl font-semibold text-foreground">List an item</h1>
                <ListingForm />
            </div>
        </section>
    );
}
