<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    /**
     * @return Collection<int, Project>
     */
    public function getAll(): Collection
    {
        return Project::all();
    }
}
