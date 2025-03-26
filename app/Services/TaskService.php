<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class TaskService
{
    /**
     * @return Collection<int, Task>
     */
    public function list(mixed $projectId): Collection
    {
        return Task::with('projects')
            ->where('project_id', $projectId)
            ->orderBy('priority')
            ->get();
    }
}
