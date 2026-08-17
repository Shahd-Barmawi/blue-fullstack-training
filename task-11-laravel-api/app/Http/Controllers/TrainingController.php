<?php

namespace App\Http\Controllers;

class TrainingController extends Controller
{
    public function index()
    {
        return response()->json([
            "intern" => "Shahd Barmawi",
            "task" => "Task 11",
            "framework" => "Laravel",
        ]);
    }
}
