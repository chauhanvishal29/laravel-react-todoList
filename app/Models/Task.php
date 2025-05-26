<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $table = 'tasks';

    protected $guarded = ['created_at', 'updated_at'];

    /**
     * @return BelongsTo<Task, Project>
     */
    public function projects(): BelongsTo
    {
        /** @var BelongsTo<Task, Project> */
        return $this->belongsTo(Project::class);
    }
}
