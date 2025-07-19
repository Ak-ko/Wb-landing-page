import { BrandingProjectT } from '@/types';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function BrandingProjectsGrid({ projects }: { projects: BrandingProjectT[] }) {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Link
                        href={route('branding-projects.detail', { project: project.id })}
                        className="group block overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
                    >
                        {project.images?.[0] && (
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={project.images[0].image}
                                    alt={project.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h3>
                            <p className="mb-2 text-sm text-gray-600">{project.client_company}</p>
                            {project.client_origin && (
                                <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin size={12} />
                                    <span>{project.client_origin}</span>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="rounded-full px-3 py-1 text-xs font-medium"
                                        style={{ backgroundColor: tag.color, color: '#fff' }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
