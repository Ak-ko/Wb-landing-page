# Branding Project Image Gallery Fixes

## Issues Fixed

### 1. **Storage URL Hardcoding Issue** ❌ → ✅

**Problem**: The frontend was hardcoding `/storage/` prefix in image URLs, which breaks when using cloud storage (DigitalOcean Spaces, AWS S3, etc.) in production.

**Solution**:

- Frontend now receives full URLs from backend via `Storage::url()` helper
- The `BrandingProjectImage` model uses the `HasImage` trait which automatically handles both local storage (`/storage/`) and cloud storage (full URLs)
- For new uploads, we store the raw path and let the backend generate proper URLs

**Files Changed**:

- `resources/js/components/app/admin/branding-project/branding-project-form.tsx`
    - Line 32: Now uses `img.image` directly without hardcoding `/storage/`
    - Line 135-140: Conditionally adds `/storage/` prefix only for local previews

### 2. **Duplicate Images Bug** 🐛 → ✅

**Problem**: When uploading 3 photos and saving, 6 photos would be created because the backend was processing both `images` and `new_images` arrays.

**Solution**:

- **Frontend**: Removed the `images` array from form data, now only sends:
    - `new_images`: Array of newly uploaded images with their file paths and primary status
    - `existing_images_order`: Array of existing image IDs in their new order
    - `removed_images`: Array of image IDs to delete
- **Backend**: Updated controllers to process images correctly:
    - `store()`: Only processes `new_images` array (lines 107-116)
    - `update()`: Separately handles existing images order and new images (lines 229-265)

**Files Changed**:

- `resources/js/components/app/admin/branding-project/branding-project-form.tsx`
    - Removed `images` field from form data
    - Added `existing_images_order` field to track existing image order
    - Updated `handleImageUpload()` to not populate `data.images`
    - Updated `handleSubmit()` to send proper data structure
- `app/Http/Controllers/BrandingProjectController.php`
    - Updated `store()` validation and logic (lines 76-116)
    - Updated `update()` validation and logic (lines 175-265)

### 3. **Poor Drag-and-Drop UX** 🖱️ → ✨

**Problem**: Drag and drop was not smooth, didn't have proper visual feedback, and felt clunky.

**Solution**:

- Implemented `@dnd-kit` library for smooth, modern drag-and-drop functionality
- Added proper visual feedback during dragging (opacity changes, smooth transitions)
- Improved touch and keyboard accessibility
- Added activation constraint (8px movement) to prevent accidental drags

**Files Changed**:

- `resources/js/components/common/image-gallery.tsx`
    - Complete rewrite using `@dnd-kit/core` and `@dnd-kit/sortable`
    - Added `SortableImageItem` component for individual draggable items
    - Implemented `DndContext` with sensors for pointer and keyboard interactions
    - Smooth animations and visual feedback during drag operations

**New Dependencies**:

```json
"@dnd-kit/core": "^6.x",
"@dnd-kit/sortable": "^8.x",
"@dnd-kit/utilities": "^3.x"
```

## Technical Details

### Frontend Data Structure (on submit)

**For Creating New Project**:

```typescript
{
  title: string,
  description: string,
  // ... other fields ...
  new_images: [
    { file: "uploads/xyz.jpg", is_primary: true },
    { file: "uploads/abc.jpg", is_primary: false },
  ],
  primary_image_index: 0 | null,
}
```

**For Updating Existing Project**:

```typescript
{
  title: string,
  description: string,
  // ... other fields ...
  existing_images_order: [12, 45, 67], // IDs in new order
  new_images: [
    { file: "uploads/xyz.jpg", is_primary: false },
  ],
  removed_images: [34, 56], // IDs to delete
  primary_image_id: 12 | null,
  primary_image_index: 0 | null,
}
```

### Backend Processing

**Create Flow**:

1. Validate `new_images` array (minimum 2 images required)
2. Create project record
3. Iterate through `new_images` and create `BrandingProjectImage` records with:
    - Raw file path (without `/storage/` prefix)
    - Order based on array index
    - Primary status from the data

**Update Flow**:

1. Validate all fields including `existing_images_order` and `new_images`
2. Delete removed images (both records and files)
3. Update existing images with new order and primary status
4. Add new images with proper order (after existing images)

### Model Enhancement

**BrandingProjectImage Model**:

- Added `getRawImagePath()` method to get the stored path without URL transformation
- The `getImageAttribute()` accessor automatically converts paths to full URLs using `Storage::url()`
- This ensures compatibility with both local and cloud storage

```php
// For local storage: /storage/uploads/image.jpg
// For cloud storage: https://your-space.digitaloceanspaces.com/uploads/image.jpg
```

## Testing Checklist

### Creating New Project

- [ ] Upload 2+ images
- [ ] Verify images display correctly in preview
- [ ] Drag and drop to reorder images
- [ ] Set a primary image
- [ ] Save project
- [ ] Verify correct number of images saved
- [ ] Check that primary image is marked correctly

### Updating Existing Project

- [ ] Load existing project with images
- [ ] Verify all images display with correct URLs
- [ ] Reorder existing images via drag and drop
- [ ] Add new images
- [ ] Delete some existing images
- [ ] Change primary image
- [ ] Save changes
- [ ] Verify:
    - No duplicate images created
    - Order is maintained correctly
    - Primary image is correct
    - Deleted images are removed

### Cloud Storage Testing (Production)

- [ ] Deploy to production with DigitalOcean Spaces
- [ ] Upload images to project
- [ ] Verify images display correctly (should use Spaces URLs)
- [ ] Edit project and verify images still work
- [ ] Test drag and drop reordering

## Files Modified

### Frontend (TypeScript/React)

1. `resources/js/components/common/image-gallery.tsx` - Complete rewrite with @dnd-kit
2. `resources/js/components/app/admin/branding-project/branding-project-form.tsx` - Updated data handling
3. `resources/js/components/app/admin/branding-project/branding-project-image-gallery.tsx` - No changes needed

### Backend (PHP/Laravel)

1. `app/Http/Controllers/BrandingProjectController.php` - Updated store() and update() methods
2. `app/Models/BrandingProjectImage.php` - Added getRawImagePath() method

### Dependencies

- Added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` via npm

## Notes for Similar Components

The following components also use image galleries and may benefit from similar fixes:

- Blog form (`resources/js/components/app/admin/blogs/blog-form.tsx`)
- Illustration art form
- Sticker art form
- Mascot art form
- Comic art form
- Animation and motion form

Consider applying the same patterns to these forms if they exhibit similar issues.

## Migration Path (If Needed)

If existing projects have incorrect image paths stored:

```php
// Run this migration if needed
BrandingProjectImage::whereNotNull('image')->chunk(100, function ($images) {
    foreach ($images as $image) {
        $path = $image->getRawOriginal('image');
        if (str_starts_with($path, '/storage/')) {
            $image->update([
                'image' => str_replace('/storage/', '', $path)
            ]);
        }
    }
});
```

## Performance Improvements

1. **@dnd-kit** is more performant than native HTML5 drag-and-drop
2. Uses CSS transforms for smooth animations (GPU accelerated)
3. Optimized re-renders with React hooks and memoization
4. Activation constraint prevents accidental drags on scroll

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (including iOS)
- Mobile browsers: ✅ Touch support included

---

**Date**: October 13, 2025
**Developer**: AI Assistant
**Status**: ✅ Complete and Ready for Testing
