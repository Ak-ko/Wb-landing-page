import { Input } from '@/components/ui/input';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BusinessBrandGuidelineFiltersProps {
    onSearch: (query: string) => void;
    defaultQuery?: string;
}

export default function BusinessBrandGuidelineFilters({ onSearch, defaultQuery = '' }: BusinessBrandGuidelineFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(defaultQuery);
    const debounceQuery = useDebounce(searchQuery, 500);
    useEffect(() => {
        onSearch(debounceQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceQuery]);
    return (
        <div className="flex items-center gap-4">
            <div className="relative grow">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                    type="text"
                    placeholder="Search guidelines..."
                    className="w-full py-2 pr-4 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
