<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $table = 'projects';

    protected $guarded = [];

    /**
     * @return HasMany<Task, Project>
     */
    public function tasks(): HasMany
    {
        /** @var HasMany<Task, Project> */
        return $this->hasMany(Task::class);
    }
}
