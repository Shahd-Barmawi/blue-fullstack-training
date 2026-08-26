<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    // 1. Login success
    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ]);
    }

    // 2. Unauthenticated access to protected endpoint
    public function test_unauthenticated_user_cannot_create_post(): void
    {
        $category = Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
        ]);

        $response = $this->postJson('/api/posts', [
            'title' => 'Protected Post',
            'body' => 'This post should not be created.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(401);

        $this->assertDatabaseMissing('posts', [
            'title' => 'Protected Post',
        ]);
    }

    // 3. Authenticated post creation
    public function test_authenticated_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'Business',
            'slug' => 'business',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/posts', [
            'title' => 'Feature Test Post',
            'body' => 'This post was created by an authenticated user.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('posts', [
            'title' => 'Feature Test Post',
            'body' => 'This post was created by an authenticated user.',
            'status' => 'published',
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
    }

    // 4. Validation failure
    public function test_post_creation_fails_with_invalid_data(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/posts', [
            'title' => '',
            'body' => '',
            'status' => 'wrong-status',
            'category_id' => 999999,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'title',
                'body',
                'status',
                'category_id',
            ]);
    }

    // 5A. User cannot update another user's post
    public function test_user_cannot_update_another_users_post(): void
    {
        $owner = User::factory()->create();

        $otherUser = User::factory()->create();

        $category = Category::create([
            'name' => 'Education',
            'slug' => 'education',
        ]);

        $post = $owner->posts()->create([
            'title' => 'Owner Post',
            'body' => 'This post belongs to the owner.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->putJson(
            "/api/posts/{$post->id}",
            [
                'title' => 'Forbidden Update',
                'body' => 'Another user is trying to update this post.',
                'status' => 'published',
                'category_id' => $category->id,
            ]
        );

        $response->assertStatus(403);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Owner Post',
        ]);
    }

    // 5B. User cannot delete another user's post
    public function test_user_cannot_delete_another_users_post(): void
    {
        $owner = User::factory()->create();

        $otherUser = User::factory()->create();

        $category = Category::create([
            'name' => 'Health',
            'slug' => 'health',
        ]);

        $post = $owner->posts()->create([
            'title' => 'Protected Owner Post',
            'body' => 'Another user should not delete this post.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->deleteJson(
            "/api/posts/{$post->id}"
        );

        $response->assertStatus(403);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Protected Owner Post',
        ]);
    }

    // 6. Posts list returns successful response
    public function test_posts_list_endpoint_returns_successful_response(): void
    {
        $user = User::factory()->create();

        $category = Category::create([
            'name' => 'General',
            'slug' => 'general',
        ]);

        $user->posts()->create([
            'title' => 'Posts List Test',
            'body' => 'Testing the public posts list endpoint.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        $response = $this->getJson('/api/posts');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'links',
                'meta',
            ]);
    }
}
