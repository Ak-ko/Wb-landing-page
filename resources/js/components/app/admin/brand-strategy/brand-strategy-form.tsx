/* eslint-disable @typescript-eslint/no-explicit-any */

import SortableList from '@/components/common/sortable-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateNestedOrderNumbers, updateOrderNumbers } from '@/lib/sort-utils';
import { BrandStrategyT } from '@/types';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface SortableItem {
    id?: number | string;
    order: number | null;
    [key: string]: unknown;
}

interface BrandStrategyElementForm extends SortableItem {
    title: string;
    items: BrandStrategyElementItemForm[];
}

interface BrandStrategyElementItemForm extends SortableItem {
    title: string;
}

interface BrandStrategyFormProps {
    strategy?: BrandStrategyT;
}

export default function BrandStrategyForm({ strategy }: BrandStrategyFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: strategy?.title || '',
        description: strategy?.description || '',
        elements:
            strategy?.elements?.map((el) => ({
                id: el.id,
                title: el.title,
                order: el.order,
                items:
                    el.items?.map((item) => ({
                        id: item.id,
                        title: item.title,
                        order: item.order,
                    })) || [],
            })) || [],
    } as any);

    const addElement = () => {
        setData('elements', [...data.elements, { title: '', order: null, items: [] }]);
    };
    const removeElement = (idx: number) => {
        const updated = [...data.elements];
        updated.splice(idx, 1);
        // Update order numbers after removal
        const reorderedElements = updateNestedOrderNumbers(updated);
        setData('elements', reorderedElements);
    };
    const addItem = (elementIdx: number) => {
        const updated = [...data.elements];
        updated[elementIdx].items.push({ title: '', order: null });
        // Update order numbers for items in this element
        updated[elementIdx].items = updateOrderNumbers(updated[elementIdx].items);
        setData('elements', updated);
    };
    const removeItem = (elementIdx: number, itemIdx: number) => {
        const updated = [...data.elements];
        updated[elementIdx].items.splice(itemIdx, 1);
        // Update order numbers for items in this element
        updated[elementIdx].items = updateOrderNumbers(updated[elementIdx].items);
        setData('elements', updated);
    };

    // Handle reordering of elements
    const handleElementsReorder = (newElements: BrandStrategyElementForm[]) => {
        const reorderedElements = updateNestedOrderNumbers(newElements);
        setData('elements', reorderedElements);
    };

    // Handle reordering of items within an element
    const handleItemsReorder = (elementIdx: number, newItems: BrandStrategyElementItemForm[]) => {
        const updated = [...data.elements];
        updated[elementIdx].items = updateOrderNumbers(newItems);
        setData('elements', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = strategy ? route('brand-strategies.update', strategy.id) : route('brand-strategies.store');
        if (strategy) {
            put(url);
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Strategy Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description
                        </label>
                        <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                </div>
            </fieldset>
            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Subtitles</legend>
                <SortableList<BrandStrategyElementForm>
                    items={data.elements}
                    onReorder={handleElementsReorder}
                    className="space-y-4"
                    itemClassName="mb-4 rounded-lg border p-4 bg-white"
                    renderItem={(element, idx) => (
                        <div className="w-full">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    placeholder="eg: 1"
                                    value={element.order ?? ''}
                                    onChange={(e) => {
                                        const updated = [...data.elements];
                                        updated[idx].order = e.target.value ? Number(e.target.value) : null;
                                        setData('elements', updated);
                                    }}
                                    containerClassName="w-24"
                                />
                                <Input
                                    placeholder="Subtitle"
                                    value={element.title}
                                    onChange={(e) => {
                                        const updated = [...data.elements];
                                        updated[idx].title = e.target.value;
                                        setData('elements', updated);
                                    }}
                                    className="flex-1"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeElement(idx)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="my-5 ml-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Items</span>
                                    <Button type="button" size="sm" onClick={() => addItem(idx)}>
                                        <Plus className="h-4 w-4" /> Add Item
                                    </Button>
                                </div>
                                <SortableList<BrandStrategyElementItemForm>
                                    items={element.items}
                                    onReorder={(newItems) => handleItemsReorder(idx, newItems)}
                                    className="mt-2 space-y-2"
                                    itemClassName="flex items-center gap-2"
                                    renderItem={(item, itemIdx) => (
                                        <>
                                            <Input
                                                type="number"
                                                placeholder="eg: 1.1"
                                                value={item.order ?? ''}
                                                onChange={(e) => {
                                                    const updated = [...data.elements];
                                                    updated[idx].items[itemIdx].order = e.target.value ? Number(e.target.value) : null;
                                                    setData('elements', updated);
                                                }}
                                                containerClassName="w-24"
                                            />
                                            <Input
                                                placeholder="Item Title"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updated = [...data.elements];
                                                    updated[idx].items[itemIdx].title = e.target.value;
                                                    setData('elements', updated);
                                                }}
                                                className="flex-1"
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx, itemIdx)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    )}
                />
                <Button type="button" onClick={addElement} className="mt-2">
                    <Plus className="h-4 w-4" /> Add Subtitle
                </Button>
            </fieldset>
            {errors.elements && <p className="text-sm text-red-500">{errors.elements}</p>}
            <Button type="submit" disabled={processing}>
                {strategy ? 'Update Strategy' : 'Create Strategy'}
            </Button>
        </form>
    );
}
