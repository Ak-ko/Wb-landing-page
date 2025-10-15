# Image Gallery Component

A high-performance, sortable image/video gallery component with drag-and-drop support, optimized for large images from CDN sources.

## 📁 File Structure

```
image-gallery/
├── index.tsx                   # Main export file (barrel export)
├── image-gallery.tsx           # Main gallery component with drag-and-drop
├── sortable-image-item.tsx     # Individual sortable item component
├── optimized-image.tsx         # Optimized image with progressive loading
├── optimized-video.tsx         # Optimized video with lazy loading
├── utils.ts                    # Utility functions
└── README.md                   # This file
```

## 🎯 Components

### ImageGallery (Main Component)

The main gallery component that orchestrates all child components and handles drag-and-drop functionality.

**Location:** `image-gallery.tsx`

**Features:**

- Drag-and-drop reordering with dnd-kit
- Touch and keyboard support
- Empty state handling
- Memoized for optimal performance

### SortableImageItem

Individual gallery item with sorting capabilities.

**Location:** `sortable-image-item.tsx`

**Features:**

- Drag handle with visual feedback
- Primary and Mascot badges
- Smooth transitions and opacity changes
- Memoized to prevent unnecessary re-renders

### OptimizedImage

Image component with progressive loading and error handling.

**Location:** `optimized-image.tsx`

**Features:**

- Skeleton loader while loading
- Smooth fade-in transition
- Error fallback UI
- Low fetch priority for performance

### OptimizedVideo

Video component with lazy loading.

**Location:** `optimized-video.tsx`

**Features:**

- Lazy loading with `preload="none"`
- Play icon overlay
- Error fallback UI
- Touch-friendly controls

## 📝 Usage

### Basic Usage

```tsx
import ImageGallery from '@/components/common/image-gallery';

function MyComponent() {
    const [images, setImages] = useState([
        { id: 1, url: 'https://...', is_primary: true },
        { id: 2, url: 'https://...', is_primary: false },
    ]);

    return <ImageGallery images={images} onImageClick={(image) => console.log('Clicked:', image)} />;
}
```

### With Drag-and-Drop

```tsx
import ImageGallery from '@/components/common/image-gallery';

function EditableGallery() {
  const [images, setImages] = useState([...]);

  const handleReorder = (reorderedImages) => {
    setImages(reorderedImages);
    // Save to backend
  };

  return (
    <ImageGallery
      images={images}
      onReorder={handleReorder}
      isEditing={true}
      allowDrag={true}
    />
  );
}
```

### Custom Styling

```tsx
<ImageGallery
    images={images}
    className="my-custom-gallery"
    imageClassName="h-32 w-32" // Custom thumbnail size
/>
```

## 🔧 Props

### ImageGalleryProps

| Prop               | Type                            | Default       | Description                          |
| ------------------ | ------------------------------- | ------------- | ------------------------------------ |
| `images`           | `ImageItem[]`                   | Required      | Array of images/videos to display    |
| `onImageClick`     | `(image: ImageItem) => void`    | -             | Click handler for individual items   |
| `onReorder`        | `(images: ImageItem[]) => void` | -             | Callback when items are reordered    |
| `isEditing`        | `boolean`                       | `false`       | Enable editing mode                  |
| `allowDrag`        | `boolean`                       | `false`       | Enable drag-and-drop                 |
| `showPrimaryBadge` | `boolean`                       | `true`        | Show "Primary" badge                 |
| `showMascotBadge`  | `boolean`                       | `false`       | Show "Mascot" badge                  |
| `showDragHandle`   | `boolean`                       | `true`        | Show drag handle icon                |
| `className`        | `string`                        | `''`          | Additional CSS classes for container |
| `imageClassName`   | `string`                        | `'h-24 w-24'` | CSS classes for individual items     |

### ImageItem Type

```typescript
interface ImageItem {
    id?: number;
    url?: string;
    is_primary?: boolean;
    is_mascot?: boolean;
    // ... other fields
}
```

## 🚀 Performance Optimizations

### 1. Component Memoization

All components are wrapped with `React.memo()` to prevent unnecessary re-renders:

- `SortableImageItem`
- `OptimizedImage`
- `OptimizedVideo`

### 2. Callback Memoization

Event handlers are memoized with `useCallback()` to maintain referential equality.

### 3. Value Memoization

Expensive computations are memoized with `useMemo()`:

- Items array for drag-and-drop
- Style objects
- Video file detection
- Optimized URLs

### 4. Progressive Loading

- Images use native lazy loading
- Async decoding
- Low fetch priority
- Smooth opacity transitions

### 5. Drag Performance

- 8px activation distance prevents accidental drags
- Touch-none class for better mobile performance
- Optimized drag events

## 🎨 Customization

### Adding Image Optimization Service

Edit `utils.ts`:

```typescript
export const getOptimizedImageUrl = (url: string): string => {
    // Example with Cloudflare Images
    return `${url}?w=200&h=200&fit=cover&quality=80&format=auto`;

    // Or with imgix
    return `${url}?w=200&h=200&fit=crop&auto=format,compress`;
};
```

### Custom Badges

You can extend the component to support custom badges by modifying `sortable-image-item.tsx`:

```tsx
{
    showCustomBadge && image.custom_field && <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] text-white">Custom</span>;
}
```

## 🔍 Importing Specific Components

If you need to use individual components:

```tsx
import { OptimizedImage, OptimizedVideo } from '@/components/common/image-gallery';

// Use standalone
<OptimizedImage src="..." alt="..." className="h-32 w-32" />;
```

## 📚 Related Documentation

- [Image Optimization Guide](../../../../docs/IMAGE_OPTIMIZATION_GUIDE.md)
- [dnd-kit Documentation](https://docs.dndkit.com/)
- [React Performance](https://react.dev/reference/react/memo)

## 🐛 Troubleshooting

### Images not loading

- Check CDN CORS settings
- Verify image URLs are accessible
- Check browser console for errors

### Drag-and-drop not working

- Ensure `isEditing={true}` and `allowDrag={true}`
- Check if `onReorder` callback is provided
- Verify images have unique IDs

### Performance issues

- Ensure images are optimized at the source
- Consider implementing CDN resizing
- Check if too many images are rendered at once
- Review [Image Optimization Guide](../../../../docs/IMAGE_OPTIMIZATION_GUIDE.md)

## 🔄 Migration from Old Component

If you were using the old single-file `image-gallery.tsx`, no changes are needed! The import path remains the same:

```tsx
// This still works
import ImageGallery from '@/components/common/image-gallery';
```

The component API is exactly the same, just better organized and more maintainable.
