'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { IconHeart } from '@tabler/icons-react';
import { useSession } from '@/lib/auth-client';
import { toggleFavorite } from '@/lib/mock';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
    listingId: string;
    initialFavorited?: boolean;
    className?: string;
}

export function FavoriteButton({ listingId, initialFavorited = false, className }: FavoriteButtonProps) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [favorited, setFavorited] = useState(initialFavorited);
    const [isTransitioning, startTransition] = useTransition();

    function handleClick(e: React.MouseEvent) {
        // Prevent bubbling into a parent Link (listing card navigation).
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        if (!session?.user) {
            router.push('/login');
            return;
        }

        // Optimistic update.
        const next = !favorited;
        setFavorited(next);

        startTransition(async () => {
            try {
                const result = await toggleFavorite(listingId);
                setFavorited(result.favorited);
            } catch {
                // Roll back on failure.
                setFavorited(!next);
            }
        });
    }

    return (
        <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleClick}
            disabled={isTransitioning}
            aria-pressed={favorited}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={cn('rounded-full', className)}
        >
            <IconHeart className={cn('size-4', favorited && 'fill-primary text-primary')} />
        </Button>
    );
}
