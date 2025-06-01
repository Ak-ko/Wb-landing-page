import { BlogT } from '@/types';
import BlogCard from './blog-card';

interface BlogListProps {
    blogs: BlogT[];
}

export default function BlogList({ blogs }: BlogListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
    );
}
