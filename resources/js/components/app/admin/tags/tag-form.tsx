import { ColorInput } from '@/components/common/color-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagT } from '@/types';
import { useForm } from '@inertiajs/react';

interface TagFormProps {
    tag?: TagT;
    tagTypes?: { value: string; label: string }[];
    onSuccess: () => void;
}

export default function TagForm({ tag, tagTypes = [], onSuccess }: TagFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: tag?.name || '',
        color: tag?.color || '#3b82f6', // Default blue color
        text_color: tag?.text_color || '#ffffff',
        type: tag?.type || '',
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
                <label htmlFor="type" className="block text-sm font-medium">
                    Tag Type
                </label>
                <Select value={data.type || undefined} onValueChange={(value) => setData('type', value === 'none' ? '' : value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select tag type (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {tagTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <ColorInput
                label="Tag Color"
                backgroundColor={data.color}
                textColor={data.text_color}
                onBackgroundColorChange={(value) => setData('color', value)}
                onTextColorChange={(value) => setData('text_color', value)}
                backgroundColorError={errors.color}
                textColorError={errors.text_color}
            />

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
