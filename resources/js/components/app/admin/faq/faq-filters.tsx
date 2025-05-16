import { Input } from '@/components/ui/input';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FaqFiltersProps {
    onSearch: (query: string) => void;
    defaultQuery?: string;
}

export default function FaqFilters({ onSearch, defaultQuery = '' }: FaqFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(defaultQuery);

    const debounceQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        onSearch(debounceQuery);
    }, [debounceQuery, onSearch]);

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Search FAQs..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
