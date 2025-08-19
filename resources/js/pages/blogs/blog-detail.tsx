import BlogCard from '@/components/app/blog-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useTopScrollAnimation from '@/hooks/use-top-scroll-animation';
import LandingLayout from '@/layouts/landing-layout';
import { BlogT } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock } from 'lucide-react';

interface BlogDetailProps {
    blog: BlogT;
    relatedBlogs: BlogT[];
    readingTime: number;
}

export default function BlogDetail({ blog, relatedBlogs, readingTime }: BlogDetailProps) {
    const { topBarClass } = useTopScrollAnimation();

    return (
        <LandingLayout>
            <Head title={blog.title} />
            <div className={`${topBarClass} fixed top-0 left-0 z-[5] h-[5px] w-full origin-left`} />

            <div className="min-h-[90vh] py-5">
                <div className="app-container mx-auto max-w-3xl">
                    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                        <Link href={route('blogs.list')} className="hover:text-primary">
                            Blogs
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-gray-700">{blog.title}</span>
                    </div>
                    <h1 className="mb-4 text-3xl font-bold md:text-4xl">{blog.title}</h1>
                    <div className="mb-4 flex items-center gap-4 text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                    <div className="mb-6 flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={route('blogs.list', { tag: tag.id })}
                                className="rounded-full px-3 py-1 text-xs font-medium"
                                style={{ backgroundColor: tag.color, color: '#fff' }}
                            >
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                    {blog.images.length > 0 && (
                        <div className="mb-8">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {blog.images.map((image) => (
                                        <CarouselItem key={image.id}>
                                            <img src={image.image} alt={blog.title} className="mx-auto max-w-[500px] rounded-xl object-cover" />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {blog.images.length > 1 && (
                                    <>
                                        <CarouselPrevious />
                                        <CarouselNext />
                                    </>
                                )}
                            </Carousel>
                        </div>
                    )}
                    <div
                        className="prose prose-lg mb-12 max-w-none font-light [&_.text-center]:text-center [&_.text-left]:text-left [&_.text-right]:text-right [&_em]:italic [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-bold [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_ol]:ml-3 [&_ol]:list-decimal [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_ul]:ml-3 [&_ul]:list-disc [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: blog.description || '' }}
                    />
                    {relatedBlogs.length > 0 && (
                        <div className="mt-12">
                            <h2 className="mb-6 text-2xl font-bold">Related Blogs</h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {relatedBlogs.map((blog) => (
                                    <BlogCard key={blog.id} blog={blog} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LandingLayout>
    );
}
