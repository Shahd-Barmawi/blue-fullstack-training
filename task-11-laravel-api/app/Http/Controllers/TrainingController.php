<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrainingController extends Controller
{
    private array $tasks = [
        [
            "id" => 1,
            "title" => "Frontend Development",
            "status" => "Completed",
            "estimated_hours" => 8,
        ],
        [
            "id" => 2,
            "title" => "Vue Router",
            "status" => "Completed",
            "estimated_hours" => 6,
        ],
        [
            "id" => 3,
            "title" => "Pinia State Management",
            "status" => "Completed",
            "estimated_hours" => 6,
        ],
        [
            "id" => 4,
            "title" => "Laravel API",
            "status" => "In Progress",
            "estimated_hours" => 8,
        ],
        [
            "id" => 5,
            "title" => "Full Stack Integration",
            "status" => "Pending",
            "estimated_hours" => 10,
        ],
    ];

    public function profile()
    {
        return response()->json([
            "id" => 1,
            "name" => "Shahd Barmawi",
            "training_track" => "Full Stack Development",
            "current_task" => 11,
        ]);
    }

    public function skills()
    {
        return response()->json([
            "HTML",
            "CSS",
            "JavaScript",
            "Vue.js",
            "PHP",
            "Laravel",
        ]);
    }

    public function tasks()
    {
        return response()->json($this->tasks);
    }

    public function taskById($id)
    {
        foreach ($this->tasks as $task) {
            if ($task["id"] == $id) {
                return response()->json($task);
            }
        }

        return response()->json([
            "error" => "Task not found",
        ], 404);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            "name" => "required",
            "email" => "required|email",
            "subject" => "nullable",
            "message" => "required|min:10",
        ]);

        return response()->json([
            "success" => true,
            "data" => $validated,
        ]);
    }
}
