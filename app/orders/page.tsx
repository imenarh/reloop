import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/lib/mock';
import { requireUser } from '@/lib/mock';
import { ActionError } from '@/lib/errors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/components/listings/types';

const paymentLabels: Record<string, string> = {
    mock_paid: 'Paid',
    pending: 'Pending',
    completed: 'Completed',
};

const paymentStyles: Record<string, string> = {
    mock_paid: 'bg-primary/10 text-primary',
    pending: 'bg-muted text-muted-foreground',
    completed: 'bg-foreground text-background',
};

export default async function OrdersPage() {
    let currentUser;
    try {
        currentUser = await requireUser();
    } catch (err) {
        if (err instanceof ActionError) redirect('/login?redirect=/orders');
        throw err;
    }

    const orders = await getUserOrders();

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground">Orders</h1>
                    <p className="text-sm tabular-nums text-muted-foreground">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
                        <p className="font-heading text-lg text-foreground">No orders yet.</p>
                        <p className="text-sm text-muted-foreground">
                            When you buy or claim an item, it&apos;ll show up here.
                        </p>
                        <Button nativeButton={false} render={<Link href="/listings" />} className="mt-2">
                            Browse listings
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => {
                            const isBuyer = order.buyerId === currentUser.id;
                            return (
                                <Link
                                    key={order.id}
                                    href={`/listings/${order.listingId}`}
                                    className="flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-medium text-foreground">
                                            {order.listing?.title ?? 'Untitled listing'}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {isBuyer ? 'You purchased' : 'You sold'} &middot;{' '}
                                            {order.type === 'donation_claim' ? 'Donation claim' : 'Purchase'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {order.amount && (
                                            <span className="text-sm font-semibold tabular-nums text-foreground">
                                                {formatPrice(order.amount)}
                                            </span>
                                        )}
                                        <Badge className={paymentStyles[order.paymentStatus] ?? ''}>
                                            {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
                                        </Badge>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
