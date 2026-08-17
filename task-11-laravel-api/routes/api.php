<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;
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
