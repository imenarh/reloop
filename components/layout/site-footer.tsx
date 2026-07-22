import Link from 'next/link';
import { listApprovedOrganizations } from '@/lib/mock';

const MARKETPLACE_LINKS = [
    { href: '/listings', label: 'Browse listings' },
    { href: '/listings/new', label: 'Sell an item' },
    { href: '/listings/new', label: 'Donate an item' },
    { href: '/how-it-works', label: 'How it works' },
];

const ACCOUNT_LINKS = [
    { href: '/login', label: 'Log in' },
    { href: '/listings/mine', label: 'My listings' },
];

export async function SiteFooter() {
    const organizations = await listApprovedOrganizations();

    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-heading text-xl font-bold text-foreground"
                        >
                            <span className="inline-block size-2.5 rounded-full bg-primary" />
                            ReLoop
                        </Link>
                        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                            A Kigali-born marketplace for second-hand clothes, shoes, furniture and accessories —
                            sold or given, your choice.
                        </p>
                    </div>

                    <nav aria-label="Marketplace">
                        <h4 className="mb-3 text-sm font-semibold text-foreground">Marketplace</h4>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {MARKETPLACE_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-foreground">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Account">
                        <h4 className="mb-3 text-sm font-semibold text-foreground">Account</h4>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {ACCOUNT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition-colors hover:text-foreground">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {organizations.length > 0 && (
                    <div className="mt-12 border-t border-border pt-8">
                        <h4 className="mb-5 text-center text-sm font-semibold text-foreground">
                            Donations are delivered through our charity partners
                        </h4>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {organizations.map((org) =>
                                org.logoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={org.id}
                                        className="h-11 max-w-40 rounded-lg border border-border bg-background object-contain px-4 py-2"
                                        src={org.logoUrl}
                                        alt={org.name}
                                    />
                                ) : (
                                    <span
                                        key={org.id}
                                        className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
                                    >
                                        {org.name}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ReLoop · Made in Kigali, Rwanda
                </div>
            </div>
        </footer>
    );
}
