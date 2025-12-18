<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $users = User::factory(10)->create();
        $users->push($testUser);

        $posts = \App\Models\Post::factory(20)->recycle($users)->create();

        foreach ($posts as $post) {
            // Create unique likes
            $likers = $users->random(rand(0, $users->count()));
            foreach ($likers as $liker) {
                \App\Models\Like::create([
                    'user_id' => $liker->id,
                    'post_id' => $post->id,
                ]);
            }

            \App\Models\Comment::factory(rand(0, 5))->recycle($users)->recycle($post)->create();
        }
    }
}
