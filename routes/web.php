<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('posts.index');
    }
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('posts.index');
    })->name('dashboard');

    Route::get('my-posts', [PostController::class, 'myPosts'])->name('posts.my');
    Route::resource('posts', PostController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('posts/{post}/like', [LikeController::class, 'store'])->name('posts.like');
    Route::delete('posts/{post}/like', [LikeController::class, 'destroy'])->name('posts.unlike');
    Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});

require __DIR__.'/settings.php';
