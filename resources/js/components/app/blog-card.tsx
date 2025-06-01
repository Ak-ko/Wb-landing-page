import { calculateReadingTime } from '@/lib/utils';
import { BlogT } from '@/types';
import { Link } from '@inertiajs/react';

interface BlogCardProps {
    blog: BlogT;
}

export default function BlogCard({ blog }: BlogCardProps) {
    const primaryImage = blog.images.find((img) => img.is_primary) || blog.images[0];
    return (
        <Link
            href={route('blogs.detail', { blog: blog.id })}
            className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow transition-shadow duration-300 hover:shadow-lg"
        >
            <div className="overflow-hidden">
                {primaryImage && (
                    <img
                        src={primaryImage.image}
                        alt={blog.title}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-[1.2]"
                    />
                )}
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex flex-wrap gap-1">
                    {blog.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag.id}
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: tag.color, color: '#fff' }}
                        >
                            {tag.name}
                        </span>
                    ))}
                    {blog.tags.length > 2 && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">+{blog.tags.length - 2}</span>
                    )}
                </div>
                <h3 className="mb-1 line-clamp-2 text-lg font-semibold">{blog.title}</h3>
                <p className="mb-2 line-clamp-3 text-sm text-gray-500">{blog.description?.replace(/<[^>]+>/g, '').slice(0, 120)}...</p>
                <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{calculateReadingTime(blog?.description as string)} min read</span>
                </div>
            </div>
        </Link>
    );
}
