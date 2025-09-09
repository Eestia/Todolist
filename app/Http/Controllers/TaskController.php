<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $filter = $request->query('filter', 'all');

        $tasks = Task::query()
            ->when($filter === 'active', fn($q) => $q->where('completed', false))
            ->when($filter === 'completed', fn($q) => $q->where('completed', true))
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'filter' => $filter,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);
        Task::create(['title' => $request->title]);
        return redirect()->route('tasks.index');
    }

    public function update(Task $task)
    {
        $task->update(['completed' => !$task->completed]);
        return redirect()->route('tasks.index');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->route('tasks.index');
    }

    public function clearCompleted()
    {
        Task::where('completed', true)->delete();
        return redirect()->route('tasks.index');
    }
}
