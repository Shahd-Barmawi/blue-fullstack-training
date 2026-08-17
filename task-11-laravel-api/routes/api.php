<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\TrainingController;
use Illuminate\Support\Facades\Route;

Route::get("/health", [HealthController::class, "index"]);

Route::get("/training", [TrainingController::class, "index"]);
