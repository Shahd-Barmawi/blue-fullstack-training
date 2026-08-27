<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContentBlockController extends Controller
{
    public function store(Request $request, $pageId)
    {
        $page = Page::find($pageId);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                Rule::in([
                    'hero',
                    'text',
                    'call_to_action',
                    'feature_list',
                ]),
            ],
            'position' => 'required|integer|min:0',
            'content' => 'required|array',
        ]);

        $block = $page->contentBlocks()->create($validated);

        return response()->json($block, 201);
    }

    public function update(Request $request, $pageId, $blockId)
    {
        $page = Page::find($pageId);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $block = $page->contentBlocks()->find($blockId);

        if (!$block) {
            return response()->json([
                'message' => 'Content block not found',
            ], 404);
        }

        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                Rule::in([
                    'hero',
                    'text',
                    'call_to_action',
                    'feature_list',
                ]),
            ],
            'position' => 'required|integer|min:0',
            'content' => 'required|array',
        ]);

        $block->update($validated);

        return response()->json($block);
    }

    public function destroy($pageId, $blockId)
    {
        $page = Page::find($pageId);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $block = $page->contentBlocks()->find($blockId);

        if (!$block) {
            return response()->json([
                'message' => 'Content block not found',
            ], 404);
        }

        $block->delete();

        return response()->json([
            'message' => 'Content block deleted successfully',
        ]);
    }

    public function reorder(Request $request, $pageId)
    {
        $page = Page::find($pageId);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $validated = $request->validate([
            'blocks' => 'required|array|min:1',
            'blocks.*.id' => 'required|integer',
            'blocks.*.position' => 'required|integer|min:0',
        ]);

        foreach ($validated['blocks'] as $blockData) {
            $block = $page->contentBlocks()
                ->where('id', $blockData['id'])
                ->first();

            if (!$block) {
                return response()->json([
                    'message' => 'One or more content blocks are invalid',
                ], 422);
            }

            $block->update([
                'position' => $blockData['position'],
            ]);
        }

        return response()->json([
            'message' => 'Content blocks reordered successfully',
            'blocks' => $page->fresh()->contentBlocks,
        ]);
    }
}
