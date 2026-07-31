'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { useSession } from '@/lib/auth-client';
import { createOrder } from '@/actions/orders';
import { verifyFlutterwavePurchase } from '@/actions/payment';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { FavoriteButton } from '@/components/listings/favorite-button';
import { formatPrice } from '@/components/listings/types';

interface Organization {
    id: string;
    name: string;
}

interface ListingActionsProps {
    listingId: string;
    title: string;
    sellerId: string;
    disposalType: 'resale' | 'donation';
    price: string | null;
    status: 'active' | 'pending' | 'sold' | 'claimed' | 'removed';
    initialFavorited?: boolean;
    userOrganizations?: Organization[];
}

const errorMessages: Record<string, string> = {
    CANNOT_ORDER_OWN_LISTING: "You can't order your own listing.",
    LISTING_NOT_AVAILABLE: 'This listing is no longer available.',
    NOT_ORGANIZATION_OWNER: 'Only the organization owner can claim this donation.',
    ORGANIZATION_NOT_APPROVED: 'Your organization must be approved before claiming donations.',
    UNAUTHENTICATED: 'Please log in to continue.',
    PAYMENT_VERIFICATION_FAILED: 'We could not verify that payment. Please try again.',
};

export function ListingActions({ listingId, title, sellerId, disposalType, price, status, initialFavorited, userOrganizations = [] }: ListingActionsProps) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState(userOrganizations[0]?.id ?? '');

    if (isPending) return null;

    const isOwner = session?.user?.id === sellerId;
    const isActive = status === 'active';

    function handlePrimaryClick() {
        if (!session?.user) {
            router.push(`/login?redirect=/listings/${listingId}`);
            return;
        }
        setDialogOpen(true);
    }

    async function handleConfirm() {
        setSubmitting(true);
        try {
            await createOrder({ listingId, type: 'donation_claim', organizationId: selectedOrgId });
            toast.success('Donation claimed!');
            setDialogOpen(false);
            router.refresh();
        } catch (err) {
            if (err instanceof ActionError) {
                toast.error(errorMessages[err.code] ?? err.message);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleFlutterwaveCallback(response: { transaction_id: number; tx_ref: string; status: string }) {
        closePaymentModal();
        if (response.status !== 'successful') {
            toast.error('Payment was not completed.');
            return;
        }
        setSubmitting(true);
        try {
            await verifyFlutterwavePurchase({
                listingId,
                transactionId: String(response.transaction_id),
                txRef: response.tx_ref,
            });
            toast.success('Purchase confirmed!');
            setDialogOpen(false);
            router.refresh();
        } catch (err) {
            if (err instanceof ActionError) {
                toast.error(errorMessages[err.code] ?? err.message);
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    const canClaim = userOrganizations.length > 0;
    const txRef = `reloop-${listingId}-${session?.user?.id ?? 'guest'}-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="flex items-center gap-3">
            <FavoriteButton listingId={listingId} initialFavorited={initialFavorited} />

            {isOwner && (
                <Link href={`/listings/${listingId}/edit`}>
                    <Button variant="outline">Edit listing</Button>
                </Link>
            )}

            {!isOwner && isActive && disposalType === 'resale' && (
                <Button onClick={handlePrimaryClick}>Buy now{price ? ` — ${formatPrice(price)}` : ''}</Button>
            )}

            {!isOwner && isActive && disposalType === 'donation' && (
                canClaim ? (
                    <Button onClick={handlePrimaryClick}>Claim donation</Button>
                ) : (
                    <span title="You need an approved organization to claim donations">
                        <Button disabled>Claim donation</Button>
                    </span>
                )
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {disposalType === 'resale' ? `Buy this for ${formatPrice(price)}?` : 'Claim this donation?'}
                        </DialogTitle>
                        <DialogDescription>
                            {disposalType === 'resale'
                                ? "You'll be redirected to Flutterwave to complete payment."
                                : 'Select the organization claiming this donation.'}
                        </DialogDescription>
                    </DialogHeader>

                    {disposalType === 'donation' && userOrganizations.length > 0 && (
                        <div className="py-2">
                            <select
                                value={selectedOrgId}
                                onChange={(e) => setSelectedOrgId(e.target.value)}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                            >
                                {userOrganizations.map((org) => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        {disposalType === 'resale' ? (
                            <FlutterWaveButton
                                public_key={process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY ?? ''}
                                tx_ref={txRef}
                                amount={Number(price)}
                                currency="RWF"
                                payment_options="card, mobilemoney, ussd"
                                customer={{
                                    email: session?.user?.email ?? '',
                                    phone_number: '',
                                    name: session?.user?.name ?? '',
                                }}
                                customizations={{
                                    title: 'ReLoop',
                                    description: title,
                                    logo: '',
                                }}
                                callback={handleFlutterwaveCallback}
                                onClose={() => {}}
                                disabled={submitting}
                                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
                                text={submitting ? 'Confirming...' : 'Pay now'}
                            />
                        ) : (
                            <Button onClick={handleConfirm} disabled={submitting || !selectedOrgId}>
                                {submitting ? 'Confirming...' : 'Confirm'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}