import { Input } from '@/components/ui/input';
import { BusinessBrandGuidelineT } from '@/types';
import { usePage } from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface BusinessPackageFiltersProps {
    onSearch: (query: string) => void;
    onFilter: (guideline: number) => void;
    defaultGuideline?: number | null;
    defaultQuery?: string;
}

export default function BusinessPackageFilters({ onSearch, onFilter, defaultGuideline, defaultQuery = '' }: BusinessPackageFiltersProps) {
    const { businessBrandGuidelines } = usePage<{ businessBrandGuidelines: BusinessBrandGuidelineT[] }>().props;

    const [searchQuery, setSearchQuery] = useState(defaultQuery);
    const [guidelineFilter, setGuidelineFilter] = useState(defaultGuideline || null);

    const debounceQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        onSearch(debounceQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceQuery]);

    const handleFilterChange = (option: SingleValue<BusinessBrandGuidelineT>) => {
        setGuidelineFilter(option?.id || null);
        onFilter(option?.id as number);
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
            <div>
                <Select
                    id="business_brand_guideline_id"
                    options={businessBrandGuidelines}
                    getOptionLabel={(o) => o.title}
                    getOptionValue={(o) => o.id?.toString()}
                    value={businessBrandGuidelines?.filter((option) => option.id === Number(guidelineFilter)) || null}
                    onChange={handleFilterChange}
                    classNamePrefix="react-select"
                    className="rounded-2xl border-0 shadow-xs"
                    placeholder="Select a brand guideline"
                    isClearable
                />
            </div>
        </div>
    );
}
