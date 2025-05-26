<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TaskService
{
    /**
     * @return Collection<int, Task>
     */
    public function list(mixed $projectId): Collection
    {
        return Task::with('projects')
            ->when($projectId, function ($q) use ($projectId) {
                if($projectId !== 'all')
                {
                    return $q->where('project_id', $projectId);
                }
                return $q;
            })
            ->orderBy('priority')
            ->get();
    }

    public function getById(int $id): ?Task
    {
        return Task::where('id', $id)->with('projects')->first();
    }

    /**
     * Store a new task and set its priority.
     *
     * @param array<string, mixed> $data
     * @return void
     */
    public function store(array $data): void
    {
        $count = Task::where('project_id', $data['project_id'])->count();
        $data['priority'] = $count + 1;

        Task::create($data);
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(int $id, array $data): void
    {
        $task = $this->getById($id);
        if ($task === null) {
            return;
        }

        $task->update($data);
    }

    public function delete(int $id): void
    {
        $task = $this->getById($id);
        if ($task === null) {
            return;
        }

        $task->delete();

        $tasks = Task::where('project_id', $task->project_id)
            ->where('priority', '>', $task->priority)
            ->get();

        if ($tasks->isEmpty()) {
            return;
        }

        $whenThen = [];
        $ids = [];

        foreach ($tasks as $taskItem) {
            $whenThen[] = "WHEN {$taskItem->id} THEN " . ($taskItem->priority - 1);
            $ids[] = $taskItem->id;
        }

        $tableName = (new Task())->getTable();
        $bulkUpdateQuery = "UPDATE `{$tableName}`
            SET `priority` = (CASE `id` " . implode(' ', $whenThen) . " END)
            WHERE `id` IN (" . implode(',', $ids) . ");";

        DB::update($bulkUpdateQuery);
    }

    public function reorder(int $projectId, int $start, int $end): void
    {
        $items = Task::where('project_id', $projectId)
            ->orderBy('priority')
            ->pluck('priority', 'id')
            ->toArray();

        if ($start > count($items) || $end > count($items)) {
            return;
        }

        $ids = array_keys($items);
        $priorities = array_values($items);

        $outPriority = array_splice($priorities, $start - 1, 1);
        array_splice($priorities, $end - 1, 0, $outPriority[0]);

        $whenThen = [];
        $idsList = [];

        foreach ($priorities as $index => $priority) {
            $id = $ids[$priority - 1];
            $whenThen[] = "WHEN {$id} THEN " . ($index + 1);
            $idsList[] = $id;
        }

        $tableName = (new Task())->getTable();
        $bulkUpdateQuery = "UPDATE `{$tableName}`
            SET `priority` = (CASE `id` " . implode(' ', $whenThen) . " END)
            WHERE `id` IN (" . implode(',', $idsList) . ")
            AND `deleted_at` IS NULL;";

        DB::update($bulkUpdateQuery);
    }
}
