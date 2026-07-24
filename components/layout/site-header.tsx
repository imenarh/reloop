'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconMenu2, IconRecycle } from '@tabler/icons-react';
import { authClient, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { href: '/listings', label: 'Listings' },
    { href: '/how-it-works', label: 'How it works' },
];

function initialsFromName(name?: string | null) {
    if (!name) return '?';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export function SiteHeader() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    async function handleLogout() {
        await authClient.signOut();
        router.push('/');
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-heading text-xl font-bold text-foreground"
                >
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <IconRecycle className="size-4.5" strokeWidth={2.25} />
                    </span>
                    ReLoop
                </Link>

                <div className="flex items-center gap-2">
                    <div className="mr-2 hidden items-center gap-1 md:flex">
                        {NAV_LINKS.map((link) => {
                            const active = pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <Button size="sm" nativeButton={false} render={<Link href="/listings/new" />}>
                        List an item
                    </Button>

                    {isPending ? null : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar>
                                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ''} />
                                    <AvatarFallback>{initialsFromName(session.user.name)}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem render={<Link href="/listings/mine" />}>
                                    My listings
                                </DropdownMenuItem>
                                <DropdownMenuItem render={<Link href="/orders" />}>
                                    Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem render={<Link href="/favorites" />}>
                                    Favorites
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/login" />}>
                            Log in
                        </Button>
                    )}

                    {/* Mobile nav */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={<Button size="icon-sm" variant="ghost" className="md:hidden" aria-label="Open menu" />}
                        >
                            <IconMenu2 className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {NAV_LINKS.map((link) => (
                                <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                                    {link.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}
