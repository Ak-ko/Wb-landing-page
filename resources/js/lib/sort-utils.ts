interface SortableItem {
    id?: number | string;
    order: number | null;
    [key: string]: unknown;
}

/**
 * Updates order numbers for a list of items after reordering
 * @param items - Array of items with order property
 * @param startOrder - Starting order number (default: 1)
 * @returns New array with updated order numbers
 */
export function updateOrderNumbers<T extends SortableItem>(items: T[], startOrder = 1): T[] {
    return items.map((item, index) => ({
        ...item,
        order: startOrder + index,
    }));
}

/**
 * Updates order numbers for nested items (like items within elements)
 * @param items - Array of parent items
 * @param startOrder - Starting order number for parent items (default: 1)
 * @param childStartOrder - Starting order number for child items (default: 1)
 * @returns New array with updated order numbers for both parent and child items
 */
export function updateNestedOrderNumbers<T extends SortableItem & { items?: SortableItem[] }>(items: T[], startOrder = 1, childStartOrder = 1): T[] {
    return items.map((item, index) => ({
        ...item,
        order: startOrder + index,
        items: item.items ? updateOrderNumbers(item.items, childStartOrder) : undefined,
    }));
}

/**
 * Formats order number for display (e.g., 1, 1.1, 1.2, etc.)
 * @param parentOrder - Parent item order number
 * @param childOrder - Child item order number (optional)
 * @returns Formatted order string
 */
export function formatOrderNumber(parentOrder: number | null, childOrder?: number | null): string {
    if (parentOrder === null) return '';
    if (childOrder === null || childOrder === undefined) return parentOrder.toString();
    return `${parentOrder}.${childOrder}`;
}
