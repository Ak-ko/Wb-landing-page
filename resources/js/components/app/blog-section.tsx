import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { BlogT } from '@/types';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SectionHeader from './section-header';

export default function BlogSection() {
    const [api, setApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const { blogs } = usePage<{ blogs: BlogT[] }>().props;

    useEffect(() => {
        if (!api) return;

        setCurrentIndex(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap());
        });
    }, [api]);

    if (!blogs || blogs.length === 0) {
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <section className="py-16">
            <div className="app-container">
                <SectionHeader header="Our Blog" />

                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {blogs.map((blog, blogIndex) => (
                            <CarouselItem key={blog.id}>
                                <motion.div
                                    className="grid min-h-[300px] grid-cols-4 gap-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate={currentIndex === blogIndex ? 'visible' : 'hidden'}
                                >
                                    <motion.div className="col-span-1 overflow-hidden rounded-lg" variants={itemVariants}>
                                        {blog.images && blog.images.length > 0 ? (
                                            <img src={blog.images[0].image} alt={blog.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <span className="text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    <motion.div
                                        style={{
                                            backgroundColor: blog.color,
                                            color: isLightColor(blog.color) ? 'black' : 'white',
                                        }}
                                        className={cn('col-span-2 flex flex-col justify-center p-6 text-center')}
                                        variants={itemVariants}
                                    >
                                        <h3 className="mb-4 text-2xl font-bold">{blog.title}</h3>
                                        <p className="line-clamp-4">{blog.description}</p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            {blog.tags &&
                                                blog.tags.map((tag) => (
                                                    <span
                                                        style={{
                                                            backgroundColor: tag.color,
                                                            color: isLightColor(tag.color) ? 'black' : 'white',
                                                        }}
                                                        key={tag.id}
                                                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                        </div>
                                    </motion.div>

                                    <motion.div className="col-span-1 overflow-hidden rounded-lg" variants={itemVariants}>
                                        {blog.images && blog.images.length > 1 ? (
                                            <img src={blog.images[1].image} alt={`${blog.title} secondary`} className="h-full w-full object-cover" />
                                        ) : blog.images && blog.images.length > 0 ? (
                                            <img src={blog.images[0].image} alt={blog.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <span className="text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </motion.div>
                                    {blog?.images?.length === 6 &&
                                        [2, 3, 4, 5]?.map((i) => (
                                            <motion.div className="col-span-1 overflow-hidden rounded-lg" variants={itemVariants}>
                                                <img src={blog.images[i].image} alt={blog.title} className="h-full w-full object-cover" />
                                            </motion.div>
                                        ))}
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {blogs?.length > 1 && (
                        <>
                            <CarouselPrevious
                                style={{
                                    backgroundColor: blogs[currentIndex]?.color,
                                    color: isLightColor(blogs[currentIndex]?.color) ? 'black' : 'white',
                                }}
                                className="left-2"
                            />
                            <CarouselNext
                                style={{
                                    backgroundColor: blogs[currentIndex]?.color,
                                    color: isLightColor(blogs[currentIndex]?.color) ? 'black' : 'white',
                                }}
                                className="right-2"
                            />
                        </>
                    )}
                </Carousel>

                {blogs?.length > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {blogs.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                style={{
                                    backgroundColor: blogs[index]?.color,
                                }}
                                className={cn(
                                    'h-2 w-2 rounded-full transition-all',
                                    currentIndex === index ? 'bg-primary w-4' : 'bg-gray-300 hover:bg-gray-400',
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
