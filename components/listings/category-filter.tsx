'use client';

import { useRouter } from 'next/navigation';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox';

interface Category {
    id: string;
    name: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory?: string;
    type?: string;
    query?: string;
}

const ALL: Category = { id: 'all', name: 'All categories' };

export function CategoryFilter({ categories, selectedCategory, type, query }: CategoryFilterProps) {
    const router = useRouter();
    const items = [ALL, ...categories];
    const selected = items.find((c) => c.id === (selectedCategory ?? 'all')) ?? ALL;

    function handleChange(category: Category | null) {
        const params = new URLSearchParams();
        if (category && category.id !== 'all') params.set('category', category.id);
        if (type) params.set('type', type);
        if (query) params.set('q', query);
        const qs = params.toString();
        router.push(qs ? `/listings?${qs}` : '/listings');
    }

    return (
        <Combobox
            items={items}
            value={selected}
            onValueChange={handleChange}
            itemToStringLabel={(c: Category) => c.name}
        >
            <ComboboxTrigger className="inline-flex h-9 w-40 cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm">
                <ComboboxValue placeholder="All categories" />
            </ComboboxTrigger>
            <ComboboxContent>
                <ComboboxEmpty>No categories.</ComboboxEmpty>
                <ComboboxList>
                    {(item: Category) => (
                        <ComboboxItem key={item.id} value={item}>
                            {item.name}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
