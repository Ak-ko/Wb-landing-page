import { motion, Reorder } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import React from 'react';

interface SortableItem {
    id?: number | string;
    [key: string]: unknown;
}

interface SortableListProps<T extends SortableItem> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    itemClassName?: string;
    showDragHandle?: boolean;
    dragHandleClassName?: string;
}

export default function SortableList<T extends SortableItem>({
    items,
    onReorder,
    renderItem,
    className = '',
    itemClassName = '',
    showDragHandle = true,
    dragHandleClassName = '',
}: SortableListProps<T>) {
    return (
        <Reorder.Group axis="y" values={items} onReorder={onReorder} className={className}>
            {items.map((item, index) => (
                <Reorder.Item
                    key={item.id || index}
                    value={item}
                    className={`flex items-center gap-2 ${itemClassName}`}
                    whileDrag={{
                        scale: 1.02,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                    }}
                >
                    {showDragHandle && (
                        <motion.div
                            className={`cursor-grab active:cursor-grabbing ${dragHandleClassName}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                        </motion.div>
                    )}
                    {renderItem(item, index)}
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}
