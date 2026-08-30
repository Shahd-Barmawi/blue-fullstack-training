<?php

namespace Tests\Feature;

use App\Models\ContentBlock;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContentBlockApiFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_has_many_content_blocks_in_position_order(): void
    {
        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 2,
            'content' => [
                'heading' => 'Hero',
            ],
        ]);

        ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'text',
            'position' => 0,
            'content' => [
                'text' => 'Text block',
            ],
        ]);

        ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'call_to_action',
            'position' => 1,
            'content' => [
                'heading' => 'CTA',
            ],
        ]);

        $blocks = $page->fresh()->contentBlocks;

        $this->assertCount(3, $blocks);

        $this->assertSame('text', $blocks[0]->type);
        $this->assertSame('call_to_action', $blocks[1]->type);
        $this->assertSame('hero', $blocks[2]->type);
    }

    public function test_content_block_belongs_to_page(): void
    {
        $page = Page::create([
            'title' => 'Services',
            'slug' => 'services',
            'content' => 'Services content.',
            'status' => 'published',
        ]);

        $block = ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'text',
            'position' => 0,
            'content' => [
                'text' => 'Services block',
            ],
        ]);

        $this->assertTrue(
            $block->page->is($page),
        );
    }

    public function test_unauthenticated_user_cannot_create_content_block(): void
    {
        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $response = $this->postJson(
            "/api/pages/{$page->id}/blocks",
            [
                'type' => 'hero',
                'position' => 0,
                'content' => [
                    'heading' => 'Welcome',
                ],
            ],
        );

        $response
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_authenticated_user_can_create_content_block(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $response = $this->postJson(
            "/api/pages/{$page->id}/blocks",
            [
                'type' => 'hero',
                'position' => 0,
                'content' => [
                    'heading' => 'Welcome to Blue Tech',
                    'subheading' => 'Modern digital solutions.',
                ],
            ],
        );

        $response
            ->assertCreated()
            ->assertJson([
                'page_id' => $page->id,
                'type' => 'hero',
                'position' => 0,
            ]);

        $this->assertDatabaseHas('content_blocks', [
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 0,
        ]);
    }

    public function test_invalid_block_type_is_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $response = $this->postJson(
            "/api/pages/{$page->id}/blocks",
            [
                'type' => 'video',
                'position' => 0,
                'content' => [
                    'title' => 'Invalid block',
                ],
            ],
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'type',
            ]);
    }

    public function test_content_is_required_when_creating_block(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $response = $this->postJson(
            "/api/pages/{$page->id}/blocks",
            [
                'type' => 'hero',
                'position' => 0,
            ],
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'content',
            ]);
    }

    public function test_authenticated_user_can_reorder_content_blocks(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $hero = ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'hero',
            'position' => 0,
            'content' => [
                'heading' => 'Hero',
            ],
        ]);

        $text = ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'text',
            'position' => 1,
            'content' => [
                'text' => 'Text',
            ],
        ]);

        $response = $this->putJson(
            "/api/pages/{$page->id}/blocks/reorder",
            [
                'blocks' => [
                    [
                        'id' => $text->id,
                        'position' => 0,
                    ],
                    [
                        'id' => $hero->id,
                        'position' => 1,
                    ],
                ],
            ],
        );

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Content blocks reordered successfully',
            ]);

        $blocks = $page->fresh()->contentBlocks;

        $this->assertSame($text->id, $blocks[0]->id);
        $this->assertSame($hero->id, $blocks[1]->id);
    }

    public function test_authenticated_user_can_delete_content_block(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $page = Page::create([
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'About us content.',
            'status' => 'published',
        ]);

        $block = ContentBlock::create([
            'page_id' => $page->id,
            'type' => 'text',
            'position' => 0,
            'content' => [
                'text' => 'Delete me',
            ],
        ]);

        $response = $this->deleteJson(
            "/api/pages/{$page->id}/blocks/{$block->id}",
        );

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Content block deleted successfully',
            ]);

        $this->assertDatabaseMissing('content_blocks', [
            'id' => $block->id,
        ]);
    }
}
