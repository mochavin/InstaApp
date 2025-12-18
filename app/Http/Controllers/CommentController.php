<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Post $post)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $post->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        $post->load(['user', 'likes', 'comments.user'])->loadCount('likes');
        $post->is_liked = auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false;

        return back()->with('updatedPost', $post);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $post = $comment->post;
        $comment->delete();

        $post->load(['user', 'likes', 'comments.user'])->loadCount('likes');
        $post->is_liked = auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false;

        return back()->with('updatedPost', $post);
    }
}
