<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'user']);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $direction = $request->get('direction', 'desc');

        $allowedSortFields = ['created_at', 'title'];
        $allowedDirections = ['asc', 'desc'];

        if (
            in_array($sortBy, $allowedSortFields)
            && in_array($direction, $allowedDirections)
        ) {
            $query->orderBy($sortBy, $direction);
        }

        $posts = $query->paginate(2);

        return PostResource::collection($posts);
    }

    public function show($id)
    {
        $post = Post::with(['category', 'user'])->find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        return new PostResource($post);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'required|in:draft,published',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post = $request->user()->posts()->create($validated);

        $post->load(['category', 'user']);

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        abort_if(
            $request->user()->cannot('update', $post),
            403,
            'Forbidden'
        );

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'status' => 'required|in:draft,published',
            'category_id' => 'required|exists:categories,id',
        ]);

        $post->update($validated);

        $post->load(['category', 'user']);

        return new PostResource($post);
    }

    public function destroy($id, Request $request)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }

        abort_if(
            $request->user()->cannot('delete', $post),
            403,
            'Forbidden'
        );

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully'
        ], 200);
    }
}
