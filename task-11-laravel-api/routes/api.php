<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TrainingController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'index']);

Route::get('/profile', [TrainingController::class, 'profile']);

Route::get('/skills', [TrainingController::class, 'skills']);

Route::get('/training/tasks', [TrainingController::class, 'tasks']);

Route::get('/training/tasks/{id}', [
    TrainingController::class,
    'taskById',
]);

Route::post('/contact', [
    TrainingController::class,
    'contact',
]);

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

// Public Read Routes
Route::get('/posts', [PostController::class, 'index']);

Route::get('/posts/{id}', [PostController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    // Posts Write Operations
    Route::post('/posts', [PostController::class, 'store']);

    Route::put('/posts/{id}', [PostController::class, 'update']);

    Route::patch('/posts/{id}', [PostController::class, 'update']);

    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});
