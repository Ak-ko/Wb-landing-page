<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogImage;
use App\Models\Tag;
use App\Traits\BlogTrait;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    use BlogTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Blog::query()->with(['tags', 'images' => function ($q) {
            $q->where('is_primary', true);
        }]);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        $blogs = $query->latest()
            ->paginate($request->input('perPage', 10))
            ->withQueryString();

        return Inertia::render('admin/blogs/index', [
            'blogs' => $blogs,
            'filters' => $request->only(['query']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tags = Tag::getBlogTags();

        return Inertia::render('admin/blogs/create', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'required|array|min:2',
            'images.*' => 'required',
            'color' => 'required',
            'primary_image_index' => 'nullable|integer',
        ]);

        $blog = Blog::create([
            'title' => $validated['title'],
            'color' => $validated['color'],
            'description' => $validated['description'] ?? null,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        // Handle tags
        if (isset($validated['tags'])) {
            $blog->tags()->attach($validated['tags']);
        }

        // Handle images
        if (isset($validated['images']) && is_array($validated['images'])) {
            $primaryIndex = $request->input('primary_image_index', 0);

            foreach ($validated['images'] as $index => $image) {
                if (is_string($image)) {
                    $path = $image;
                }

                BlogImage::create([
                    'blog_id' => $blog->id,
                    'image' => $path,
                    'is_primary' => $index == $primaryIndex,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        $blog->load('tags', 'images');

        return Inertia::render('admin/blogs/show', [
            'blog' => $blog,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        $blog->load('tags', 'images');
        $tags = Tag::getBlogTags();

        return Inertia::render('admin/blogs/edit', [
            'blog' => $blog,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'images' => 'nullable|array|min:2',
            'images.*' => 'required',
            'new_images' => 'nullable|array',
            'primary_image_id' => 'nullable|integer',
            'primary_image_index' => 'nullable|integer',
            'removed_images' => 'nullable|array',
            'color' => 'required',
            'removed_images.*' => 'exists:blog_images,id',
        ]);

        $blog->update([
            'title' => $validated['title'],
            'color' => $validated['color'] ?? $blog->color,
            'description' => $validated['description'] ?? null,
            'is_published' => $validated['is_published'] ?? $blog->is_published,
        ]);

        if (isset($validated['tags'])) {
            $blog->tags()->sync($validated['tags']);
        } else {
            $blog->tags()->detach();
        }

        if (isset($validated['removed_images'])) {
            $imagesToDelete = BlogImage::whereIn('id', $validated['removed_images'])
                ->where('blog_id', $blog->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                $image->delete();
            }
        }

        BlogImage::where('blog_id', $blog->id)->update(['is_primary' => false]);

        if ($request->has('primary_image_id') && $request->input('primary_image_index') === null) {
            BlogImage::where('id', $request->input('primary_image_id'))
                ->where('blog_id', $blog->id)
                ->update(['is_primary' => true]);
        }

        $existingImagesCount = $blog->images()->count();

        if (isset($validated['images']) && is_array($validated['images'])) {
            $primaryId = $request->input('primary_image_id', 0);

            foreach ($validated['images'] as $index => $image) {
                $dbImagePath = Str::after($image, config('app.url'));
                $blogImage = BlogImage::where('image', $dbImagePath)->first();

                if ($blogImage) {
                    $blogImage->update([
                        'blog_id' => $blog->id,
                        'order' => $existingImagesCount + $index,
                        'is_primary' => $primaryId == $blogImage->id,
                    ]);
                }
            }
        }

        if (isset($validated['new_images']) && is_array($validated['new_images'])) {
            foreach ($validated['new_images'] as $index => $image) {
                BlogImage::create([
                    'blog_id' => $blog->id,
                    'image' => $image['file'],
                    'order' => $existingImagesCount + $index,
                    'is_primary' => $image['is_primary'],
                ]);
            }
        }

        return redirect()->route('blogs.index')
            ->with('success', 'Blog updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        foreach ($blog->images as $image) {
            Storage::delete($image->image);
        }

        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }

    public function blogList(Request $request)
    {
        $query = Blog::latest()->published()->with(['tags', 'images']);

        if ($request->has('query') && $request->query('query') !== '') {
            $searchQuery = $request->query('query');
            $query->where(function ($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        if ($request->has('tag') && $request->query('tag') !== '') {
            $tagId = $request->query('tag');
            $query->whereHas('tags', function ($q) use ($tagId) {
                $q->where('tags.id', $tagId);
            });
        }

        $blogs = $query->paginate(6)->withQueryString();
        $tags = Tag::whereHas('blogs')->get();

        return Inertia::render('blogs/blogs-page', [
            'blogs' => $blogs,
            'tags' => $tags,
            'filters' => $request->only(['query', 'tag', 'page']),
        ]);
    }

    public function blogDetail(Blog $blog)
    {
        $blog->load('tags', 'images');

        // Get related blogs based on tags
        $relatedBlogs = Blog::published()
            ->where('id', '!=', $blog->id)
            ->whereHas('tags', function ($query) use ($blog) {
                $query->whereIn('tags.id', $blog->tags->pluck('id'));
            })
            ->with(['tags', 'images'])
            ->take(3)
            ->get();

        // Calculate reading time
        $readingTime = $this->calculateReadingTime($blog->description);

        return Inertia::render('blogs/blog-detail', [
            'blog' => $blog,
            'relatedBlogs' => $relatedBlogs,
            'readingTime' => $readingTime,
        ]);
    }
}
