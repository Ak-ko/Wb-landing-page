# Duplicate Functionality

This document explains how to use the reusable duplicate functionality that has been implemented for the admin tables.

## Overview

The duplicate functionality allows users to create exact copies of existing records with a complete flow including:

- Confirmation modal before duplication
- Loading state during duplication
- Success modal with options to edit or undo
- Undo confirmation modal
- Loading state during undo deletion

## Features

- **Reusable Components**: Can be easily integrated into any admin table
- **Complete Flow**: Handles the entire duplication process with proper user feedback
- **Undo Capability**: Users can undo the duplication and delete the new record
- **Edit Integration**: Direct link to edit the newly created record
- **Error Handling**: Proper error handling and user feedback

## Implementation

### 1. Server-Side (Laravel)

#### Add the Trait to Your Controller

```php
<?php

namespace App\Http\Controllers;

use App\Traits\HasDuplicateFunctionality;

class YourController extends Controller
{
    use HasDuplicateFunctionality;

    public function duplicate(Request $request)
    {
        return $this->duplicateRecord(
            $request,
            YourModel::class,
            ['title', 'description'], // Fields to copy
            ['relationship1' => ['nested_relationship']] // Relationships to duplicate
        );
    }
}
```

#### Add the Route

```php
// In routes/web.php
Route::post('/admin/your-resource/duplicate', [YourController::class, 'duplicate'])
    ->name('your-resource.duplicate');
```

### 2. Client-Side (React/TypeScript)

#### Update Your Columns Component

```tsx
import { DuplicateButton } from '@/components/common/duplicate-button';

type ActionsProps = {
    handleDeleteClick: (id: number) => void;
    handleDuplicateClick: (record: YourModelT) => void;
};

export const createYourColumns = ({ handleDeleteClick, handleDuplicateClick }: ActionsProps): ColumnDef<YourModelT>[] => [
    // ... other columns
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex justify-center gap-2">
                {/* ... other buttons */}
                <DuplicateButton onClick={() => handleDuplicateClick(row.original)} />
                {/* ... other buttons */}
            </div>
        ),
    },
];
```

#### Update Your Index Page

```tsx
import { useDuplicateRecord } from '@/hooks/use-duplicate-record';
import { createDuplicateConfig } from '@/lib/duplicate-utils';
import {
    ConfirmDuplicateModal,
    CreatingDuplicateModal,
    SuccessDuplicateModal,
    UndoDuplicateModal,
    DeletingDuplicateModal,
} from '@/components/common/duplicate-modals';

export default function YourIndexPage({ data }) {
    const duplicateHook = useDuplicateRecord(createDuplicateConfig('your-resource'));

    return (
        <div>
            <DataTable
                columns={createYourColumns({
                    handleDeleteClick,
                    handleDuplicateClick: duplicateHook.handleDuplicateClick,
                })}
                data={data}
            />

            {/* Duplicate Modals */}
            <ConfirmDuplicateModal
                isOpen={duplicateHook.isConfirmModalOpen}
                onConfirm={duplicateHook.handleConfirmDuplicate}
                onCancel={duplicateHook.handleCancelDuplicate}
                recordTitle={(duplicateHook.recordToDuplicate?.title as string) || ''}
            />
            {/* ... other modals */}
        </div>
    );
}
```

#### Alternative: Use the Higher-Order Component

```tsx
import { WithDuplicateFunctionality } from '@/components/common/with-duplicate-functionality';

export default function YourIndexPage({ data }) {
    return (
        <WithDuplicateFunctionality duplicateRoute={route('your-resource.duplicate')} editRoute={(id) => route('your-resource.edit', id)}>
            {(duplicateHook) => (
                <div>
                    <DataTable
                        columns={createYourColumns({
                            handleDeleteClick,
                            handleDuplicateClick: duplicateHook.handleDuplicateClick,
                        })}
                        data={data}
                    />
                </div>
            )}
        </WithDuplicateFunctionality>
    );
}
```

## Usage Examples

### Business Brand Guidelines

The duplicate functionality has been implemented for Business Brand Guidelines as an example:

1. **Server-Side**: `BusinessBrandGuidelineController` uses the `HasDuplicateFunctionality` trait
2. **Client-Side**: `business-brand-guidelines/index.tsx` integrates the duplicate hook and modals
3. **Columns**: `business-brand-guideline-columns.tsx` includes the duplicate button

### Adding to Other Resources

To add duplicate functionality to another resource (e.g., Brand Strategies):

1. Add the trait to the controller
2. Add the duplicate method
3. Add the route
4. Update the columns component
5. Update the index page
6. Test the functionality

## Components

### Hooks

- `useDuplicateRecord`: Main hook for managing duplicate state and actions

### Components

- `DuplicateButton`: Reusable button component for tables
- `ConfirmDuplicateModal`: Confirmation dialog before duplication
- `CreatingDuplicateModal`: Loading state during duplication
- `SuccessDuplicateModal`: Success state with edit/undo options
- `UndoDuplicateModal`: Confirmation for undoing duplication
- `DeletingDuplicateModal`: Loading state during undo deletion
- `WithDuplicateFunctionality`: Higher-order component wrapper

### Utilities

- `createDuplicateConfig`: Helper to create duplicate configuration
- `createDuplicateRouteName`: Helper to create route names
- `createEditRoute`: Helper to create edit route functions

## Customization

### Custom Success Callback

```tsx
const duplicateHook = useDuplicateRecord({
    duplicateRoute: route('your-resource.duplicate'),
    editRoute: (id) => route('your-resource.edit', id),
    onSuccess: (duplicatedId) => {
        // Custom logic after successful duplication
        router.reload();
    },
});
```

### Custom Error Handling

```tsx
const duplicateHook = useDuplicateRecord({
    duplicateRoute: route('your-resource.duplicate'),
    editRoute: (id) => route('your-resource.edit', id),
    onError: (errors) => {
        // Custom error handling
        console.error('Duplicate failed:', errors);
        // Show toast notification, etc.
    },
});
```

## Notes

- The duplicate functionality automatically adds "(Copy)" to the title field
- All relationships are properly duplicated with new IDs
- The undo functionality permanently deletes the duplicated record
- The edit button navigates directly to the edit page of the new record
- All modals are properly managed and cleaned up after use
