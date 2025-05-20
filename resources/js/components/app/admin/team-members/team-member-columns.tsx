import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TeamMemberT } from '@/types'; // Assuming you have a TeamMemberT type in your types file
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Image, Trash2 } from 'lucide-react';
import ColorTag from '../../color-tag';
import EmailActions from '../../email-actions';
import PhoneActions from '../../phone-actions';

type TeamMemberActionsProps = {
    handleEdit: (teamMember: TeamMemberT) => void;
    handleDeleteClick: (id: number) => void;
    handleToggleActive: (teamMember: TeamMemberT) => void;
};

export const createTeamMemberColumns = ({ handleEdit, handleToggleActive, handleDeleteClick }: TeamMemberActionsProps): ColumnDef<TeamMemberT>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div>{row.original.name || <span className="text-gray-400">Not provided</span>}</div>,
    },
    {
        accessorKey: 'designation',
        header: 'Designation',
        cell: ({ row }) => <div>{row.original.designation || <span className="text-gray-400">Not provided</span>}</div>,
    },
    {
        accessorKey: 'mascot_image',
        header: 'Mascot Image',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.mascot_image ? (
                    <img src={row.original.mascot_image} alt={row.original.name || 'Mascot'} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <Image className="h-5 w-5 text-gray-500" />
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'image',
        header: 'User Image',
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.original.image ? (
                    <img src={row.original.image} alt={row.original.name || 'User'} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <Image className="h-5 w-5 text-gray-500" />
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <EmailActions email={row.original.email as string} />, // Use the new component here
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => <PhoneActions phone={row.original.phone as string} />, // Use the new component here
    },
    {
        accessorKey: 'color',
        header: 'Color',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <ColorTag color={row?.original?.color as string} />
            </div>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Switch
                    checked={row.original.is_active}
                    onCheckedChange={() => handleToggleActive(row.original)}
                    aria-label={`Toggle ${row.original.name} active state`}
                />
            </div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClick(row.original.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];
