import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { isLightColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { BlogT } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CommonBodyAnimation from './common-body-animation';
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
        <section className="py-32">
            <div className="app-container">
                <SectionHeader header="Our Blogs" />

                <CommonBodyAnimation>
                    <Carousel setApi={setApi} className="w-full">
                        <CarouselContent>
                            {blogs.map((blog, blogIndex) => (
                                <CarouselItem key={blog.id}>
                                    <Link
                                        href={route('blogs.detail', { blog: blog.id })}
                                        preserveScroll={true}
                                        className="block cursor-pointer overflow-hidden rounded-xl transition-shadow hover:shadow-lg"
                                    >
                                        <motion.div
                                            className="grid min-h-[300px] grid-cols-1 md:grid-cols-4"
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate={currentIndex === blogIndex ? 'visible' : 'hidden'}
                                        >
                                            {/* First image - hidden on mobile for better text readability */}
                                            <motion.div className="hidden overflow-hidden md:col-span-1 md:block" variants={itemVariants}>
                                                {blog.images && blog.images.length > 0 ? (
                                                    <img
                                                        src={blog.images[0].image}
                                                        alt={blog.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Mobile-only primary image */}
                                            <motion.div className="col-span-1 overflow-hidden md:hidden" variants={itemVariants}>
                                                {blog.images && blog.images.length > 0 ? (
                                                    <img
                                                        src={blog.images[0].image}
                                                        alt={blog.title}
                                                        className="h-64 w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-64 w-full items-center justify-center bg-gray-100">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Content section - full width on mobile, 2 columns on desktop */}
                                            <motion.div
                                                style={{
                                                    backgroundColor: blog.color,
                                                    color: isLightColor(blog.color) ? 'black' : 'white',
                                                }}
                                                className={cn('col-span-1 flex flex-col justify-center p-4 text-center md:col-span-2 md:p-6')}
                                                variants={itemVariants}
                                            >
                                                <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">{blog.title}</h3>
                                                <p className="line-clamp-3 text-sm md:line-clamp-4 md:text-base">{blog.description}</p>
                                            </motion.div>

                                            {/* Second image - hidden on mobile */}
                                            <motion.div className="hidden overflow-hidden md:col-span-1 md:block" variants={itemVariants}>
                                                {blog.images && blog.images.length > 1 ? (
                                                    <img
                                                        src={blog.images[1].image}
                                                        alt={`${blog.title} secondary`}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : blog.images && blog.images.length > 0 ? (
                                                    <img
                                                        src={blog.images[0].image}
                                                        alt={blog.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Additional images - only shown on larger screens */}
                                            {blog?.images?.length >= 6 &&
                                                [2, 3, 4, 5]?.map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="hidden overflow-hidden md:col-span-1 md:block"
                                                        variants={itemVariants}
                                                    >
                                                        <img
                                                            src={blog.images[i].image}
                                                            alt={blog.title}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </motion.div>
                                                ))}
                                        </motion.div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {blogs?.length > 1 && (
                            <>
                                <CarouselPrevious
                                    disabled={currentIndex === 0}
                                    style={{
                                        backgroundColor: blogs[currentIndex]?.color,
                                        color: isLightColor(blogs[currentIndex]?.color) ? 'black' : 'white',
                                    }}
                                    className="left-0 size-[50px] md:left-2"
                                />
                                <CarouselNext
                                    disabled={currentIndex === blogs.length - 1}
                                    style={{
                                        backgroundColor: blogs[currentIndex]?.color,
                                        color: isLightColor(blogs[currentIndex]?.color) ? 'black' : 'white',
                                    }}
                                    className="right-0 size-[50px] md:right-2"
                                />
                            </>
                        )}
                    </Carousel>

                    {blogs?.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1 md:mt-6 md:gap-2">
                            {blogs.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => api?.scrollTo(index)}
                                    style={{
                                        backgroundColor: blogs[index]?.color,
                                    }}
                                    className={cn(
                                        'h-1.5 rounded-full transition-all md:h-2',
                                        currentIndex === index ? 'w-3 md:w-4' : 'w-1.5 bg-gray-300 hover:bg-gray-400 md:w-2',
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </CommonBodyAnimation>
            </div>
        </section>
    );
}
