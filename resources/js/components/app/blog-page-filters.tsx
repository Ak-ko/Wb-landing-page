import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
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
    const [activeTag, setActiveTag] = useState<number | null>(selectedTag || null);
    const [debouncedSearch] = useDebounceValue(searchValue, 400);
    const [activeSearchBar, setActiveSearchBar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleDropdownToggle = () => setDropdownOpen((open) => !open);

    useEffect(() => {
        onFilterChange({ ...defaultFilters, query: debouncedSearch, tag: activeTag });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleDropdownSelect = (tagId: number | null) => {
        setActiveTag(tagId);
        setDropdownOpen(false);
        onFilterChange({ ...defaultFilters, query: searchValue, tag: tagId });
    };

    const handleClickSearchBar = () => {
        setActiveSearchBar(true);
    };

    const handleBlurSearchBar = () => {
        setActiveSearchBar(false);
    };

    return (
        <div className="mb-6 flex gap-4">
            <div
                onClick={handleClickSearchBar}
                onBlur={handleBlurSearchBar}
                className={cn(
                    'flex w-full grow items-center gap-2 rounded-full border px-5 py-2 shadow transition-all duration-300',
                    activeSearchBar ? 'ring-1 ring-black' : 'ring-0',
                )}
            >
                <Search className={cn('size-5 shrink-0 transition-all duration-300', activeSearchBar ? 'text-black' : 'text-gray-400')} />
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="w-full px-2 py-2 focus:outline-none"
                />
                <div className="relative w-full max-w-[100px] cursor-pointer md:max-w-[150px]">
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between rounded-full border bg-white px-4 py-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        onClick={handleDropdownToggle}
                    >
                        <span className="truncate">{activeTag === null ? 'All' : tags.find((t) => t.id === activeTag)?.name || 'All'}</span>
                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.ul
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 z-10 mt-2 w-full overflow-hidden rounded-xl border bg-white"
                            >
                                <li className="cursor-pointer">
                                    <button
                                        className={`hover:bg-primary w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:text-white ${activeTag === null ? 'bg-primary text-white' : ''}`}
                                        onClick={() => handleDropdownSelect(null)}
                                    >
                                        All
                                    </button>
                                </li>
                                {tags.map((tag) => (
                                    <li key={tag.id} className="cursor-pointer">
                                        <button
                                            className={`hover:bg-primary w-full cursor-pointer px-4 py-2 text-left text-sm font-bold transition-colors hover:text-white ${activeTag === tag.id ? (tag.color ? '' : 'bg-primary text-white') : ''}`}
                                            style={
                                                activeTag === tag.id && tag.color
                                                    ? { backgroundColor: tag.color, color: '#fff' }
                                                    : tag.color
                                                      ? { borderColor: tag.color, color: tag.color, backgroundColor: tag.color + '10' }
                                                      : {}
                                            }
                                            onClick={() => handleDropdownSelect(tag.id)}
                                        >
                                            {tag.name}
                                        </button>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
