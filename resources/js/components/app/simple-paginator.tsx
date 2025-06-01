import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatorProps {
    links: { url: string | null; label: string; active: boolean }[];
}

export default function SimplePaginator({ links }: PaginatorProps) {
    const paginationLinks = links.slice(1, -1);
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    return (
        <div className="flex items-center justify-center gap-1">
            {prevLink.url && (
                <Link href={prevLink.url} preserveScroll className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            )}
            {paginationLinks.map((link, idx) => (
                <Link
                    key={idx}
                    preserveScroll
                    href={link.url || '#'}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${link.active ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
            {nextLink.url && (
                <Link href={nextLink.url} preserveScroll className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5" />
                </Link>
            )}
        </div>
    );
}
