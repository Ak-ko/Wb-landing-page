import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

interface TagT {
    id: number;
    name: string;
    color?: string;
}

interface BlogPageFiltersProps {
    tags: TagT[];
    selectedTag: number | null;
    search: string;
    defaultFilters: { query?: string; tag?: number | null; page?: number };
    onFilterChange: (filters: { query: string; tag: number | null; page?: number }) => void;
}

export default function BlogPageFilters({ tags, selectedTag, search, onFilterChange, defaultFilters }: BlogPageFiltersProps) {
    const [searchValue, setSearchValue] = useState(search || '');
    const [activeTag, setActiveTag] = useState<number | null>(selectedTag);
    const [debouncedSearch] = useDebounceValue(searchValue, 400);

    useEffect(() => {
        onFilterChange({ ...defaultFilters, query: debouncedSearch, tag: activeTag });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleTagClick = (tagId: number | null) => {
        setActiveTag(tagId);
        onFilterChange({ ...defaultFilters, query: searchValue, tag: tagId });
    };

    return (
        <div className="mb-6 flex flex-col gap-4">
            <div className="flex w-full items-center gap-2 rounded-2xl border px-5">
                <Search className="size-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="w-full px-2 py-2 focus:outline-none"
                />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    className={`cursor-pointer rounded-full border px-3 py-1 ${activeTag === null ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleTagClick(null)}
                >
                    All
                </button>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        className={`rounded-full border px-3 py-1 font-bold transition-colors ${
                            activeTag === tag.id ? (tag.color ? '' : 'bg-primary text-white') + ' font-semibold' : 'bg-white text-gray-700'
                        }`}
                        style={
                            activeTag === tag.id && tag.color
                                ? { backgroundColor: tag.color, color: '#fff' }
                                : tag.color
                                  ? { borderColor: tag.color, color: tag.color, backgroundColor: tag?.color + '10' }
                                  : {}
                        }
                        onClick={() => handleTagClick(tag.id)}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
