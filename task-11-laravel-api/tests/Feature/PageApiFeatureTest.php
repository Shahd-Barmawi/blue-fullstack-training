<?php

namespace Tests\Feature;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PageApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_retrieve_published_page_by_slug(): void
    {
        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About page content.',
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/pages/about-us');

        $response
            ->assertOk()
            ->assertJson([
                'id' => $page->id,
                'title' => 'About Us',
                'slug' => 'about-us',
                'content' => 'About page content.',
                'status' => 'published',
            ]);
    }

    public function test_draft_page_is_not_publicly_visible(): void
    {
        Page::create([
            'title' => 'Draft Page',
            'slug' => 'draft-page',
            'content' => 'Draft content.',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/pages/draft-page');

        $response
            ->assertNotFound()
            ->assertJson([
                'message' => 'Page not found',
            ]);
    }

    public function test_unauthenticated_user_cannot_access_management_pages(): void
    {
        $response = $this->getJson('/api/manage/pages');

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_authenticated_user_can_create_page(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $payload = [
            'title' => 'Services',
            'slug' => 'services',
            'content' => 'Services page content.',
            'status' => 'published',
        ];

        $response = $this->postJson('/api/pages', $payload);

        $response
            ->assertCreated()
            ->assertJson([
                'title' => 'Services',
                'slug' => 'services',
                'content' => 'Services page content.',
                'status' => 'published',
            ]);

        $this->assertDatabaseHas('pages', $payload);
    }

    public function test_page_creation_fails_with_invalid_data(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/pages', [
            'title' => '',
            'slug' => '',
            'content' => '',
            'status' => 'published',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title',
                'slug',
                'content',
            ]);
    }

    public function test_duplicate_slug_is_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        Page::create([
            'title' => 'Original Page',
            'slug' => 'about-us',
            'content' => 'Original content.',
            'status' => 'published',
        ]);

        $response = $this->postJson('/api/pages', [
            'title' => 'Duplicate Page',
            'slug' => 'about-us',
            'content' => 'Duplicate content.',
            'status' => 'published',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'slug',
            ]);
    }

    public function test_missing_page_returns_404(): void
    {
        $response = $this->getJson('/api/pages/page-that-does-not-exist');

        $response
            ->assertNotFound()
            ->assertJson([
                'message' => 'Page not found',
            ]);
    }
}
