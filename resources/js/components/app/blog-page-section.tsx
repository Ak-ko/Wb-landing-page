/* eslint-disable @typescript-eslint/no-explicit-any */
import useFilter from '@/hooks/use-filter';
import { BlogT, TagT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
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
        tag: filters?.tag || null,
        page: filters?.page || 1,
    });

    const { setIsFilter } = useFilter(localFilters, route('blogs.list'), false);

    const handleFilterChange = (_filters: { query?: string; tag?: number | null }) => {
        setIsFilter(true);
        setLocalFilters({ ..._filters, page: 1 });
    };

    return (
        <div className="py-10">
            <div className="app-container p-5 md:p-9">
                <BlogPageFilters
                    tags={tags}
                    search={filters?.query || ''}
                    defaultFilters={localFilters}
                    selectedTag={filters?.tag as unknown as number}
                    onFilterChange={handleFilterChange}
                />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${filters?.query}-${filters?.tag}-${filters?.page}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.4 }}
                    >
                        {blogs.data.length > 0 ? (
                            <BlogList blogs={blogs.data} />
                        ) : (
                            <div className="mt-2 flex flex-col items-center gap-4 text-center text-gray-500">
                                <NotFoundLottie />
                                <p className="text-center text-lg">
                                    {filters?.query ? 'No blogs found with' : 'No Blogs'} <strong className="text-black">{filters?.query}</strong>.
                                </p>
                            </div>
                        )}

                        {blogs.last_page > 1 && (
                            <div className="mt-12">
                                <SimplePaginator links={blogs.links} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
