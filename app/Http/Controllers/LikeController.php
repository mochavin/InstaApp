<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function store(Post $post)
    {
        $post->likes()->firstOrCreate([
            'user_id' => auth()->id(),
        ]);

        $post->load(['user', 'likes', 'comments.user'])->loadCount('likes');
        $post->is_liked = true;

        return back()->with('updatedPost', $post);
    }

    public function destroy(Post $post)
    {
        $post->likes()->where('user_id', auth()->id())->delete();

        $post->load(['user', 'likes', 'comments.user'])->loadCount('likes');
        $post->is_liked = false;

        return back()->with('updatedPost', $post);
    }
}
