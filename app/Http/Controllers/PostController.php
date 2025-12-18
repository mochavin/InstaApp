<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Inertia::render('Posts/Index', [
            'posts' => Post::with(['user', 'likes', 'comments.user'])
                ->withCount('likes')
                ->latest()
                ->paginate(5)
                ->through(function ($post) {
                    return array_merge($post->toArray(), [
                        'is_liked' => auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false,
                    ]);
                }),
        ]);
    }

    public function myPosts()
    {
        $user = auth()->user();
        return Inertia::render('Posts/MyPosts', [
            'posts_count' => $user->posts()->count(),
            'posts' => $user->posts()
                ->with(['user', 'likes', 'comments.user'])
                ->withCount('likes')
                ->latest()
                ->paginate(5)
                ->through(function ($post) {
                    return array_merge($post->toArray(), [
                        'is_liked' => $post->likes->contains('user_id', auth()->id()),
                    ]);
                }),
        ]);
    }

    public function posts(User $user)
    {
        return Inertia::render('Posts/UserPosts', [
            'user' => $user,
            'posts_count' => $user->posts()->count(),
            'posts' => $user->posts()
                ->with(['user', 'likes', 'comments.user'])
                ->withCount('likes')
                ->latest()
                ->paginate(5)
                ->through(function ($post) {
                    return array_merge($post->toArray(), [
                        'is_liked' => auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false,
                    ]);
                }),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
            'caption' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('posts', 'public');

        auth()->user()->posts()->create([
            'image' => Storage::url($path),
            'caption' => $request->caption,
        ]);

        return back()->with('success', 'Post created successfully.');
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $request->validate([
            'image' => 'nullable|image|max:2048',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it's a local path
            if (str_contains($post->image, '/storage/posts/')) {
                $oldPath = str_replace('/storage/', '', $post->image);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('posts', 'public');
            $post->image = Storage::url($path);
        }

        $post->caption = $request->caption;
        $post->save();

        $post->load(['user', 'likes', 'comments.user'])->loadCount('likes');
        $post->is_liked = auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false;

        return back()->with('updatedPost', $post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $postId = $post->id;

        // Delete image from storage if it's a local path
        if (str_contains($post->image, '/storage/posts/')) {
            $path = str_replace('/storage/', '', $post->image);
            Storage::disk('public')->delete($path);
        }

        $post->delete();

        return back()->with('deletedPostId', $postId);
    }
}
