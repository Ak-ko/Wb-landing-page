import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TeamMemberFiltersProps {
    onSearch: (query: string) => void;
    onTypeFilter: (type: string) => void;
    defaultQuery?: string;
    defaultType?: string;
}

export default function TeamMemberFilters({ onSearch, onTypeFilter, defaultQuery = '', defaultType = '' }: TeamMemberFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(defaultQuery);
    const [typeFilter, setTypeFilter] = useState(defaultType);

    const debounceQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        onSearch(debounceQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceQuery]);

    useEffect(() => {
        onTypeFilter(typeFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeFilter]);

    return (
        <div className="flex items-center gap-4">
            <div className="relative grow">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                    type="text"
                    placeholder="Search team members..."
                    className="w-full py-2 pr-4 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Select value={typeFilter || 'all'} onValueChange={(value) => setTypeFilter(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="star_member">Star Member</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
