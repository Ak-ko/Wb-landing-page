import { Input } from '@/components/ui/input';
import { usePage } from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface ArtPackageFiltersProps {
    onSearch: (query: string) => void;
    onSelectType: (type: string) => void;
    defaultType?: string;
    defaultQuery?: string;
}

export default function ArtPackageFilters({ onSearch, onSelectType, defaultQuery = '', defaultType = '' }: ArtPackageFiltersProps) {
    const [searchQuery, setSearchQuery] = useState(defaultQuery);

    const [type, setType] = useState<string>(defaultType);

    const { types } = usePage<{ types: { name: string; value: string }[] }>().props;

    const debounceQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        onSearch(debounceQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceQuery]);

    const handleSelect = (option: SingleValue<{ name: string; value: string }>) => {
        if (!option?.value) {
            setType('');
            onSelectType('');
            return;
        }

        setType(option.value);
        onSelectType(option.value);
    };

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
            <div className="relative grow">
                <Select
                    options={types}
                    getOptionLabel={(o) => o.name}
                    getOptionValue={(o) => o.value}
                    value={types?.find((option) => option.value === type) || null}
                    onChange={handleSelect}
                    classNamePrefix="react-select"
                    className="rounded-2xl border-0 shadow-xs"
                    placeholder="Select a type"
                    isClearable
                />
            </div>
        </div>
    );
}
