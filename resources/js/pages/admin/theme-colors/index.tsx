import ColorContainer from '@/components/app/admin/theme-colors/color-container';
import ColorManagementModal from '@/components/app/admin/theme-colors/color-management-modal';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface Color {
    id: number;
    color: string;
    type: 'white_bg' | 'black_bg';
}

export default function ThemeColorsIndex({
    colors,
}: {
    colors: {
        white_bg: Color[];
        black_bg: Color[];
    };
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);
    const [selectedType, setSelectedType] = useState<'white_bg' | 'black_bg'>('white_bg');

    const handleCreateColor = (type: 'white_bg' | 'black_bg') => {
        setSelectedType(type);
        setEditingColor(null);
        setIsModalOpen(true);
    };

    const handleEditColor = (color: Color) => {
        setEditingColor(color);
        setSelectedType(color.type);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingColor(null);
    };

    return (
        <AppLayout>
            <Head title="Theme Colors" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Theme Colors</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage color suggestions for different backgrounds</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <ColorContainer
                        title="For White Background"
                        colors={colors.white_bg}
                        backgroundType="white_bg"
                        onColorClick={handleEditColor}
                        onCreateClick={() => handleCreateColor('white_bg')}
                        showCreateButton={true}
                    />

                    <ColorContainer
                        title="For Black Background"
                        colors={colors.black_bg}
                        backgroundType="black_bg"
                        onColorClick={handleEditColor}
                        onCreateClick={() => handleCreateColor('black_bg')}
                        showCreateButton={true}
                    />
                </div>

                {/* Color Management Modal */}
                <ColorManagementModal isOpen={isModalOpen} onClose={handleCloseModal} editingColor={editingColor} selectedType={selectedType} />
            </div>
        </AppLayout>
    );
}
