# Sortable Components

This directory contains reusable drag and drop sorting components built with Framer Motion.

## Components

### SortableList

A generic drag and drop list component that can be used to sort any array of items.

#### Props

- `items: T[]` - Array of items to sort
- `onReorder: (newItems: T[]) => void` - Callback when items are reordered
- `renderItem: (item: T, index: number) => React.ReactNode` - Function to render each item
- `className?: string` - CSS classes for the container
- `itemClassName?: string` - CSS classes for each item
- `showDragHandle?: boolean` - Whether to show the drag handle (default: true)
- `dragHandleClassName?: string` - CSS classes for the drag handle

#### Usage Example

```tsx
import SortableList from '@/components/common/sortable-list';
import { updateOrderNumbers } from '@/lib/sort-utils';

interface MyItem {
    id: number;
    title: string;
    order: number | null;
}

function MyComponent() {
    const [items, setItems] = useState<MyItem[]>([
        { id: 1, title: 'Item 1', order: 1 },
        { id: 2, title: 'Item 2', order: 2 },
    ]);

    const handleReorder = (newItems: MyItem[]) => {
        const reorderedItems = updateOrderNumbers(newItems);
        setItems(reorderedItems);
    };

    return (
        <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(item, index) => (
                <div className="rounded border p-4">
                    <span>{item.title}</span>
                </div>
            )}
        />
    );
}
```

## Utilities

### updateOrderNumbers

Updates order numbers for a list of items after reordering.

```tsx
import { updateOrderNumbers } from '@/lib/sort-utils';

const items = [
    { id: 1, title: 'Item 1', order: 3 },
    { id: 2, title: 'Item 2', order: 1 },
];

const reordered = updateOrderNumbers(items);
// Result: [
//   { id: 1, title: 'Item 1', order: 1 },
//   { id: 2, title: 'Item 2', order: 2 },
// ]
```

### updateNestedOrderNumbers

Updates order numbers for nested items (like items within elements).

```tsx
import { updateNestedOrderNumbers } from '@/lib/sort-utils';

const elements = [
    {
        id: 1,
        title: 'Element 1',
        order: 2,
        items: [
            { id: 1, title: 'Item 1.1', order: 2 },
            { id: 2, title: 'Item 1.2', order: 1 },
        ],
    },
];

const reordered = updateNestedOrderNumbers(elements);
// Result: [
//   {
//     id: 1,
//     title: 'Element 1',
//     order: 1,
//     items: [
//       { id: 1, title: 'Item 1.1', order: 1 },
//       { id: 2, title: 'Item 1.2', order: 2 },
//     ],
//   },
// ]
```

### formatOrderNumber

Formats order numbers for display (e.g., 1, 1.1, 1.2, etc.).

```tsx
import { formatOrderNumber } from '@/lib/sort-utils';

formatOrderNumber(1); // "1"
formatOrderNumber(1, 2); // "1.2"
formatOrderNumber(null); // ""
```

## Integration Examples

### Brand Strategy Form

The brand strategy form demonstrates how to use nested sorting:

1. Elements can be reordered using drag and drop
2. Items within each element can also be reordered
3. Order numbers are automatically updated when items are reordered
4. Order numbers are also updated when items are added or removed

### Business Brand Guideline Form

Similar to the brand strategy form, but for business brand guidelines.

## Requirements

- Framer Motion must be installed
- Items must have an `id` property (number or string)
- Items must have an `order` property (number or null)
- Items should extend the `SortableItem` interface
