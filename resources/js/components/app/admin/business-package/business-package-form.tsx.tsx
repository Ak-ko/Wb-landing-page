import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BrandStrategyT, BusinessBrandGuidelineT, BusinessPackageT } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import Select from 'react-select';
import ColorSuggestions from '../../color-suggestions';

interface BusinessPackageWithStrategyT extends BusinessPackageT {
    brand_strategy?: {
        id: number;
        title: string;
    };
}

interface BusinessPackageItemWithLinkT {
    name: string;
    is_included: boolean;
    detail_link: string;
}

interface BusinessPackageFormProps {
    businessPackage?: BusinessPackageWithStrategyT;
    onSuccess: () => void;
}

export default function BusinessPackageForm({ businessPackage, onSuccess }: BusinessPackageFormProps) {
    const { businessBrandGuidelines, brandStrategies } = usePage<{
        businessBrandGuidelines: BusinessBrandGuidelineT[];
        brandStrategies: BrandStrategyT[];
    }>().props;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: businessPackage?.name || '',
        description: businessPackage?.description || '',
        price_text: businessPackage?.price_text || '',
        price: 0,
        currency: 'USD',
        durations: businessPackage?.durations?.map((duration) => ({
            duration: duration.duration,
            duration_remarks: duration.duration_remarks,
        })) || [{ duration: '', duration_remarks: '' }],
        items:
            businessPackage?.business_package_items?.map((item) => ({
                name: item.name,
                is_included: item.is_included ?? true,
                detail_link: 'detail_link' in item ? ((item as Record<string, unknown>).detail_link as string) || '' : '',
            })) || [],
        color: businessPackage?.color || '#000000',
        is_recommended: businessPackage?.is_recommended || false,
        is_discount: businessPackage?.is_discount || false,
        discount_price_text: businessPackage?.is_discount ? businessPackage?.discount_price_text || '' : '',
        discount_description: businessPackage?.is_discount ? businessPackage?.discount_description || '' : '',
        discount_end_date: businessPackage?.is_discount ? businessPackage?.discount_end_date || '' : '',
        business_brand_guideline_id: businessBrandGuidelines?.filter((g) => g?.id === businessPackage?.brand_guideline?.id)[0]?.id || null,
        brand_strategy_id: businessPackage?.brand_strategy?.id || null,
    });

    const errorMap = errors as Record<string, string>;

    const addItem = () => {
        setData('items', [...data.items, { name: '', is_included: true, detail_link: '' } as BusinessPackageItemWithLinkT]);
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

    const updateItemDetailLink = (index: number, link: string) => {
        const updatedItems = [...data.items];
        updatedItems[index].detail_link = link;
        setData('items', updatedItems);
    };

    const addDuration = () => {
        setData('durations', [...data.durations, { duration: '', duration_remarks: '' }]);
    };

    const removeDuration = (index: number) => {
        const updatedDurations = [...data.durations];
        updatedDurations.splice(index, 1);
        setData('durations', updatedDurations);
    };

    const updateDuration = (index: number, field: 'duration' | 'duration_remarks', value: string) => {
        const updatedDurations = [...data.durations];
        updatedDurations[index][field] = value;
        setData('durations', updatedDurations);
    };

    const handleColorSelect = (color: string) => {
        setData('color', color);
    };

    const handleDiscountToggle = (checked: boolean) => {
        setData('is_discount', checked);
        if (!checked) {
            // Clear discount fields when discount is disabled
            setData('discount_price_text', '');
            setData('discount_description', '');
            setData('discount_end_date', '');
        }
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
                        {errorMap.name && <p className="text-sm text-red-500">{errorMap.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price_text" className="block text-sm font-medium">
                            Price Text <small>( can put range also )</small>
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="price_text"
                            placeholder="e.g. Starting from"
                            value={data.price_text}
                            onChange={(e) => setData('price_text', e.target.value)}
                        />
                        {errorMap.price_text && <p className="text-sm text-red-500">{errorMap.price_text}</p>}
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
                        {errorMap.description && <p className="text-sm text-red-500">{errorMap.description}</p>}
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label htmlFor="color" className="block text-sm font-medium">
                            Package Color<span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="color"
                                type="color"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                className="h-10 w-20"
                            />
                            <Input
                                type="text"
                                value={data.color}
                                onChange={(e) => setData('color', e.target.value)}
                                placeholder="#HEX color"
                                className="flex-1"
                            />
                            <ColorSuggestions onColorSelect={handleColorSelect} />
                        </div>
                        <p className="text-xs text-gray-500">Choose a color or select from suggestions</p>
                        {errorMap.color && <p className="text-sm text-red-500">{errorMap.color}</p>}
                    </div>

                    <div className="col-span-2 flex items-center space-x-2">
                        <Switch
                            id="is_recommended"
                            checked={data.is_recommended}
                            onCheckedChange={(checked) => {
                                setData('is_recommended', checked);
                            }}
                        />
                        <Label htmlFor="is_recommended" className={cn(data?.is_recommended && 'text-green-500', 'block text-sm font-medium')}>
                            {data?.is_recommended ? 'Recommended' : 'Not Recommended'}
                            <span className="text-red-500">*</span>
                        </Label>
                        {errorMap.is_recommended && <p className="text-sm text-red-500">{errorMap.is_recommended}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <div>
                            <Label htmlFor="type">
                                Brand Guideline <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                id="business_brand_guideline_id"
                                options={businessBrandGuidelines}
                                getOptionLabel={(o) => o.title}
                                getOptionValue={(o) => o.id?.toString()}
                                value={businessBrandGuidelines?.filter((option) => option.id === data.business_brand_guideline_id) || null}
                                onChange={(option) => setData('business_brand_guideline_id', option ? option?.id : null)}
                                classNamePrefix="react-select"
                                className="rounded-2xl border-0 shadow-xs"
                                placeholder="Select a brand guideline"
                                isClearable
                            />
                            {errorMap.business_brand_guideline_id && (
                                <p className="mt-1 text-sm text-red-500">{errorMap.business_brand_guideline_id}</p>
                            )}
                        </div>
                        <Link
                            className="mt-5 flex items-center gap-1 text-xs font-semibold hover:underline"
                            href={route('business-brand-guidelines.create')}
                        >
                            <Plus size={14} />
                            Create Brand Guideline
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <Label htmlFor="brand_strategy_id">Brand Strategy</Label>
                            <Select
                                id="brand_strategy_id"
                                options={brandStrategies}
                                getOptionLabel={(o) => o.title}
                                getOptionValue={(o) => o.id?.toString()}
                                value={brandStrategies?.filter((option) => option.id === data.brand_strategy_id) || null}
                                onChange={(option: BrandStrategyT | null) => setData('brand_strategy_id', option ? option.id : null)}
                                classNamePrefix="react-select"
                                className="rounded-2xl border-0 shadow-xs"
                                placeholder="Select a brand strategy"
                                isClearable
                            />
                            {errorMap.brand_strategy_id && <p className="mt-1 text-sm text-red-500">{errorMap.brand_strategy_id}</p>}
                        </div>
                        <Link className="mt-5 flex items-center gap-1 text-xs font-semibold hover:underline" href={route('brand-strategies.create')}>
                            <Plus size={14} />
                            Create Brand Strategy
                        </Link>
                    </div>
                </div>
            </fieldset>

            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">Discount Settings</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="col-span-2 flex items-center space-x-2">
                        <Switch id="is_discount" checked={data.is_discount} onCheckedChange={handleDiscountToggle} />
                        <Label htmlFor="is_discount" className={cn(data?.is_discount && 'text-green-500', 'block text-sm font-medium')}>
                            {data?.is_discount ? 'Discount Active' : 'No Discount'}
                        </Label>
                        {errorMap.is_discount && <p className="text-sm text-red-500">{errorMap.is_discount}</p>}
                    </div>

                    {data.is_discount && (
                        <>
                            <div className="space-y-2">
                                <label htmlFor="discount_price_text" className="block text-sm font-medium">
                                    Discount Price Text <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="discount_price_text"
                                    placeholder="e.g. $799 (was $999)"
                                    value={data.discount_price_text}
                                    onChange={(e) => setData('discount_price_text', e.target.value)}
                                    required={data.is_discount}
                                />
                                {data.is_discount && !data.discount_price_text && (
                                    <p className="text-sm text-red-500">Discount price is required when discount is active.</p>
                                )}
                                {errorMap.discount_price_text && <p className="text-sm text-red-500">{errorMap.discount_price_text}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="discount_end_date" className="block text-sm font-medium">
                                    Discount End Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="discount_end_date"
                                    type="datetime-local"
                                    value={data.discount_end_date || ''}
                                    onChange={(e) => setData('discount_end_date', e.target.value)}
                                    required={data.is_discount}
                                />
                                {data.is_discount && !data.discount_end_date && (
                                    <p className="text-sm text-red-500">Discount end date is required when discount is active.</p>
                                )}
                                {errorMap.discount_end_date && <p className="text-sm text-red-500">{errorMap.discount_end_date}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="discount_description" className="block text-sm font-medium">
                                    Discount Description
                                </label>
                                <Textarea
                                    id="discount_description"
                                    placeholder="Enter discount description"
                                    value={data.discount_description}
                                    onChange={(e) => setData('discount_description', e.target.value)}
                                    rows={2}
                                />
                                {errorMap.discount_description && <p className="text-sm text-red-500">{errorMap.discount_description}</p>}
                            </div>
                        </>
                    )}
                </div>
            </fieldset>

            <fieldset className="rounded-xl border p-5">
                <legend className="font-bold">
                    Package Durations<span className="text-red-500">*</span>
                    {errorMap.durations && <p className="text-sm font-normal text-red-500">{errorMap.durations}</p>}
                </legend>
                <div className="space-y-4">
                    {data.durations.map((duration, index) => (
                        <div key={index} className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <Label htmlFor={`duration-${index}`} className="sr-only">
                                    Duration {index + 1}
                                </Label>
                                <Input
                                    placeholder="eg: Normal Project Duration"
                                    value={duration.duration_remarks || ''}
                                    onChange={(e) => updateDuration(index, 'duration_remarks', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    id={`duration-${index}`}
                                    placeholder="e.g. 2 weeks"
                                    value={duration.duration}
                                    onChange={(e) => updateDuration(index, 'duration', e.target.value)}
                                />
                                {errorMap[`durations.${index}.duration`] && (
                                    <p className="text-sm text-red-500">{errorMap[`durations.${index}.duration`]}</p>
                                )}
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeDuration(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addDuration} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Duration
                    </Button>
                </div>
            </fieldset>

            <fieldset className="rounded-xl border p-5">
                <legend className="mb-2 font-bold">
                    Package Items<span className="text-red-500">*</span>
                </legend>
                <p className="mb-4 text-xs text-gray-500">
                    Add the features or deliverables included in this package. You can also provide a detail link for more info.
                </p>
                {errorMap.items && <p className="text-sm font-normal text-red-500">{errorMap.items}</p>}
                <div className="grid gap-4">
                    {data.items.map((item: BusinessPackageItemWithLinkT, index: number) => (
                        <div
                            key={index}
                            className="relative flex flex-col rounded-lg border bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-4"
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500"
                                onClick={() => removeItem(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                                <div>
                                    <Label htmlFor={`item-${index}`}>Item Name</Label>
                                    <Input
                                        id={`item-${index}`}
                                        placeholder="Enter item name"
                                        value={item.name}
                                        onChange={(e) => updateItemName(index, e.target.value)}
                                    />
                                    {errorMap[`items.${index}.name`] && <p className="text-xs text-red-500">{errorMap[`items.${index}.name`]}</p>}
                                </div>
                                <div>
                                    <Label htmlFor={`item-detail-link-${index}`}>Detail Link</Label>
                                    <Input
                                        id={`item-detail-link-${index}`}
                                        type="url"
                                        placeholder="https://..."
                                        value={item.detail_link || ''}
                                        onChange={(e) => updateItemDetailLink(index, e.target.value)}
                                    />
                                    {errorMap[`items.${index}.detail_link`] && (
                                        <p className="text-xs text-red-500">{errorMap[`items.${index}.detail_link`]}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 md:mt-0 md:ml-4">
                                <Switch
                                    id={`is_included-${index}`}
                                    checked={item.is_included}
                                    onCheckedChange={(checked) => {
                                        const updatedItems = [...data.items];
                                        updatedItems[index].is_included = checked;
                                        setData('items', updatedItems);
                                    }}
                                />
                                <Label htmlFor={`is_included-${index}`} className={item.is_included ? 'text-green-600' : 'text-gray-400'}>
                                    {item.is_included ? 'Included' : 'Not Included'}
                                </Label>
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" onClick={addItem} className="mt-4 w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
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
