'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconGift, IconTag } from '@tabler/icons-react';
import { listCategories } from '@/lib/mock';
import { createListing, updateListing } from '@/lib/mock';
import { useImageUpload } from '@/hooks/use-image-upload';
import { ActionError } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Combobox,
    ComboboxContent,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox';
import { Card, CardContent } from '@/components/ui/card';

type Condition = 'new' | 'like_new' | 'good' | 'fair' | 'worn';
type DisposalType = 'resale' | 'donation';

interface ExistingListing {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    condition: Condition;
    disposalType: DisposalType;
    price: string | null;
    images: { url: string }[];
}

interface ListingFormProps {
    existingListing?: ExistingListing;
}

const conditionOptions: { value: Condition; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like new' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'worn', label: 'Worn' },
];

export function ListingForm({ existingListing }: ListingFormProps) {
    const router = useRouter();
    const { upload, uploading, progress } = useImageUpload();

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [title, setTitle] = useState(existingListing?.title ?? '');
    const [description, setDescription] = useState(existingListing?.description ?? '');
    const [categoryId, setCategoryId] = useState(existingListing?.categoryId ?? '');
    const [condition, setCondition] = useState<Condition>(existingListing?.condition ?? 'good');
    const [disposalType, setDisposalType] = useState<DisposalType>(existingListing?.disposalType ?? 'resale');
    const [price, setPrice] = useState(existingListing?.price ?? '');
    const [files, setFiles] = useState<File[]>([]);
    const [touchedImages, setTouchedImages] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        listCategories().then(setCategories).catch(() => setGeneralError('Could not load categories.'));
    }, []);

    function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files ?? []);
        setTouchedImages(true);
        if (selected.length > 8) {
            setGeneralError('You can upload at most 8 images.');
            return;
        }
        setGeneralError(null);
        setFiles(selected);
    }

    function validate(): boolean {
        const next: Record<string, string> = {};
        if (title.trim().length < 3) next.title = 'Title must be at least 3 characters.';
        if (description.trim().length < 10) next.description = 'Description must be at least 10 characters.';
        if (!categoryId) next.categoryId = 'Choose a category.';
        if (disposalType === 'resale') {
            const numeric = Number(price);
            if (!price || Number.isNaN(numeric) || numeric <= 0) {
                next.price = 'Enter a price greater than 0.';
            }
        }
        if (!existingListing && files.length === 0) {
            next.images = 'At least one image is required.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setGeneralError(null);
        if (!validate()) return;

        setSubmitting(true);
        try {
            let imageUrls: string[] | undefined;
            if (files.length > 0) {
                imageUrls = await upload(files);
            }

            if (existingListing) {
                const payload: Record<string, unknown> = {
                    title,
                    description,
                    categoryId,
                    condition,
                    disposalType,
                    price: disposalType === 'resale' ? price : null,
                };
                // Only touch imageUrls if the user actually picked new files.
                if (touchedImages && imageUrls) {
                    (payload as { imageUrls?: string[] }).imageUrls = imageUrls;
                }
                await updateListing(existingListing.id, payload);
                toast.success('Listing updated.');
                router.push(`/listings/${existingListing.id}`);
            } else {
                const result = await createListing({
                    title,
                    description,
                    categoryId,
                    condition,
                    disposalType,
                    price: disposalType === 'resale' ? price : undefined,
                    imageUrls: imageUrls ?? [],
                });
                toast.success('Listing created.');
                router.push(`/listings/${result.id}`);
            }
        } catch (err) {
            if (err instanceof ActionError) {
                setGeneralError(err.message);
            } else if (err instanceof Error) {
                setGeneralError(err.message);
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    const busy = submitting || uploading;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {generalError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {generalError}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={2000}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label>Category</Label>
                    <Combobox
                        items={categories}
                        value={categories.find((c) => c.id === categoryId) ?? null}
                        onValueChange={(c) => setCategoryId(c?.id ?? '')}
                        itemToStringLabel={(c) => c.name}
                    >
                        <ComboboxTrigger className="inline-flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm">
                            <ComboboxValue placeholder="Select a category" />
                        </ComboboxTrigger>
                        <ComboboxContent>
                            <ComboboxList>
                                {(item: { id: string; name: string }) => (
                                    <ComboboxItem key={item.id} value={item}>
                                        {item.name}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                    {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Condition</Label>
                    <Combobox
                        items={conditionOptions}
                        value={conditionOptions.find((o) => o.value === condition) ?? null}
                        onValueChange={(o) => o && setCondition(o.value)}
                        itemToStringLabel={(o) => o.label}
                    >
                        <ComboboxTrigger className="inline-flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm">
                            <ComboboxValue placeholder="Select condition" />
                        </ComboboxTrigger>
                        <ComboboxContent>
                            <ComboboxList>
                                {(item: { value: Condition; label: string }) => (
                                    <ComboboxItem key={item.value} value={item}>
                                        {item.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Listing type</Label>
                <RadioGroup
                    value={disposalType}
                    onValueChange={(v) => v && setDisposalType(v as DisposalType)}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                    {[
                        {
                            value: 'resale' as const,
                            icon: IconTag,
                            title: 'Sell it',
                            desc: 'Set a price — the buyer pays shipping on top.',
                        },
                        {
                            value: 'donation' as const,
                            icon: IconGift,
                            title: 'Donate it',
                            desc: 'Free — we route it to a charity partner.',
                        },
                    ].map((opt) => {
                        const selected = disposalType === opt.value;
                        return (
                            <label
                                key={opt.value}
                                className={cn(
                                    'flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors',
                                    selected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-foreground/25'
                                )}
                            >
                                <span className="mb-1 flex items-center justify-between">
                                    <opt.icon
                                        className={cn(
                                            'size-5',
                                            selected ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                    />
                                    <RadioGroupItem value={opt.value} />
                                </span>
                                <span className="text-sm font-semibold text-foreground">{opt.title}</span>
                                <span className="text-xs text-muted-foreground">{opt.desc}</span>
                            </label>
                        );
                    })}
                </RadioGroup>
            </div>

            {disposalType === 'resale' && (
                <div className="flex flex-col gap-2">
                    <Label htmlFor="price">Price (RWF)</Label>
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        step="100"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 5000"
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="images">Photos {existingListing ? '(leave empty to keep current photos)' : ''}</Label>
                <Input id="images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFilesChange} />
                {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}

                {uploading && (
                    <p className="text-xs text-muted-foreground">
                        Uploading {progress.completed}/{progress.total}...
                    </p>
                )}

                {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3">
                        {files.map((file, i) => (
                            <Card key={i} className="w-24 overflow-hidden rounded-lg border border-border p-0">
                                <CardContent className="p-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="aspect-square w-full object-cover"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {existingListing && existingListing.images.length > 0 && !touchedImages && (
                    <div className="mt-2 flex flex-wrap gap-3">
                        {existingListing.images.map((img, i) => (
                            <Card key={i} className="w-24 overflow-hidden rounded-lg border border-border p-0">
                                <CardContent className="p-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" disabled={busy} size="lg" className="self-start">
                {busy ? 'Saving...' : existingListing ? 'Save changes' : 'Publish listing'}
            </Button>
        </form>
    );
}
