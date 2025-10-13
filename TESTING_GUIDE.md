# Testing Guide for Branding Project Fixes

## Quick Test Steps

### 1. Test Creating a New Project

1. Navigate to: `http://your-app.test/admin/branding-projects/create`
2. Fill in all required fields
3. Upload 3 images using the file uploader
4. **Verify**: All 3 images appear in the gallery below
5. **Verify**: Image URLs start with `/storage/` (local) or full URL (production)
6. Click on an image to open the modal
7. Set one as "Primary"
8. Close modal
9. **Verify**: Primary badge appears on the correct image
10. Drag and drop images to reorder
11. **Verify**: Reordering feels smooth and responsive
12. Click "Create Project"
13. **Verify**: Success message appears
14. Click "Edit" on the newly created project
15. **Verify**: Exactly 3 images appear (not 6!)
16. **Verify**: Images are in the correct order
17. **Verify**: Primary image is correct

### 2. Test Updating an Existing Project

1. Open an existing project for editing
2. **Verify**: All existing images load correctly
3. Drag and drop to reorder existing images
4. Add 2 new images
5. Delete 1 existing image
6. Change the primary image to a different one
7. Save changes
8. Reload the edit page
9. **Verify**:
    - Correct number of images (original - deleted + new)
    - No duplicates
    - Order is maintained
    - Primary image is correct

### 3. Test Drag and Drop UX

1. Open any project edit page with multiple images
2. Try dragging an image:
    - **Verify**: Smooth animation
    - **Verify**: Opacity changes during drag
    - **Verify**: Other images shift smoothly
3. Try dragging with keyboard (Tab to image, Space to grab, Arrow keys to move)
4. On mobile/touch device:
    - **Verify**: Touch drag works
    - **Verify**: Doesn't conflict with scrolling

### 4. Test Validation

1. Try to create a project with only 1 image
    - **Expected**: Error message "minimum 2 images required"
2. Edit a project and try to delete all but 1 image
    - **Expected**: Error message about needing at least 2 images
3. Try to save without setting a primary image
    - **Expected**: Should work, first image becomes primary by default

### 5. Test Cloud Storage (Production Only)

1. Deploy to production server with DigitalOcean Spaces
2. Create a new project with images
3. **Verify**: Images upload successfully
4. **Verify**: Image URLs use Spaces domain (e.g., `https://your-space.digitaloceanspaces.com/...`)
5. Edit the project
6. **Verify**: Images display correctly from Spaces
7. Add new images and save
8. **Verify**: Both old and new images work correctly

## Expected Results Summary

| Action          | Expected Result              |
| --------------- | ---------------------------- |
| Upload 3 images | See 3 images in gallery      |
| Save project    | No duplicates created        |
| Reorder images  | Smooth drag animation        |
| Set primary     | Badge appears correctly      |
| Delete image    | Image removed, count updates |
| Add new images  | New images append to list    |
| Mix operations  | All changes saved correctly  |

## Common Issues to Watch For

### ❌ If you see duplicates after saving:

- Check browser console for errors
- Verify the `new_images` data being sent (not `images`)
- Check backend logs

### ❌ If images don't display:

- Check image URLs in browser dev tools
- Verify Storage disk configuration in `config/filesystems.php`
- Check if images exist in storage

### ❌ If drag-and-drop doesn't work:

- Clear browser cache
- Check for JavaScript errors in console
- Verify `@dnd-kit` packages are installed

### ❌ If order isn't maintained:

- Check `existing_images_order` array in form submission
- Verify backend is updating the `order` field

## Browser Testing Checklist

Test in multiple browsers:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Performance Testing

1. Upload 10 images (maximum allowed)
2. Verify:
    - Smooth drag-and-drop performance
    - No lag or stutter
    - Quick save operation

## Database Verification

After creating/updating a project, check the database:

```sql
-- Check for duplicates
SELECT branding_project_id, COUNT(*) as image_count
FROM branding_project_images
GROUP BY branding_project_id
HAVING image_count > 10;

-- Verify order and primary flags
SELECT id, branding_project_id, image, `order`, is_primary
FROM branding_project_images
WHERE branding_project_id = YOUR_PROJECT_ID
ORDER BY `order`;

-- Should see:
-- - Correct number of images
-- - Sequential order values (0, 1, 2, ...)
-- - Only ONE is_primary = 1 per project
```

## Rollback Plan (If Needed)

If issues are found:

1. Revert Git changes:

```bash
git log --oneline  # Find commit before changes
git revert <commit-hash>
```

2. Reinstall old packages:

```bash
npm install
```

3. Clear caches:

```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

## Success Criteria

✅ All tests pass
✅ No duplicate images created
✅ Smooth drag-and-drop UX
✅ Images display correctly in both local and production
✅ Order is maintained after save
✅ Primary image logic works correctly
✅ Validation prevents invalid states

---

**Note**: If all tests pass, you can confidently deploy to production!
