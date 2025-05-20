import { Head, router } from '@inertiajs/react';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { createTeamMemberColumns } from '@/components/app/admin/team-members/team-member-columns';
import TeamMemberFilters from '@/components/app/admin/team-members/team-member-filters';
import TeamMemberForm from '@/components/app/admin/team-members/team-member-form';
import DashboardTitle from '@/components/app/dashboard-title';
import EmailActions from '@/components/app/email-actions';
import PhoneActions from '@/components/app/phone-actions';
import { DataCardView } from '@/components/data-view/card/data-card-view';
import { DataTable } from '@/components/data-view/table/data-table';
import { ViewMode, ViewToggle } from '@/components/data-view/view-toggle';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useFilter from '@/hooks/use-filter'; // Assuming this hook exists
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, CommonPaginationT, TeamMemberT } from '@/types'; // Assuming TeamMemberT type

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team Members',
        href: '/admin/team-members',
    },
];

export default function TeamMembers({
    teamMembers,
    filters,
}: {
    teamMembers: CommonPaginationT<TeamMemberT>;
    filters: {
        query: string;
    };
}) {
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMemberT | null>(null);
    const [teamMemberIdToDelete, setTeamMemberIdToDelete] = useState<number | null>(null);

    const [filterStates, setFilterStates] = useState({
        pageSize: teamMembers?.per_page,
        pageIndex: teamMembers?.current_page,
        query: filters.query || '',
    });

    const { setIsFilter } = useFilter(
        {
            perPage: filterStates.pageSize,
            page: filterStates.pageIndex,
            query: filterStates.query,
        },
        route('team-members.index'),
        false,
    );

    const handleSearch = (query: string) => {
        setFilterStates((prev) => ({ ...prev, query }));
        setIsFilter(true);
    };

    const onPaginationChange = (page: number) => {
        setIsFilter(true);
        setFilterStates((prev) => ({
            ...prev,
            pageIndex: page,
        }));
    };

    const onSelectChange = (value: number) => {
        setIsFilter(true);
        return setFilterStates((prev) => ({
            ...prev,
            pageIndex: 1,
            pageSize: value,
        }));
    };

    const handleEdit = (teamMember: TeamMemberT) => {
        setSelectedTeamMember(teamMember);
        setIsEditDialogOpen(true);
    };

    const handleToggleActive = (teamMember: TeamMemberT) => {
        router.patch(route('team-members.toggle-active', teamMember.id));
    };

    const handleDeleteClick = (id: number) => {
        setTeamMemberIdToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (teamMemberIdToDelete) {
            router.delete(route('team-members.destroy', teamMemberIdToDelete), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setTeamMemberIdToDelete(null);
                    // Optionally refresh the list or remove the item from the state
                },
                onError: () => {
                    // Handle error
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    const teamMemberColumns = createTeamMemberColumns({
        handleEdit,
        handleDeleteClick,
        handleToggleActive,
    });

    const renderTeamMemberCard = (teamMember: TeamMemberT) => (
        <Card key={teamMember.id} className="min-h-[250px] max-w-[300px] overflow-hidden pt-0">
            <div className="relative aspect-video bg-gray-100">
                {teamMember.image ? (
                    <img src={teamMember.image} alt={teamMember.name || 'User Image'} className="h-[150px] w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                    </div>
                )}
            </div>
            <CardContent className="space-y-2 p-4">
                <h3 className="text-lg font-medium">{teamMember.name || 'Anonymous'}</h3>
                {teamMember.designation && <p className="text-sm text-gray-600">{teamMember.designation}</p>}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EmailActions email={teamMember.email as string} />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneActions phone={teamMember.phone as string} />
                </div>
                <p className="text-sm text-gray-500">Added on {new Date(teamMember.created_at).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-center p-4 pt-0 lg:p-6">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(teamMember)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(teamMember.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Members" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between py-4">
                    <DashboardTitle title="Team Members" description="Manage the team members here." />
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
                        <TeamMemberFilters onSearch={handleSearch} defaultQuery={filters.query} />

                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Team Member</DialogTitle>
                                </DialogHeader>
                                <TeamMemberForm onSuccess={() => setIsAddDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    </div>
                </div>

                {viewMode === 'table' ? (
                    <DataTable
                        columns={teamMemberColumns}
                        data={teamMembers.data}
                        pagingData={{
                            pageIndex: teamMembers.current_page,
                            pageSize: teamMembers.per_page,
                            total: teamMembers.total,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                    />
                ) : (
                    <DataCardView
                        data={teamMembers.data}
                        renderCard={renderTeamMemberCard}
                        pagingData={{
                            pageIndex: teamMembers.current_page,
                            pageSize: teamMembers.per_page,
                            total: teamMembers.total,
                        }}
                        onPaginationChange={onPaginationChange}
                        onSelectChange={onSelectChange}
                    />
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Team Member</DialogTitle>
                    </DialogHeader>
                    {selectedTeamMember && <TeamMemberForm teamMember={selectedTeamMember} onSuccess={() => setIsEditDialogOpen(false)} />}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the team member.</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
