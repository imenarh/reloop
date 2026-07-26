import Link from 'next/link';
import {
    IconChevronDown,
    IconGift,
    IconPackage,
    IconShieldCheck,
    IconTag,
    IconTruckDelivery,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

const sellSteps = [
    'Take a few clear photos and describe the item honestly — size, condition, any wear.',
    'Set your price and publish. It appears in the relevant category instantly.',
    'A buyer orders and pays for shipping on top of your price — that part is never deducted from you.',
    'You package the item and drop it at a pickup point. The buyer can track it the whole way.',
    'Once the buyer confirms it matches the listing, your full asking price is released to you.',
];

const donateSteps = [
    'Take the same clear photos, but select "Donate" instead of setting a price.',
    'ReLoop reviews the photos to confirm the item is clean and usable.',
    'Once approved, we match it with one of our charity partners in Kigali.',
    'You drop it at the same pickup point sellers use — no separate process to learn.',
    "We handle delivery to the partner organization. You'll see which one received it.",
];

const infoCards = [
    {
        icon: IconShieldCheck,
        title: 'Payment protection',
        desc: 'Money from a sale sits with ReLoop until the buyer confirms the item arrived as described. Sellers never ship into the unknown, and buyers never pay for a surprise.',
    },
    {
        icon: IconTruckDelivery,
        title: 'Tracked shipping',
        desc: "Every sold item gets a tracking number the buyer can follow from pickup to delivery. Shipping is paid by the buyer, on top of the item's price.",
    },
    {
        icon: IconPackage,
        title: 'Condition checks',
        desc: "Donated items are reviewed before they're routed to a partner, so charities only receive things that are genuinely usable.",
    },
];

const faqs = [
    {
        q: 'How do I get paid after a sale?',
        a: 'Once your buyer confirms the item matches the listing, your full asking price is released to your ReLoop balance, which you can withdraw to mobile money or your bank account.',
    },
    {
        q: 'Can I change a listing from "Sell" to "Donate" later?',
        a: 'Yes — as long as no buyer has purchased it yet, you can switch a listing between selling and donating at any time from your dashboard.',
    },
    {
        q: 'Who pays for shipping?',
        a: "The buyer pays shipping on top of the item's price when they check out. Sellers are never charged for postage, and donations ship for free.",
    },
    {
        q: "What happens if my donated item isn't accepted?",
        a: "If an item doesn't pass our condition check, we'll let you know why and you can choose to collect it again or dispose of it responsibly.",
    },
    {
        q: 'Which charities does ReLoop work with?',
        a: 'Any organization approved through our vetting process can receive donations — you can see the current list of approved partners in the footer, and which one received your donation from your account.',
    },
];

export default function HowItWorks() {
    return (
        <>
            {/* HEADER */}
            <section className="border-b border-border py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-semibold text-primary">How ReLoop works</p>
                        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
                            From your closet to someone else&apos;s, step by step.
                        </h1>
                        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                            Every listing starts the exact same way. Where it ends up — a buyer&apos;s doorstep or
                            a charity partner&apos;s hands — is entirely up to you.
                        </p>
                    </div>
                </div>
            </section>

            {/* THE TWO PATHS */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-10 max-w-xl">
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                            Pick your path when you list.
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Both start with the same photos. Here&apos;s exactly what happens after that.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <PathCard
                            icon={IconTag}
                            title="Sell it"
                            intro="You set the price. ReLoop connects you with a buyer, handles tracking, and only releases your money once the sale is confirmed."
                            steps={sellSteps}
                            note="If an item doesn't match its description, the buyer can flag it before funds are released — that's what keeps sellers honest and buyers confident."
                        />
                        <PathCard
                            icon={IconGift}
                            title="Donate it"
                            intro="No price, no fees. You're clearing space and someone else is getting something they need."
                            steps={donateSteps}
                            note="Donated items are never resold by ReLoop or by our partners — they go directly to people who need them."
                        />
                    </div>
                </div>
            </section>

            {/* TRUST / LOGISTICS */}
            <section className="border-y border-border bg-muted/40 py-16">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-10 max-w-xl">
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                            Trust isn&apos;t automatic. We build it into every step.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {infoCards.map((card) => (
                            <div key={card.title} className="rounded-xl bg-background p-6 ring-1 ring-foreground/10">
                                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <card.icon className="size-5" />
                                </div>
                                <h3 className="font-heading text-lg font-semibold text-foreground">{card.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="mb-8 font-heading text-2xl font-semibold text-foreground">
                        Common questions
                    </h2>

                    <div className="flex flex-col gap-3">
                        {faqs.map((faq) => (
                            <details
                                key={faq.q}
                                className="group rounded-xl bg-background px-5 py-4 ring-1 ring-foreground/10"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                                    {faq.q}
                                    <IconChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border bg-muted/40 py-16">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
                        Ready to clear out your closet?
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Sell it, give it away, or a bit of both — the choice is yours every time you list.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Button size="lg" nativeButton={false} render={<Link href="/listings/new" />}>
                            List an item
                        </Button>
                        <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/listings" />}>
                            Browse listings
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

function PathCard({
    icon: Icon,
    title,
    intro,
    steps,
    note,
}: {
    icon: typeof IconTag;
    title: string;
    intro: string;
    steps: string[];
    note: string;
}) {
    return (
        <div className="rounded-xl bg-background p-6 ring-1 ring-foreground/10 md:p-8">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">{intro}</p>
            <ol className="flex flex-col gap-3">
                {steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-sm">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold tabular-nums text-primary-foreground">
                            {i + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                    </li>
                ))}
            </ol>
            <p className="mt-6 border-t border-dashed border-border pt-5 text-sm text-muted-foreground italic">
                {note}
            </p>
        </div>
    );
}
