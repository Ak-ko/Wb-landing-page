import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'table' | 'card';

interface ViewToggleProps {
    viewMode: ViewMode;
    onChange: (value: ViewMode) => void;
    className?: string;
}

export function ViewToggle({ viewMode, onChange, className }: ViewToggleProps) {
    return (
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onChange(value as ViewMode)} className={className}>
            <ToggleGroupItem value="table" aria-label="Table view">
                <List className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Table</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="card" aria-label="Card view">
                <LayoutGrid className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
