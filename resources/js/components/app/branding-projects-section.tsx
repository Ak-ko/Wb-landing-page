/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundLottie } from '@/components/app/lottie/not-found-lottie';
import SimplePaginator from '@/components/app/simple-paginator';
import useFilter from '@/hooks/use-filter';
import { BrandingProjectT, TagT } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import BrandingProjectsFilters from './branding-projects-filters';
import BrandingProjectsGrid from './branding-projects-grid';

export default function BrandingProjectsSection() {
    const { projects, tags, filters } = usePage<{
        projects: {
            data: BrandingProjectT[];
            links: any;
            current_page: number;
            last_page: number;
        };
        tags: TagT[];
        filters: { query?: string; tag?: number | null; page?: number };
    }>().props;

    const [localFilters, setLocalFilters] = useState({
        query: filters?.query || '',
        tag: filters?.tag || null,
        page: filters?.page || 1,
    });

    const { setIsFilter } = useFilter(
        {
            query: localFilters.query,
            tag: localFilters.tag,
            page: localFilters.page,
        },
        route('branding-projects.list'),
    );

    const handleFilterChange = (newFilters: typeof localFilters) => {
        setIsFilter(true);
        setLocalFilters({ ...newFilters, page: 1 });
    };

    return (
        <div className="min-h-screen py-12">
            <div className="app-container">
                {projects.data.length > 0 && (
                    // @ts-expect-error @ts-ignore
                    <BrandingProjectsFilters tags={tags} currentFilters={localFilters} onFilterChange={handleFilterChange} />
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${filters?.query}-${filters?.tag}-${filters?.page}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="mt-8"
                    >
                        {projects.data.length > 0 ? (
                            <BrandingProjectsGrid projects={projects.data} />
                        ) : (
                            <div className="flex flex-col items-center gap-6 py-12 text-center">
                                <NotFoundLottie />
                                <p className="text-lg text-gray-600">No projects found{filters?.query ? ` matching "${filters.query}"` : ''}.</p>
                            </div>
                        )}

                        {projects.last_page > 1 && (
                            <div className="mt-12">
                                <SimplePaginator links={projects.links} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
