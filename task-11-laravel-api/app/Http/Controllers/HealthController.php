<?php

namespace App\Http\Controllers;

class HealthController extends Controller
{
    public function index()
    {
        return response()->json([
            "status" => "ok",
            "application_name" => "Task 11 Laravel API",
            "message" => "Backend is running successfully",
        ], 200);
    }
}
