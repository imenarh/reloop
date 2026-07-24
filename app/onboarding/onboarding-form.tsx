'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { completeOnboarding } from '@/lib/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    defaultName: string;
    defaultBio: string;
    defaultImage: string | null;
};

export function OnboardingForm({ defaultName, defaultBio, defaultImage }: Props) {
    const [name, setName] = useState(defaultName);
    const [bio, setBio] = useState(defaultBio);
    const [imageUrl, setImageUrl] = useState<string | null>(defaultImage);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');
        try {
            const presignRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    contentLength: file.size,
                }),
            });

            if (!presignRes.ok) {
                const body = await presignRes.json().catch(() => ({}));
                throw new Error(body.message ?? 'Could not prepare photo upload.');
            }

            const { uploadUrl, publicUrl } = await presignRes.json();

            const putRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            if (!putRes.ok) {
                throw new Error('Photo upload failed. Please try again.');
            }

            setImageUrl(publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Photo upload failed.');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await completeOnboarding({ name, image: imageUrl, bio: bio || undefined });
            toast.success('Welcome to ReLoop!');
            router.push('/');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save your profile.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="mb-2 text-sm font-semibold text-primary">One last step</div>
                <CardTitle className="text-2xl">Set up your profile</CardTitle>
                <CardDescription>Tell the ReLoop community a little about you.</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                        <Avatar size="lg">
                            <AvatarImage src={imageUrl ?? undefined} alt={name} />
                            <AvatarFallback>{name ? name[0]?.toUpperCase() : '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="photo">Photo (optional)</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            minLength={2}
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bio">Bio (optional)</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            maxLength={500}
                            placeholder="What are you hoping to sell or donate?"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={submitting || uploading} className="w-full">
                        {submitting ? 'Saving…' : 'Finish setup'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
