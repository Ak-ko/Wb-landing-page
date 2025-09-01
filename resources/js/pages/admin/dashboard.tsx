import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardProps {
    stats: {
        totalProjects: number;
        totalBlogs: number;
        totalTeamMembers: number;
        totalPackages: number;
    };
    recentProjects: Array<{
        id: number;
        title: string;
        client_company: string;
        service_fees: number;
        team_size: number;
        status: string;
        created_at: string;
    }>;
    monthlyProjectStats: Array<{
        month: string;
        count: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ stats, recentProjects, monthlyProjectStats }: DashboardProps) {
    const { totalProjects, totalBlogs, totalTeamMembers, totalPackages } = stats;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Stats Overview */}
                <div className="grid gap-4 md:grid-cols-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('branding-projects.index'));
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalProjects}</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('blogs.index'));
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalBlogs}</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('team-members.index'));
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalTeamMembers}</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('business-packages.index'));
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Business Packages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalPackages}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Charts and Recent Projects */}
                <div className="grid gap-4 md:grid-cols-2">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('branding-projects.index'));
                            }}
                        >
                            <CardHeader>
                                <CardTitle>Monthly Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyProjectStats}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card
                            className="cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={() => {
                                router.visit(route('branding-projects.index'));
                            }}
                        >
                            <CardHeader>
                                <CardTitle>Recent Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div key={project.id} className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <p className="font-medium">{project.title}</p>
                                                <p className="text-sm text-gray-500">{project.client_company}</p>
                                            </div>
                                            <p className="font-medium">{project.service_fees}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
