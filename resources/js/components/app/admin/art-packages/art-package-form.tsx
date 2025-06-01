import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArtPackageT } from '@/types';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import ColorSuggestions from '../../color-suggestions';

interface ArtPackageFormProps {
    package?: ArtPackageT;
    types: { name: string; value: string }[];
    onSuccess: () => void;
}

export default function ArtPackageForm({ package: artPackage, types, onSuccess }: ArtPackageFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: artPackage?.title || '',
        type: artPackage?.type || '',
        color: artPackage?.color || '',
        items: artPackage?.items?.map((item) => ({ item: item.item })) || [],
        prices: artPackage?.prices?.map((price) => ({ price: price.price, duration: price.duration })) || [],
    });

    const addItem = () => {
        setData('items', [...data.items, { item: '' }]);
    };

    const removeItem = (index: number) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const updateItemValue = (index: number, item: string) => {
        const updatedItems = [...data.items];
        updatedItems[index].item = item;
        setData('items', updatedItems);
    };

    const addPrice = () => {
        setData('prices', [...data.prices, { price: 0, duration: '' }]);
    };

    const removePrice = (index: number) => {
        const updatedPrices = [...data.prices];
        updatedPrices.splice(index, 1);
        setData('prices', updatedPrices);
    };

    const updatePriceValue = (index: number, field: 'price' | 'duration', value: string | number) => {
        const updatedPrices = [...data.prices];
        // @ts-expect-error @ts-ignore
        updatedPrices[index][field] = value;
        setData('prices', updatedPrices);
    };

    const handleColorSelect = (color: string) => {
        setData('color', color);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (artPackage) {
            put(route('art-packages.update', artPackage.id), {
                onSuccess,
            });
        } else {
            post(route('art-packages.store'), {
                onSuccess,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">
                        Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={cn(errors.title && 'border-red-500')}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                    <Label htmlFor="type">
                        Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        id="type"
                        options={types}
                        getOptionLabel={(o) => o.name}
                        getOptionValue={(o) => o.value}
                        value={types.find((option) => option.value === data.type) || null}
                        onChange={(option) => setData('type', option ? option.value : '')}
                        classNamePrefix="react-select"
                        className="rounded-2xl border-0 shadow-xs"
                        placeholder="Select a type"
                        isClearable
                    />
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                </div>

                <div>
                    <Label htmlFor="color">
                        Color <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="color"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className={cn(errors.color && 'border-red-500')}
                        />
                        <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: data.color || '#ffffff' }}></div>
                        <ColorSuggestions onColorSelect={handleColorSelect} />
                    </div>
                    {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color}</p>}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <Label>
                            Items <span className="text-red-500">*</span>
                        </Label>
                        <Button type="button" variant="outline" size="sm" onClick={addItem}>
                            <Plus className="mr-1 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                    {data.items.length === 0 && <p className="text-sm text-gray-500">No items added yet. Click "Add Item" to add one.</p>}
                    {data.items.map((item, index) => (
                        <div key={index} className="mb-2 flex items-center gap-2">
                            <Input
                                value={item.item}
                                onChange={(e) => updateItemValue(index, e.target.value)}
                                placeholder="Item description"
                                // @ts-expect-error @ts-ignore
                                className={cn(errors[`items.${index}.item`] && 'border-red-500')}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={data.items.length <= 1}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {errors.items && <p className="mt-1 text-sm text-red-500">{errors.items}</p>}
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <Label>
                            Prices <span className="text-red-500">*</span>
                        </Label>
                        <Button type="button" variant="outline" size="sm" onClick={addPrice}>
                            <Plus className="mr-1 h-4 w-4" /> Add Price Option
                        </Button>
                    </div>
                    {data.prices.length === 0 && (
                        <p className="text-sm text-gray-500">No price options added yet. Click "Add Price Option" to add one.</p>
                    )}
                    {data.prices.map((price, index) => (
                        <div key={index} className="mb-2 grid grid-cols-12 gap-2">
                            <div className="col-span-5">
                                <Input
                                    type="text"
                                    value={price.price}
                                    onChange={(e) => updatePriceValue(index, 'price', e.target.value)}
                                    placeholder="Price"
                                    // @ts-expect-error @ts-ignore
                                    className={cn(errors[`prices.${index}.price`] && 'border-red-500')}
                                />
                            </div>
                            <div className="col-span-6">
                                <Input
                                    value={price.duration}
                                    onChange={(e) => updatePriceValue(index, 'duration', e.target.value)}
                                    placeholder="Duration (e.g., 'per month')"
                                    // @ts-expect-error @ts-ignore
                                    className={cn(errors[`prices.${index}.duration`] && 'border-red-500')}
                                />
                            </div>
                            <div className="col-span-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePrice(index)}
                                    disabled={data.prices.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {errors.prices && <p className="mt-1 text-sm text-red-500">{errors.prices}</p>}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {artPackage ? 'Update' : 'Create'} Art Package
                </Button>
            </div>
        </form>
    );
}
