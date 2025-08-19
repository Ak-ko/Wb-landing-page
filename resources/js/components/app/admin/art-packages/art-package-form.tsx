import { ColorInput } from '@/components/common/color-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArtPackageT } from '@/types';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';

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
        text_color: artPackage?.text_color || '#ffffff',
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
        setData('prices', [...data.prices, { price: '', duration: '' }]);
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        placeholder="Select art package type"
                        options={types}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.value}
                        value={types.find((type) => type.value === data.type) || null}
                        onChange={(selectedOption) => {
                            setData('type', selectedOption?.value || '');
                        }}
                        className={cn(errors.type && 'border-red-500')}
                    />
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                </div>

                <ColorInput
                    label="Color"
                    backgroundColor={data.color}
                    textColor={data.text_color}
                    onBackgroundColorChange={(value) => setData('color', value)}
                    onTextColorChange={(value) => setData('text_color', value)}
                    backgroundColorError={errors.color}
                    textColorError={errors.text_color}
                />

                <div>
                    <Label>
                        Items <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={item.item}
                                    onChange={(e) => updateItemValue(index, e.target.value)}
                                    placeholder="Enter item"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                    disabled={data.items.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addItem} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                        {errors.items && <p className="mt-1 text-sm text-red-500">{errors.items}</p>}
                    </div>
                </div>

                <div>
                    <Label>
                        Prices <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                        {data.prices.map((price, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={price.price}
                                    onChange={(e) => updatePriceValue(index, 'price', e.target.value || '')}
                                    placeholder="Price"
                                    className="flex-1"
                                />
                                <Input
                                    value={price.duration}
                                    onChange={(e) => updatePriceValue(index, 'duration', e.target.value)}
                                    placeholder="Duration"
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removePrice(index)}
                                    disabled={data.prices.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addPrice} className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Price
                        </Button>
                        {errors.prices && <p className="mt-1 text-sm text-red-500">{errors.prices}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {artPackage ? 'Update' : 'Create'} Art Package
                </Button>
            </div>
        </form>
    );
}
