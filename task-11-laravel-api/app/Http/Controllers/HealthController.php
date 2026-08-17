<?php

namespace App\Http\Controllers;

class HealthController extends Controller
{
    public function index()
    {
        return response()->json([
            "status" => "ok",
            "message" => "Backend is running successfully",
        ]);
    }
}
