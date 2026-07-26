'use client';

import Link from 'next/link';
import { Suspense, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Step = 'email' | 'code';

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}

function LoginForm() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    async function sendCode(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: 'sign-in',
        });
        setLoading(false);
        if (sendError) {
            setError(sendError.message ?? 'Could not send a code. Please try again.');
            return;
        }
        setStep('code');
    }

    async function verifyCode(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { data, error: verifyError } = await authClient.signIn.emailOtp({
            email,
            otp: code,
        });
        setLoading(false);
        if (verifyError) {
            setError(verifyError.message ?? 'Invalid or expired code. Please try again.');
            return;
        }

        const redirect = searchParams.get('redirect');
        const needsOnboarding = !data?.user || !('onboardedAt' in data.user) || !(data.user as { onboardedAt?: string | null }).onboardedAt;
        if (needsOnboarding) {
            router.push('/onboarding');
        } else {
            router.push(redirect || '/');
        }
        router.refresh();
    }

    async function resendCode() {
        setError('');
        setLoading(true);
        const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: 'sign-in',
        });
        setLoading(false);
        if (sendError) {
            setError(sendError.message ?? 'Could not resend the code. Please try again.');
        }
    }

    return (
        <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted/30 px-4 py-16">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="mb-2 text-sm font-semibold text-primary">
                        {step === 'email' ? 'Welcome' : 'Check your email'}
                    </div>
                    <CardTitle className="text-2xl">
                        {step === 'email' ? 'Log in to ReLoop' : 'Enter your code'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'email'
                            ? "We'll email you a one-time code — no password needed."
                            : `We sent a 6-digit code to ${email}.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {step === 'email' ? (
                        <form onSubmit={sendCode} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Sending…' : 'Send code'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={verifyCode} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="code">Verification code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    placeholder="123456"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Verifying…' : 'Verify'}
                            </Button>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <button
                                    type="button"
                                    className="font-semibold text-primary hover:underline"
                                    onClick={() => {
                                        setStep('email');
                                        setCode('');
                                        setError('');
                                    }}
                                >
                                    Use a different email
                                </button>
                                <button
                                    type="button"
                                    className="font-semibold text-primary hover:underline"
                                    onClick={resendCode}
                                    disabled={loading}
                                >
                                    Resend code
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <Link href="/" className="hover:underline">
                            Back to ReLoop
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
