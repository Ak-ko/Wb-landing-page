import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TagT } from '@/types';

interface TagSelectorProps {
    tags: TagT[];
    selectedTags: number[];
    onTagToggle: (tagId: number) => void;
    error?: string;
    className?: string;
    required?: boolean;
}

export default function TagSelector({ tags, selectedTags, onTagToggle, error, className = '', required = false }: TagSelectorProps) {
    if (tags.length === 0) return null;

    return (
        <div className={cn('space-y-2', className)}>
            <label className="block text-sm font-medium">Tags {required && <span className="text-red-500">*</span>}</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag.id}
                        style={{
                            backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                            color: selectedTags.includes(tag.id) ? 'white' : 'black',
                        }}
                        className={cn('cursor-pointer border', selectedTags.includes(tag.id) ? 'border-transparent' : 'border-gray-300')}
                        onClick={() => onTagToggle(tag.id)}
                    >
                        {tag.name}
                    </Badge>
                ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
