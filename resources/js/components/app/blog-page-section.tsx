/* eslint-disable @typescript-eslint/no-explicit-any */
import useFilter from '@/hooks/use-filter';
import { BlogT, TagT } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import BlogList from './blog-list';
import BlogPageFilters from './blog-page-filters';
import { NotFoundLottie } from './lottie/not-found-lottie';
import SimplePaginator from './simple-paginator';

interface BlogPageProps {
    blogs: { data: BlogT[]; links: any; current_page: number; last_page: number };
    tags: TagT[];
    filters: { query?: string; tag?: number | null; page?: number };
}

export default function BlogPageSection() {
    // @ts-expect-error @ts-ignore
    const { blogs, tags, filters } = usePage<BlogPageProps>().props;

    const [localFilters, setLocalFilters] = useState<{ query?: string; tag?: number | null; page?: number }>({
        query: filters?.query || '',
        tag: filters?.tag || 0,
        page: filters?.page || 1,
    });

    const { setIsFilter } = useFilter(localFilters, route('blogs.list'), false);

    const handleFilterChange = (_filters: { query?: string; tag?: number | null }) => {
        setIsFilter(true);
        setLocalFilters({ ..._filters });
    };

    return (
        <div className="py-16">
            <div className="app-container">
                <BlogPageFilters
                    tags={tags}
                    search={filters?.query || ''}
                    defaultFilters={localFilters}
                    selectedTag={filters?.tag as unknown as number}
                    onFilterChange={handleFilterChange}
                />
                {blogs.data.length > 0 ? (
                    <BlogList blogs={blogs.data} />
                ) : (
                    <div className="mt-2 flex flex-col items-center gap-4 text-center text-gray-500">
                        <NotFoundLottie />
                        <p className="text-center text-lg">
                            No blogs found with <strong className="text-black">{filters?.query}</strong>.
                        </p>
                    </div>
                )}
                {blogs.last_page > 1 && (
                    <div className="mt-12">
                        <SimplePaginator links={blogs.links} />
                    </div>
                )}
            </div>
        </div>
    );
}
