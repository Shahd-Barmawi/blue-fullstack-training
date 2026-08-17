<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::create([
            'title' => 'First Post',
            'body' => 'This is the first sample post.',
            'status' => 'published',
        ]);

        Post::create([
            'title' => 'Second Post',
            'body' => 'This is the second sample post.',
            'status' => 'draft',
        ]);

        Post::create([
            'title' => 'Third Post',
            'body' => 'This is the third sample post.',
            'status' => 'published',
        ]);
    }
}
