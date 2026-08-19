<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $userA = User::where('email', 'usera@example.com')->firstOrFail();
        $userB = User::where('email', 'userb@example.com')->firstOrFail();

        $userA->posts()->create([
            'title' => 'First Post',
            'body' => 'This is the first sample post.',
            'status' => 'published',
            'category_id' => 1,
        ]);

        $userB->posts()->create([
            'title' => 'Second Post',
            'body' => 'This is the second sample post.',
            'status' => 'draft',
            'category_id' => 2,
        ]);

        $userA->posts()->create([
            'title' => 'Third Post',
            'body' => 'This is the third sample post.',
            'status' => 'published',
            'category_id' => 3,
        ]);
    }
}
