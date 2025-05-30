import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BusinessPackageAddonT } from '@/types';
import { useForm } from '@inertiajs/react';

interface BusinessPackageAddonFormProps {
    businessPackageAddon?: BusinessPackageAddonT;
    onSuccess: () => void;
}

export default function BusinessPackageAddonForm({ businessPackageAddon, onSuccess }: BusinessPackageAddonFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: businessPackageAddon?.name || '',
        price_text: businessPackageAddon?.price_text || '',
        currency: businessPackageAddon?.currency || 'USD',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = businessPackageAddon ? route('add-ons-packages.update', businessPackageAddon.id) : route('add-on-packages.store');

        if (businessPackageAddon) {
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
                <legend className="font-bold">Addon Information</legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Addon Name <span className="text-red-500">*</span>
                        </label>
                        <Input id="name" placeholder="Enter addon name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price_text" className="block text-sm font-medium">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="price_text"
                            placeholder="Enter price"
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
                </div>
            </fieldset>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {businessPackageAddon ? 'Update Addon' : 'Create Addon'}
                </Button>
            </div>
        </form>
    );
}
