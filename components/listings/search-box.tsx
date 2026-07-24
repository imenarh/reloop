'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
    defaultValue?: string;
    className?: string;
    placeholder?: string;
}

/**
 * Submit-based search: navigates to /listings?q=... on Enter, so the
 * server runs exactly one query per search — nothing per keystroke.
 */
export function SearchBox({ defaultValue = '', className, placeholder = 'Search listings' }: SearchBoxProps) {
    const router = useRouter();
    const [term, setTerm] = useState(defaultValue);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const q = term.trim();
        router.push(q ? `/listings?q=${encodeURIComponent(q)}` : '/listings');
    }

    return (
        <form onSubmit={handleSubmit} role="search" className={cn('relative', className)}>
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="pl-9"
            />
        </form>
    );
}
