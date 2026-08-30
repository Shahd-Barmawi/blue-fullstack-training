<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Public Pages
    |--------------------------------------------------------------------------
    */

    // Public: return published pages only
    public function index()
    {
        $pages = Page::where('status', 'published')
            ->latest()
            ->get();

        return response()->json($pages);
    }

    // Public: return one published page by slug with ordered content blocks
    public function show($slug)
    {
        $page = Page::with('contentBlocks')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        return response()->json($page);
    }

    /*
    |--------------------------------------------------------------------------
    | Management Pages
    |--------------------------------------------------------------------------
    */

    // Management: return all pages, including drafts and content blocks
    public function manageIndex()
    {
        $pages = Page::with('contentBlocks')
            ->latest()
            ->get();

        return response()->json($pages);
    }

    // Management: return one page by ID, including drafts and content blocks
    public function manageShow($id)
    {
        $page = Page::with('contentBlocks')->find($id);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        return response()->json($page);
    }

    // Management: create a new page
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $page = Page::create($validated);

        return response()->json($page, 201);
    }

    // Management: update an existing page
    public function update(Request $request, $id)
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',

            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('pages', 'slug')
                    ->ignore($page->id),
            ],

            'content' => 'required|string',

            'status' => 'required|in:draft,published',
        ]);

        $page->update($validated);

        // Return the updated page together with its content blocks
        $page->load('contentBlocks');

        return response()->json($page);
    }

    // Management: delete an existing page
    public function destroy($id)
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'message' => 'Page not found',
            ], 404);
        }

        $page->delete();

        return response()->json([
            'message' => 'Page deleted successfully',
        ], 200);
    }
}
