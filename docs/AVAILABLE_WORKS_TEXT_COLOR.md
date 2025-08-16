# Available Works Text Color Feature

## Overview

The Available Works feature now supports custom text colors in addition to background colors. This allows for better visual customization of the work badges displayed in the marquee section.

## Changes Made

### Database

- Added `text_color` column to `available_works` table
- Default value: `#ffffff` (white)
- Migration: `2025_08_16_150834_add_text_color_to_available_works_table.php`

### Backend

- Updated `AvailableWork` model to include `text_color` in fillable fields
- Updated `AvailableWorkController` validation to require `text_color`
- Added `text_color` to create and update operations

### Frontend Components

#### New ColorInput Component

- Location: `resources/js/components/common/color-input.tsx`
- Features:
    - Combined background and text color inputs
    - Live preview of the badge with selected colors
    - Responsive grid layout
    - Error handling for both color fields

#### Updated Forms

- **Create Form**: `resources/js/pages/admin/available-works/create.tsx`
- **Edit Form**: `resources/js/pages/admin/available-works/edit.tsx`
- Both forms now use the new `ColorInput` component

#### Updated Display Components

- **Index Page**: Shows both background and text colors in table and card views
- **Show Page**: Displays text color information and preview
- **AvailableWorkBadge**: Updated to accept and use `textColor` prop
- **AvailableWorksSection**: Updated to pass `text_color` to badges

## Usage

### Creating/Editing Available Works

1. Navigate to Available Works admin section
2. Click "Add New" or edit an existing work
3. Use the color inputs to set both background and text colors
4. See live preview of how the badge will appear
5. Save the work

### Color Input Features

- **Color Picker**: Click the color swatch to open browser color picker
- **Hex Input**: Type or paste hex color codes directly
- **Live Preview**: See exactly how the badge will look with selected colors
- **Validation**: Both colors are required and validated

### Preview

The preview shows a sample badge with the selected background and text colors, giving users immediate feedback on their color choices.

## Technical Details

### Color Validation

- Both `color` and `text_color` are validated as required strings
- Maximum length: 7 characters (hex format: #RRGGBB)
- Default values: Background `#3b82f6` (blue), Text `#ffffff` (white)

### Component Props

```typescript
interface ColorInputProps {
    backgroundColor: string;
    textColor: string;
    onBackgroundColorChange: (color: string) => void;
    onTextColorChange: (color: string) => void;
    backgroundColorError?: string;
    textColorError?: string;
    label?: string;
}
```

### Database Schema

```sql
ALTER TABLE available_works ADD COLUMN text_color VARCHAR(7) DEFAULT '#ffffff' AFTER color;
```

## Migration Notes

- Existing records without `text_color` are automatically updated to use `#ffffff`
- The seeder has been updated to include sample data with appropriate text colors
- All existing functionality remains backward compatible
