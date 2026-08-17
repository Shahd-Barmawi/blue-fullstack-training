<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get("/health", [HealthController::class, "index"]);

Route::get("/profile", [TrainingController::class, "profile"]);

Route::get("/skills", [TrainingController::class, "skills"]);

Route::get("/training/tasks", [TrainingController::class, "tasks"]);

Route::get("/training/tasks/{id}", [
    TrainingController::class,
    "taskById",
]);

Route::post("/contact", [
    TrainingController::class,
    "contact",
]);

// Posts CRUD API
Route::get("/posts", [PostController::class, "index"]);

Route::get("/posts/{id}", [PostController::class, "show"]);

Route::post("/posts", [PostController::class, "store"]);

Route::put("/posts/{id}", [PostController::class, "update"]);

Route::patch("/posts/{id}", [PostController::class, "update"]);

Route::delete("/posts/{id}", [PostController::class, "destroy"]);
