import { Input } from '@/components/ui/input';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ArtPackageFiltersProps {
    onSearch: (query: string) => void;
    defaultQuery?: string;
}

export default function ArtPackageFilters({ onSearch, defaultQuery = '' }: ArtPackageFiltersProps) {
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
                    placeholder="Search packages..."
                    className="w-full py-2 pr-4 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
