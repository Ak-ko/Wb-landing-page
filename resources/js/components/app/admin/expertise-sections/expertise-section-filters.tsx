import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';

interface ExpertiseSectionFiltersProps {
    filters: {
        query?: string;
    };
    onFiltersChange: (filters: { query?: string }) => void;
}

export default function ExpertiseSectionFilters({ filters, onFiltersChange }: ExpertiseSectionFiltersProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                        placeholder="Search sections..."
                        value={filters.query || ''}
                        onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
                        className="w-[300px] pl-8"
                    />
                </div>
            </div>

            <Button asChild>
                <Link href={route('expertise-sections.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                </Link>
            </Button>
        </div>
    );
}
