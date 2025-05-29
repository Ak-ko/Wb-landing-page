import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BusinessPackageT } from '@/types';
import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface BusinessPackageFormProps {
    businessPackage?: BusinessPackageT;
    onSuccess: () => void;
}

export default function BusinessPackageForm({ businessPackage, onSuccess }: BusinessPackageFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: businessPackage?.name || '',
        description: businessPackage?.description || '',
        price_text: businessPackage?.price_text || '',
        currency: businessPackage?.currency || 'USD',
        duration: businessPackage?.duration || '',
        revision_remarks: businessPackage?.revision_remarks || '',
        items: businessPackage?.business_package_items?.map((item) => ({ name: item.name })) || [],
    });

    const addItem = () => {
        setData('items', [...data.items, { name: '' }]);
    };

    const removeItem = (index: number) => {
        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const updateItemName = (index: number, name: string) => {
        const updatedItems = [...data.items];
        updatedItems[index].name = name;
        setData('items', updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = businessPackage ? route('business-packages.update', businessPackage.id) : route('business-packages.store');

        if (businessPackage) {
            put(url, {
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            post(url, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Package Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Package Name <span className="text-red-500">*</span>
                        </label>
                        <Input id="name" placeholder="Enter package name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price_text" className="block text-sm font-medium">
                            Price <small>( can put range also )</small>
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="price_text"
                            placeholder="e.g. Starting from"
                            value={data.price_text}
                            onChange={(e) => setData('price_text', e.target.value)}
                        />
                        {errors.price_text && <p className="text-sm text-red-500">{errors.price_text}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium">
                            Currency<span className="text-red-500">*</span>
                        </label>
                        <Input id="currency" placeholder="e.g. USD" value={data.currency} onChange={(e) => setData('currency', e.target.value)} />
                        {errors.currency && <p className="text-sm text-red-500">{errors.currency}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="duration" className="block text-sm font-medium">
                            Duration<span className="text-red-500">*</span>
                        </label>
                        <Input id="duration" placeholder="e.g. 2 weeks" value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                        {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium">
                            Description<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Enter package description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="revision_remarks" className="block text-sm font-medium">
                            Revision Remarks<span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="revision_remarks"
                            placeholder="Enter revision remarks"
                            value={data.revision_remarks}
                            onChange={(e) => setData('revision_remarks', e.target.value)}
                            rows={2}
                        />
                        {errors.revision_remarks && <p className="text-sm text-red-500">{errors.revision_remarks}</p>}
                    </div>
                </div>
            </fieldset>

            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">
                    Package Items<span className="text-red-500">*</span>
                    {errors.items && <p className="text-sm font-normal text-red-500">{errors.items}</p>}
                </legend>
                <div className="space-y-4">
                    {data.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                                <Label htmlFor={`item-${index}`} className="sr-only">
                                    Item {index + 1}
                                </Label>
                                <Input
                                    id={`item-${index}`}
                                    placeholder="Enter item name"
                                    value={item.name}
                                    onChange={(e) => updateItemName(index, e.target.value)}
                                />
                                {/* @ts-expect-error @ts-ignore */}
                                {errors[`items.${index}.name`] && <p className="text-sm text-red-500">{errors[`items.${index}.name`]}</p>}
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addItem} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>
            </fieldset>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {businessPackage ? 'Update Package' : 'Create Package'}
                </Button>
            </div>
        </form>
    );
}
