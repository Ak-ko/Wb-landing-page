# Image Gallery Pattern Guide

## Overview

This guide documents the correct pattern for implementing image galleries that work with both local storage and cloud storage (DigitalOcean Spaces, S3, etc.).

## The Problem

❌ **Don't hardcode `/storage/` in URLs**:

```typescript
// BAD - Breaks with cloud storage
url: `/storage/${file}`;
```

✅ **Let the backend handle URLs**:

```typescript
// GOOD - Works with any storage driver
url: img.image; // Backend uses Storage::url()
```

## Frontend Pattern

### 1. State Management

```typescript
// Separate existing and new images
const [existingImages, setExistingImages] = useState(
    project?.images.map((img) => ({
        id: img.id,
        url: img.image, // ✅ Full URL from backend
        is_primary: img.is_primary,
    })) || [],
);

const [newImages, setNewImages] = useState<NewImage[]>([]);
```

### 2. Form Data Structure

```typescript
const { data, setData } = useForm({
    // ... other fields ...
    new_images: [],
    removed_images: [] as number[],
    existing_images_order: [] as number[],
    primary_image_id: null,
    primary_image_index: null,
});
```

### 3. Handle Image Upload

```typescript
const handleImageUpload = (file: File | string) => {
    if (typeof file !== 'string') return;

    // For preview, conditionally add /storage/ for local files
    const previewUrl = file.startsWith('http') ? file : `/storage/${file}`;

    const newImage = {
        file, // Raw path for backend
        url: previewUrl, // Full URL for preview
        is_primary: false,
    };

    setNewImages((prev) => [...prev, newImage]);
};
```

### 4. Submit Logic

```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Separate existing and new images
    const existingImagesOrder = displayImages.filter((img) => typeof img.id === 'number').map((img) => img.id as number);

    const reorderedNewImages = displayImages
        .filter((img) => typeof img.id === 'string' && img.id.startsWith('new-'))
        .map((img) => ({
            file: img.file,
            is_primary: img.is_primary,
        }));

    transform((data) => ({
        ...data,
        existing_images_order: existingImagesOrder,
        new_images: reorderedNewImages,
    }));

    // Submit to backend
};
```

## Backend Pattern

### 1. Model Setup

```php
// Use HasImage trait
use HasImage;

protected $fillable = ['project_id', 'image', 'is_primary', 'order'];

// Accessor automatically uses Storage::url()
public function getImageAttribute($value)
{
    if (!$value) {
        return null;
    }
    return $this->getImageUrl($value);
}

// Method to get raw path
public function getRawImagePath()
{
    return $this->getRawOriginal('image');
}
```

### 2. Controller - Store Method

```php
public function store(Request $request)
{
    $validated = $request->validate([
        // ... other fields ...
        'new_images' => 'required|array|min:2',
        'new_images.*.file' => 'required|string',
        'new_images.*.is_primary' => 'required|boolean',
    ]);

    $project = Project::create([...]);

    // Only process new_images
    foreach ($validated['new_images'] as $index => $image) {
        ProjectImage::create([
            'project_id' => $project->id,
            'image' => $image['file'],  // Store raw path
            'order' => $index,
            'is_primary' => $image['is_primary'] ?? false,
        ]);
    }

    return redirect()->route('projects.index');
}
```

### 3. Controller - Update Method

```php
public function update(Request $request, Project $project)
{
    $validated = $request->validate([
        // ... other fields ...
        'new_images' => 'nullable|array',
        'new_images.*.file' => 'required|string',
        'new_images.*.is_primary' => 'required|boolean',
        'existing_images_order' => 'nullable|array',
        'existing_images_order.*' => 'exists:project_images,id',
        'removed_images' => 'nullable|array',
        'removed_images.*' => 'exists:project_images,id',
        'primary_image_id' => 'nullable|integer',
    ]);

    // Handle removed images
    if (isset($validated['removed_images'])) {
        $imagesToDelete = ProjectImage::whereIn('id', $validated['removed_images'])
            ->where('project_id', $project->id)
            ->get();

        foreach ($imagesToDelete as $image) {
            Storage::delete($image->getRawOriginal('image'));
            $image->delete();
        }
    }

    // Reset primary flags
    ProjectImage::where('project_id', $project->id)
        ->update(['is_primary' => false]);

    // Update existing images order
    if (isset($validated['existing_images_order'])) {
        foreach ($validated['existing_images_order'] as $index => $imageId) {
            $image = ProjectImage::find($imageId);
            if ($image) {
                $isPrimary = $request->input('primary_image_id') == $imageId;
                $image->update([
                    'order' => $index,
                    'is_primary' => $isPrimary,
                ]);
            }
        }
    }

    // Add new images
    if (isset($validated['new_images'])) {
        $existingCount = count($validated['existing_images_order'] ?? []);

        foreach ($validated['new_images'] as $index => $image) {
            $isPrimary = $image['is_primary'] ?? false;

            if ($isPrimary) {
                ProjectImage::where('project_id', $project->id)
                    ->update(['is_primary' => false]);
            }

            ProjectImage::create([
                'project_id' => $project->id,
                'image' => $image['file'],
                'order' => $existingCount + $index,
                'is_primary' => $isPrimary,
            ]);
        }
    }

    return redirect()->route('projects.index');
}
```

## Drag and Drop with @dnd-kit

### Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities --legacy-peer-deps
```

### Implementation

```typescript
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ image }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: image.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={image.url} />
        </div>
    );
}

function Gallery({ images, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);
            onReorder(arrayMove(images, oldIndex, newIndex));
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map(img => img.id)}>
                {images.map((image) => (
                    <SortableItem key={image.id} image={image} />
                ))}
            </SortableContext>
        </DndContext>
    );
}
```

## Storage Configuration

### Local Development

```php
// config/filesystems.php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
],
```

### Production (DigitalOcean Spaces)

```php
// config/filesystems.php
'disks' => [
    'spaces' => [
        'driver' => 's3',
        'key' => env('DO_SPACES_KEY'),
        'secret' => env('DO_SPACES_SECRET'),
        'endpoint' => env('DO_SPACES_ENDPOINT'),
        'region' => env('DO_SPACES_REGION'),
        'bucket' => env('DO_SPACES_BUCKET'),
        'url' => env('DO_SPACES_URL'),
        'visibility' => 'public',
    ],
],

// Set as default
'default' => env('FILESYSTEM_DISK', 'spaces'),
```

### Environment Variables

```env
# Local
FILESYSTEM_DISK=public

# Production
FILESYSTEM_DISK=spaces
DO_SPACES_KEY=your-key
DO_SPACES_SECRET=your-secret
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_REGION=nyc3
DO_SPACES_BUCKET=your-bucket-name
DO_SPACES_URL=https://your-bucket-name.nyc3.digitaloceanspaces.com
```

## Key Principles

1. **Never hardcode storage paths** - Use `Storage::url()` on backend
2. **Separate existing and new images** - Avoid duplication
3. **Use proper data structures** - `existing_images_order`, `new_images`, `removed_images`
4. **Validate minimum images** - Ensure business rules are enforced
5. **Handle storage correctly** - Delete physical files when removing images
6. **Use modern UX** - @dnd-kit for smooth drag-and-drop

## Forms to Update

The following forms may need similar fixes:

- [ ] Blog form (`BlogController`, `blog-form.tsx`)
- [ ] Illustration art form
- [ ] Sticker art form
- [ ] Mascot art form
- [ ] Comic art form
- [ ] Animation and motion form

## Checklist for Implementing

When adding this pattern to a new form:

- [ ] Install @dnd-kit packages
- [ ] Update model to use HasImage trait
- [ ] Add `getRawImagePath()` method to model
- [ ] Update controller store() method
- [ ] Update controller update() method
- [ ] Update frontend form data structure
- [ ] Implement proper image upload handling
- [ ] Implement drag-and-drop with @dnd-kit
- [ ] Add proper validation (min 2 images)
- [ ] Test with local storage
- [ ] Test with cloud storage
- [ ] Test drag-and-drop UX
- [ ] Test for duplicate prevention

---

**Reference Implementation**: `BrandingProjectController.php` and `branding-project-form.tsx`
