import ColorSuggestions from '@/components/app/color-suggestions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagT } from '@/types';
import { useForm } from '@inertiajs/react';

interface TagFormProps {
    tag?: TagT;
    onSuccess: () => void;
}

export default function TagForm({ tag, onSuccess }: TagFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: tag?.name || '',
        color: tag?.color || '#3b82f6', // Default blue color
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (tag) {
            put(route('tags.update', tag.id), {
                onSuccess: () => {
                    onSuccess();
                },
            });
        } else {
            post(route('tags.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    const handleColorSelect = (color: string) => {
        setData('color', color);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                    Tag Name
                </label>
                <Input id="name" placeholder="Enter tag name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-medium">
                    Tag Color
                </label>
                <div className="flex items-center gap-3">
                    <Input id="color" type="color" value={data.color} onChange={(e) => setData('color', e.target.value)} className="h-10 w-20" />
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
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onSuccess}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {tag ? 'Update Tag' : 'Create Tag'}
                </Button>
            </div>
        </form>
    );
}
